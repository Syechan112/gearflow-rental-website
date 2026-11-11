import React from 'react';
import { cn } from '@/utils/cn';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = 'neutral',
  className,
}) {
  return (
    <div className={cn('bg-white border border-neutral-200 rounded-card p-5 shadow-sm transition-all hover:border-neutral-300', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2 rounded-btn bg-neutral-100 text-primary">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-neutral-900 tracking-tight">{value}</span>
      </div>
      {(subtitle || badgeText) && (
        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
          {badgeText && (
            <span className={cn(
              'px-1.5 py-0.5 rounded font-medium',
              badgeType === 'success' && 'bg-success-light text-success',
              badgeType === 'warning' && 'bg-warning-light text-warning',
              badgeType === 'neutral' && 'bg-neutral-100 text-neutral-700'
            )}>
              {badgeText}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
