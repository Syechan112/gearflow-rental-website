import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ROUTES } from '@/constants/routes';
import { useStaffBadgeCounts } from '@/hooks/useBadgeCounts';
import { useAuthStore } from '@/stores/authStore';
import { getStaffPermissions } from '@/constants/permissions';
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  Wrench,
  BarChart3,
} from 'lucide-react';

export function StaffLayout() {
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const counts = useStaffBadgeCounts();
  const perms = getStaffPermissions(user);

  const navItems = [
    { to: ROUTES.STAFF_DASHBOARD, label: 'Dashboard Operasional', icon: LayoutDashboard },
    { to: ROUTES.STAFF_INVENTORY, label: 'Inventaris & Unit', icon: Package },
    { to: ROUTES.STAFF_BOOKINGS, label: 'Verifikasi Booking', icon: CalendarCheck, badge: counts.pending, badgeVariant: 'warning' },
    { to: ROUTES.STAFF_RENTALS, label: 'Active Rentals', icon: Receipt },
  ];

  if (perms.can_checkout) {
    navItems.push(
      { to: ROUTES.STAFF_CHECKOUT, label: 'Check-out Barang', icon: ArrowUpRight, badge: counts.checkout, badgeVariant: 'primary' },
      { to: ROUTES.STAFF_RETURNS, label: 'Check-in & Inspeksi', icon: ArrowDownLeft, badge: counts.returns, badgeVariant: 'danger' }
    );
  }

  navItems.push(
    { to: ROUTES.STAFF_MAINTENANCE, label: 'Servis & Maintenance', icon: Wrench, badge: counts.maint, badgeVariant: 'warning' }
  );

  if (perms.can_view_reports) {
    navItems.push(
      { to: ROUTES.STAFF_REPORTS, label: 'Laporan Bisnis', icon: BarChart3 }
    );
  }

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
