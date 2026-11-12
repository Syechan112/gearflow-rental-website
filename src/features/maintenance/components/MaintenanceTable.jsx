import React from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Wrench } from 'lucide-react';

export function MaintenanceTable({ records, units, equipment, onComplete }) {
  if (records.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-neutral-500 bg-white border border-neutral-200 rounded-card">
        Tidak ada data perawatan atau servis unit saat ini.
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
            <tr>
              <th className="px-5 py-3.5">No. Seri Unit</th>
              <th className="px-5 py-3.5">Alat & Kendala</th>
              <th className="px-5 py-3.5">Teknisi / Tempat Servis</th>
              <th className="px-5 py-3.5">Tanggal Lapor</th>
              <th className="px-5 py-3.5">Biaya</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {records.map((r) => {
              const unit = units.find((u) => u.id === r.unit_id);
              const eq = equipment.find((e) => e.id === r.equipment_id);
              const isInProgress = r.status === 'in_progress';

              return (
                <tr key={r.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-neutral-900">
                    {unit?.serial_number || r.unit_id}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-neutral-900">{eq?.name || 'Peralatan'}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">{r.issue}</p>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-700">{r.technician || '-'}</td>
                  <td className="px-5 py-3.5 text-neutral-600">{formatDate(r.reported_at)}</td>
                  <td className="px-5 py-3.5 font-semibold text-neutral-900">{formatCurrency(r.cost)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={isInProgress ? 'warning' : 'success'}>
                      {isInProgress ? 'Dalam Servis' : 'Selesai'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {isInProgress ? (
                      <Button size="sm" icon={CheckCircle2} onClick={() => onComplete(r)}>
                        Selesai Servis
                      </Button>
                    ) : (
                      <span className="text-neutral-400 font-medium">Unit Aktif Kembali</span>
                    )}
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
