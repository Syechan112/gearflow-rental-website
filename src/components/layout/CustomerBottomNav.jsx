import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { LayoutDashboard, ShoppingBag, Calendar, History, User } from 'lucide-react';
import { cn } from '@/utils/cn';

export function CustomerBottomNav({ counts = {} }) {
  const items = [
    { to: ROUTES.CUSTOMER_PORTAL, label: 'Dashboard', icon: LayoutDashboard },
    { to: ROUTES.CATALOG, label: 'Katalog', icon: ShoppingBag },
    { to: ROUTES.CUSTOMER_BOOKINGS, label: 'Booking', icon: Calendar, badge: counts.bookings },
    { to: ROUTES.CUSTOMER_RENTALS, label: 'Rental', icon: History, badge: counts.rentals },
    { to: ROUTES.CUSTOMER_PROFILE, label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-neutral-200 lg:hidden px-4 py-2 flex items-center justify-around shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-1 px-3 rounded-btn text-[11px] font-medium transition-colors',
                isActive ? 'text-primary font-bold' : 'text-neutral-500 hover:text-neutral-900'
              )
            }
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-[14px] text-[9px] font-bold rounded-full bg-primary text-white flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
