import React from 'react';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 8,
  onPageChange,
  className,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalItems <= pageSize && currentPage === 1) return null;

  const start = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const end = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-neutral-100', className)}>
      <span className="text-xs text-neutral-500 order-2 sm:order-1">
        Menampilkan <strong className="text-neutral-800">{start}–{end}</strong> dari <strong className="text-neutral-800">{totalItems}</strong> peralatan
      </span>

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-2.5 text-xs"
          icon={ChevronLeft}
        >
          <span className="hidden sm:inline">Sebelumnya</span>
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((p, idx) =>
            p === '...' ? (
              <span key={`dots-${idx}`} className="px-2 text-xs text-neutral-400">...</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={cn(
                  'w-8 h-8 rounded-btn text-xs font-semibold transition-colors cursor-pointer',
                  currentPage === p
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                )}
              >
                {p}
              </button>
            )
          )}
        </div>

        <Button
          size="sm"
          variant="outline"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-2.5 text-xs"
        >
          <span className="hidden sm:inline">Berikutnya</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
