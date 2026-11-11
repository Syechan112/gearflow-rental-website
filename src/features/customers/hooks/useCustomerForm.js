import { useState } from 'react';
import { customerRepository } from '@/database/repositories/customerRepository';
import { generateId } from '@/utils/generateId';
import { toast } from 'sonner';

export function useCustomerForm({ initialData, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    id_number: initialData?.id_number || '',
    address: initialData?.address || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nama pelanggan wajib diisi';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Format email tidak valid';
    if (!formData.phone.trim()) errs.phone = 'Nomor telepon wajib diisi';
    if (!formData.id_number.trim()) errs.id_number = 'Nomor KTP/ID wajib diisi';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await customerRepository.update(initialData.id, formData);
        toast.success('Data pelanggan berhasil diperbarui!');
      } else {
        await customerRepository.create({
          ...formData,
          id: generateId('cst'),
          business_id: 'biz-apex',
          total_rentals: 0,
          createdAt: new Date().toISOString(),
        });
        toast.success('Pelanggan baru berhasil didaftarkan!');
      }
      onSuccess?.();
      onClose?.();
    } catch {
      toast.error('Gagal menyimpan data pelanggan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, errors, isSubmitting, handleChange, handleSubmit };
}
