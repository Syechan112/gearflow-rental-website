import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer } from '@/components/common/PageContainer';
import { StatCard } from '@/components/common/StatCard';
import { dashboardRepository } from '@/database/repositories/dashboardRepository';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { formatCurrency } from '@/utils/formatCurrency';
import { Badge } from '@/components/ui/Badge';
import { DollarSign, PackageCheck, CalendarClock, AlertCircle } from 'lucide-react';

export function OwnerDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, b] = await Promise.all([
          dashboardRepository.getOwnerMetrics(),
          bookingRepository.getAll(),
        ]);
        setMetrics(m);
        setRecentBookings(b.slice(0, 5));
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Ringkasan Bisnis & Finansial"
        description="Ikhtisar operasional, pendapatan, ketersediaan unit, dan status pemesanan terkini."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
          value={metrics ? `${metrics.availableUnits} / ${metrics.totalUnits}` : '...'}
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
