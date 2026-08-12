import { Store, Store as StoreIcon } from 'lucide-react';
import type { SupermarketId } from '@/types/product';
import { SUPERMARKET_LIST } from '@/config/supermarkets';

interface Props {
  /** Supermercados actualmente activos. Arreglo vacío = todos. */
  selected: SupermarketId[];
  /** Callback que recibe el nuevo conjunto de activos (vacio = todos). */
  onChange: (ids: SupermarketId[]) => void;
}

/**
 * Selector de supermercados de selección única (no aditivo).
 * - "Todos" (selected === []) muestra todos los supermercados.
 * - Al tocar un supermercado se selecciona únicamente ese.
 * - Al volver a tocar el supermercado ya activo se revierte a "Todos".
 * No es posible tener varios supermercados activos a la vez.
 */
export default function SupermarketFilter({ selected, onChange }: Props) {
  const allActive = selected.length === 0;
  const active = allActive ? null : selected[0];
  const activeCount = allActive ? SUPERMARKET_LIST.length : 1;

  const toggle = (id: SupermarketId) => {
    if (allActive) {
      // Salir de "Todos": activar solo el tocado.
      onChange([id]);
      return;
    }
    // Si es el ya activo, se revierte a "Todos"; si no, se selecciona solo ese.
    onChange(active === id ? [] : [id]);
  };

  return (
    <section className="w-full">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Store className="h-4 w-4 text-slate-400" />
          Supermercados{' '}
          <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-600">
            {allActive ? 'Todos' : `${activeCount}/${SUPERMARKET_LIST.length}`}
          </span>
        </h2>
        <button
          type="button"
          onClick={() => onChange([])}
          className="text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          Todos
        </button>
      </div>

      {/* Lista vertical: muestra las 8 cadenas desplegadas, siempre visibles en la barra lateral */}
      <div className="flex flex-col gap-1.5">
        {SUPERMARKET_LIST.map((supermarket) => {
          const isActive = allActive || active === supermarket.id;
          return (
            <button
              key={supermarket.id}
              type="button"
              onClick={() => toggle(supermarket.id)}
              aria-pressed={isActive}
              className={`group flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-sm font-medium transition-all
                ${
                  isActive
                    ? `${supermarket.theme.softBg} ${supermarket.theme.border} ${supermarket.theme.accentText} shadow-sm`
                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
            >
              {/* Avatares circulares con la sigla de la marca */}
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: supermarket.theme.primary }}
              >
                {supermarket.short}
              </span>
              <span className="flex-1 truncate">{supermarket.name}</span>
              {isActive ? (
                <StoreIcon className="h-4 w-4 shrink-0" />
              ) : (
                <span className="h-4 w-4 shrink-0 rounded-full border border-current opacity-40" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
