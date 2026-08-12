/**
 * Caché en memoria con TTL (time-to-live).
 *
 * El objetivo es no golpear los sitios de los supermercados en cada request.
 * Se cachea por clave (normalmente la búsqueda o el prefijo) durante un TTL
 * configurable (por defecto 15 minutos, recomendado para catálogos de ofertas).
 *
 * Como es en memoria, el caché no persiste entre reinicios del servidor.
 * Para producción conviene reemplazarlo por Redis / DynamoDB / Cloudflare KV.
 */

/** Mapa clave -> { value, expiresAt } */
const store = new Map();

/**
 * Lee una clave del caché. Devuelve `undefined` si no existe o expiró.
 * @param {string} key
 */
export function get(key) {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

/**
 * Guarda un valor bajo una clave con un TTL en segundos.
 * @param {string} key
 * @param {unknown} value
 * @param {number} ttlSeconds
 */
export function set(key, value, ttlSeconds = 900) {
  store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

/** Devuelve la cantidad de claves en caché (utilidad de diagnóstico). */
export function size() {
  return store.size;
}

/** Limpia la caché completa. */
export function clear() {
  store.clear();
}
