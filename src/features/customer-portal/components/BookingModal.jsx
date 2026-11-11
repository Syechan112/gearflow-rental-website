import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/utils/formatCurrency';
import { generateId } from '@/utils/generateId';
import { BOOKING_STATUS } from '@/constants/statuses';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export function BookingModal({ equipment, isOpen, onClose, onSuccess }) {
  const { user } = useAuthStore();
  const [startDate, setStartDate] = useState('2026-11-15');
  const [endDate, setEndDate] = useState('2026-11-17');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!equipment) return null;

  const days = Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1);
  const totalPrice = equipment.daily_price * days;

  const handleCreateBooking = async () => {
    setIsSubmitting(true);
    try {
      const newBooking = {
        id: generateId('bk'),
        business_id: equipment.business_id,
        customer_id: user?.id || 'cst-001',
        equipment_id: equipment.id,
        start_date: startDate,
        end_date: endDate,
        total_days: days,
        total_price: totalPrice,
        deposit: equipment.deposit_amount || 0,
        status: BOOKING_STATUS.PENDING,
        notes: notes || 'Booking via Customer Portal',
        createdAt: new Date().toISOString(),
      };
      await bookingRepository.create(newBooking);
      toast.success('Pemesanan berhasil diajukan! Menunggu verifikasi staff.');
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Gagal mengajukan booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Booking ${equipment.name}`}
      description="Tentukan rentang tanggal sewa untuk peralatan ini."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button isLoading={isSubmitting} onClick={handleCreateBooking}>Konfirmasi Sewa</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-btn border border-neutral-200">
          <img src={equipment.image_url} alt="" className="w-12 h-12 object-cover rounded-btn" />
          <div>
            <p className="text-xs font-semibold text-neutral-900">{equipment.name}</p>
            <p className="text-xs text-primary font-bold">{formatCurrency(equipment.daily_price)} / hari</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Tanggal Mulai" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input label="Tanggal Selesai" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <Input label="Catatan Penggunaan" placeholder="Keperluan shooting / trip..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className="p-3 bg-primary-light/40 rounded-btn flex justify-between items-center text-xs">
          <span className="text-neutral-700">Estimasi Total ({days} Hari):</span>
          <span className="text-base font-bold text-primary">{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </Modal>
  );
}
