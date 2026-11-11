import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer } from '@/components/common/PageContainer';
import { StatCard } from '@/components/common/StatCard';
import { dashboardRepository } from '@/database/repositories/dashboardRepository';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { unitRepository } from '@/database/repositories/unitRepository';
import { formatCurrency } from '@/utils/formatCurrency';
import { Badge } from '@/components/ui/Badge';
import { RevenueChart } from '../components/RevenueChart';
import { EquipmentUtilization } from '../components/EquipmentUtilization';
import { DollarSign, PackageCheck, CalendarClock, AlertCircle } from 'lucide-react';
import { UNIT_STATUS } from '@/constants/statuses';

export function OwnerDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [unitCounts, setUnitCounts] = useState({ available: 0, rented: 0, maintenance: 0, total: 0 });

  useEffect(() => {
    async function loadData() {
      const [m, b, units] = await Promise.all([
        dashboardRepository.getOwnerMetrics(),
        bookingRepository.getAll(),
        unitRepository.getAll(),
      ]);
      setMetrics(m);
      setRecentBookings(b.slice(0, 5));
      const avail = units.filter((u) => u.status === UNIT_STATUS.AVAILABLE).length;
      const rent = units.filter((u) => u.status === UNIT_STATUS.RENTED).length;
      const maint = units.filter((u) => u.status === UNIT_STATUS.MAINTENANCE).length;
      setUnitCounts({ available: avail, rented: rent, maintenance: maint, total: units.length });
    }
    loadData();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Ringkasan Bisnis & Finansial"
        description="Ikhtisar operasional, pendapatan, ketersediaan unit, dan status pemesanan terkini."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Pendapatan"
          value={metrics ? formatCurrency(metrics.totalRevenue) : '...'}
          subtitle="Tercatat dari transaksi selesai"
          icon={DollarSign}
          badgeText="Akumulatif"
          badgeType="success"
        />
        <StatCard
          title="Rental Sedang Berjalan"
          value={metrics ? `${metrics.activeRentals} Order` : '...'}
          subtitle="Peralatan di tangan customer"
          icon={PackageCheck}
          badgeText="Ongoing"
          badgeType="warning"
        />
        <StatCard
          title="Unit Siap Sewa"
          value={metrics ? `${unitCounts.available} / ${unitCounts.total}` : '...'}
          subtitle="Stok unit fisik di gudang"
          icon={CalendarClock}
          badgeText="Available"
          badgeType="neutral"
        />
        <StatCard
          title="Booking Menunggu"
          value={metrics ? `${metrics.pendingBookings} Booking` : '...'}
          subtitle="Perlu verifikasi & persetujuan"
          icon={AlertCircle}
          badgeText="Review"
          badgeType="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <RevenueChart className="lg:col-span-2" />
        <EquipmentUtilization
          available={unitCounts.available}
          rented={unitCounts.rented}
          maintenance={unitCounts.maintenance}
          total={unitCounts.total}
        />
      </div>

      <div className="bg-white border border-neutral-200 rounded-card p-6 shadow-sm">
        <h3 className="text-base font-semibold text-neutral-900 mb-4">Pemesanan Masuk Terbaru</h3>
        {recentBookings.length === 0 ? (
          <p className="text-xs text-neutral-500">Belum ada pemesanan masuk.</p>
        ) : (
          <div className="divide-y divide-neutral-100">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-900">{booking.id} — {booking.notes || 'Rental Harian'}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Periode: {booking.start_date} s/d {booking.end_date} ({booking.total_days} hari)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-neutral-900">
                    {formatCurrency(booking.total_price)}
                  </span>
                  <Badge variant={booking.status === 'approved' ? 'success' : 'warning'}>
                    {booking.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
