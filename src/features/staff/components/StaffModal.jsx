import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { userRepository } from '@/database/repositories/userRepository';
import { auditRepository } from '@/database/repositories/auditRepository';
import { ROLES } from '@/constants/roles';
import { generateId } from '@/utils/generateId';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export function StaffModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!name.trim()) return toast.error('Nama staf wajib diisi');
    if (!email.trim() || !email.includes('@')) return toast.error('Format email tidak valid');

    setIsSubmitting(true);
    try {
      const newStaff = {
        id: generateId('usr'),
        business_id: 'biz-apex',
        name,
        email,
        phone,
        role: ROLES.STAFF,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        permissions: {
          can_checkout: true,
          can_approve_booking: true,
          can_view_reports: false,
        },
        createdAt: new Date().toISOString(),
      };
      await userRepository.create(newStaff);
      await auditRepository.log(user?.id, 'STAFF_CREATED', `Staf baru ditambahkan: ${name} (${email})`);
      toast.success('Akun staf operasional berhasil dibuat!');
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Gagal menambahkan staf');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Akun Staf Operasional"
      description="Buat akun operasional untuk menangani serah terima, inventaris, dan inspeksi."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button isLoading={isSubmitting} onClick={handleSubmit}>Simpan Akun Staf</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <Input label="Nama Lengkap Staf" placeholder="Nama staf operasional" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email Login" type="email" placeholder="staf@gearflow.local" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Nomor WhatsApp" placeholder="0812xxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </form>
    </Modal>
  );
}
