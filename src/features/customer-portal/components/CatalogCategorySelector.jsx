import React from 'react';
import { Select } from '@/components/ui/Select';
import { Sparkles, Layers, Camera, Tent, Sun, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';

const CATEGORY_ICONS = {
  all: Layers,
  'cat-camera': Camera,
  'cat-camping': Tent,
  'cat-lighting': Sun,
  'cat-drone': Zap,
};

export function CatalogCategorySelector({
  categories = [],
  selectedCategory,
  onCategoryChange,
  equipmentList = [],
}) {
  const getCategoryCount = (catId) => {
    if (catId === 'all') return equipmentList.length;
    return equipmentList.filter((item) => item.category_id === catId).length;
  };

  const categoryOptions = [
    { value: 'all', label: `Semua Kategori (${equipmentList.length})` },
    ...categories.map((c) => ({ value: c.id, label: `${c.name} (${getCategoryCount(c.id)})` })),
  ];

  return (
    <>
      {/* Mobile Category Dropdown */}
      <div className="sm:hidden mb-4">
        <Select options={categoryOptions} value={selectedCategory} onChange={onCategoryChange} />
      </div>

      {/* Desktop/Tablet Category Pills */}
      <div className="hidden sm:flex items-center justify-center gap-2 overflow-x-auto pb-6 pt-1">
        <button
          onClick={() => onCategoryChange('all')}
          className={cn(
            'flex-shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer border',
            selectedCategory === 'all'
              ? 'bg-primary text-white border-primary shadow-sm ring-2 ring-primary/10'
              : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Semua Kategori</span>
          <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-bold', selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500')}>
            {equipmentList.length}
          </span>
        </button>

        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] || Sparkles;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                'flex-shrink-0 whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer border',
                isSelected
                  ? 'bg-primary text-white border-primary shadow-sm ring-2 ring-primary/10'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
              <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-bold', isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500')}>
                {getCategoryCount(cat.id)}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
