import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/formatCurrency';
import { ArrowDownLeft, Eye } from 'lucide-react';

export function ReturnsTable({
  rentals = [],
  equipmentList = [],
  customers = [],
  units = [],
  onReturn,
  onDetail,
}) {
  return (
    <div className="bg-white border border-neutral-200 rounded-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
              <th className="py-3 px-4">ID Rental</th>
              <th className="py-3 px-4">Nomor Seri Unit</th>
              <th className="py-3 px-4">Pelanggan</th>
              <th className="py-3 px-4">Batas Pengembalian</th>
              <th className="py-3 px-4 text-right">Uang Jaminan</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Aksi Check-in</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rentals.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-neutral-400">
                  Tidak ada unit rental aktif yang menunggu pengembalian.
                </td>
              </tr>
            ) : (
              rentals.map((r) => {
                const eq = equipmentList.find((e) => e.id === r.equipment_id);
                const cust = customers.find((c) => c.id === r.customer_id);
                const u = units.find((item) => item.id === r.unit_id);
                return (
                  <tr key={r.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900">{r.id}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-primary">{u?.serial_number || r.unit_id}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-900 block">{cust?.name || r.customer_id}</span>
                      <span className="text-[11px] text-neutral-500">{eq?.name}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-neutral-800">{r.end_date}</td>
                    <td className="py-3 px-4 text-right font-medium text-neutral-700">{formatCurrency(r.deposit_amount || 0)}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={r.status === 'overdue' ? 'danger' : 'warning'}>{r.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center space-x-1.5">
                      <Button size="sm" icon={ArrowDownLeft} onClick={() => onReturn(r)}>
                        Check-in Fisik
                      </Button>
                      <Button size="sm" variant="ghost" icon={Eye} onClick={() => onDetail(r)} />
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
