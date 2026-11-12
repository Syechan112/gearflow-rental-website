import React from 'react';
import { Input } from '@/components/ui/Input';
import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

const DEFAULT_TABS = [
  { id: 'all', label: 'Semua' },
  { id: 'ongoing', label: 'Sedang Berjalan' },
  { id: 'completed', label: 'Selesai' },
  { id: 'overdue', label: 'Terlambat' },
];

export function CustomerRentalFilterBar({
  tabs = DEFAULT_TABS,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  placeholder = 'Cari ID transaksi atau alat...',
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors',
              activeTab === tab.id
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="w-full sm:w-64">
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={Search}
        />
      </div>
    </div>
  );
}
