import React from 'react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import { ArrowUpRight } from 'lucide-react';

export function CheckoutTable({
  bookings = [],
  equipmentList = [],
  customers = [],
  onCheckout,
}) {
  return (
    <div className="bg-white border border-neutral-200 rounded-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
              <th className="py-3 px-4">ID Booking</th>
              <th className="py-3 px-4">Pelanggan</th>
              <th className="py-3 px-4">Peralatan</th>
              <th className="py-3 px-4">Jadwal Sewa</th>
              <th className="py-3 px-4 text-right">Deposit</th>
              <th className="py-3 px-4 text-right">Total Sewa</th>
              <th className="py-3 px-4 text-center">Aksi Serah Terima</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-neutral-400">
                  Tidak ada antrean booking yang siap untuk di-checkout saat ini.
                </td>
              </tr>
            ) : (
              bookings.map((b) => {
                const eq = equipmentList.find((e) => e.id === b.equipment_id);
                const cust = customers.find((c) => c.id === b.customer_id);
                return (
                  <tr key={b.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">{b.id}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-900 block">{cust?.name || b.customer_id}</span>
                      <span className="text-[11px] text-neutral-500">{cust?.phone || '-'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={eq?.image_url} alt="" className="w-9 h-9 rounded object-cover border border-neutral-200" />
                        <span className="font-medium text-neutral-900">{eq?.name || b.equipment_id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-neutral-600">
                      <span>{b.start_date} s/d {b.end_date}</span>
                      <span className="block text-[11px] text-neutral-400">{b.total_days} Hari</span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-neutral-700">{formatCurrency(b.deposit || 0)}</td>
                    <td className="py-3 px-4 text-right font-bold text-primary">{formatCurrency(b.total_price)}</td>
                    <td className="py-3 px-4 text-center">
                      <Button size="sm" icon={ArrowUpRight} onClick={() => onCheckout(b)}>
                        Serah Terima Unit
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
