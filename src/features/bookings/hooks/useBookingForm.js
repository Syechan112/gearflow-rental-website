import { useState, useEffect } from 'react';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { generateId } from '@/utils/generateId';
import { BOOKING_STATUS } from '@/constants/statuses';
import { toast } from 'sonner';

export function useBookingForm({ equipmentList = [], customerList = [], onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    equipment_id: equipmentList[0]?.id || '',
    customer_id: customerList[0]?.id || '',
    start_date: '2026-11-15',
    end_date: '2026-11-17',
    notes: '',
  });
  const [availability, setAvailability] = useState({ isAvailable: true, availableSlots: 1 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedEquipment = equipmentList.find((e) => e.id === formData.equipment_id);

  const days = Math.max(
    1,
    Math.round((new Date(formData.end_date) - new Date(formData.start_date)) / (1000 * 60 * 60 * 24)) || 1
  );
  const totalPrice = (selectedEquipment?.daily_price || 0) * days;
  const deposit = selectedEquipment?.deposit_amount || 0;

  useEffect(() => {
    async function check() {
      if (formData.equipment_id && formData.start_date && formData.end_date) {
        const result = await bookingRepository.checkAvailability(
          formData.equipment_id,
          formData.start_date,
          formData.end_date
        );
        setAvailability(result);
      }
    }
    check();
  }, [formData.equipment_id, formData.start_date, formData.end_date]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!availability.isAvailable) {
      return toast.error('Unit tidak tersedia pada rentang tanggal tersebut!');
    }
    setIsSubmitting(true);
    try {
      await bookingRepository.create({
        id: generateId('bk'),
        business_id: 'biz-apex',
        customer_id: formData.customer_id,
        equipment_id: formData.equipment_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        total_days: days,
        total_price: totalPrice,
        deposit,
        status: BOOKING_STATUS.APPROVED, // Direct staff booking is pre-approved
        notes: formData.notes || 'Booking dibuat oleh Staff/Admin',
        createdAt: new Date().toISOString(),
      });
      toast.success('Pemesanan rental berhasil dibuat & disetujui!');
      onSuccess?.();
      onClose?.();
    } catch {
      toast.error('Gagal membuat pemesanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    selectedEquipment,
    days,
    totalPrice,
    deposit,
    availability,
  };
}
