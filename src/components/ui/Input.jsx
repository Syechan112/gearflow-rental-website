import React from 'react';
import { cn } from '@/utils/cn';

export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  className,
  wrapperClassName,
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || React.useId();

  return (
    <div className={cn('flex flex-col gap-1.5 w-full', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-neutral-700 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-neutral-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          className={cn(
            'w-full h-[42px] px-3.5 bg-white border border-neutral-200 rounded-input text-sm text-neutral-900',
            'placeholder:text-neutral-500 transition-colors duration-150',
            'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10',
            'disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed',
            Icon && 'pl-10',
            error && 'border-danger focus:border-danger focus:ring-danger/10',
            className
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-danger font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-neutral-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
