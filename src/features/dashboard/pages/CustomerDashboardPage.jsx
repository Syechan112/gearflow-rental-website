import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { rentalRepository } from '@/database/repositories/rentalRepository';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { unitRepository } from '@/database/repositories/unitRepository';
import { generateInvoicePdf } from '@/features/rental-orders/utils/generateInvoicePdf';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Calendar, ShoppingBag, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    async function loadData() {
      if (user?.id) {
        const [b, r, eq, u] = await Promise.all([
          bookingRepository.getByCustomerId(user.id),
          rentalRepository.getByCustomerId(user.id),
          equipmentRepository.getAll(),
          unitRepository.getAll(),
        ]);
        setBookings(b);
        setRentals(r);
        setEquipment(eq);
        setUnits(u);
      }
    }
    loadData();
  }, [user]);

  const handlePrint = (r) => {
    const eq = equipment.find((e) => e.id === r.equipment_id);
    const u = units.find((item) => item.id === r.unit_id);
    generateInvoicePdf(r, user, eq, u);
    toast.success('Invoice PDF berhasil diunduh!');
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Portal Pelanggan — ${user?.name || 'Pelanggan'}`}
        description="Pantau pemesanan aktif, unit sewa yang sedang Anda bawa, serta unduh riwayat invoice sewa."
        action={
          <Link to={ROUTES.CATALOG}>
            <Button size="sm" icon={ShoppingBag}>Jelajahi Katalog</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-card p-6 shadow-sm">
          <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> Permintaan Booking Saya ({bookings.length})
          </h3>
          {bookings.length === 0 ? (
            <p className="text-xs text-neutral-400 py-6 text-center">Belum ada booking aktif saat ini.</p>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => {
                const eq = equipment.find((e) => e.id === b.equipment_id);
                return (
                  <div key={b.id} className="p-3 bg-neutral-50 rounded-btn border border-neutral-100 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-neutral-900">{b.id}</span>
                      <p className="text-neutral-700 font-medium mt-0.5">{eq?.name || b.equipment_id}</p>
                      <p className="text-neutral-500 text-[11px]">{b.start_date} s/d {b.end_date} ({b.total_days} hari)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{formatCurrency(b.total_price)}</p>
                      <Badge variant={b.status === 'approved' ? 'success' : b.status === 'pending' ? 'warning' : 'danger'} className="mt-1">
                        {b.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white border border-neutral-200 rounded-card p-6 shadow-sm">
          <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary" /> Transaksi & Riwayat Rental ({rentals.length})
          </h3>
          {rentals.length === 0 ? (
            <p className="text-xs text-neutral-400 py-6 text-center">Tidak ada unit yang sedang Anda sewa saat ini.</p>
          ) : (
            <div className="space-y-3">
              {rentals.map((r) => {
                const eq = equipment.find((e) => e.id === r.equipment_id);
                return (
                  <div key={r.id} className="p-3 bg-neutral-50 rounded-btn border border-neutral-100 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-neutral-900">{r.id}</span>
                      <p className="text-neutral-700 font-medium mt-0.5">{eq?.name || r.equipment_id}</p>
                      <p className="text-neutral-500 text-[11px]">Batas Kembali: {r.end_date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={r.status === 'ongoing' ? 'warning' : 'success'}>{r.status}</Badge>
                      <Button size="sm" variant="secondary" icon={FileText} onClick={() => handlePrint(r)}>
                        Invoice
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
