import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ROUTES } from '@/constants/routes';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { rentalRepository } from '@/database/repositories/rentalRepository';
import { unitRepository } from '@/database/repositories/unitRepository';
import { BOOKING_STATUS, RENTAL_STATUS, UNIT_STATUS } from '@/constants/statuses';
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  Wrench,
} from 'lucide-react';

export function StaffLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({ pending: 0, checkout: 0, returns: 0, maint: 0 });

  useEffect(() => {
    async function loadCounts() {
      const [bookings, rentals, units] = await Promise.all([
        bookingRepository.getAll(),
        rentalRepository.getAll(),
        unitRepository.getAll(),
      ]);
      setCounts({
        pending: bookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length,
        checkout: bookings.filter((b) => b.status === BOOKING_STATUS.APPROVED).length,
        returns: rentals.filter((r) => r.status === RENTAL_STATUS.ONGOING || r.status === 'overdue').length,
        maint: units.filter((u) => u.status === UNIT_STATUS.MAINTENANCE).length,
      });
    }
    loadCounts();
  }, []);

  const navItems = [
    { to: ROUTES.STAFF_DASHBOARD, label: 'Dashboard Operasional', icon: LayoutDashboard },
    { to: ROUTES.STAFF_INVENTORY, label: 'Inventaris & Unit', icon: Package },
    { to: ROUTES.STAFF_BOOKINGS, label: 'Verifikasi Booking', icon: CalendarCheck, badge: counts.pending, badgeVariant: 'warning' },
    { to: ROUTES.STAFF_RENTALS, label: 'Active Rentals', icon: Receipt },
    { to: ROUTES.STAFF_CHECKOUT, label: 'Check-out Barang', icon: ArrowUpRight, badge: counts.checkout, badgeVariant: 'primary' },
    { to: ROUTES.STAFF_RETURNS, label: 'Check-in & Inspeksi', icon: ArrowDownLeft, badge: counts.returns, badgeVariant: 'danger' },
    { to: ROUTES.STAFF_MAINTENANCE, label: 'Servis & Maintenance', icon: Wrench, badge: counts.maint, badgeVariant: 'warning' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar
          items={navItems}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 overflow-x-hidden min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
