import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer } from '@/components/common/PageContainer';
import { StatCard } from '@/components/common/StatCard';
import { dashboardRepository } from '@/database/repositories/dashboardRepository';
import { unitRepository } from '@/database/repositories/unitRepository';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ArrowUpRight, ArrowDownLeft, Wrench, Clock, AlertTriangle } from 'lucide-react';
import { UNIT_STATUS } from '@/constants/statuses';

export function StaffDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [maintUnits, setMaintUnits] = useState([]);

  useEffect(() => {
    async function loadData() {
      const [m, units] = await Promise.all([
        dashboardRepository.getStaffMetrics(),
        unitRepository.getAll(),
      ]);
      setMetrics(m);
      setMaintUnits(units.filter((u) => u.status === UNIT_STATUS.MAINTENANCE));
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Jadwal Check-out" value={metrics ? `${metrics.todayCheckouts} Unit` : '...'} subtitle="Booking disetujui" icon={ArrowUpRight} badgeText="Hari Ini" badgeType="success" />
        <StatCard title="Target Pengembalian" value={metrics ? `${metrics.todayReturns} Order` : '...'} subtitle="Jadwal kembali ke gudang" icon={ArrowDownLeft} badgeText="Aktif" badgeType="warning" />
        <StatCard title="Unit di Maintenance" value={metrics ? `${maintUnits.length} Unit` : '...'} subtitle="Perlu cleaning / servis" icon={Wrench} badgeText="Perlu Servis" badgeType="warning" />
        <StatCard title="Rental Berlangsung" value={metrics ? `${metrics.activeRentals} Order` : '...'} subtitle="Sedang disewa pelanggan" icon={Clock} badgeText="Ongoing" badgeType="neutral" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Unit Perlu Perhatian & Maintenance ({maintUnits.length})
          </h3>
          <p className="text-xs text-neutral-500 mb-3">Unit fisik ini diblokir otomatis dari sistem booking.</p>
          {maintUnits.length === 0 ? (
            <p className="text-xs text-neutral-400 py-3 text-center">Seluruh unit fisik dalam kondisi prima siap sewa.</p>
          ) : (
            <div className="space-y-2">
              {maintUnits.map((u) => (
                <div key={u.id} className="p-3 bg-neutral-50 rounded-btn border border-neutral-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-neutral-900">{u.serial_number}</span>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{u.condition}</p>
                  </div>
                  <Badge variant="warning">Maintenance</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-neutral-200 rounded-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-neutral-900 mb-2">Checklist Verifikasi Serah Terima</h3>
          <p className="text-xs text-neutral-500 mb-4">Prosedur wajib sebelum menyerahkan unit ke penyewa:</p>
          <div className="space-y-3 text-xs text-neutral-700">
            <div className="flex items-start gap-2.5 p-2.5 bg-neutral-50 rounded-btn">
              <span className="font-bold text-primary">01.</span>
              <span>Periksa nomor seri (Serial Number) bodi kamera & lensa agar identik dengan data booking.</span>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 bg-neutral-50 rounded-btn">
              <span className="font-bold text-primary">02.</span>
              <span>Pastikan kelengkapan aksesoris (baterai cadangan, charger, lens cap, strap, memory card).</span>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 bg-neutral-50 rounded-btn">
              <span className="font-bold text-primary">03.</span>
              <span>Uji fungsi dasar: autofocus, shutter count, dan kebersihan sensor sebelum serah terima.</span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
