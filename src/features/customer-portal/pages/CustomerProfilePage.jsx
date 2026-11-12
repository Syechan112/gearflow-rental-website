import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/authStore';
import { customerRepository } from '@/database/repositories/customerRepository';
import { User, Phone, Mail, CreditCard, MapPin, Save, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function CustomerProfilePage() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    id_number: '',
    address: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (user?.id) {
        const cust = await customerRepository.getById(user.id);
        if (cust) {
          setFormData({
            name: cust.name || user.name || '',
            email: cust.email || user.email || '',
            phone: cust.phone || '',
            id_number: cust.id_number || '',
            address: cust.address || '',
          });
        } else {
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: '081399887766',
            id_number: '3171012345670001',
            address: 'Jakarta Selatan',
          });
        }
      }
    }
    loadProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (user?.id) {
        await customerRepository.update(user.id, formData);
      }
      toast.success('Profil penyewa berhasil diperbarui!');
    } catch {
      toast.error('Gagal memperbarui profil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Pengaturan Profil Pelanggan"
        description="Kelola informasi identitas pribadi, nomor kontak verifikasi, dan alamat domisili untuk keperluan rental."
      />

      <div className="max-w-2xl bg-white border border-neutral-200 rounded-card p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-neutral-100">
            <img src={user?.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-primary/20" />
            <div>
              <h3 className="text-base font-bold text-neutral-900">{formData.name}</h3>
              <p className="text-xs text-neutral-500">{formData.email}</p>
            </div>
          </div>

          <Input
            label="Nama Lengkap Sesuai KTP"
            icon={User}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Email"
              icon={Mail}
              type="email"
              value={formData.email}
              disabled
            />
            <Input
              label="Nomor WhatsApp / HP Aktif"
              icon={Phone}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <Input
            label="Nomor Induk Kependudukan (KTP) / Paspor"
            icon={CreditCard}
            value={formData.id_number}
            onChange={(e) => setFormData({ ...formData, id_number: e.target.value })}
          />

          <Input
            label="Alamat Domisili Lengkap"
            icon={MapPin}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="p-3 bg-neutral-50 rounded-btn flex items-center gap-2 text-xs text-neutral-600">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span>Data identitas Anda tersimpan aman secara lokal untuk validasi serah terima peralatan.</span>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" icon={Save} isLoading={isSaving} type="submit">
              Simpan Profil
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
}
