import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { UnitStatusModal } from './UnitStatusModal';
import { unitRepository } from '@/database/repositories/unitRepository';
import { UNIT_STATUS } from '@/constants/statuses';
import { generateId } from '@/utils/generateId';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export function UnitManagerModal({ equipment, isOpen, onClose, onUpdated }) {
  const [units, setUnits] = useState([]);
  const [newCondition, setNewCondition] = useState('Sangat Baik');
  const [isAdding, setIsAdding] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);

  const loadUnits = async () => {
    if (!equipment) return;
    const data = await unitRepository.getByEquipmentId(equipment.id);
    setUnits(data);
  };

  useEffect(() => {
    if (isOpen) loadUnits();
  }, [isOpen, equipment]);

  const handleAddUnit = async () => {
    // Generate strictly unique 16-digit numeric ID automatically (no manual input needed)
    const uniqueId = generateId();
    await unitRepository.create({
      id: uniqueId,
      equipment_id: equipment.id,
      business_id: equipment.business_id,
      serial_number: uniqueId,
      status: UNIT_STATUS.AVAILABLE,
      condition: newCondition || 'Sangat Baik',
    });
    toast.success(`Unit ${uniqueId} berhasil didaftarkan secara otomatis!`);
    setNewCondition('Sangat Baik');
    setIsAdding(false);
    loadUnits();
    onUpdated?.();
  };

  const handleDeleteUnit = async (unitId) => {
    await unitRepository.delete(unitId);
    toast.success('Unit fisik dihapus');
    loadUnits();
    onUpdated?.();
  };

  const getBadgeVariant = (st) => {
    if (st === UNIT_STATUS.AVAILABLE) return 'success';
    if (st === UNIT_STATUS.RENTED) return 'warning';
    if (st === UNIT_STATUS.DAMAGED) return 'danger';
    return 'warning';
  };

  if (!equipment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manajemen Unit Fisik — ${equipment.name}`}
      description="Lacak nomor seri otomatis (16 angka), kondisi fisik, dan alokasi unit."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <span className="text-xs font-semibold text-neutral-700">Total Terdaftar: {units.length} Unit</span>
          <Button size="sm" variant="secondary" icon={Plus} onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? 'Tutup Form' : 'Tambah Unit Baru'}
          </Button>
        </div>

        {isAdding && (
          <div className="p-3.5 bg-neutral-50 rounded-btn border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-neutral-900">Registrasi Unit Baru</h4>
              <span className="text-[11px] font-mono font-semibold text-primary bg-primary-light px-2.5 py-0.5 rounded-full">
                ID Otomatis 16 Angka Siap Terbit
              </span>
            </div>
            <Input
              label="Catatan Kondisi Fisik"
              placeholder="Misal: Sangat Baik, Baru Buka Box..."
              value={newCondition}
              onChange={(e) => setNewCondition(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Batal</Button>
              <Button size="sm" onClick={handleAddUnit}>Simpan Unit (Auto 16 Angka)</Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {units.map((unit) => (
            <div key={unit.id} className="p-3 bg-white border border-neutral-200 rounded-btn flex items-center justify-between gap-3 text-xs shadow-sm hover:border-neutral-300 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-neutral-900 text-xs tracking-wide">{unit.serial_number}</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-0.5 truncate">Kondisi: {unit.condition || 'Normal'}</p>
              </div>

              {/* Status Clickable Button to Open Modal */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUnit(unit)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-btn border border-neutral-200 hover:border-primary/50 hover:bg-neutral-50 transition-all cursor-pointer"
                  title="Klik untuk mengubah status via modal"
                >
                  <Badge variant={getBadgeVariant(unit.status)} className="capitalize py-0.5">
                    {unit.status}
                  </Badge>
                  <Edit2 className="w-3 h-3 text-neutral-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteUnit(unit.id)}
                  className="p-1.5 text-neutral-400 hover:text-danger rounded-btn transition-colors cursor-pointer"
                  title="Hapus Unit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Khusus Pemilihan Status Unit */}
      <UnitStatusModal
        unit={editingUnit}
        isOpen={!!editingUnit}
        onClose={() => setEditingUnit(null)}
        onSuccess={() => { loadUnits(); onUpdated?.(); }}
      />
    </Modal>
  );
}
