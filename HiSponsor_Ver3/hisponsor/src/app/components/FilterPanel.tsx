import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { CATEGORY_META, COUNTRIES, type Category } from '../data/posts';

interface FilterState {
  categories: Category[];
  countries: string[];
}

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const CATEGORY_COUNTS: Record<Category, number> = { jobs: 5, information: 5, template: 3 };
const COUNTRY_COUNTS: Record<string, number> = {
  USA: 2, Canada: 2, UK: 1, Australia: 2, Germany: 1,
  Japan: 1, Singapore: 1, Netherlands: 1, Global: 3,
};

export function FilterPanel({ filters, onFiltersChange, isMobile = false, onClose }: FilterPanelProps) {
  const [catOpen, setCatOpen] = useState(true);
  const [countryOpen, setCountryOpen] = useState(true);

  const toggleCat = (id: Category) => {
    const next = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id];
    onFiltersChange({ ...filters, categories: next });
  };

  const toggleCountry = (id: string) => {
    const next = filters.countries.includes(id)
      ? filters.countries.filter((c) => c !== id)
      : [...filters.countries, id];
    onFiltersChange({ ...filters, countries: next });
  };

  const clearAll = () => onFiltersChange({ categories: [], countries: [] });
  const total = filters.categories.length + filters.countries.length;

  return (
    <div className={`bg-white border border-gray-100 rounded-2xl shadow-sm ${isMobile ? 'w-full' : 'w-64 sticky top-20'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-800">필터 <span className="text-gray-400 font-normal text-xs">Filter</span></span>
          {total > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{total}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {total > 0 && (
            <button onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
              초기화
            </button>
          )}
          {isMobile && (
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Categories */}
        <div>
          <button
            onClick={() => setCatOpen(!catOpen)}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">카테고리 Category</span>
            <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
          </button>
          {catOpen && (
            <div className="space-y-2">
              {(Object.keys(CATEGORY_META) as Category[]).map((id) => {
                const meta = CATEGORY_META[id];
                const checked = filters.categories.includes(id);
                return (
                  <label key={id} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCat(id)}
                        className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        {meta.labelKr} <span className="text-gray-400 text-xs">{meta.labelEn}</span>
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                      {CATEGORY_COUNTS[id]}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-gray-50" />

        {/* Countries */}
        <div>
          <button
            onClick={() => setCountryOpen(!countryOpen)}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">국가 Country</span>
            <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${countryOpen ? 'rotate-180' : ''}`} />
          </button>
          {countryOpen && (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {COUNTRIES.map((c) => {
                const checked = filters.countries.includes(c.id);
                return (
                  <label key={c.id} className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCountry(c.id)}
                        className="w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        {c.flag} {c.labelKr} <span className="text-gray-400 text-xs">{c.labelEn}</span>
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                      {COUNTRY_COUNTS[c.id] ?? 0}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
