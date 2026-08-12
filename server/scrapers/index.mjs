/**
 * Scrapers por supermercado (best-effort).
 *
 * Jumbo, Vea, Disco, Carrefour y Día corren sobre VTEX (SAP/Salesforce Commerce),
 * que expone una API de catálogo pública vía HTTP:
 *
 *   GET https://{host}/api/catalog_system/pub/products/search?O=OrderByPriceASC&ft={término}
 *
 * Devuelve JSON real (productName, brand, precio, precio anterior) y sirve para
 * scraping rápido sin depender de JavaScript ni de Playwright.
 *
 * Coto no es VTEX y renderiza por JS; se extrae con Playwright (./coto.mjs) y
 * devuelve ofertas reales actuales.
 *
 * ChangoMás (403/anti-bot) y Vital (sin respuesta) no se pueden leer de forma
 * estable: sus scrapers devuelven vacío y el servidor completa con el catálogo
 * de respaldo para que la app nunca quede vacía en esas cadenas.
 *
 * Si algún endpoint deja de responder, el scraper devuelve [] y la búsqueda cae
 * al respaldo sin romper la app.
 */

import { httpGet, matchesAllTokens, normalize, tokenize } from './shared.mjs';
import * as cache from '../cache.mjs';
import { scrapeCoto } from './coto.mjs';

// ---------------------------------------------------------------------------
// Scraper genérico para tiendas VTEX (API de catálogo pública por HTTP).
// Jumbo, Vea, Disco, Carrefour y Día corren sobre VTEX y exponen esta API:
//
//   GET https://{host}/api/catalog_system/pub/products/search?O=OrderByPriceASC&ft={término}
//
// La API limita cada llamada a 50 ítems (una ventana de >50 devuelve HTTP 400),
// así que se pagan 3 ventanas (0..149) para traer más ofertas reales por cadena.
// ---------------------------------------------------------------------------

/** Builds una URL de página VTEX. Cada ventana es de 50 ítems. */
function vtexUrl(host, q, page) {
  const from = page * 50;
  return (
    `https://${host}/api/catalog_system/pub/products/search?O=OrderByPriceASC&ft=${encodeURIComponent(q)}` +
    `&_from=${from}&_to=${from + 49}`
  );
}

function makeVtexScraper({ ttlKey, host, pages = 3 }) {
  return async function scrape(query = '') {
    const key = `${ttlKey}:${normalize(query)}`;
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    const docs = [];
    const seen = new Set();
    const qTokens = tokenize(query);
    try {
      for (let page = 0; page < pages; page++) {
        const body = await httpGet(vtexUrl(host, query, page), { json: true });
        if (!Array.isArray(body) || body.length === 0) break;
        for (const p of body) {
          const item = p.items && p.items[0];
          const seller = item && item.sellers && item.sellers[0];
          const offer = seller && seller.commertialOffer;
          const price = offer && Number(offer.Price);
          // Ignorar ítems sin precio real: también se descartan los que llegan en
          // cero (o negativo), que no representan una oferta válida y ensucian el
          // listado con productos sin precio.
          if (!item || !p.productName || !Number.isFinite(price) || price <= 0) continue;
          // Descartar productos agotados / no disponibles. VTEX marca la falta de
          // stock con `IsAvailable: false` o `AvailableQuantity: 0`, lo que hace
          // que la página de producto muestre "producto sin stock" / "no
          // disponible". Solo se filtra cuando hay una señal explícita de
          // indisponibilidad, para no descartar ofertas válidas de cadenas que no
          // envían estos campos.
          const qty = Number(offer.AvailableQuantity);
          if (offer.IsAvailable === false || (Number.isFinite(qty) && qty <= 0)) continue;
          const name = String(p.productName).trim();
          if (!name) continue;
          // Coincidencia por tokens (evita descartar ofertas válidas para
          // búsquedas de varias palabras). Incluye marca en el haystack.
          const brand = String(p.brand || '').trim();
          // `hay` debe estar normalizado para que la coincidencia por tokens sea
          // a-tilde y case-insensitive (ej: buscar "atun" debe matchear "Atún").
          // Con el texto en crudo (mayúsculas/tildes) se descartaban ofertas
          // válidas en búsquedas acentuadas.
          const hay = normalize(`${name} ${brand}`);
          if (qTokens.length && !matchesAllTokens(qTokens, hay)) continue;
          const listPrice = Number(offer.ListPrice);
          // `PriceWithoutDiscount` es el "precio anterior" real (sin descuento) en
          // VTEX. Algunas cadenas (p. ej. Disco) devuelven un `ListPrice` no
          // confiable (hasta ~80x el precio), lo que generaba un falso descuento
          // del ~99%. Se prefiere `PriceWithoutDiscount`; si no hay señal de
          // descuento en él, se usa `ListPrice` solo si el descuento implícito es
          // razonable (<= 90%).
          const priceWithoutDiscount = Number(offer.PriceWithoutDiscount);
          let originalPrice = null;
          if (Number.isFinite(priceWithoutDiscount) && priceWithoutDiscount > price) {
            originalPrice = priceWithoutDiscount;
          } else if (Number.isFinite(listPrice) && listPrice > price) {
            const discountRatio = (listPrice - price) / listPrice;
            if (discountRatio <= 0.9) originalPrice = listPrice;
          }
          const dedupeKey = normalize(`${name}|${brand}`);
          if (seen.has(dedupeKey)) continue;
          seen.add(dedupeKey);
          docs.push({
            productName: name,
            brand,
            unit: String(item.nameComplete || '').trim(),
            price,
            // URL real del producto en el sitio de la cadena (deep link).
            url: String(p.link || '').trim() || undefined,
            // Guardar el precio anterior solo si es mayor al actual y verosímil.
            originalPrice,
          });
        }
      }
    } catch (err) {
      console.warn(`[scraper:${ttlKey}] fallback (${err.message})`);
    }

    cache.set(key, docs, 900); // 15 min
    return docs;
  };
}

const carrefour = makeVtexScraper({ ttlKey: 'carrefour', host: 'www.carrefour.com.ar' });
const jumbo = makeVtexScraper({ ttlKey: 'jumbo', host: 'www.jumbo.com.ar' });
const disco = makeVtexScraper({ ttlKey: 'disco', host: 'www.disco.com.ar' });
const vea = makeVtexScraper({ ttlKey: 'vea', host: 'www.vea.com.ar' });
const dia = makeVtexScraper({ ttlKey: 'dia', host: 'diaonline.supermercadosdia.com.ar' });

// ---------------------------------------------------------------------------
// Coto: no es VTEX; renderiza por JavaScript (Angular + Endeca) y sus URLs de
// carga pasan por anti-bot, pero la página de búsqueda puede renderizarse con
// Playwright (./coto.mjs) y devuelve ofertas reales actuales.
// ---------------------------------------------------------------------------
const coto = scrapeCoto;

// ---------------------------------------------------------------------------
// ChangoMás y Vital: no exponen una API pública y bloquean el acceso por HTTP
// (403) / no responden. Retornan vacío -> el servidor completa con el catálogo
// de respaldo para que la app no quede nunca vacía en esas cadenas.
// ---------------------------------------------------------------------------
const emptyScraper = async () => [];
const changomas = emptyScraper;
const vital = emptyScraper;

export const SCRAPERS = {
  jumbo,
  coto,
  disco,
  vea,
  carrefour,
  dia,
  changomas,
  vital,
};
