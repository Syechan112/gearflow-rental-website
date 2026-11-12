import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { unitRepository } from '@/database/repositories/unitRepository';
import { UNIT_STATUS } from '@/constants/statuses';
import { generateId } from '@/utils/generateId';
import { toast } from 'sonner';
import { Plus, Trash2, RotateCw } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: UNIT_STATUS.AVAILABLE, label: 'Available (Siap Sewa)' },
  { value: UNIT_STATUS.RENTED, label: 'Rented (Sedang Sewa)' },
  { value: UNIT_STATUS.MAINTENANCE, label: 'Maintenance (Perbaikan)' },
  { value: UNIT_STATUS.DAMAGED, label: 'Damaged (Rusak)' },
];

export function UnitManagerModal({ equipment, isOpen, onClose, onUpdated }) {
  const [units, setUnits] = useState([]);
  const [newSerial, setNewSerial] = useState('');
  const [newCondition, setNewCondition] = useState('Sangat Baik');
  const [isAdding, setIsAdding] = useState(false);

  const loadUnits = async () => {
    if (!equipment) return;
    const data = await unitRepository.getByEquipmentId(equipment.id);
    setUnits(data);
  };

  useEffect(() => {
    if (isOpen) loadUnits();
  }, [isOpen, equipment]);

  const handleStatusChange = async (unitId, newStatus) => {
    await unitRepository.updateStatus(unitId, newStatus);
    toast.success('Status unit fisik diperbarui');
    loadUnits();
    onUpdated?.();
  };

  const handleToggleAdd = () => {
    if (!isAdding) {
      setNewSerial(generateId());
    }
    setIsAdding(!isAdding);
  };

  const handleAddUnit = async () => {
    const sn = newSerial.trim() || generateId();
    await unitRepository.create({
      id: generateId(),
      equipment_id: equipment.id,
      business_id: equipment.business_id,
      serial_number: sn,
      status: UNIT_STATUS.AVAILABLE,
      condition: newCondition || 'Sangat Baik',
    });
    toast.success(`Unit ${sn} berhasil didaftarkan!`);
    setNewSerial('');
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

  if (!equipment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manajemen Unit Fisik — ${equipment.name}`}
      description="Lacak status, kondisi dan nomor seri setiap unit peralatan."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <span className="text-xs font-semibold text-neutral-700">Total Terdaftar: {units.length} Unit</span>
          <Button size="sm" variant="secondary" icon={Plus} onClick={handleToggleAdd}>
            {isAdding ? 'Tutup Form' : 'Tambah Unit Fisik'}
          </Button>
        </div>

        {isAdding && (
          <div className="p-3 bg-neutral-50 rounded-btn border border-neutral-200 space-y-3">
            <h4 className="text-xs font-bold text-neutral-900">Registrasi Unit Baru (ID Otomatis 16 Angka)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex gap-1.5 items-center">
                <Input placeholder="Nomor Seri (16 Angka)" value={newSerial} onChange={(e) => setNewSerial(e.target.value)} className="font-mono text-xs flex-1" />
                <Button type="button" size="sm" variant="outline" icon={RotateCw} onClick={() => setNewSerial(generateId())} title="Generate Ulang 16 Angka" />
              </div>
              <Input placeholder="Kondisi Fisik" value={newCondition} onChange={(e) => setNewCondition(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Batal</Button>
              <Button size="sm" onClick={handleAddUnit}>Simpan Unit</Button>
            </div>
          </div>
        )}

        <div className="space-y-2.5 pb-24">
          {units.map((unit) => (
            <div key={unit.id} className="p-3 bg-white border border-neutral-200 rounded-btn flex items-center justify-between gap-3 text-xs shadow-sm hover:border-neutral-300 transition-colors">
              <div className="flex-1">
                <p className="font-bold text-neutral-900">{unit.serial_number}</p>
                <p className="text-[11px] text-neutral-500">Kondisi: {unit.condition || 'Normal'}</p>
              </div>
              <div className="w-48">
                <Select options={STATUS_OPTIONS} value={unit.status} onChange={(val) => handleStatusChange(unit.id, val)} />
              </div>
              <button
                type="button"
                onClick={() => handleDeleteUnit(unit.id)}
                className="p-2 text-neutral-400 hover:text-danger rounded-btn transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
