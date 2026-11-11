import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ROUTES } from '@/constants/routes';
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';

const STAFF_NAV_ITEMS = [
  { to: ROUTES.STAFF_DASHBOARD, label: 'Dashboard Operasional', icon: LayoutDashboard },
  { to: ROUTES.STAFF_INVENTORY, label: 'Inventaris & Unit', icon: Package },
  { to: ROUTES.STAFF_BOOKINGS, label: 'Verifikasi Booking', icon: CalendarCheck },
  { to: ROUTES.STAFF_RENTALS, label: 'Active Rentals', icon: Receipt },
  { to: ROUTES.STAFF_CHECKOUT, label: 'Check-out Barang', icon: ArrowUpRight },
  { to: ROUTES.STAFF_RETURNS, label: 'Check-in & Inspeksi', icon: ArrowDownLeft },
];

export function StaffLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar
          items={STAFF_NAV_ITEMS}
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
