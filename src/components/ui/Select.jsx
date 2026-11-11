import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, Check } from 'lucide-react';

export function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Pilih opsi...',
  error,
  className,
  wrapperClassName,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className={cn('relative flex flex-col gap-1.5 w-full', wrapperClassName)}>
      {label && (
        <label className="text-xs font-semibold text-neutral-700 tracking-wide">{label}</label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full h-[42px] px-3.5 bg-white border border-neutral-200 rounded-input text-sm text-left',
          'flex items-center justify-between transition-all duration-150',
          'focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10',
          'disabled:bg-neutral-100 disabled:cursor-not-allowed',
          isOpen && 'border-primary ring-2 ring-primary/10',
          error && 'border-danger',
          className
        )}
      >
        <span className={cn('truncate', !selectedOption && 'text-neutral-500')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-neutral-500 transition-transform duration-200 shrink-0 ml-2',
            isOpen && 'rotate-180 text-primary'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 w-full mt-1.5 bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-card shadow-tactile-light py-1.5 max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-3.5 py-2 text-xs text-neutral-500 text-center">Tidak ada opsi</div>
          ) : (
            options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange?.(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full px-3.5 py-2 text-xs text-left flex items-center justify-between',
                    'transition-colors duration-100 cursor-pointer',
                    isSelected
                      ? 'bg-primary-light text-primary font-medium'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      )}
      {error && <p className="text-xs text-danger font-medium">{error}</p>}
    </div>
  );
}
