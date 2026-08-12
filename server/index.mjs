/**
 * Servidor API de ofertas (Express).
 *
 * Expone:
 *   GET /api/offers   -> búsqueda de ofertas (contrato del frontend)
 *   GET /api/health   -> estado del servicio
 *   GET /             -> ayuda básica
 *
 * Uso:
 *   node server/index.mjs
 *   # o con variables de entorno:
 *   PORT=8080 node server/index.mjs
 *
 * Endpoints de scraping reales se intentan para cada supermercado; si alguno
 * no está disponible, se usa el catálogo de respaldo (server/fallback.mjs).
 */

import express from 'express';
import cors from 'cors';
import { searchProducts, suggestions } from './search.mjs';
import { SUPERMARKET_IDS } from './fallback.mjs';
import * as cache from './cache.mjs';

const app = express();
const PORT = process.env.PORT || 8080;

// CORS abierto para desarrollo (el front corre en otro puerto).
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET'],
  }),
);

app.use(express.json());

/** Endpoint principal de búsqueda. Respeta el contrato SearchParams JSON. */
app.get('/api/offers', async (req, res) => {
  try {
    const query = String(req.query.query || '').trim();
    const supermarketIds = req.query.supermarkets
      ? String(req.query.supermarkets)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const sort = String(req.query.sort || 'relevance');
    const maxPrice =
      req.query.maxPrice !== undefined && req.query.maxPrice !== ''
        ? Number(req.query.maxPrice)
        : undefined;
    const onlyDiscounted = req.query.onlyDiscounted === 'true';

    // 1) Intentar con caché (TTL 15 min) para no golpear los sitios siempre.
    const cacheKey = JSON.stringify({
      query,
      supermarketIds: [...supermarketIds].sort(),
      sort,
      maxPrice: maxPrice ?? null,
      onlyDiscounted,
    });
    const cached = cache.get(cacheKey);
    if (cached !== undefined) {
      return res.json(cached);
    }

    // 2) Resolver la búsqueda.
    const result = await searchProducts({ query, supermarketIds, sort, maxPrice, onlyDiscounted });

    // 3) Guardar en caché y responder.
    cache.set(cacheKey, result, 900);
    return res.json(result);
  } catch (err) {
    console.error('[api/offers]', err);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

/** Endpoint de autocompletado del buscador. */
app.get('/api/suggestions', async (req, res) => {
  try {
    const query = String(req.query.query || '').trim();
    const supermarketIds = req.query.supermarkets
      ? String(req.query.supermarkets).split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const result = await suggestions(query, supermarketIds);
    return res.json({ suggestions: result.slice(0, 8) });
  } catch (err) {
    console.error('[api/suggestions]', err);
    return res.json({ suggestions: [] });
  }
});

/** Endpoint de salud. */
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
    cacheEntries: cache.size(),
    supermarkets: SUPERMARKET_IDS,
  });
});

/** Endpoint de ayuda. */
app.get('/', (req, res) => {
  res.json({
    name: 'OfertasAR API',
    endpoints: {
      search: '/api/offers?query=leche&supermarkets=coto,jumbo&sort=price_asc&maxPrice=2000&onlyDiscounted=true',
      health: '/api/health',
    },
  });
});

app.listen(PORT, () => {
  console.log(`OfertasAR API escuchando en http://localhost:${PORT}`);
});
