import { SearchX } from 'lucide-react';
import type { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
  loading: boolean;
  onRetry: () => void;
}

/** Tarjeta fantasma (skeleton) mostrada mientras carga la búsqueda. */
function ProductCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="skeleton h-5 w-24" />
        <div className="skeleton h-5 w-20" />
      </div>
      <div className="px-4 py-4">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton mt-2 h-4 w-3/4" />
        <div className="skeleton mt-2 h-3 w-full" />
        <div className="mt-4 flex items-center gap-2">
          <div className="skeleton h-10 w-1/3" />
        </div>
        <div className="skeleton mt-4 h-8 w-full" />
      </div>
    </article>
  );
}

export default function ProductGrid({
  products,
  loading,
  onRetry,
}: Props) {
  return (
    <section className="w-full">
      {/* Barra de herramientas: contador + ordenamiento */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-sm text-slate-500">
          {loading ? (
            'Buscando ofertas…'
          ) : (
            <span>
              <strong className="font-semibold text-slate-900">
                {products.length}
              </strong>{' '}
              {products.length === 1 ? 'producto' : 'productos'} con ofertas
            </span>
          )}
        </p>
      </div>

      {/* Skeletons mientras carga */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        // Estado vacío
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <SearchX className="h-7 w-7 text-slate-400" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-800">
            No encontramos ofertas
          </h3>
          <p className="mt-1 max-w-sm px-4 text-sm text-slate-500">
            Probá con otra búsqueda, cambiá los supermercados seleccionados o
            quitá los filtros de precio.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </section>
  );
}
