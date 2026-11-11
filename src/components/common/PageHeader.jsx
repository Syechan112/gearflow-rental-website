import React from 'react';
import { cn } from '@/utils/cn';

export function PageHeader({
  title,
  description,
  action,
  breadcrumbs,
  className,
}) {
  return (
    <div className={cn('flex flex-col gap-3 pb-6 md:flex-row md:items-center md:justify-between', className)}>
      <div className="space-y-1">
        {breadcrumbs && (
          <div className="text-xs text-neutral-500 font-medium">{breadcrumbs}</div>
        )}
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-neutral-500 max-w-2xl">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-2.5 shrink-0">{action}</div>}
    </div>
  );
}
