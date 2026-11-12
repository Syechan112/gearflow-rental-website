import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { unitRepository } from '@/database/repositories/unitRepository';
import { rentalRepository } from '@/database/repositories/rentalRepository';
import { RENTAL_STATUS, UNIT_STATUS } from '@/constants/statuses';
import { generateId } from '@/utils/generateId';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export function CheckoutModal({ booking, equipment, customer, isOpen, onClose, onSuccess }) {
  const { user } = useAuthStore();
  const [availableUnits, setAvailableUnits] = useState([]);
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [depositReceived, setDepositReceived] = useState(booking?.deposit || 0);
  const [paymentReceived, setPaymentReceived] = useState(booking?.total_price || 0);
  const [notes, setNotes] = useState('Peralatan & aksesoris lengkap');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadUnits() {
      if (equipment?.id) {
        const units = await unitRepository.getByEquipmentId(equipment.id);
        const free = units.filter((u) => u.status === UNIT_STATUS.AVAILABLE);
        setAvailableUnits(free);
        if (free.length > 0) setSelectedUnitId(free[0].id);
      }
    }
    if (isOpen && equipment) {
      loadUnits();
      setDepositReceived(booking?.deposit || 0);
      setPaymentReceived(booking?.total_price || 0);
    }
  }, [isOpen, equipment, booking]);

  const handleCheckout = async () => {
    if (!selectedUnitId) return toast.error('Pilih unit fisik yang tersedia untuk diserahkan');
    setIsSubmitting(true);
    try {
      const rentalId = generateId('rnt');
      const inspectionId = generateId('insp');
      await rentalRepository.processCheckout({
        rentalOrder: {
          id: rentalId,
          business_id: booking.business_id,
          booking_id: booking.id,
          customer_id: booking.customer_id,
          equipment_id: booking.equipment_id,
          unit_id: selectedUnitId,
          start_date: booking.start_date,
          end_date: booking.end_date,
          total_amount: booking.total_price,
          deposit_amount: parseFloat(depositReceived) || 0,
          paid_amount: parseFloat(paymentReceived) || 0,
          status: RENTAL_STATUS.ONGOING,
          late_fee: 0,
          createdAt: new Date().toISOString(),
        },
        unitId: selectedUnitId,
        inspection: {
          id: inspectionId,
          rental_order_id: rentalId,
          type: 'checkout',
          inspector_id: user?.id || 'staff',
          condition_notes: notes,
          createdAt: new Date().toISOString(),
        },
        bookingId: booking.id,
        customerId: booking.customer_id,
      });
      toast.success(`Check-out selesai! Unit diserahkan ke ${customer?.name}`);
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Gagal memproses check-out');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!booking) return null;

  const unitOptions = availableUnits.map((u) => ({
    value: u.id,
    label: `${u.serial_number} (${u.condition || 'Siap Sewa'})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Proses Check-out Peralatan"
      description={`Serah terima alat untuk pemesanan ${booking.id}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button isLoading={isSubmitting} disabled={availableUnits.length === 0} onClick={handleCheckout}>
            Konfirmasi Serah Terima (Check-out)
          </Button>
        </>
      }
    >
      <div className="space-y-3.5 text-xs">
        <div className="p-3 bg-neutral-50 rounded-btn border border-neutral-200">
          <p className="font-semibold text-neutral-900">{equipment?.name} — {customer?.name}</p>
          <p className="text-neutral-500">Masa Sewa: {booking.start_date} s/d {booking.end_date} ({booking.total_days} hari)</p>
        </div>
        <Select
          label="Pilih Unit Fisik (Serial Number)"
          options={unitOptions}
          value={selectedUnitId}
          onChange={setSelectedUnitId}
          placeholder={availableUnits.length === 0 ? 'Tidak ada unit fisik siap sewa!' : 'Pilih unit...'}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Biaya Sewa Diterima (Rp)" type="number" value={paymentReceived} onChange={(e) => setPaymentReceived(e.target.value)} />
          <Input label="Uang Jaminan Deposit (Rp)" type="number" value={depositReceived} onChange={(e) => setDepositReceived(e.target.value)} />
        </div>
        <Input label="Catatan Kondisi Fisik Saat Serah Terima" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
    </Modal>
  );
}
