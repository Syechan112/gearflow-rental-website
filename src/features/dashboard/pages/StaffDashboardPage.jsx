import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer } from '@/components/common/PageContainer';
import { StatCard } from '@/components/common/StatCard';
import { dashboardRepository } from '@/database/repositories/dashboardRepository';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ArrowUpRight, ArrowDownLeft, Wrench, Clock, CheckCircle2 } from 'lucide-react';

export function StaffDashboardPage() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    async function loadData() {
      const data = await dashboardRepository.getStaffMetrics();
      setMetrics(data);
    }
    loadData();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard Operasional Lapangan"
        description="Fokus tugas harian: serah terima peralatan, pemeriksaan fisik unit, dan inspeksi pengembalian."
        action={
          <div className="flex gap-2">
            <Link to={ROUTES.STAFF_CHECKOUT}>
              <Button size="sm" icon={ArrowUpRight}>Proses Check-out</Button>
            </Link>
            <Link to={ROUTES.STAFF_RETURNS}>
              <Button size="sm" variant="secondary" icon={ArrowDownLeft}>Input Pengembalian</Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Jadwal Check-out"
          value={metrics ? `${metrics.todayCheckouts} Unit` : '...'}
          subtitle="Booking yang siap diserahkan"
          icon={ArrowUpRight}
          badgeText="Hari Ini"
          badgeType="success"
        />
        <StatCard
          title="Target Pengembalian"
          value={metrics ? `${metrics.todayReturns} Order` : '...'}
          subtitle="Jadwal kembali ke gudang"
          icon={ArrowDownLeft}
          badgeText="Aktif"
          badgeType="warning"
        />
        <StatCard
          title="Unit di Maintenance"
          value={metrics ? `${metrics.maintenanceCount} Unit` : '...'}
          subtitle="Perlu perbaikan / cleaning"
          icon={Wrench}
          badgeText="Service"
          badgeType="neutral"
        />
        <StatCard
          title="Rental Berlangsung"
          value={metrics ? `${metrics.activeRentals} Order` : '...'}
          subtitle="Sedang disewa pelanggan"
          icon={Clock}
          badgeText="Ongoing"
          badgeType="neutral"
        />
      </div>

      <div className="bg-white border border-neutral-200 rounded-card p-6 shadow-sm">
        <h3 className="text-base font-semibold text-neutral-900 mb-2">Panduan Standar Operasional (SOP)</h3>
        <p className="text-xs text-neutral-500 mb-4">Pastikan langkah berikut ditaati pada setiap serah terima barang:</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-btn border border-neutral-200/60">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-neutral-900">1. Verifikasi Nomor Seri (Serial Number): </span>
              <span className="text-neutral-600">Cocokkan barcode fisik pada bodi kamera/lensa sebelum tombol Check-out ditekan.</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-btn border border-neutral-200/60">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-neutral-900">2. Cek Kondisi & Kelengkapan Baterai: </span>
              <span className="text-neutral-600">Pastikan charger, cap lensa, dan strap tercatat dalam checklist inspeksi.</span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
