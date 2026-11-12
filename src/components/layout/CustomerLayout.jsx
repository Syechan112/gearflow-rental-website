import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar } from './Navbar';
import { CustomerBottomNav } from './CustomerBottomNav';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { rentalRepository } from '@/database/repositories/rentalRepository';
import { LayoutDashboard, ShoppingBag, Calendar, History, User } from 'lucide-react';
import { cn } from '@/utils/cn';

export function CustomerLayout() {
  const { user } = useAuthStore();
  const [counts, setCounts] = useState({ bookings: 0, rentals: 0 });

  useEffect(() => {
    async function loadCounts() {
      if (user?.id) {
        const [b, r] = await Promise.all([
          bookingRepository.getByCustomerId(user.id),
          rentalRepository.getByCustomerId(user.id),
        ]);
        setCounts({
          bookings: b.filter((item) => item.status === 'pending' || item.status === 'approved').length,
          rentals: r.filter((item) => item.status === 'ongoing' || item.status === 'overdue').length,
        });
      }
    }
    loadCounts();
  }, [user]);

  const navItems = [
    { to: ROUTES.CUSTOMER_PORTAL, label: 'Dashboard', icon: LayoutDashboard },
    { to: ROUTES.CATALOG, label: 'Katalog Peralatan', icon: ShoppingBag },
    { to: ROUTES.CUSTOMER_BOOKINGS, label: 'Booking Saya', icon: Calendar, badge: counts.bookings },
    { to: ROUTES.CUSTOMER_RENTALS, label: 'Riwayat Rental', icon: History, badge: counts.rentals },
    { to: ROUTES.CUSTOMER_PROFILE, label: 'Profil Saya', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background pb-16 lg:pb-0">
      <Navbar />
      <div className="hidden lg:block bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-6 overflow-x-auto py-2.5">
            {navItems.map((item) => {
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
                  {item.badge > 0 && (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-primary/10 text-primary">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="flex-1">
        <Outlet />
      </main>

      <CustomerBottomNav counts={counts} />
    </div>
  );
}
