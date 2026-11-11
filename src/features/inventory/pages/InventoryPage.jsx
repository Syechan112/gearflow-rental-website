import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { formatCurrency } from '@/utils/formatCurrency';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Plus, Package, Layers } from 'lucide-react';

export function InventoryPage() {
  const [equipment, setEquipment] = useState([]);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    async function load() {
      const [eq, unts] = await Promise.all([
        equipmentRepository.getAll(),
        equipmentRepository.getAllUnits(),
      ]);
      setEquipment(eq);
      setUnits(unts);
    }
    load();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Inventaris & Manajemen Unit"
        description="Daftar peralatan, tarif sewa harian, jumlah total stok, serta pelacakan nomor seri unit fisik."
        action={<Button size="sm" icon={Plus}>Tambah Peralatan</Button>}
      />

      <div className="bg-white border border-neutral-200 rounded-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-5 py-3.5">Peralatan</th>
                <th className="px-5 py-3.5">Merk & Model</th>
                <th className="px-5 py-3.5">Tarif Sewa</th>
                <th className="px-5 py-3.5">Deposit</th>
                <th className="px-5 py-3.5">Total Stok</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {equipment.map((item) => {
                const itemUnits = units.filter((u) => u.equipment_id === item.id);
                return (
                  <tr key={item.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <img src={item.image_url} alt="" className="w-10 h-10 object-cover rounded-btn border border-neutral-200" />
                      <div>
                        <p className="font-semibold text-neutral-900">{item.name}</p>
                        <p className="text-[11px] text-neutral-400">{item.id}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-700">{item.brand} — {item.model}</td>
                    <td className="px-5 py-3.5 font-semibold text-neutral-900">{formatCurrency(item.daily_price)} / hari</td>
                    <td className="px-5 py-3.5 text-neutral-600">{formatCurrency(item.deposit_amount)}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-neutral-800">{itemUnits.length} Unit Fisik</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="text-primary hover:underline font-semibold cursor-pointer">Detail Unit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
