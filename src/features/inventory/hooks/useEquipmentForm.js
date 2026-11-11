import { useState } from 'react';
import { generateId } from '@/utils/generateId';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { unitRepository } from '@/database/repositories/unitRepository';
import { UNIT_STATUS } from '@/constants/statuses';
import { toast } from 'sonner';

export function useEquipmentForm({ initialData, onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category_id: initialData?.category_id || '',
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    daily_price: initialData?.daily_price || 150000,
    deposit_amount: initialData?.deposit_amount || 300000,
    description: initialData?.description || '',
    image_url: initialData?.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    initialUnits: 1,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nama peralatan wajib diisi';
    if (!formData.category_id) errs.category_id = 'Pilih kategori';
    if (!formData.brand.trim()) errs.brand = 'Merk wajib diisi';
    if (!formData.daily_price || formData.daily_price <= 0) errs.daily_price = 'Tarif sewa harus > 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        await equipmentRepository.update(initialData.id, formData);
        toast.success('Peralatan berhasil diperbarui!');
      } else {
        const newId = generateId('eq');
        const equipmentPayload = {
          ...formData,
          id: newId,
          business_id: 'biz-apex',
          total_stock: formData.initialUnits || 1,
          createdAt: new Date().toISOString(),
        };
        await equipmentRepository.create(equipmentPayload);
        for (let i = 1; i <= (formData.initialUnits || 1); i++) {
          await unitRepository.create({
            id: generateId('unt'),
            equipment_id: newId,
            business_id: 'biz-apex',
            serial_number: `SN-${formData.brand.toUpperCase()}-${String(i).padStart(3, '0')}`,
            status: UNIT_STATUS.AVAILABLE,
            condition: 'Baru / Sangat Baik',
          });
        }
        toast.success('Peralatan baru & unit fisik berhasil ditambahkan!');
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      toast.error('Gagal menyimpan peralatan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, errors, isSubmitting, handleChange, handleSubmit };
}
