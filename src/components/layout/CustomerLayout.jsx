import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ROUTES } from '@/constants/routes';
import { ShoppingBag, Calendar, History, User } from 'lucide-react';
import { cn } from '@/utils/cn';

const CUSTOMER_NAV = [
  { to: ROUTES.CATALOG, label: 'Katalog Peralatan', icon: ShoppingBag },
  { to: ROUTES.CUSTOMER_BOOKINGS, label: 'Booking Saya', icon: Calendar },
  { to: ROUTES.CUSTOMER_RENTALS, label: 'Riwayat Rental', icon: History },
  { to: ROUTES.CUSTOMER_PROFILE, label: 'Profil Saya', icon: User },
];

export function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      {/* Commerce Subheader Navigation */}
      <div className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-6 overflow-x-auto py-2.5">
            {CUSTOMER_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2 py-1 text-xs font-medium whitespace-nowrap transition-colors border-b-2',
                      isActive
                        ? 'border-primary text-primary font-semibold'
                        : 'border-transparent text-neutral-500 hover:text-neutral-900'
                    )
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
