/**
 * Tipos globales del comparador de ofertas.
 * Centrales aquí para que components, services y la App compartan un único contrato.
 */

/** Identificadores normalizados de las 8 cadenas soportadas. */
export type SupermarketId =
  | 'jumbo'
  | 'coto'
  | 'disco'
  | 'vea'
  | 'carrefour'
  | 'dia'
  | 'changomas'
  | 'vital';

/** Paleta + clases por defecto de una marca (ver src/config/supermarkets.ts). */
export interface SupermarketTheme {
  /** Color principal (hex). Se usa en estilos inline y en gradientes. */
  primary: string;
  /** Color secundario / de acento (hex). */
  secondary: string;
  /** Color oscuro para textos o fondos contrastados (hex). */
  dark: string;
  /** Color de texto legible sobre `primary`. */
  onPrimary: string;
  /** Gradiente de fondo de la marca (usado en el header de la marca). */
  gradient: string;
  /** Clases Tailwind para el borde de tarjetas y chips. */
  border: string;
  /** Clases Tailwind para el fondo de chips/badges suaves. */
  softBg: string;
  /** Clases Tailwind para texto con color de marca (hover/accent). */
  accentText: string;
  /** Clases Tailwind para el botón de acción principal de la marca. */
  button: string;
  /** Clases Tailwind para el badge de "ver oferta" resaltado. */
  badge: string;
}

/** Identidad completa de marca para cada supermercado. */
export interface Supermarket {
  id: SupermarketId;
  /** Nombre comercial. */
  name: string;
  /** Sigla/abreviatura usada en avatares circulares. */
  short: string;
  /** Una línea de descripción. */
  tagline: string;
  /** Clasificación visual (rango de precio percibido, a modo informativo). */
  tier: 'economico' | 'medio' | 'premium';
  /** URL de la página de inicio del supermercado. */
  homeUrl: string;
  /** Datos de la marca. */
  theme: SupermarketTheme;
}

/**
 * Oferta de un producto en un supermercado puntual.
 * `originalPrice + discountPercent` permiten calcular el ahorro.
 */
export interface Offer {
  id: string;
  supermarketId: SupermarketId;
  /** Precio final a pagar (ARS). */
  price: number;
  /** Precio de referencia anterior (para calcular % de ahorro). */
  originalPrice?: number;
  /** % de descuento calculado (−). */
  discountPercent?: number;
  /** Etiqueta promocional ("2x1", "Llevá 3", "Con tarjeta", etc.). */
  promoLabel?: string;
  /** Unidad de venta ("1 kg", "Litro", "500 g"...). */
  unit?: string;
  /** Si es una oferta exclusiva de membresía (ej. Club Carrefour). */
  membersOnly?: boolean;
  /** URL real del producto en el sitio del supermercado (deep link). */
  url?: string;
  /** Fecha ISO de última sincronización. */
  updatedAt: string;
}

/** Producto genérico que puede tener ofertas en varias cadenas. */
export interface Product {
  id: string;
  name: string;
  /** Marca de fábrica (Arcor, Molinos, Coca-Cola...). */
  brand?: string;
  /** Categoría ("Lácteos", "Almacén", "Bebidas"...). */
  category: string;
  /** URL o ruta de imagen (opcional para mock). */
  image?: string;
  /** Descripción corta. */
  description?: string;
  /** Ofertas disponibles, una por cadena. */
  offers: Offer[];
}

/** Modo de ordenamiento de los resultados. */
export type SortOption =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'discount';

/** Filtros globales aplicados por la App y consumidos por los servicios. */
export interface Filters {
  /** Texto del buscador. */
  query: string;
  /** Conjunto de supermercados habilitados (vacío = todos). */
  supermarketIds: SupermarketId[];
  /** Ordenamiento activo. */
  sort: SortOption;
  /** Límite de precio máximo. */
  maxPrice?: number;
  /** Si solo se muestran productos con descuento. */
  onlyDiscounted: boolean;
}

/** Criterio de búsqueda que consume el servicio de datos. */
export interface SearchParams {
  query: string;
  supermarketIds: SupermarketId[];
  sort: SortOption;
  maxPrice?: number;
  onlyDiscounted: boolean;
}

/** Resultado de la búsqueda. */
export interface SearchResult {
  products: Product[];
  total: number;
  /** Duración simulada de la consulta (ms). */
  took: number;
}
