import React from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BOOKING_STATUS } from '@/constants/statuses';
import { Eye, Check, X } from 'lucide-react';

export function BookingTable({ bookings, equipment, customers, onView, onApprove, onReject }) {
  if (bookings.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-neutral-500 bg-white border border-neutral-200 rounded-card">
        Tidak ada data pemesanan yang sesuai dengan filter.
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
            <tr>
              <th className="px-5 py-3.5">ID Booking</th>
              <th className="px-5 py-3.5">Pelanggan & Alat</th>
              <th className="px-5 py-3.5">Periode Sewa</th>
              <th className="px-5 py-3.5">Total Biaya</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {bookings.map((b) => {
              const eq = equipment.find((e) => e.id === b.equipment_id);
              const cust = customers.find((c) => c.id === b.customer_id);
              return (
                <tr key={b.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-neutral-900">{b.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-neutral-900">{cust?.name || b.customer_id}</p>
                    <p className="text-[11px] text-neutral-500">{eq?.name || b.equipment_id}</p>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-700">{b.start_date} s/d {b.end_date} ({b.total_days} hari)</td>
                  <td className="px-5 py-3.5 font-bold text-neutral-900">{formatCurrency(b.total_price)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={b.status === BOOKING_STATUS.APPROVED ? 'success' : b.status === BOOKING_STATUS.PENDING ? 'warning' : 'danger'}>
                      {b.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end items-center gap-1.5">
                      <button onClick={() => onView(b)} className="p-1.5 text-neutral-400 hover:text-primary rounded-btn cursor-pointer">
                        <Eye className="w-4 h-4" />
                      </button>
                      {b.status === BOOKING_STATUS.PENDING && (
                        <>
                          <Button size="sm" variant="secondary" icon={Check} onClick={() => onApprove(b.id)}>Setujui</Button>
                          <Button size="sm" variant="destructive" icon={X} onClick={() => onReject(b.id)}>Tolak</Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
