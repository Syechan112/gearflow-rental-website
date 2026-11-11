import React from 'react';
import { cn } from '@/utils/cn';

const BADGE_VARIANTS = {
  success: 'bg-success-light text-success border-success/20',
  warning: 'bg-warning-light text-warning border-warning/20',
  danger: 'bg-danger-light text-danger border-danger/20',
  info: 'bg-info-light text-info border-info/20',
  neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  primary: 'bg-primary-light text-primary border-primary/20',
};

export function Badge({
  children,
  variant = 'neutral',
  className,
  dot = false,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border select-none',
        BADGE_VARIANTS[variant] || BADGE_VARIANTS.neutral,
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-warning',
            variant === 'danger' && 'bg-danger',
            variant === 'info' && 'bg-info',
            variant === 'primary' && 'bg-primary',
            variant === 'neutral' && 'bg-neutral-500'
          )}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
