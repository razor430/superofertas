import { useCallback, useEffect, useRef, useState } from 'react';
import { Wallet } from 'lucide-react';
import type { Filters, Product, SortOption, SupermarketId } from '@/types/product';
import { searchProducts } from '@/services/api';
import Header from '@/components/Header';
import SupermarketFilter from '@/components/SupermarketFilter';
import ProductGrid from '@/components/ProductGrid';

/**
 * Componente principal.
 * Coordina los estados globales: búsqueda, supermercados activos, ordenamiento,
 * filtro de precio y estado de carga, y orquesta el llamado al servicio de datos.
 */
export default function App() {
  // --- Estado global -------------------------------------------------------
  const [query, setQuery] = useState('');
  const [supermarketIds, setSupermarketIds] = useState<SupermarketId[]>([]);
  const [sort, setSort] = useState<SortOption>('relevance');
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce para la búsqueda en vivo mientras se escribe.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Contador para descartar respuestas obsoletas (protección ante carreras).
  const requestId = useRef(0);

  /** Ejecuta la búsqueda con todos los filtros vigentes. */
  const runSearch = useCallback(
    async (overrides: Partial<Filters> = {}) => {
      const current = requestId.current + 1;
      requestId.current = current;
      setLoading(true);
      setError(null);
      try {
        const result = await searchProducts({
          query: overrides.query ?? query,
          supermarketIds: overrides.supermarketIds ?? supermarketIds,
          sort: overrides.sort ?? sort,
          onlyDiscounted: overrides.onlyDiscounted ?? onlyDiscounted,
          maxPrice: overrides.maxPrice ?? maxPrice,
        });
        // Solo aplicar si esta respuesta sigue siendo la más reciente.
        if (requestId.current === current) setProducts(result.products);
      } catch {
        if (requestId.current === current) {
          setError('No pudimos cargar las ofertas. Intentalo de nuevo.');
          setProducts([]);
        }
      } finally {
        if (requestId.current === current) setLoading(false);
      }
    },
    [query, supermarketIds, sort, onlyDiscounted, maxPrice],
  );

  // Búsqueda inicial al montar.
  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Búsqueda en vivo: debounce de 300 ms mientras se escribe el texto.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      runSearch({ query });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Re-búsqueda cuando cambian los filtros que no dependen del texto.
  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supermarketIds, sort, onlyDiscounted, maxPrice]);

  const clearFilters = () => {
    setQuery('');
    setSupermarketIds([]);
    setSort('relevance');
    setOnlyDiscounted(false);
    setMaxPrice(undefined);
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        query={query}
        onQueryChange={setQuery}
        onSearch={() => runSearch({ query })}
        sort={sort}
        onSortChange={setSort}
        onlyDiscounted={onlyDiscounted}
        onToggleOnlyDiscounted={() => setOnlyDiscounted((v) => !v)}
        onClearFilters={clearFilters}
      />

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Compará y ahorrá en cada compra
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                El mejor precio de la semana en ocho supermercados argentinos,
                en un solo lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* Columna lateral de filtros */}
          <aside className="lg:sticky lg:top-36 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <SupermarketFilter
                selected={supermarketIds}
                onChange={setSupermarketIds}
              />

              {/* Filtro de precio máximo */}
              <div className="mt-5 border-t border-slate-100 pt-4">
                <label
                  htmlFor="max-price"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Precio máximo ($)
                </label>
                <input
                  id="max-price"
                  type="number"
                  min={0}
                  value={maxPrice ?? ''}
                  onChange={(e) =>
                    setMaxPrice(
                      e.target.value === '' ? undefined : Number(e.target.value),
                    )
                  }
                  placeholder="Sin límite"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </aside>

          {/* Grilla de resultados */}
          <div>
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <ProductGrid
              products={products}
              loading={loading}
              onRetry={clearFilters}
            />
          </div>
        </div>
      </main>

      <footer className="mt-8 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs text-slate-400 sm:px-6">
          OfertasAR · Precios reales relevados en tiempo real de supermercados
          argentinos (ARS). Los datos pueden variar según disponibilidad de cada
          cadena.
        </div>
      </footer>
    </div>
  );
}

