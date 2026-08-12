/**
 * Servidor API de ofertas (local).
 *
 * Levanta la aplicación Express definida en `./app.mjs` y la hace escuchar en
 * un puerto. Para correr como función serverless (Vercel) se usa
 * `api/index.js`, que reutiliza la misma `app` sin `listen`.
 *
 * Uso:
 *   node server/index.mjs
 *   # o con variables de entorno:
 *   PORT=8080 node server/index.mjs
 */

import { app } from './app.mjs';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`OfertasAR API escuchando en http://localhost:${PORT}`);
});
