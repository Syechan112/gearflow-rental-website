import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { rentalRepository } from '@/database/repositories/rentalRepository';
import { formatCurrency } from '@/utils/formatCurrency';
import { toast } from 'sonner';

export function PaymentModal({ rental, isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!rental) return null;

  const totalBill = rental.total_amount + (rental.late_fee || 0) + (rental.damage_fee || 0);
  const remaining = Math.max(0, totalBill - (rental.paid_amount || 0));

  const handleRecordPayment = async () => {
    const payVal = parseFloat(amount);
    if (!payVal || payVal <= 0) return toast.error('Masukkan nominal pembayaran');
    setIsSubmitting(true);
    try {
      await rentalRepository.recordPayment(rental.id, payVal);
      toast.success(`Pembayaran ${formatCurrency(payVal)} berhasil dicatat!`);
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Gagal mencatat pembayaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Catat Pembayaran — Order ${rental.id}`}
      description="Input pelunasan sewa, denda keterlambatan, atau pelunasan biaya kerusakan."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button isLoading={isSubmitting} onClick={handleRecordPayment}>Simpan Pembayaran</Button>
        </>
      }
    >
      <div className="space-y-3.5 text-xs">
        <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-btn border border-neutral-200">
          <div>
            <span className="text-neutral-500 block">Total Tagihan:</span>
            <span className="font-bold text-neutral-900">{formatCurrency(totalBill)}</span>
          </div>
          <div>
            <span className="text-neutral-500 block">Sisa Pembayaran:</span>
            <span className="font-bold text-danger">{formatCurrency(remaining)}</span>
          </div>
        </div>
        <Input
          label="Nominal Pembayaran Diterima (Rp)"
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Select
          label="Metode Pembayaran"
          options={[
            { value: 'transfer', label: 'Transfer Bank / QRIS' },
            { value: 'cash', label: 'Tunai (Cash di Toko)' },
            { value: 'debit', label: 'Kartu Debit / EDC' },
          ]}
          value={paymentMethod}
          onChange={setPaymentMethod}
        />
        <Input
          label="Catatan Pembayaran"
          placeholder="Bukti transfer / pelunasan..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
    </Modal>
  );
}
