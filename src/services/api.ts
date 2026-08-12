import type {
  SearchParams,
  SearchResult,
} from '@/types/product';

/**
 * CAPA DE SERVICIOS
 * ---------------------------------------------------------------------------
 * Consume el backend real de scraping (server/index.mjs), que obtiene precios
 * en tiempo real de los supermercados argentinos. No hay datos mock: si el
 * backend no está configurado o falla, la búsqueda lanza un error que la App
 * muestra al usuario.
 *
 * Configuración:
 *   VITE_API_URL=https://tu-api.example.com   (producción)
 *   VITE_API_URL=http://localhost:8080        (backend local)
 */

/** URL del backend de scraping (definida por VITE_API_URL). */
const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.trim() ?? '';

/** Lanza un error claro si no hay backend configurado. */
function requireApiUrl(): void {
  if (!API_URL) {
    throw new Error(
      'El backend de scraping no está configurado. Definí la variable VITE_API_URL.',
    );
  }
}

/**
 * Busca productos contra el backend real de scraping.
 * Devuelve una promesa que resuelve en un `SearchResult`. Lanza si el backend
 * no está configurado o si la red/el servidor fallan (la App maneja el error).
 */
export async function searchProducts(
  params: SearchParams,
): Promise<SearchResult> {
  requireApiUrl();
  const qs = new URLSearchParams({
    query: params.query,
    supermarkets: params.supermarketIds.join(','),
    sort: params.sort,
    onlyDiscounted: String(params.onlyDiscounted),
  });
  if (params.maxPrice != null) qs.set('maxPrice', String(params.maxPrice));

  const res = await fetch(`${API_URL}/api/offers?${qs.toString()}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`El backend respondió con error ${res.status}`);
  const data = (await res.json()) as SearchResult;
  if (!Array.isArray(data.products)) throw new Error('Respuesta inválida del backend');
  return data;
}

/**
 * Sugerencias para el autocompletado del buscador, provistas por el backend.
 * Devuelve un arreglo de nombres de productos/marcas/categorías que coinciden
 * parcialmente con el texto ingresado. Si el backend no está configurado o
 * falla, devuelve un arreglo vacío (el autocompletado es no-bloqueante).
 */
export async function fetchSuggestions(prefix: string): Promise<string[]> {
  if (!prefix.trim()) return [];
  if (!API_URL) return [];
  try {
    const qs = new URLSearchParams({ query: prefix.trim() });
    const res = await fetch(`${API_URL}/api/suggestions?${qs.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { suggestions?: string[] };
    return Array.isArray(data.suggestions) ? data.suggestions : [];
  } catch {
    return [];
  }
}
