import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { bundleRepository } from '@/database/repositories/bundleRepository';
import { auditRepository } from '@/database/repositories/auditRepository';
import { generateId } from '@/utils/generateId';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

export function BundleModal({ isOpen, onClose, equipmentList = [], onSuccess }) {
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dailyPrice, setDailyPrice] = useState('');
  const [selectedEqIds, setSelectedEqIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleEquipment = (id) => {
    setSelectedEqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!name.trim()) return toast.error('Nama paket bundling wajib diisi');
    if (!dailyPrice || parseFloat(dailyPrice) <= 0) return toast.error('Tarif sewa paket harus > 0');
    if (selectedEqIds.length === 0) return toast.error('Pilih minimal 1 peralatan dalam paket');

    setIsSubmitting(true);
    try {
      const bundle = {
        id: generateId('bdl'),
        business_id: 'biz-apex',
        name,
        description,
        daily_price: parseFloat(dailyPrice),
        equipment_ids: selectedEqIds,
        createdAt: new Date().toISOString(),
      };
      await bundleRepository.create(bundle);
      await auditRepository.log(user?.id, 'BUNDLE_CREATED', `Paket baru dibuat: ${name}`);
      toast.success('Paket bundling peralatan berhasil dibuat!');
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Gagal membuat paket bundling');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Buat Paket Bundling Peralatan"
      description="Gabungkan beberapa kamera, lensa, dan aksesoris menjadi paket sewa hemat."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button isLoading={isSubmitting} onClick={handleSubmit}>Simpan Paket</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <Input label="Nama Paket" placeholder="Contoh: Paket Podcast 2 Kamera" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Deskripsi Paket" placeholder="Deskripsi isi paket dan peruntukan..." value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input label="Tarif Sewa Paket / Hari (Rp)" type="number" placeholder="0" value={dailyPrice} onChange={(e) => setDailyPrice(e.target.value)} />
        <div>
          <label className="text-xs font-semibold text-neutral-700 block mb-2">Pilih Peralatan Yang Termasuk:</label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
            {equipmentList.map((eq) => {
              const isChecked = selectedEqIds.includes(eq.id);
              return (
                <button
                  type="button"
                  key={eq.id}
                  onClick={() => toggleEquipment(eq.id)}
                  className={`p-2 rounded-btn border text-left transition-colors cursor-pointer ${
                    isChecked ? 'bg-primary-light border-primary text-primary font-bold' : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <p className="truncate">{eq.name}</p>
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </Modal>
  );
}
