/**
 * Motor de búsqueda del servidor.
 *
 * Orquesta los scrapers por supermercado, mezcla sus resultados con el
 * catálogo de respaldo (para las cadenas que no se pueden escrapear en ese
 * momento), agrupa por producto, aplica filtros (texto, supermercados, precio
 * máximo, solo descuento) y ordena. Devuelve un `SearchResult` idéntico al
 * contrato del frontend: `{ products, total, took }`.
 */

import { SCRAPERS } from './scrapers/index.mjs';
import { SUPERMARKET_IDS } from './fallback.mjs';
import { matchesAllTokens, normalize as normalizeShared, tokenize } from './scrapers/shared.mjs';

function normalizeText(t) {
  return normalizeShared(t);
}

/** Devuelve un id estable para un producto (nombre + marca). */
function slugify(name, brand = '') {
  return normalizeText(`${name} ${brand}`)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Agrupa ofertas (tanto de scraping como de respaldo) por producto.
 * Cada oferta llega como { productName, brand, category, unit, price,
 * originalPrice, supermarketId, promoLabel, membersOnly }.
 * La agrupación se hace por nombre normalizado + marca, de modo que dos
 * marcas del mismo tipo (ej. "Aceite de Oliva" Nucete y Cocinero) sean
 * productos distintos en los resultados.
 */
function groupByProduct(rawOffers) {
  const map = new Map();
  for (const ofr of rawOffers) {
    // Nunca agrupar ofertas sin precio válido (cero o negativo).
    if (!ofr || !Number.isFinite(ofr.price) || ofr.price <= 0) continue;
    const key = `${normalizeText(ofr.productName)}|${normalizeText(ofr.brand || '')}`;
    if (!key || key === '|') continue;
    if (!map.has(key)) {
      map.set(key, {
        id: slugify(ofr.productName, ofr.brand),
        name: ofr.productName,
        brand: ofr.brand || undefined,
        category: ofr.category || 'General',
        description: ofr.description || undefined,
        offers: [],
      });
    }
    const product = map.get(key);
    const originalPrice = ofr.originalPrice && ofr.originalPrice > ofr.price ? ofr.originalPrice : undefined;
    const discountPercent =
      originalPrice && originalPrice > 0
        ? Math.round(((originalPrice - ofr.price) / originalPrice) * 100)
        : undefined;
    product.offers.push({
      id: `${ofr.supermarketId}-${product.id}-${product.offers.length}`,
      supermarketId: ofr.supermarketId,
      price: ofr.price,
      originalPrice,
      discountPercent,
      promoLabel: ofr.promoLabel,
      membersOnly: ofr.membersOnly,
      unit: ofr.unit,
      url: ofr.url || undefined,
      updatedAt: ofr.updatedAt || new Date().toISOString(),
    });
  }
  // Descartar productos que quedaron sin ninguna oferta válida (p. ej. si todas
  // sus ofertas tenían precio cero o negativo).
  return [...map.values()].filter((p) => p.offers.length > 0);
}

/**
 * Convierte el resultado de un scraper (arreglo de docs) en ofertas planas.
 * @param {Array} docs
 * @param {string} supermarketId
 */
function scraperDocsToOffers(docs, supermarketId) {
  return (docs || [])
    .filter((d) => d && d.productName && Number.isFinite(d.price) && d.price > 0)
    .map((d) => ({
    productName: d.productName,
    brand: d.brand || '',
    category: 'General',
    unit: d.unit || '',
    price: d.price,
    originalPrice: d.originalPrice || undefined,
    promoLabel: d.promoLabel || undefined,
    membersOnly: Boolean(d.membersOnly) || undefined,
    url: d.url || undefined,
    supermarketId,
    updatedAt: new Date().toISOString(),
  }));
}

/**
 * Ejecuta la búsqueda completa.
 * @param {{query:string, supermarketIds:string[], sort:string, maxPrice?:number, onlyDiscounted:boolean}} params
 */
export async function searchProducts(params) {
  const started = Date.now();

  const query = params.query?.trim() ?? '';
  const activeSet = new Set(
    (params.supermarketIds || []).filter((id) => SUPERMARKET_IDS.includes(id)),
  );

  // 1) Consultar scrapers en paralelo para los supermercados activos.
  const idsToScrape = activeSet.size === 0 ? SUPERMARKET_IDS : [...activeSet];
  const scrapeResults = await Promise.all(
    idsToScrape.map(async (id) => {
      try {
        const docs = await SCRAPERS[id]?.(query);
        return scraperDocsToOffers(docs, id);
      } catch {
        return [];
      }
    }),
  );
  const scrapedFlat = scrapeResults.flat();

  // 2) Filtrar por texto (coincidencia por tokens: "aceite de oliva" trae todos
  //    los aceites cuyo nombre contenga esas palabras, aunque no estén
  //    contiguas). Solo se usan datos reales de los scrapers, sin catálogo de
  //    respaldo ni mock.
  const qTokens = tokenize(query);
  const merged = scrapedFlat.filter((o) => {
    if (!qTokens.length) return true;
    const hay = normalizeText([o.productName, o.brand, o.category].join(' '));
    return matchesAllTokens(qTokens, hay);
  });

  // 3) Agrupar por producto.
  let products = groupByProduct(merged);

  // 4) Aplicar filtros adicionales.
  if (params.onlyDiscounted) {
    products = products
      .map((p) => ({
        ...p,
        offers: p.offers.filter((o) => (o.discountPercent ?? 0) > 0),
      }))
      .filter((p) => p.offers.length > 0);
  }
  if (params.maxPrice != null) {
    products = products.filter(
      (p) => p.offers.some((o) => o.price <= params.maxPrice),
    );
  }

  // 5) Ordenar ofertas de cada producto por precio ascendente (oferta[0] = mejor).
  for (const p of products) {
    p.offers.sort((a, b) => a.price - b.price);
  }

  // 6) Ordenar productos según la opción pedida.
  const sortOption = params.sort || 'relevance';
  products.sort((a, b) => {
    const best = (p) => p.offers[0] ?? {};
    switch (sortOption) {
      case 'price_asc':
        return (best(a).price ?? 0) - (best(b).price ?? 0);
      case 'price_desc':
        return (best(b).price ?? 0) - (best(a).price ?? 0);
      case 'discount':
        return (best(b).discountPercent ?? 0) - (best(a).discountPercent ?? 0);
      default: // relevance
        return (best(b).discountPercent ?? 0) - (best(a).discountPercent ?? 0);
    }
  });

  return {
    products,
    total: products.length,
    took: Date.now() - started,
  };
}

/**
 * Sugerencias para el autocompletado del buscador.
 * Consulta los scrapers de los supermercados activos con el texto ingresado y
 * devuelve nombres de productos reales que coinciden parcialmente con él.
 * Es best-effort y acotado para no golpear demasiado los sitios.
 * @param {string} prefix
 * @param {string[]} supermarketIds  Activos (vacío = todos).
 * @returns {Promise<string[]>}
 */
export async function suggestions(prefix, supermarketIds = []) {
  const term = String(prefix || '').trim();
  if (!term) return [];

  const activeSet = new Set(
    (supermarketIds || []).filter((id) => SUPERMARKET_IDS.includes(id)),
  );
  const idsToScrape = activeSet.size === 0 ? SUPERMARKET_IDS : [...activeSet];

  const results = await Promise.all(
    idsToScrape.map(async (id) => {
      try {
        const docs = await SCRAPERS[id]?.(term);
        return (docs || []).map((d) => d.productName).filter(Boolean);
      } catch {
        return [];
      }
    }),
  );

  const seen = new Set();
  const out = [];
  for (const names of results) {
    for (const n of names) {
      const key = normalizeText(n);
      if (!key.includes(normalizeText(term))) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(n);
      if (out.length >= 8) return out;
    }
  }
  return out.slice(0, 8);
}
