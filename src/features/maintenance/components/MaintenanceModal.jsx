import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { maintenanceRepository } from '@/database/repositories/maintenanceRepository';
import { auditRepository } from '@/database/repositories/auditRepository';
import { generateId } from '@/utils/generateId';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export function MaintenanceModal({ isOpen, onClose, equipmentList = [], units = [], onSuccess }) {
  const { user } = useAuthStore();
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [issue, setIssue] = useState('');
  const [technician, setTechnician] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const unitOptions = units.map((u) => {
    const eq = equipmentList.find((e) => e.id === u.equipment_id);
    return {
      value: u.id,
      label: `${u.serial_number} — ${eq?.name || 'Alat'} (${u.condition || 'Normal'})`,
    };
  });

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!selectedUnitId) return toast.error('Pilih unit fisik yang akan diservis');
    if (!issue.trim()) return toast.error('Uraikan kendala atau kerusakan');
    setIsSubmitting(true);
    try {
      const unit = units.find((u) => u.id === selectedUnitId);
      const newMnt = {
        id: generateId('mnt'),
        business_id: 'biz-apex',
        equipment_id: unit?.equipment_id || '',
        unit_id: selectedUnitId,
        issue,
        technician: technician || 'Internal Studio Technician',
        cost: parseFloat(estimatedCost) || 0,
        status: 'in_progress',
        reported_at: new Date().toISOString(),
      };
      await maintenanceRepository.create(newMnt);
      await auditRepository.log(user?.id, 'MAINTENANCE_CREATED', `Unit ${unit?.serial_number} dilaporkan: ${issue}`);
      toast.success(`Unit ${unit?.serial_number} berhasil masuk status Maintenance!`);
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Gagal mencatat pemeliharaan unit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Perawatan & Laporan Kerusakan Unit"
      description="Unit yang didaftarkan ke pemeliharaan akan otomatis diblokir dari sistem sewa."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button isLoading={isSubmitting} onClick={handleSubmit}>Kirim ke Maintenance</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <Select
          label="Pilih Unit Fisik (Nomor Seri)"
          options={unitOptions}
          value={selectedUnitId}
          onChange={setSelectedUnitId}
          placeholder="Pilih unit fisik..."
        />
        <Input
          label="Deskripsi Kendala / Perbaikan"
          placeholder="Contoh: Sensor kotor, tombol shutter macet, kalibrasi..."
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Pihak Teknisi / Vendor Servis"
            placeholder="Official Service Center / Teknisi internal"
            value={technician}
            onChange={(e) => setTechnician(e.target.value)}
          />
          <Input
            label="Estimasi Biaya Servis (Rp)"
            type="number"
            placeholder="0"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
          />
        </div>
      </form>
    </Modal>
  );
}
