import { chromium } from 'playwright';
import * as cache from '../cache.mjs';
import { normalize, parsePrice } from './shared.mjs';

/**
 * Scraper de Coto (www.coto.com.ar) con Playwright.
 *
 * Coto no expone la API de catálogo VTEX y sus endpoints de carga pasan por
 * anti-bot, pero la página de búsqueda `/buscar?Ntt={término}` se renderiza con
 * JavaScript (Angular) y deja las tarjetas de producto en el DOM con clases
 * estables:
 *
 *   <div class="card-container" data-cnstrc-item-name="...">
 *     <h3 class="nombre-producto"> Nombre </h3>
 *     <div class="descuentos-slot">
 *       <small class="offer-crum"> PRECIO CON 15%DTO </small>
 *       <h4 class="card-title"> $3.399,15 </h4>
 *     </div>
 *     <small> Precio Regular: $3.999,00 </small>
 *
 * Se reutiliza una única instancia de Chromium (para no lanzar un navegador
 * por request) y se cachea el resultado por término durante 15 min.
 *
 * Si por cualquier motivo el sitio bloquea o el render falla, devuelve []
 * (best-effort) y el servidor cae al catálogo de respaldo sin romper la app.
 */

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

/** Un solo navegador compartido, reutilizado entre búsquedas. */
let browserPromise = null;
let browserLastRef = 0;

/** Tope total para una búsqueda de Coto (evita colgar `/api/offers` si el sitio bloquea). */
const OVERALL_TIMEOUT_MS = 16000;

/** Resuelve la promesa o devuelve `fallback` si excede `ms` (para acotar el tiempo total). */
function withTimeout(promise, ms, fallback) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      console.warn(`[scraper:coto] timeout total tras ${ms}ms para ${fallback ?? '[]'}`);
      resolve(fallback);
    }, ms);
    Promise.resolve(promise)
      .then((v) => {
        clearTimeout(timer);
        resolve(v);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(fallback);
      });
  });
}

async function getBrowser() {
  // Re-lanzar si pasó más de 10 min de inactividad (libera memoria en dev).
  if (!browserPromise || Date.now() - browserLastRef > 600000) {
    browserPromise = chromium
      .launch({ headless: true, args: ['--no-sandbox'] })
      .then((b) => {
        browserLastRef = Date.now();
        return b;
      })
      .catch((err) => {
        console.warn('[scraper:coto] no se pudo lanzar Chromium:', err.message);
        browserPromise = null;
        return null;
      });
  }
  return browserPromise;
}

/** Convierte una tarjeta de `.card-container` ya cacheada en un doc de oferta. */
function cardToDoc(card) {
  const name = String(card.name || '').trim();
  if (!name) return null;
  const price = parsePrice(card.priceText);
  if (!Number.isFinite(price) || price <= 0) return null;
  // Descartar productos sin stock / no disponibles (la página de producto
  // mostraría "producto sin stock" o "no disponible").
  if (/sin stock|sin existencia|no disponible|agotado|no hay stock/i.test(String(card.stockText || ''))) return null;
  const originalPrice = card.regularText ? parsePrice(card.regularText) : null;
  return {
    productName: name,
    brand: String(card.brand || '').trim(),
    unit: String(card.unit || '').trim(),
    price,
    // URL real del producto en el sitio de Coto (deep link), si la había.
    url: String(card.url || '').trim() || undefined,
    originalPrice: Number.isFinite(originalPrice) && originalPrice > price ? originalPrice : null,
    promoLabel: card.promoLabel || undefined,
  };
}

/**
 * Busca ofertas reales en Coto para un término.
 * @param {string} query
 * @returns {Promise<Array>}
 */
export async function scrapeCoto(query = '') {
  const term = String(query || '').trim();

  // Si no hay término, se scrapea la sección de ofertas/promociones para poder
  // mostrar productos reales al filtrar por Coto (o en el home). Devolver [] con
  // un query vacío hacía que "filtrar por Coto" mostrara 0 resultados siempre.
  const pageUrl = term
    ? 'https://www.coto.com.ar/buscar?Ntt=' + encodeURIComponent(term)
    : 'https://www.coto.com.ar/productos/ofertas/todas-las-ofertas';

  const key = `coto:${normalize(term)}`;
  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  const run = async () => {
    const browser = await getBrowser();
    if (!browser) return [];

    const ctx = await browser.newContext({ userAgent: USER_AGENT, locale: 'es-AR' });
    const page = await ctx.newPage();
    const out = [];
    try {
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 12000 });
      // Esperar a que aparezcan las tarjetas de producto (si no, seguimos con las
      // que haya o nos vamos con []).
      await page
        .waitForSelector('.card-container', { timeout: 7000 })
        .catch(() => {});
      await page.waitForTimeout(1000);

      const cards = await page.evaluate(() => {
        const res = [];
        // eslint-disable-next-line no-undef
        document.querySelectorAll('.card-container').forEach((el) => {
          const nameEl = el.querySelector('.nombre-producto');
          const priceEl = el.querySelector('.card-title');
          const regularEl = Array.from(el.querySelectorAll('small')).find((s) =>
            /precio regular/i.test(s.textContent || ''),
          );
          const promoEl = el.querySelector('.offer-crum');
          const linkEl = el.querySelector('a[href]');
          res.push({
            name: (nameEl ? nameEl.textContent : '') || el.getAttribute('data-cnstrc-item-name') || '',
            priceText: priceEl ? priceEl.textContent : '',
            regularText: regularEl ? regularEl.textContent : '',
            promoLabel: promoEl ? promoEl.textContent.trim() : '',
            // Texto completo de la tarjeta: permite detectar el estado de stock
            // ("sin stock"/"no disponible") que muestra la página del producto.
            stockText: el.textContent || '',
            url: linkEl ? linkEl.getAttribute('href') : '',
          });
        });
        return res;
      });

      for (const card of cards) {
        const doc = cardToDoc(card);
        if (doc) out.push(doc);
      }
    } catch (err) {
      console.warn(`[scraper:coto] error (${err.message})`);
    } finally {
      await ctx.close().catch(() => {});
    }
    return out;
  };

  // Tope total: si Coto bloquea o tarda demasiado, respondemos [] rápido en vez de
  // colgar la búsqueda global (que espera en paralelo todos los scrapers).
  const docs = await withTimeout(run(), OVERALL_TIMEOUT_MS, []);

  // Resultados vacíos se cachean menos (5 min) para poder reintentar antes.
  cache.set(key, docs, docs.length > 0 ? 900 : 300);
  return docs;
}