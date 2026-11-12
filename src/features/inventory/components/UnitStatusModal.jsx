import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { unitRepository } from '@/database/repositories/unitRepository';
import { UNIT_STATUS } from '@/constants/statuses';
import { CheckCircle2, Clock, Wrench, AlertTriangle, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

const STATUS_LIST = [
  {
    value: UNIT_STATUS.AVAILABLE,
    label: 'Available (Siap Sewa)',
    description: 'Unit dalam kondisi baik dan siap dialokasikan untuk booking.',
    badgeVariant: 'success',
    icon: CheckCircle2,
  },
  {
    value: UNIT_STATUS.RENTED,
    label: 'Rented (Sedang Disewa)',
    description: 'Unit sedang dibawa oleh penyewa di lapangan.',
    badgeVariant: 'warning',
    icon: Clock,
  },
  {
    value: UNIT_STATUS.MAINTENANCE,
    label: 'Maintenance (Perbaikan)',
    description: 'Unit diblokir dari booking untuk pembersihan sensor atau servis.',
    badgeVariant: 'warning',
    icon: Wrench,
  },
  {
    value: UNIT_STATUS.DAMAGED,
    label: 'Damaged (Rusak)',
    description: 'Unit mengalami kerusakan fisik atau kehilangan fungsi.',
    badgeVariant: 'danger',
    icon: AlertTriangle,
  },
];

export function UnitStatusModal({ unit, isOpen, onClose, onSuccess }) {
  const [selectedStatus, setSelectedStatus] = useState(unit?.status || UNIT_STATUS.AVAILABLE);
  const [conditionNotes, setConditionNotes] = useState(unit?.condition || 'Normal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (unit) {
      setSelectedStatus(unit.status || UNIT_STATUS.AVAILABLE);
      setConditionNotes(unit.condition || 'Normal');
    }
  }, [unit, isOpen]);

  if (!unit) return null;

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await unitRepository.updateStatus(unit.id, selectedStatus, conditionNotes);
      toast.success(`Status unit ${unit.serial_number} berhasil diperbarui!`);
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Gagal memperbarui status unit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ubah Status Unit — ${unit.serial_number}`}
      description="Pilih status operasional dan perbarui catatan kondisi unit fisik."
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button isLoading={isSubmitting} onClick={handleSave}>Simpan Perubahan</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-2">
          {STATUS_LIST.map((opt) => {
            const isSelected = selectedStatus === opt.value;
            const Icon = opt.icon;
            return (
              <div
                key={opt.value}
                onClick={() => setSelectedStatus(opt.value)}
                className={cn(
                  'p-3 rounded-btn border text-left cursor-pointer transition-all flex items-start justify-between gap-3',
                  isSelected
                    ? 'border-primary bg-primary-light/40 ring-2 ring-primary/10'
                    : 'border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-300'
                )}
              >
                <div className="flex items-start gap-2.5">
                  <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', isSelected ? 'text-primary' : 'text-neutral-400')} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-neutral-900">{opt.label}</span>
                      <Badge variant={opt.badgeVariant} className="text-[10px] py-0 px-1.5">{opt.value}</Badge>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">{opt.description}</p>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
              </div>
            );
          })}
        </div>

        <div>
          <Input
            label="Catatan Kondisi Fisik"
            placeholder="Misal: Sangat baik, Lensa bersih, Perlu ganti strap..."
            value={conditionNotes}
            onChange={(e) => setConditionNotes(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}
