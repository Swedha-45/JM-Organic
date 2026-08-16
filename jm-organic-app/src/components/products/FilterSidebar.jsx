// components/products/FilterSidebar.jsx
import React from 'react';
import { LayoutGrid, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // <-- Changed

const CATEGORY_ICONS = {
  all: LayoutGrid,
};

const FilterSidebar = ({
  categories,
  activeCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  maxPrice,
  selectedTags,
  onTagToggle,
  availableTags,
}) => {
  const { t } = useTranslation(); // <-- Changed

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Categories */}
      <div className="rounded-3xl bg-card shadow-card p-6">
        <h3 className="font-display font-bold text-foreground mb-4">
          {t('categories')}
        </h3>
        <div className="space-y-1">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.toLowerCase()] || Leaf;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-secondary text-primary'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat === 'all' ? t('allProducts') : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div className="rounded-3xl bg-card shadow-card p-6">
        <h3 className="font-display font-bold text-foreground mb-4">
          {t('priceRange')}
        </h3>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={10}
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>₹0</span>
          <span className="font-semibold text-foreground">
            {t('upTo')} ₹{priceRange}
          </span>
        </div>
      </div>

      {/* Tag filters (Cold Pressed, Organic, etc.) */}
      {availableTags.length > 0 && (
        <div className="rounded-3xl bg-card shadow-card p-6">
          <h3 className="font-display font-bold text-foreground mb-4">
            {t('productType')}
          </h3>
          <div className="space-y-2.5">
            {availableTags.map((tag) => (
              <label
                key={tag}
                className="flex items-center gap-3 text-sm text-foreground cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => onTagToggle(tag)}
                  className="w-4 h-4 rounded accent-primary"
                />
                {tag === 'Cold Pressed' ? t('coldPressed') : 
                 tag === 'Organic' ? t('hundredOrganic') :
                 tag === 'No Preservatives' ? t('noPreservatives') :
                 tag === 'Virgin' ? t('virgin') :
                 tag}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Trust footer, matches JM brand voice */}
      <div className="rounded-3xl bg-secondary/60 p-6">
        <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
          <Leaf className="w-4 h-4" />
          {t('hundredOrganic')}
        </span>
        <p className="text-xs text-muted-foreground mt-2">
          {t('noChemicalsPesticides')}
        </p>
      </div>
    </aside>
  );
};

export default FilterSidebar;