import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { rentalRepository } from '@/database/repositories/rentalRepository';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { Badge } from '@/components/ui/Badge';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { Calendar, ShoppingBag } from 'lucide-react';

export function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    async function loadUserData() {
      if (user?.id) {
        const [b, r] = await Promise.all([
          bookingRepository.getByCustomerId(user.id),
          rentalRepository.getByCustomerId(user.id),
        ]);
        setBookings(b);
        setRentals(r);
      }
    }
    loadUserData();
  }, [user]);

  return (
    <PageContainer>
      <PageHeader
        title={`Halo, ${user?.name || 'Pelanggan'}!`}
        description="Pantau pemesanan aktif, riwayat penyewaan peralatan, dan invoice Anda."
        action={
          <Link to={ROUTES.CATALOG}>
            <Button size="sm" icon={ShoppingBag}>Jelajahi Katalog</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Pemesanan Saya ({bookings.length})
          </h3>
          {bookings.length === 0 ? (
            <p className="text-xs text-neutral-500 py-4 text-center">Belum ada booking aktif saat ini.</p>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="p-3 bg-neutral-50 rounded-btn border border-neutral-100 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-neutral-900">{b.id}</span>
                    <p className="text-neutral-500">{b.start_date} s/d {b.end_date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-neutral-900">{formatCurrency(b.total_price)}</p>
                    <Badge variant={b.status === 'approved' ? 'success' : 'warning'}>{b.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-neutral-200 rounded-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-neutral-900 mb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-primary" />
            Riwayat Rental Berjalan ({rentals.length})
          </h3>
          {rentals.length === 0 ? (
            <p className="text-xs text-neutral-500 py-4 text-center">Tidak ada unit rental yang sedang berjalan.</p>
          ) : (
            <div className="space-y-3">
              {rentals.map((r) => (
                <div key={r.id} className="p-3 bg-neutral-50 rounded-btn border border-neutral-100 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-semibold text-neutral-900">{r.id}</span>
                    <p className="text-neutral-500">Batas Kembali: {r.end_date}</p>
                  </div>
                  <Badge variant="primary">{r.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
