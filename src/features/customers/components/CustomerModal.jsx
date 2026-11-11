import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useCustomerForm } from '../hooks/useCustomerForm';
import { User, Mail, Phone, CreditCard, MapPin } from 'lucide-react';

export function CustomerModal({ isOpen, onClose, initialData, onSuccess }) {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useCustomerForm({
    initialData,
    onSuccess,
    onClose,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Data Pelanggan' : 'Registrasi Pelanggan Baru'}
      description="Lengkapi kontak, identitas, dan domisili untuk keperluan verifikasi sewa."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button isLoading={isSubmitting} onClick={handleSubmit}>
            {initialData ? 'Simpan Perubahan' : 'Daftarkan Pelanggan'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Nama Lengkap"
          icon={User}
          placeholder="Nama sesuai KTP"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Email"
            icon={Mail}
            type="email"
            placeholder="nama@email.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            error={errors.email}
          />
          <Input
            label="Nomor WhatsApp / HP"
            icon={Phone}
            placeholder="0812xxxxxxxx"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
          />
        </div>
        <Input
          label="Nomor KTP / SIM / Paspor"
          icon={CreditCard}
          placeholder="Nomor identitas sah"
          value={formData.id_number}
          onChange={(e) => handleChange('id_number', e.target.value)}
          error={errors.id_number}
        />
        <Input
          label="Alamat Domisili"
          icon={MapPin}
          placeholder="Alamat lengkap tempat tinggal"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
        />
      </form>
    </Modal>
  );
}
