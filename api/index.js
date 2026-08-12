/**
 * Función serverless de Vercel para la API de ofertas.
 *
 * Reutiliza la misma aplicación Express definida en `server/app.mjs` y la
 * exporta como manejador de Vercel (sin `app.listen`). Vercel enruta
 * `/api/*` hacia esta función mediante las rewrites de `vercel.json`.
 */
import { app } from '../server/app.mjs';

export default app;