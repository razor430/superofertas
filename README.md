# 🛒 OfertasAR — Comparador de supermercados argentinos

Aplicación web profesional (React + TypeScript + Vite + Tailwind) que compara ofertas
de supermercados de Argentina: **Jumbo, Coto, Disco, Vea, Carrefour, Día, ChangoMás y Vital**.

Cada tarjeta de producto adapta dinámicamente colores, bordes, badges y botones según la
marca del supermercado que ofrece el mejor precio; los precios se muestran en pesos (ARS).

---

## 🚀 Puesta en marcha

```bash
npm install      # instala dependencias
npm run dev      # levanta el backend (puerto 8080) + servidor de desarrollo (http://localhost:5173)
npm run build    # compila tipos + produce /dist listo para producción
npm run preview  # sirve el build de producción localmente
```

El comando `npm run dev` inicia en simultáneo el **backend de scraping** (`server/index.mjs`, puerto 8080) y el **frontend** de Vite (puerto 5173). Si el backend no está corriendo, el buscador no puede obtener ofertas y muestra un error de conexión. Para detenerlos juntos, presioná `Ctrl+C` en la terminal donde corre `npm run dev`.

## 📁 Estructura

```
src/
├── types/product.ts          # Interfaces: Product, Offer, Supermarket, Filters, etc.
├── config/supermarkets.ts    # Identidad de marca (colores, clases Tailwind) de las 8 cadenas
├── services/api.ts           # Capa de datos: mock + búsqueda asíncrona/filtros/orden + comentarios backend
├── utils/format.ts           # Formateo de ARS y porcentajes
├── components/
│   ├── Header.tsx            # Navbar: buscador global, autocompletado y filtros rápidos
│   ├── SupermarketFilter.tsx # Selector activar/desactivar supermercados
│   ├── ProductCard.tsx       # Tarjeta adaptada a la marca del supermercado
│   └── ProductGrid.tsx       # Grilla responsive + skeleton loaders + estado vacío
└── App.tsx                   # Estado global (búsqueda, filtros, carga, orden) y layout
```

## 🎨 Branding
Las clases Tailwind de cada marca se declaran como literales en
`src/config/supermarkets.ts` para que Tailwind JIT las genere en el build
(bordes, fondos suaves, textos de acento, badges y botones).

## 🔌 Conectar un backend real (Serverless / Scraping)

1. Reemplazá el cuerpo de `searchProducts` en `src/services/api.ts` por un `fetch`
   a tu endpoint (hay un ejemplo comentado dentro del archivo).
2. El backend (AWS Lambda / Cloudflare Workers / Vercel Functions) debe:
   - Obtener catálogos vía **web scraping** de cada cadena con Playwright/Puppeteer.
   - Normalizar a las interfaces `Product`/`Offer`.
   - Cachear en una BD (TTL 15-30 min) para no golpear los sitios por request.
3. Usá una variable de entorno `VITE_API_URL` (ver `.env.example`).

> Los datos actuales son **mock** (precios referenciales simulados) con fines
> demostrativos. No reflejan precios reales.
