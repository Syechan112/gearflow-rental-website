import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { rentalRepository } from '@/database/repositories/rentalRepository';
import { UNIT_STATUS } from '@/constants/statuses';
import { generateId } from '@/utils/generateId';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export function ReturnInspectionModal({ rental, equipment, unit, isOpen, onClose, onSuccess }) {
  const { user } = useAuthStore();
  const todayStr = new Date().toISOString().split('T')[0];
  const [returnDate, setReturnDate] = useState(todayStr);
  const [conditionNotes, setConditionNotes] = useState('Peralatan kembali lengkap dan bersih');
  const [unitStatusAfter, setUnitStatusAfter] = useState(UNIT_STATUS.AVAILABLE);
  const [damageFee, setDamageFee] = useState(0);
  const [lateFee, setLateFee] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (rental && returnDate) {
      const scheduledEnd = new Date(rental.end_date);
      const actualReturn = new Date(returnDate);
      const diffTime = actualReturn - scheduledEnd;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        // Late fee policy: 50% extra daily rate per day late
        const daily = equipment?.daily_price || 150000;
        setLateFee(diffDays * Math.round(daily * 1.5));
      } else {
        setLateFee(0);
      }
    }
  }, [rental, returnDate, equipment]);

  if (!rental) return null;

  const totalDeposit = rental.deposit_amount || 0;
  const totalDeductions = parseFloat(lateFee || 0) + parseFloat(damageFee || 0);
  const depositRefund = Math.max(0, totalDeposit - totalDeductions);
  const extraToPay = Math.max(0, totalDeductions - totalDeposit);

  const handleReturn = async () => {
    setIsSubmitting(true);
    try {
      const inspId = generateId('insp');
      await rentalRepository.processReturn({
        rentalId: rental.id,
        unitId: rental.unit_id,
        returnData: {
          actualReturnDate: returnDate,
          lateFee: parseFloat(lateFee) || 0,
          damageFee: parseFloat(damageFee) || 0,
          depositRefunded: depositRefund,
          finalPaidAmount: (rental.paid_amount || rental.total_amount) + extraToPay,
          conditionNotes,
        },
        inspection: {
          id: inspId,
          rental_order_id: rental.id,
          type: 'return',
          inspector_id: user?.id || 'staff',
          condition_notes: conditionNotes,
          damage_fee: parseFloat(damageFee) || 0,
          createdAt: new Date().toISOString(),
        },
        nextUnitStatus: unitStatusAfter,
      });
      toast.success('Pengembalian & inspeksi selesai dicatat!');
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Gagal memproses pengembalian');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Inspeksi Pengembalian Unit (Check-in)"
      description={`Pemeriksaan fisik unit ${unit?.serial_number || rental.unit_id}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button isLoading={isSubmitting} onClick={handleReturn}>Selesaikan Pengembalian</Button>
        </>
      }
    >
      <div className="space-y-3.5 text-xs">
        <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-btn border border-neutral-200">
          <div>
            <span className="text-neutral-500 block">Jadwal Kembali:</span>
            <span className="font-bold text-neutral-900">{rental.end_date}</span>
          </div>
          <div>
            <span className="text-neutral-500 block">Uang Deposit Ditahan:</span>
            <span className="font-bold text-primary">{formatCurrency(totalDeposit)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Tanggal Pengembalian Fisik" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
          <Select
            label="Kondisi Fisik Unit"
            options={[
              { value: UNIT_STATUS.AVAILABLE, label: 'Normal / Prima (Siap Sewa)' },
              { value: UNIT_STATUS.MAINTENANCE, label: 'Perlu Servis / Cleaning' },
              { value: UNIT_STATUS.DAMAGED, label: 'Rusak Fisik' },
            ]}
            value={unitStatusAfter}
            onChange={setUnitStatusAfter}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Denda Terlambat (Rp)" type="number" value={lateFee} onChange={(e) => setLateFee(e.target.value)} />
          <Input label="Biaya Kerusakan / Cacat (Rp)" type="number" value={damageFee} onChange={(e) => setDamageFee(e.target.value)} />
        </div>
        <Input label="Catatan Hasil Inspeksi Fisik" value={conditionNotes} onChange={(e) => setConditionNotes(e.target.value)} />
        <div className="p-3 bg-primary-light/40 rounded-btn flex justify-between items-center font-semibold">
          <span>Deposit Dikembalikan ke Penyewa:</span>
          <span className="text-base text-primary font-bold">{formatCurrency(depositRefund)}</span>
        </div>
      </div>
    </Modal>
  );
}
