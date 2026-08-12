import { BadgePercent, Crown, Package, Tag } from 'lucide-react';
import type { Product } from '@/types/product';
import { getOfferUrl, getSupermarket } from '@/config/supermarkets';
import { formatARSInt, formatPercent } from '@/utils/format';

interface Props {
  product: Product;
}

function PriceTag({ offer }: { offer: Product['offers'][number] }) {
  const supermarket = getSupermarket(offer.supermarketId);
  return (
    <div
      className={`flex items-baseline gap-2 rounded-lg px-3 py-2 ${supermarket.theme.softBg}`}
    >
      <span className={`text-sm font-bold ${supermarket.theme.accentText}`}>
        {formatARSInt(offer.price)}
      </span>
      {offer.originalPrice && (
        <span className="text-xs text-slate-400 line-through">
          {formatARSInt(offer.originalPrice)}
        </span>
      )}
      {offer.discountPercent ? (
        <span
          className={`ml-auto rounded-md px-1.5 py-0.5 text-xs font-bold text-white ${supermarket.theme.badge}`}
        >
          {formatPercent(offer.discountPercent)}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Tarjeta de producto. Adapta dinámicamente bordes, badges, colores y botones
 * según la marca del supermercado que ofrece el mejor precio (ofertas[0],
 * ya viene ordenado por precio ascendente desde el servicio).
 */
export default function ProductCard({ product }: Props) {
  const best = product.offers[0];
  const alternatives = product.offers.slice(1);
  const supermarket = best ? getSupermarket(best.supermarketId) : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg animate-fade-in">
      {/* Cabecera: categoría + insignia de la marca del supermercado */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
          <Package className="h-3 w-3" />
          {product.category}
        </span>
        {supermarket && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold text-white"
            style={{ background: supermarket.theme.primary }}
          >
            <Tag className="h-3 w-3" />
            {supermarket.name}
          </span>
        )}
      </div>

      {/* Contenido del producto */}
      <div className="flex flex-1 flex-col px-4 py-4">
        {product.brand && (
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {product.brand}
          </p>
        )}
        <h3 className="mt-0.5 text-base font-semibold leading-snug text-slate-900">
          {product.name}
        </h3>
        {product.description && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">
            {product.description}
          </p>
        )}

        {/* Mejor oferta resaltada */}
        {best && supermarket && (
          <div
            className={`mt-4 rounded-2xl border-2 p-3 transition-colors ${supermarket.theme.border}`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Mejor precio
              </span>
              {best.membersOnly && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                  <Crown className="h-3.5 w-3.5" />
                  {best.promoLabel ?? 'Solo club'}
                </span>
              )}
            </div>

            <PriceTag offer={best} />

            {best.unit && (
              <p className="mt-1 text-xs text-slate-500">{best.unit}</p>
            )}
            {best.promoLabel && !best.membersOnly && (
              <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                <BadgePercent className="h-3.5 w-3.5 text-emerald-600" />
                {best.promoLabel}
              </span>
            )}

            <a
              href={getOfferUrl(best.supermarketId, best.url)}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-3 flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${supermarket.theme.button}`}
            >
              Ver oferta en {supermarket.name}
            </a>
          </div>
        )}

        {/* Ofertas alternativas (otras cadenas) */}
        {alternatives.length > 0 && (
          <div className="mt-3 space-y-1.5">
            <p className="px-1 text-xs font-medium text-slate-400">
              También en:
            </p>
            {alternatives.map((alt) => (
              <a
                key={alt.id}
                href={getOfferUrl(alt.supermarketId, alt.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-slate-50"
              >
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ background: getSupermarket(alt.supermarketId).theme.primary }}
                  >
                    {getSupermarket(alt.supermarketId).short}
                  </span>
                  {getSupermarket(alt.supermarketId).name}
                </span>
                <span className="flex shrink-0 items-center gap-2 text-right">
                  <span className="text-sm font-semibold text-slate-800">
                    {formatARSInt(
                      Math.min(alt.price, alt.originalPrice ?? alt.price),
                    )}
                  </span>
                  {alt.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      {formatARSInt(alt.originalPrice)}
                    </span>
                  )}
                  {alt.discountPercent ? (
                    <span
                      className="rounded-md px-1.5 py-0.5 text-xs font-bold text-white"
                      style={{
                        background: getSupermarket(alt.supermarketId).theme.primary,
                      }}
                    >
                      {formatPercent(alt.discountPercent)}
                    </span>
                  ) : null}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
