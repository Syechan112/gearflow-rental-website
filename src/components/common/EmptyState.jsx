import React from 'react';
import { cn } from '@/utils/cn';
import { PackageOpen } from 'lucide-react';

export function EmptyState({
  title = 'Tidak ada data',
  description = 'Belum ada data yang tersedia untuk ditampilkan.',
  icon: Icon = PackageOpen,
  action,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center bg-white border border-dashed border-neutral-200 rounded-card', className)}>
      <div className="p-3 bg-neutral-100 rounded-full text-neutral-500 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-neutral-900">{title}</h4>
      <p className="text-xs text-neutral-500 mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
