import { Search, ShoppingBasket, TrendingDown, X } from 'lucide-react';
import type { SortOption } from '@/types/product';
import { SUPERMARKET_LIST } from '@/config/supermarkets';

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  /** Ejecuta la búsqueda con el texto actual. */
  onSearch: () => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  onlyDiscounted: boolean;
  onToggleOnlyDiscounted: () => void;
  onClearFilters: () => void;
}

/** Devuelve un handler que ejecuta la búsqueda al presionar Enter. */
function useEnterSubmit(onSearch: () => void) {
  return (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };
}

/**
 * Navbar con buscador global y filtros rápidos (ordenamiento y "solo ofertas
 * con descuento"). A propósito no incluye autocompletado ni ningún dropdown
 * de sugerencias en el buscador.
 */
export default function Header({
  query,
  onQueryChange,
  onSearch,
  sort,
  onSortChange,
  onlyDiscounted,
  onToggleOnlyDiscounted,
  onClearFilters,
}: Props) {
  const handleEnter = useEnterSubmit(onSearch);
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Marca */}
          <button
            type="button"
            onClick={onClearFilters}
            className="flex shrink-0 items-center gap-2 text-left"
            title="Volver al inicio"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-amber-400 text-white shadow">
              <ShoppingBasket className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-lg font-extrabold leading-tight text-slate-900">
                Ofertas<span className="text-emerald-600">AR</span>
              </span>
              <span className="block text-xs text-slate-500">Compará y ahorrá</span>
            </span>
          </button>

          {/* Buscador global */}
          <div className="relative flex-1">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  onKeyDown={handleEnter}
                  placeholder="Buscá productos, marcas o categorías… (ej: leche, aceite, fideos)"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      onQueryChange('');
                      onSearch();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onSearch}
                className="shrink-0 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                Buscar
              </button>
            </div>
          </div>
        </div>

        {/* Fila de filtros rápidos */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="relative inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={onlyDiscounted}
              onChange={onToggleOnlyDiscounted}
              className="peer sr-only"
            />
            <span className="relative h-6 w-11 rounded-full bg-slate-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-emerald-600 peer-checked:after:translate-x-5" />
            <TrendingDown className="h-4 w-4 text-emerald-600" />
            <span>Solo ofertas</span>
          </label>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="relevance">Más relevantes</option>
            <option value="discount">Mayor descuento</option>
            <option value="price_asc">Menor precio</option>
            <option value="price_desc">Mayor precio</option>
          </select>

          <span className="ml-auto hidden items-center gap-1 text-xs text-slate-400 lg:flex">
            {SUPERMARKET_LIST.length} supermercados · actualizado hoy
          </span>
        </div>
      </div>
    </header>
  );
}

