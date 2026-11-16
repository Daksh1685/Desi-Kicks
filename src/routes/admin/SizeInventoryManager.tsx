import type { ProductGender } from '../../types/product';
import { ALL_ADMIN_SIZES, GENDER_SIZE_PRESETS } from './adminTypes';

interface SizeInventoryManagerProps {
  gender: ProductGender;
  selectedSizes: string[];
  onChangeSelectedSizes: (sizes: string[]) => void;
  sizeStocks: Record<string, number>;
  onChangeStock: (size: string, stock: number) => void;
  onApplyStockToAll: (stock: number) => void;
}

export function SizeInventoryManager({
  gender,
  selectedSizes,
  onChangeSelectedSizes,
  sizeStocks,
  onChangeStock,
  onApplyStockToAll,
}: SizeInventoryManagerProps) {
  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      onChangeSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      onChangeSelectedSizes([...selectedSizes, size]);
    }
  };

  const applyPreset = (presetSizes: readonly string[]) => {
    onChangeSelectedSizes([...presetSizes]);
  };

  return (
    <div className="space-y-3">
      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-gray-400 font-semibold mr-1">Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset(GENDER_SIZE_PRESETS.Women)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer border ${gender === 'Women'
                ? 'bg-pink-50 border-pink-200 text-pink-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
          >
            Women (UK 3–8)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(GENDER_SIZE_PRESETS.Men)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer border ${gender === 'Men'
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
          >
            Men (UK 6–12)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(GENDER_SIZE_PRESETS.Kids)}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer border ${gender === 'Kids'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
          >
            Kids (UK 1–5)
          </button>
          <button
            type="button"
            onClick={() => applyPreset(ALL_ADMIN_SIZES)}
            className="px-2.5 py-1 rounded-lg font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            All Sizes (UK 1–12)
          </button>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => onApplyStockToAll(20)}
            className="text-primary hover:underline font-bold cursor-pointer"
          >
            Set 20 to all
          </button>
          <span className="text-gray-300">•</span>
          <button
            type="button"
            onClick={() => onChangeSelectedSizes([])}
            className="text-gray-400 hover:text-red-500 transition cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Dynamic Size Cards Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {ALL_ADMIN_SIZES.map((sz) => {
          const isSelected = selectedSizes.includes(sz);
          const stock = sizeStocks[sz] ?? 0;
          return (
            <div
              key={sz}
              className={`rounded-xl border p-2 transition-all ${isSelected
                  ? 'bg-white border-primary/40 shadow-2xs ring-1 ring-primary/20'
                  : 'bg-gray-50/70 border-gray-200 opacity-60 hover:opacity-100'
                }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <button
                  type="button"
                  onClick={() => toggleSize(sz)}
                  className="flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSize(sz)}
                    className="w-3.5 h-3.5 rounded text-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                  <span className={`text-xs font-bold ${isSelected ? 'text-gray-900' : 'text-gray-500'}`}>
                    {sz}
                  </span>
                </button>
              </div>

              <div className="mt-1">
                <label className="block text-[10px] text-gray-400 mb-0.5 font-medium">Pairs:</label>
                <input
                  type="number"
                  min={0}
                  disabled={!isSelected}
                  value={isSelected ? stock : ''}
                  placeholder={isSelected ? '0' : '—'}
                  onChange={(e) => onChangeStock(sz, Math.max(0, Number(e.target.value) || 0))}
                  className={`w-full text-center rounded-md py-1 text-xs font-bold transition ${isSelected
                      ? 'bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white'
                      : 'bg-gray-100 border border-transparent text-gray-400 cursor-not-allowed'
                    }`}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-500 pt-1">
        Selected: <strong className="text-gray-800">{selectedSizes.length} sizes active</strong> · Only checked sizes will be shown to customers on the storefront.
      </p>
    </div>
  );
}
