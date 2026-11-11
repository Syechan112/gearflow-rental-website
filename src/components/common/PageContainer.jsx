import React from 'react';
import { cn } from '@/utils/cn';

export function PageContainer({ children, className }) {
  return (
    <div className={cn('mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6', className)}>
      {children}
    </div>
  );
}
