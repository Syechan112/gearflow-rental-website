import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ROUTES } from '@/constants/routes';
import { useOwnerBadgeCounts } from '@/hooks/useBadgeCounts';
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  Receipt,
  Users,
  Wrench,
  Layers,
  UserCheck,
  BarChart3,
  Settings,
} from 'lucide-react';

export function OwnerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const counts = useOwnerBadgeCounts();

  const navItems = [
    { to: ROUTES.OWNER_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { to: ROUTES.OWNER_INVENTORY, label: 'Inventaris Peralatan', icon: Package },
    {
      to: ROUTES.OWNER_BOOKINGS,
      label: 'Pemesanan (Bookings)',
      icon: CalendarDays,
      badge: counts.pendingBookings,
      badgeVariant: 'warning',
    },
    {
      to: ROUTES.OWNER_RENTALS,
      label: 'Transaksi Rental',
      icon: Receipt,
      badge: counts.ongoingRentals,
      badgeVariant: 'primary',
    },
    { to: ROUTES.OWNER_CUSTOMERS, label: 'Data Pelanggan', icon: Users },
    {
      to: ROUTES.OWNER_MAINTENANCE,
      label: 'Perawatan Unit',
      icon: Wrench,
      badge: counts.maintenanceUnits,
      badgeVariant: 'warning',
    },
    { to: ROUTES.OWNER_BUNDLES, label: 'Paket Bundling', icon: Layers },
    { to: ROUTES.OWNER_STAFF, label: 'Kelola Staf & Izin', icon: UserCheck },
    { to: ROUTES.OWNER_REPORTS, label: 'Laporan & Analytics', icon: BarChart3 },
    { to: ROUTES.OWNER_SETTINGS, label: 'Pengaturan & Audit', icon: Settings },
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
