/**
 * Catálogo de respaldo (fallback) para el servidor.
 *
 * Cuando un supermercado bloquea el scraping o no hay datos en tiempo real,
 * se usan estos productos de ejemplo para que la app nunca quede vacía y el
 * usuario pueda ver el flujo completo (filtros, orden, comparación de precios).
 *
 * Estructura idéntica a la interfaz Product/Offer del frontend, para que el
 * contrato de la API sea consistente.
 */

export const FALLBACK_PRODUCTS = [
  {
    id: 'leche-larga-vida',
    name: 'Leche Larga Vida Entera',
    brand: 'La Serenísima',
    category: 'Lácteos',
    description: 'Brick 1 L de leche entera UAT.',
    offers: [
      { id: 'o-jumbo-leche', supermarketId: 'jumbo', price: 1299, originalPrice: 1550, discountPercent: 16, unit: '1 L', updatedAt: '2026-07-08T10:00:00Z' },
      { id: 'o-carrefour-leche', supermarketId: 'carrefour', price: 1185, originalPrice: 1450, discountPercent: 18, promoLabel: 'Club Carrefour', membersOnly: true, unit: '1 L', updatedAt: '2026-07-08T09:00:00Z' },
      { id: 'o-coto-leche', supermarketId: 'coto', price: 1350, originalPrice: 1500, discountPercent: 10, unit: '1 L', updatedAt: '2026-07-07T18:00:00Z' },
    ],
  },
  {
    id: 'yogur-bebible',
    name: 'Yogur Bebible',
    brand: 'Sancor',
    category: 'Lácteos',
    description: 'Pack 6 unidades de 200 g.',
    offers: [
      { id: 'o-coto-yogur', supermarketId: 'coto', price: 1650, originalPrice: 1990, discountPercent: 17, promoLabel: '2do al 50%', unit: '6 x 200 g', updatedAt: '2026-07-08T11:00:00Z' },
      { id: 'o-dia-yogur', supermarketId: 'dia', price: 1590, originalPrice: 1900, discountPercent: 16, unit: '6 x 200 g', updatedAt: '2026-07-08T10:30:00Z' },
      { id: 'o-vital-yogur', supermarketId: 'vital', price: 1700, originalPrice: 1950, discountPercent: 13, unit: '6 x 200 g', updatedAt: '2026-07-07T21:00:00Z' },
    ],
  },
  {
    id: 'queso-crema',
    name: 'Queso Crema Casancrem',
    brand: 'Casancrem',
    category: 'Lácteos',
    description: 'Pote de 400 g.',
    offers: [
      { id: 'o-disco-queso', supermarketId: 'disco', price: 1740, originalPrice: 2090, discountPercent: 17, unit: '400 g', updatedAt: '2026-07-08T10:10:00Z' },
      { id: 'o-vital-queso', supermarketId: 'vital', price: 1690, originalPrice: 2000, discountPercent: 15, unit: '400 g', updatedAt: '2026-07-08T09:40:00Z' },
      { id: 'o-carrefour-queso', supermarketId: 'carrefour', price: 1810, originalPrice: 2100, discountPercent: 14, unit: '400 g', updatedAt: '2026-07-07T19:45:00Z' },
    ],
  },
  {
    id: 'aceite-girasol',
    name: 'Aceite de Girasol',
    brand: 'Natura',
    category: 'Almacén',
    description: 'Botella de 900 ml.',
    offers: [
      { id: 'o-dia-aceite', supermarketId: 'dia', price: 2240, originalPrice: 2790, discountPercent: 20, unit: '900 ml', updatedAt: '2026-07-08T08:00:00Z' },
      { id: 'o-vea-aceite', supermarketId: 'vea', price: 2190, originalPrice: 2600, discountPercent: 16, unit: '900 ml', updatedAt: '2026-07-08T07:30:00Z' },
      { id: 'o-jumbo-aceite', supermarketId: 'jumbo', price: 2490, originalPrice: 2800, discountPercent: 11, unit: '900 ml', updatedAt: '2026-07-07T20:00:00Z' },
    ],
  },
  {
    id: 'aceite-oliva',
    name: 'Aceite de Oliva',
    brand: 'Nucete',
    category: 'Almacén',
    description: 'Botella de 500 ml de aceite de oliva extra virgen.',
    offers: [
      { id: 'o-coto-aceite-oliva', supermarketId: 'coto', price: 3890, originalPrice: 4690, discountPercent: 17, promoLabel: 'Llevá 2 p/6.990', unit: '500 ml', updatedAt: '2026-07-08T09:00:00Z' },
      { id: 'o-vea-aceite-oliva', supermarketId: 'vea', price: 4050, originalPrice: 4800, discountPercent: 16, unit: '500 ml', updatedAt: '2026-07-08T08:30:00Z' },
      { id: 'o-carrefour-aceite-oliva', supermarketId: 'carrefour', price: 4180, originalPrice: 4900, discountPercent: 15, unit: '500 ml', updatedAt: '2026-07-07T19:30:00Z' },
    ],
  },
  {
    id: 'fideos-moñitas',
    name: 'Fideos Moñitas',
    brand: 'Matarazzo',
    category: 'Almacén',
    description: 'Pack de 500 g de pasta seca.',
    offers: [
      { id: 'o-disco-fideos', supermarketId: 'disco', price: 890, originalPrice: 1100, discountPercent: 19, unit: '500 g', updatedAt: '2026-07-08T10:00:00Z' },
      { id: 'o-dia-fideos', supermarketId: 'dia', price: 870, originalPrice: 1050, discountPercent: 17, unit: '500 g', updatedAt: '2026-07-08T09:30:00Z' },
      { id: 'o-coto-fideos', supermarketId: 'coto', price: 930, originalPrice: 1150, discountPercent: 19, unit: '500 g', updatedAt: '2026-07-07T18:40:00Z' },
    ],
  },
  {
    id: 'arroz-doble-carolina',
    name: 'Arroz Doble Carolina',
    brand: 'Molinos Ala',
    category: 'Almacén',
    description: 'Bolsa de 1 kg.',
    offers: [
      { id: 'o-coto-arroz', supermarketId: 'coto', price: 1480, originalPrice: 1750, discountPercent: 15, unit: '1 kg', updatedAt: '2026-07-08T11:30:00Z' },
      { id: 'o-carrefour-arroz', supermarketId: 'carrefour', price: 1450, originalPrice: 1690, discountPercent: 14, unit: '1 kg', updatedAt: '2026-07-08T08:50:00Z' },
      { id: 'o-jumbo-arroz', supermarketId: 'jumbo', price: 1520, originalPrice: 1790, discountPercent: 15, unit: '1 kg', updatedAt: '2026-07-07T19:10:00Z' },
    ],
  },
  {
    id: 'pollo-entero',
    name: 'Pollo Entero',
    brand: '',
    category: 'Carnes',
    description: 'Pollo fresco entero.',
    offers: [
      { id: 'o-changomas-pollo', supermarketId: 'changomas', price: 2650, originalPrice: 3300, discountPercent: 20, promoLabel: 'Precio Chango', unit: 'kg', updatedAt: '2026-07-08T08:15:00Z' },
      { id: 'o-vea-pollo', supermarketId: 'vea', price: 2790, originalPrice: 3200, discountPercent: 13, unit: 'kg', updatedAt: '2026-07-08T09:00:00Z' },
      { id: 'o-coto-pollo', supermarketId: 'coto', price: 2890, originalPrice: 3400, discountPercent: 15, unit: 'kg', updatedAt: '2026-07-08T09:45:00Z' },
    ],
  },
  {
    id: 'coca-cola-1-5',
    name: 'Coca-Cola',
    brand: 'Coca-Cola',
    category: 'Bebidas',
    description: 'Gaseosa cola edición regular.',
    offers: [
      { id: 'o-carrefour-coca', supermarketId: 'carrefour', price: 2450, originalPrice: 2990, discountPercent: 18, promoLabel: 'Llevá 2 p/3.990', unit: '1,5 L', updatedAt: '2026-07-08T12:00:00Z' },
      { id: 'o-disco-coca', supermarketId: 'disco', price: 2490, originalPrice: 2900, discountPercent: 14, unit: '1,5 L', updatedAt: '2026-07-07T19:00:00Z' },
      { id: 'o-jumbo-coca', supermarketId: 'jumbo', price: 2590, originalPrice: 3100, discountPercent: 16, unit: '1,5 L', updatedAt: '2026-07-08T11:45:00Z' },
    ],
  },
  {
    id: 'agua-mineral',
    name: 'Agua Mineral',
    brand: 'Villavicencio',
    category: 'Bebidas',
    description: 'Pack de 6 botellas de 500 ml.',
    offers: [
      { id: 'o-coto-agua', supermarketId: 'coto', price: 2650, originalPrice: 3200, discountPercent: 17, unit: '6 x 500 ml', updatedAt: '2026-07-08T11:20:00Z' },
      { id: 'o-changomas-agua', supermarketId: 'changomas', price: 2590, originalPrice: 3100, discountPercent: 16, unit: '6 x 500 ml', updatedAt: '2026-07-08T08:30:00Z' },
      { id: 'o-jumbo-agua', supermarketId: 'jumbo', price: 2750, originalPrice: 3300, discountPercent: 17, unit: '6 x 500 ml', updatedAt: '2026-07-08T11:00:00Z' },
    ],
  },
  {
    id: 'detergente-mastropiero',
    name: 'Detergente Limón',
    brand: 'Mastropiero',
    category: 'Limpieza',
    description: 'Botella de 750 ml.',
    offers: [
      { id: 'o-changomas-detergente', supermarketId: 'changomas', price: 780, originalPrice: 950, discountPercent: 18, promoLabel: 'Precio Chango', unit: '750 ml', updatedAt: '2026-07-08T08:00:00Z' },
      { id: 'o-disco-detergente', supermarketId: 'disco', price: 820, originalPrice: 990, discountPercent: 17, unit: '750 ml', updatedAt: '2026-07-08T07:50:00Z' },
      { id: 'o-vea-detergente', supermarketId: 'vea', price: 850, originalPrice: 1000, discountPercent: 15, unit: '750 ml', updatedAt: '2026-07-07T20:30:00Z' },
    ],
  },
  {
    id: 'pañales-bebe',
    name: 'Pañales Confort Sec',
    brand: 'Pañales',
    category: 'Bebé',
    description: 'Pack XG 30 unidades talle P.',
    offers: [
      { id: 'o-changomas-pañales', supermarketId: 'changomas', price: 12400, originalPrice: 14500, discountPercent: 14, unit: 'XG 30', updatedAt: '2026-07-08T11:00:00Z' },
      { id: 'o-jumbo-pañales', supermarketId: 'jumbo', price: 12900, originalPrice: 14900, discountPercent: 13, promoLabel: 'Club Jumbo', membersOnly: true, unit: 'XG 30', updatedAt: '2026-07-08T12:30:00Z' },
      { id: 'o-vea-pañales', supermarketId: 'vea', price: 13200, originalPrice: 15000, discountPercent: 12, unit: 'XG 30', updatedAt: '2026-07-07T18:30:00Z' },
    ],
  },
  {
    id: 'galletitas-chocolate',
    name: 'Galletitas Chocolate',
    brand: 'Criollitas',
    category: 'Almacén',
    description: 'Paquete de 200 g.',
    offers: [
      { id: 'o-dia-galle', supermarketId: 'dia', price: 690, originalPrice: 830, discountPercent: 17, unit: '200 g', updatedAt: '2026-07-08T08:20:00Z' },
      { id: 'o-vea-galle', supermarketId: 'vea', price: 710, originalPrice: 850, discountPercent: 16, unit: '200 g', updatedAt: '2026-07-08T07:40:00Z' },
    ],
  },
{
    id: 'aceite-oliva-cocinero',
    name: 'Aceite de Oliva',
    brand: 'Cocinero',
    category: 'Almacén',
    description: 'Botella de 500 ml de aceite de oliva extra virgen.',
    offers: [
      { id: 'o-changomas-aceite-oliva-coc', supermarketId: 'changomas', price: 3890, originalPrice: 4700, discountPercent: 17, unit: '500 ml', updatedAt: '2026-07-08T10:10:00Z' },
      { id: 'o-dia-aceite-oliva-coc', supermarketId: 'dia', price: 4020, originalPrice: 4850, discountPercent: 17, unit: '500 ml', updatedAt: '2026-07-08T08:40:00Z' },
      { id: 'o-coto-aceite-oliva-coc', supermarketId: 'coto', price: 4150, originalPrice: 4900, discountPercent: 15, promoLabel: 'Llevá 2 p/7.990', unit: '500 ml', updatedAt: '2026-07-08T09:20:00Z' },
    ],
  },
  {
    id: 'aceite-oliva-natura',
    name: 'Aceite de Oliva',
    brand: 'Natura',
    category: 'Almacén',
    description: 'Botella de 500 ml de aceite de oliva extra virgen.',
    offers: [
      { id: 'o-vea-aceite-oliva-natura', supermarketId: 'vea', price: 3780, originalPrice: 4550, discountPercent: 17, unit: '500 ml', updatedAt: '2026-07-08T07:30:00Z' },
      { id: 'o-jumbo-aceite-oliva-natura', supermarketId: 'jumbo', price: 4020, originalPrice: 4700, discountPercent: 14, unit: '500 ml', updatedAt: '2026-07-08T11:00:00Z' },
      { id: 'o-carrefour-aceite-oliva-natura', supermarketId: 'carrefour', price: 3950, originalPrice: 4600, discountPercent: 14, unit: '500 ml', updatedAt: '2026-07-07T19:40:00Z' },
    ],
  },
  {
    id: 'aceite-girasol-cocinero',
    name: 'Aceite de Girasol',
    brand: 'Cocinero',
    category: 'Almacén',
    description: 'Botella de 900 ml de aceite de girasol.',
    offers: [
      { id: 'o-carrefour-aceite-girasol-coc', supermarketId: 'carrefour', price: 2260, originalPrice: 2750, discountPercent: 18, unit: '900 ml', updatedAt: '2026-07-08T09:10:00Z' },
      { id: 'o-jumbo-aceite-girasol-coc', supermarketId: 'jumbo', price: 2310, originalPrice: 2800, discountPercent: 17, unit: '900 ml', updatedAt: '2026-07-08T11:30:00Z' },
      { id: 'o-disco-aceite-girasol-coc', supermarketId: 'disco', price: 2190, originalPrice: 2650, discountPercent: 17, unit: '900 ml', updatedAt: '2026-07-08T10:00:00Z' },
    ],
  },
{
    id: 'leche-sancor',
    name: 'Leche Larga Vida Entera',
    brand: 'Sancor',
    category: 'Lácteos',
    description: 'Brick 1 L de leche entera UAT.',
    offers: [
      { id: 'o-dia-leche-sancor', supermarketId: 'dia', price: 1260, originalPrice: 1510, discountPercent: 16, unit: '1 L', updatedAt: '2026-07-08T08:30:00Z' },
      { id: 'o-vea-leche-sancor', supermarketId: 'vea', price: 1230, originalPrice: 1490, discountPercent: 17, unit: '1 L', updatedAt: '2026-07-08T07:45:00Z' },
      { id: 'o-changomas-leche-sancor', supermarketId: 'changomas', price: 1290, originalPrice: 1520, discountPercent: 15, unit: '1 L', updatedAt: '2026-07-08T10:20:00Z' },
    ],
  },
  {
    id: 'leche-ilolay',
    name: 'Leche Larga Vida Entera',
    brand: 'Ilolay',
    category: 'Lácteos',
    description: 'Brick 1 L de leche entera UAT.',
    offers: [
      { id: 'o-disco-leche-ilolay', supermarketId: 'disco', price: 1310, originalPrice: 1560, discountPercent: 16, unit: '1 L', updatedAt: '2026-07-08T09:50:00Z' },
      { id: 'o-vital-leche-ilolay', supermarketId: 'vital', price: 1280, originalPrice: 1530, discountPercent: 16, unit: '1 L', updatedAt: '2026-07-08T08:10:00Z' },
      { id: 'o-coto-leche-ilolay', supermarketId: 'coto', price: 1340, originalPrice: 1550, discountPercent: 14, unit: '1 L', updatedAt: '2026-07-07T18:30:00Z' },
    ],
  },
  {
    id: 'yogur-la-serenisima',
    name: 'Yogur Bebible',
    brand: 'La Serenísima',
    category: 'Lácteos',
    description: 'Pack 6 unidades de 200 g.',
    offers: [
      { id: 'o-jumbo-yogur-ls', supermarketId: 'jumbo', price: 1720, originalPrice: 2060, discountPercent: 16, unit: '6 x 200 g', updatedAt: '2026-07-08T11:10:00Z' },
      { id: 'o-carrefour-yogur-ls', supermarketId: 'carrefour', price: 1690, originalPrice: 2010, discountPercent: 16, promoLabel: 'Club Carrefour', membersOnly: true, unit: '6 x 200 g', updatedAt: '2026-07-08T09:20:00Z' },
      { id: 'o-disco-yogur-ls', supermarketId: 'disco', price: 1750, originalPrice: 2070, discountPercent: 15, unit: '6 x 200 g', updatedAt: '2026-07-08T10:40:00Z' },
    ],
  },
{
    id: 'queso-mendicrim',
    name: 'Queso Crema',
    brand: 'Mendicrim',
    category: 'Lácteos',
    description: 'Pote de 400 g.',
    offers: [
      { id: 'o-coto-queso-mendicrim', supermarketId: 'coto', price: 1790, originalPrice: 2150, discountPercent: 17, unit: '400 g', updatedAt: '2026-07-08T09:30:00Z' },
      { id: 'o-changomas-queso-mendicrim', supermarketId: 'changomas', price: 1740, originalPrice: 2080, discountPercent: 16, unit: '400 g', updatedAt: '2026-07-08T08:00:00Z' },
      { id: 'o-vea-queso-mendicrim', supermarketId: 'vea', price: 1820, originalPrice: 2140, discountPercent: 15, unit: '400 g', updatedAt: '2026-07-07T20:00:00Z' },
    ],
  },
  {
    id: 'arroz-largo-fino-gallo',
    name: 'Arroz Largo Fino',
    brand: 'Gallo',
    category: 'Almacén',
    description: 'Bolsa de 1 kg.',
    offers: [
      { id: 'o-dia-arroz-gallo', supermarketId: 'dia', price: 1390, originalPrice: 1680, discountPercent: 17, unit: '1 kg', updatedAt: '2026-07-08T08:20:00Z' },
      { id: 'o-jumbo-arroz-gallo', supermarketId: 'jumbo', price: 1450, originalPrice: 1730, discountPercent: 16, unit: '1 kg', updatedAt: '2026-07-08T11:20:00Z' },
      { id: 'o-carrefour-arroz-gallo', supermarketId: 'carrefour', price: 1420, originalPrice: 1700, discountPercent: 16, unit: '1 kg', updatedAt: '2026-07-07T19:00:00Z' },
    ],
  },
  {
    id: 'fideos-tirabuzon-lucchetti',
    name: 'Fideos Tirabuzón',
    brand: 'Lucchetti',
    category: 'Almacén',
    description: 'Paquete de 500 g de pasta seca.',
    offers: [
      { id: 'o-jumbo-fideos-lucchetti', supermarketId: 'jumbo', price: 920, originalPrice: 1110, discountPercent: 17, unit: '500 g', updatedAt: '2026-07-08T10:50:00Z' },
      { id: 'o-changomas-fideos-lucchetti', supermarketId: 'changomas', price: 890, originalPrice: 1070, discountPercent: 17, unit: '500 g', updatedAt: '2026-07-08T08:10:00Z' },
      { id: 'o-carrefour-fideos-lucchetti', supermarketId: 'carrefour', price: 950, originalPrice: 1120, discountPercent: 15, unit: '500 g', updatedAt: '2026-07-08T09:40:00Z' },
    ],
  },
];

/** Nombres de supermercados soportados (para validar el filtro). */
export const SUPERMARKET_IDS = [
  'jumbo',
  'coto',
  'disco',
  'vea',
  'carrefour',
  'dia',
  'changomas',
  'vital',
];


