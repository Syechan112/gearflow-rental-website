import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { formatCurrency } from '@/utils/formatCurrency';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BOOKING_STATUS } from '@/constants/statuses';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

export function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  const loadData = async () => {
    const data = await bookingRepository.getAll();
    setBookings(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await bookingRepository.updateStatus(id, status);
    toast.success(`Booking ${id} berhasil di-${status}!`);
    loadData();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Pemesanan (Bookings)"
        description="Kelola persetujuan reservasi pelanggan, tanggal sewa, dan alokasi unit."
      />

      <div className="bg-white border border-neutral-200 rounded-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-5 py-3.5">ID & Customer</th>
                <th className="px-5 py-3.5">Periode Sewa</th>
                <th className="px-5 py-3.5">Total Harga</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-neutral-900">{b.id}</p>
                    <p className="text-[11px] text-neutral-500">Customer: {b.customer_id}</p>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-700">
                    {b.start_date} s/d {b.end_date} ({b.total_days} hari)
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-neutral-900">
                    {formatCurrency(b.total_price)}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={b.status === BOOKING_STATUS.APPROVED ? 'success' : b.status === BOOKING_STATUS.PENDING ? 'warning' : 'danger'}>
                      {b.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {b.status === BOOKING_STATUS.PENDING ? (
                      <div className="flex justify-end gap-1.5">
                        <Button size="sm" variant="secondary" icon={Check} onClick={() => handleUpdateStatus(b.id, BOOKING_STATUS.APPROVED)}>
                          Setujui
                        </Button>
                        <Button size="sm" variant="destructive" icon={X} onClick={() => handleUpdateStatus(b.id, BOOKING_STATUS.REJECTED)}>
                          Tolak
                        </Button>
                      </div>
                    ) : (
                      <span className="text-neutral-400 font-medium">Selesai Diproses</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
