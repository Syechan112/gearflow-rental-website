import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';

export function Sidebar({ items = [], isOpen = true, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm lg:hidden transition-opacity',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed lg:sticky top-0 lg:top-16 z-40 h-screen lg:h-[calc(100vh-4rem)] w-64 bg-white border-r border-neutral-200 flex flex-col justify-between transition-transform duration-200',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-4 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Menu Utama
          </div>
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-btn text-xs font-medium transition-colors select-none',
                    isActive
                      ? 'bg-primary text-white shadow-sm font-semibold'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                  <span
                    className={cn(
                      'ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full transition-colors',
                      item.badgeVariant === 'warning'
                        ? 'bg-amber-100 text-amber-700'
                        : item.badgeVariant === 'danger'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-primary-light text-primary'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        <div className="p-4 border-t border-neutral-100 text-[11px] text-neutral-400">
          <p className="font-semibold text-neutral-600">GearFlow v2.0</p>
          <p>Local-First IndexedDB</p>
        </div>
      </aside>
    </>
  );
}
