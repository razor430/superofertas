/** Utilidades de formato compartidas (moneda ARS y porcentajes). */

const arsFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 2,
});

/** Formatea un número como moneda argentina: $ 1.299,00 */
export function formatARS(value: number): string {
  return arsFormatter.format(value);
}

/** Formatea un entero como ARS sin decimales: $ 1.299 */
export function formatARSInt(value: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Formatea un porcentaje: "-16%" */
export function formatPercent(value: number): string {
  return `-${Math.round(value)}%`;
}

/** Convierte fecha ISO a texto corto en es-AR: "8/7" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}
