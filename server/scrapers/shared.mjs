/**
 * Utilidades compartidas de scraping.
 *
 * Cada scraper consulta una URL real del supermercado correspondiente e
 * intenta parsear los datos (precio, nombre, unidad, descuento). Si el sitio
 * responde mal, está protegido contra bots, o el parseo falla, el scraper
 * devuelve un arreglo vacío y el servidor usa el catálogo de respaldo.
 *
 * IMPORTANTE: los sitios cambian su HTML/markup con frecuencia y muchos están
 * detrás de proxies anti-bot (Cloudflare, Akamai) o cargan el contenido por
 * JavaScript. Por eso estos scrapers son "best-effort": hay que ajustarlos al
 * markup actual de cada cadena, idealmente con Playwright en producción.
 */

import { load } from 'cheerio';
import * as cache from '../cache.mjs';

const DEFAULT_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-AR,es;q=0.9,en;q=0.8',
};

/** Tiempo máximo de espera por request (ms). */
const FETCH_TIMEOUT_MS = 8000;

/**
 * Realiza un GET a una URL con timeout y headers realistas de navegador.
 * Devuelve la respuesta `Response` o lanza si falla.
 */
export async function httpGet(url, { json = false } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: DEFAULT_HEADERS,
      signal: controller.signal,
      redirect: 'follow',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} para ${url}`);
    if (json) return await res.json();
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

/** Convierte texto '$ 1.299' / '1.299,00' / '1299' a número. */
export function parsePrice(value) {
  if (typeof value === 'number') return value;
  if (value == null) return null;
  const raw = String(value).replace(/[^0-9.,-]/g, '');
  if (!raw) return null;

  // Formato argentino: '.' = miles, ',' = centavos.
  // Si hay coma, es el separador decimal: se quitan los puntos y se cambia la
  // coma por un punto (ej. "1.299,50" -> "1299.50").
  const firstComma = raw.indexOf(',');
  const firstDot = raw.indexOf('.');
  let cleaned;
  if (firstComma !== -1) {
    cleaned = raw.replace(/\./g, '').replace(',', '.');
  } else if (firstDot !== -1) {
    // Sin coma: el punto es el separador decimal solo si le siguen 1-2 dígitos
    // (ej. "1299.5" / "1299.50"); si le siguen 3 dígitos es separador de miles
    // (ej. "1.299"). Evita convertir "1299.00" en 129900.
    const after = raw.length - firstDot - 1;
    if (after === 1 || after === 2) {
      cleaned = raw.replace(',', '.');
    } else {
      cleaned = raw.replace(/\./g, '');
    }
  } else {
    cleaned = raw;
  }

  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

/** Normaliza texto (minúsculas, sin acentos) para comparar búsquedas. */
export function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Palabras vacías que se ignoran al hacer coincidencia por tokens. */
const STOPWORDS = new Set([
  'de', 'la', 'el', 'los', 'las', 'del', 'y', 'en', 'a', 'al', 'con',
  'para', 'por', 'un', 'una', 'u', 'o', 'e', 'ya', 'que', 'se', 'su',
]);

/**
 * Divide un texto normalizado en tokens relevantes (sin palabras vacías).
 * Mejor que la coincidencia por sub-string completa: una búsqueda de varias
 * palabras (ej. "aceite de oliva") matchea "Aceite Oliva extra", "Aceite de
 * Oliva Nucete", etc., sin requerir que las palabras estén contiguas.
 * @param {string} text
 * @returns {string[]}
 */
export function tokenize(text) {
  return normalize(text)
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => !STOPWORDS.has(t));
}

/**
 * Devuelve true si `hay` (texto ya normalizado) contiene todos los tokens.
 * @param {string[]} tokens
 * @param {string} hay Texto normalizado donde buscar.
 */
export function matchesAllTokens(tokens, hay) {
  if (!tokens.length) return true;
  return tokens.every((t) => hay.includes(t));
}

/**
 * Crea una función de scraping con caché por URL.
 * @param {string} ttlKey Prefijo de clave de caché (por supermercado).
 * @param {(query:string)=>string} buildUrl
 * @param {(html:string, query:string)=>Array} parse Un parseador best-effort.
 */
export function makeScraper({ ttlKey, buildUrl, parse, json = false }) {
  return async function scrape(query = '') {
    const key = `${ttlKey}:${normalize(query)}`;
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    let docs = [];
    try {
      const body = await httpGet(buildUrl(query), { json });
      docs = json ? parse(body, query) : parse(body, query);
    } catch (err) {
      console.warn(`[scraper:${ttlKey}] fallback (${err.message})`);
      docs = [];
    }

    cache.set(key, docs, 900); // 15 min
    return docs;
  };
}
