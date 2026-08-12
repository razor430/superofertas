import type { Supermarket, SupermarketId } from '@/types/product';

/**
 * Identidades de marca de los 8 supermercados.
 *
 * Nota sobre Tailwind JIT: las clases "border", "softBg", "accentText",
 * "button" y "badge" se declaran como literales completos (no concatenadas),
 * para que el compilador de Tailwind pueda detectarlas durante el build y
 * generarlas en el CSS final.
 *
 * Las propiedades hex (primary/secondary/dark/onPrimary/gradient) se aplican
 * con estilos inline cuando se necesita un gradiente o color dinámico.
 */

export const SUPERMARKETS: Record<SupermarketId, Supermarket> = {
  jumbo: {
    id: 'jumbo',
    name: 'Jumbo',
    short: 'J',
    tagline: 'Gran variedad y ofertas premium',
    tier: 'premium',
    homeUrl: 'https://www.jumbo.com.ar/',
    theme: {
      primary: '#00843D',
      secondary: '#FFD100',
      dark: '#005c2b',
      onPrimary: '#ffffff',
      gradient: 'linear-gradient(135deg, #00843D 0%, #FFD100 100%)',
      border: 'border-green-600',
      softBg: 'bg-green-50',
      accentText: 'text-green-700',
      button: 'bg-green-600 hover:bg-green-700 text-white',
      badge: 'bg-green-600 text-white',
    },
  },
  coto: {
    id: 'coto',
    name: 'Coto',
    short: 'C',
    tagline: 'El super de la esquina, precios bajos',
    tier: 'medio',
    homeUrl: 'https://www.cotodigital3.com.ar/',
    theme: {
      primary: '#D71920',
      secondary: '#0053A0',
      dark: '#a30f15',
      onPrimary: '#ffffff',
      gradient: 'linear-gradient(135deg, #D71920 0%, #0053A0 100%)',
      border: 'border-red-700',
      softBg: 'bg-red-50',
      accentText: 'text-red-700',
      button: 'bg-red-600 hover:bg-red-700 text-white',
      badge: 'bg-red-600 text-white',
    },
  },
  disco: {
    id: 'disco',
    name: 'Disco',
    short: 'D',
    tagline: 'Ofertas que suman',
    tier: 'medio',
    homeUrl: 'https://www.disco.com.ar/',
    theme: {
      primary: '#E2001A',
      secondary: '#FFD100',
      dark: '#b00014',
      onPrimary: '#ffffff',
      gradient: 'linear-gradient(135deg, #E2001A 0%, #FFD100 100%)',
      border: 'border-red-600',
      softBg: 'bg-red-50',
      accentText: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700 text-white',
      badge: 'bg-red-600 text-white',
    },
  },
  vea: {
    id: 'vea',
    name: 'Vea',
    short: 'V',
    tagline: 'Cerca tuyo, con tu precio',
    tier: 'economico',
    homeUrl: 'https://www.vea.com.ar/',
    theme: {
      primary: '#00833A',
      secondary: '#00A651',
      dark: '#00602b',
      onPrimary: '#ffffff',
      gradient: 'linear-gradient(135deg, #00602b 0%, #00A651 100%)',
      border: 'border-green-600',
      softBg: 'bg-green-50',
      accentText: 'text-green-700',
      button: 'bg-green-700 hover:bg-green-800 text-white',
      badge: 'bg-green-700 text-white',
    },
  },
  carrefour: {
    id: 'carrefour',
    name: 'Carrefour',
    short: 'CF',
    tagline: 'Precios que se notan',
    tier: 'medio',
    homeUrl: 'https://www.carrefour.com.ar/',
    theme: {
      primary: '#003DA5',
      secondary: '#E63329',
      dark: '#002b77',
      onPrimary: '#ffffff',
      gradient: 'linear-gradient(135deg, #003DA5 0%, #E63329 100%)',
      border: 'border-blue-700',
      softBg: 'bg-blue-50',
      accentText: 'text-blue-700',
      button: 'bg-blue-700 hover:bg-blue-800 text-white',
      badge: 'bg-blue-700 text-white',
    },
  },
  dia: {
    id: 'dia',
    name: 'Día',
    short: 'DÍA',
    tagline: 'El colmadito de todos los días',
    tier: 'economico',
    homeUrl: 'https://diaonline.supermercadosdia.com.ar/',
    theme: {
      primary: '#E2001A',
      secondary: '#ffffff',
      dark: '#b40014',
      onPrimary: '#ffffff',
      gradient: 'linear-gradient(135deg, #E2001A 0%, #ffffff 100%)',
      border: 'border-red-600',
      softBg: 'bg-red-50',
      accentText: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700 text-white',
      badge: 'bg-red-600 text-white',
    },
  },
  changomas: {
    id: 'changomas',
    name: 'ChangoMás',
    short: 'CM',
    tagline: 'Más ahorro, todos los días',
    tier: 'economico',
    homeUrl: 'https://www.changomas.com.ar/',
    theme: {
      primary: '#004B93',
      secondary: '#FFD100',
      dark: '#003a72',
      onPrimary: '#ffffff',
      gradient: 'linear-gradient(135deg, #004B93 0%, #FFD100 100%)',
      border: 'border-blue-800',
      softBg: 'bg-blue-50',
      accentText: 'text-blue-800',
      button: 'bg-blue-800 hover:bg-blue-900 text-white',
      badge: 'bg-blue-800 text-white',
    },
  },
  vital: {
    id: 'vital',
    name: 'Vital',
    short: 'Vt',
    tagline: 'Cuidamos tu bolsillo',
    tier: 'economico',
    homeUrl: 'https://www.vital.com.ar/',
    theme: {
      primary: '#F26522',
      secondary: '#0053A0',
      dark: '#c94f16',
      onPrimary: '#ffffff',
      gradient: 'linear-gradient(135deg, #F26522 0%, #0053A0 100%)',
      border: 'border-orange-600',
      softBg: 'bg-orange-50',
      accentText: 'text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700 text-white',
      badge: 'bg-orange-600 text-white',
    },
  },
};

/** Lista ordenada de supermercados (para renderizado estable). */
export const SUPERMARKET_LIST: Supermarket[] = Object.values(SUPERMARKETS);

/** Helper para acceder a una marca por id. */
export function getSupermarket(id: SupermarketId): Supermarket {
  return SUPERMARKETS[id];
}

/**
 * Devuelve la URL para ver la oferta del producto en el sitio del supermercado.
 * Si la oferta trae una URL real (deep link provisto por el scraper) la usa;
 * de lo contrario, cae a la página de inicio (`homeUrl`) de la cadena, que es
 * una URL estable y siempre válida.
 */
export function getOfferUrl(
  supermarketId: SupermarketId,
  offerUrl?: string,
): string {
  if (offerUrl && /^https?:\/\//i.test(offerUrl)) return offerUrl;
  return SUPERMARKETS[supermarketId].homeUrl;
}
