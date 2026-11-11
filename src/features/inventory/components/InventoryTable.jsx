import React from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Layers, Edit3, Trash2 } from 'lucide-react';
import { UNIT_STATUS } from '@/constants/statuses';

export function InventoryTable({ equipment = [], units = [], onEdit, onManageUnits, onDelete }) {
  if (equipment.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-neutral-500 bg-white border border-neutral-200 rounded-card">
        Tidak ada peralatan yang sesuai dengan pencarian atau filter.
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
            <tr>
              <th className="px-5 py-3.5">Peralatan</th>
              <th className="px-5 py-3.5">Merk & Model</th>
              <th className="px-5 py-3.5">Tarif Sewa</th>
              <th className="px-5 py-3.5">Deposit</th>
              <th className="px-5 py-3.5">Status Unit Fisik</th>
              <th className="px-5 py-3.5 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {equipment.map((item) => {
              const itemUnits = units.filter((u) => u.equipment_id === item.id);
              const availableUnits = itemUnits.filter((u) => u.status === UNIT_STATUS.AVAILABLE).length;
              const maintUnits = itemUnits.filter((u) => u.status === UNIT_STATUS.MAINTENANCE).length;

              return (
                <tr key={item.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    <img src={item.image_url} alt="" className="w-11 h-11 object-cover rounded-btn border border-neutral-200" />
                    <div>
                      <p className="font-semibold text-neutral-900">{item.name}</p>
                      <p className="text-[11px] text-neutral-400">ID: {item.id}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-700">{item.brand} — {item.model}</td>
                  <td className="px-5 py-3.5 font-bold text-neutral-900">{formatCurrency(item.daily_price)} / hari</td>
                  <td className="px-5 py-3.5 text-neutral-600">{formatCurrency(item.deposit_amount)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Badge variant={availableUnits > 0 ? 'success' : 'danger'}>
                        {availableUnits} / {itemUnits.length} Siap
                      </Badge>
                      {maintUnits > 0 && (
                        <Badge variant="warning">{maintUnits} Service</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button size="sm" variant="secondary" icon={Layers} onClick={() => onManageUnits(item)}>
                        Unit Fisik
                      </Button>
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-neutral-500 hover:text-primary rounded-btn transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-neutral-400 hover:text-danger rounded-btn transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
