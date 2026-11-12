import React from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import { Badge } from '@/components/ui/Badge';
import { Trophy } from 'lucide-react';

export function TopEquipmentTable({ items = [] }) {
  if (items.length === 0) {
    return (
      <div className="bg-white border border-neutral-200 rounded-card p-6 text-center text-xs text-neutral-400">
        Belum ada riwayat transaksi peralatan.
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-card overflow-hidden shadow-sm">
      <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-warning" /> Peringkat Utilisasi & Omzet Peralatan
        </h3>
        <span className="text-[11px] text-neutral-500">{items.length} Peralatan Aktif</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
            <tr>
              <th className="px-5 py-3">Peringkat & Alat</th>
              <th className="px-5 py-3">Merk</th>
              <th className="px-5 py-3">Frekuensi Sewa</th>
              <th className="px-5 py-3 text-right">Total Pendapatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items.slice(0, 5).map((item, index) => (
              <tr key={item.id} className="hover:bg-neutral-50/80 transition-colors">
                <td className="px-5 py-3 font-semibold text-neutral-900 flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    index === 0 ? 'bg-amber-100 text-amber-800' : index === 1 ? 'bg-slate-200 text-slate-800' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {index + 1}
                  </span>
                  <span>{item.name}</span>
                </td>
                <td className="px-5 py-3 text-neutral-600">{item.brand || '-'}</td>
                <td className="px-5 py-3">
                  <Badge variant="primary">{item.rentalCount} Kali Sewa</Badge>
                </td>
                <td className="px-5 py-3 text-right font-bold text-neutral-900">
                  {formatCurrency(item.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
