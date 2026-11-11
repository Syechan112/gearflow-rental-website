import React from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Search } from 'lucide-react';

export function InventoryFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories = [],
}) {
  const categoryOptions = [
    { value: 'all', label: 'Semua Kategori' },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 bg-white p-3 border border-neutral-200 rounded-card shadow-sm">
      <div className="flex-1 w-full">
        <Input
          icon={Search}
          placeholder="Cari peralatan berdasarkan nama, merk, atau model..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-60">
        <Select
          options={categoryOptions}
          value={selectedCategory}
          onChange={onCategoryChange}
        />
      </div>
    </div>
  );
}
