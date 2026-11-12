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
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', id_number: '', address: '' });
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
      if (user?.id) await customerRepository.update(user.id, formData);
      toast.success('Profil penyewa berhasil diperbarui!');
    } catch {
      toast.error('Gagal memperbarui profil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageContainer>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <PageHeader
          title="Pengaturan Profil Pelanggan"
          description="Kelola informasi identitas pribadi, nomor kontak verifikasi, dan alamat domisili untuk keperluan rental."
        />

        <div className="bg-white border border-neutral-200 rounded-card p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-neutral-100">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-primary/20 shrink-0" />
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                  <User className="w-7 h-7 text-neutral-400" />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 truncate">{formData.name}</h3>
                <p className="text-xs sm:text-sm text-neutral-500 truncate">{formData.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input label="Nama Lengkap Sesuai KTP" icon={User} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <Input label="Email Akun" icon={Mail} type="email" value={formData.email} disabled />
              <Input label="Nomor WhatsApp / HP Aktif" icon={Phone} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              <Input label="Nomor Induk Kependudukan (KTP) / Paspor" icon={CreditCard} value={formData.id_number} onChange={(e) => setFormData({ ...formData, id_number: e.target.value })} />
              <Input label="Alamat Domisili Lengkap" icon={MapPin} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>

            <div className="p-4 bg-neutral-50 rounded-btn flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Data identitas Anda tersimpan aman secara lokal untuk validasi serah terima peralatan.
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" icon={Save} isLoading={isSaving} type="submit" className="w-full sm:w-auto">
                Simpan Profil
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageContainer>
  );
}
