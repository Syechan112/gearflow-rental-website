import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useBookingForm } from '../hooks/useBookingForm';
import { formatCurrency } from '@/utils/formatCurrency';

export function CreateBookingModal({ isOpen, onClose, equipmentList = [], customerList = [], onSuccess }) {
  const {
    formData,
    handleChange,
    handleSubmit,
    isSubmitting,
    selectedEquipment,
    days,
    totalPrice,
    deposit,
    availability,
  } = useBookingForm({ equipmentList, customerList, onSuccess, onClose });

  const equipmentOptions = equipmentList.map((e) => ({
    value: e.id,
    label: `${e.name} (${formatCurrency(e.daily_price)}/hr)`,
  }));

  const customerOptions = customerList.map((c) => ({
    value: c.id,
    label: `${c.name} (${c.phone})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Input Pemesanan Baru (Staff / Owner)"
      description="Buat reservasi sewa langsung untuk pelanggan walk-in atau via telepon."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button isLoading={isSubmitting} disabled={!availability.isAvailable} onClick={handleSubmit}>
            Simpan & Konfirmasi Booking
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Select
          label="Pilih Pelanggan"
          options={customerOptions}
          value={formData.customer_id}
          onChange={(val) => handleChange('customer_id', val)}
        />
        <Select
          label="Pilih Peralatan"
          options={equipmentOptions}
          value={formData.equipment_id}
          onChange={(val) => handleChange('equipment_id', val)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Tanggal Mulai" type="date" value={formData.start_date} onChange={(e) => handleChange('start_date', e.target.value)} />
          <Input label="Tanggal Selesai" type="date" value={formData.end_date} onChange={(e) => handleChange('end_date', e.target.value)} />
        </div>
        <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-btn border border-neutral-200">
          <span className="text-xs text-neutral-600">Validasi Ketersediaan Unit:</span>
          <Badge variant={availability.isAvailable ? 'success' : 'danger'}>
            {availability.isAvailable ? `Tersedia (${availability.availableSlots} unit bebas)` : 'Jadwal Bentrok / Habis'}
          </Badge>
        </div>
        <Input label="Catatan Booking" placeholder="Lokasi shooting, keperluan khusus..." value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} />
        <div className="p-3 bg-primary-light/40 rounded-btn flex justify-between items-center text-xs">
          <div>
            <span className="text-neutral-600 block">Estimasi {days} Hari + Deposit {formatCurrency(deposit)}</span>
            <span className="font-bold text-neutral-900">Total Tarif Sewa:</span>
          </div>
          <span className="text-lg font-bold text-primary">{formatCurrency(totalPrice)}</span>
        </div>
      </form>
    </Modal>
  );
}
