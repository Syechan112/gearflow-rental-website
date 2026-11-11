import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ROUTES } from '@/constants/routes';
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  Receipt,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react';

const OWNER_NAV_ITEMS = [
  { to: ROUTES.OWNER_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { to: ROUTES.OWNER_INVENTORY, label: 'Inventaris Peralatan', icon: Package },
  { to: ROUTES.OWNER_BOOKINGS, label: 'Pemesanan (Bookings)', icon: CalendarDays },
  { to: ROUTES.OWNER_RENTALS, label: 'Transaksi Rental', icon: Receipt },
  { to: ROUTES.OWNER_CUSTOMERS, label: 'Data Pelanggan', icon: Users },
  { to: ROUTES.OWNER_REPORTS, label: 'Laporan & Analytics', icon: BarChart3 },
  { to: ROUTES.OWNER_SETTINGS, label: 'Pengaturan Bisnis', icon: Settings },
];

export function OwnerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar
          items={OWNER_NAV_ITEMS}
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
