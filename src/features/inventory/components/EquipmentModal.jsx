import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useEquipmentForm } from '../hooks/useEquipmentForm';

export function EquipmentModal({ isOpen, onClose, initialData, categories = [], onSuccess }) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useEquipmentForm({
    initialData,
    onSuccess,
    onClose,
  });

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Peralatan' : 'Tambah Peralatan Baru'}
      description="Lengkapi informasi peralatan, tarif sewa per hari, dan unit fisik."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button isLoading={isSubmitting} onClick={handleSubmit}>
            {initialData ? 'Simpan Perubahan' : 'Tambah Peralatan'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Peralatan"
          placeholder="Contoh: Sony Alpha 7 IV"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
        />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Kategori"
            options={categoryOptions}
            value={formData.category_id}
            onChange={(val) => handleChange('category_id', val)}
            error={errors.category_id}
          />
          <Input
            label="Merk / Brand"
            placeholder="Sony, Canon, DJI..."
            value={formData.brand}
            onChange={(e) => handleChange('brand', e.target.value)}
            error={errors.brand}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Model / Seri"
            placeholder="ILCE-7M4"
            value={formData.model}
            onChange={(e) => handleChange('model', e.target.value)}
          />
          {!initialData && (
            <Input
              label="Jumlah Unit Awal"
              type="number"
              min="1"
              value={formData.initialUnits}
              onChange={(e) => handleChange('initialUnits', parseInt(e.target.value) || 1)}
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Tarif Sewa / Hari (Rp)"
            type="number"
            step="10000"
            value={formData.daily_price}
            onChange={(e) => handleChange('daily_price', parseFloat(e.target.value) || 0)}
            error={errors.daily_price}
          />
          <Input
            label="Nilai Jaminan Deposit (Rp)"
            type="number"
            step="50000"
            value={formData.deposit_amount}
            onChange={(e) => handleChange('deposit_amount', parseFloat(e.target.value) || 0)}
          />
        </div>
        <Input
          label="URL Foto Peralatan"
          placeholder="https://..."
          value={formData.image_url}
          onChange={(e) => handleChange('image_url', e.target.value)}
        />
        {formData.image_url && (
          <div className="flex items-center gap-3 p-2 bg-neutral-50 rounded-btn border border-neutral-200">
            <img src={formData.image_url} alt="Preview" className="w-12 h-12 object-cover rounded-btn" />
            <span className="text-xs text-neutral-500">Preview foto peralatan</span>
          </div>
        )}
      </form>
    </Modal>
  );
}
