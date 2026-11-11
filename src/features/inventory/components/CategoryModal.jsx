import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { generateId } from '@/utils/generateId';
import { categoryRepository } from '@/database/repositories/categoryRepository';
import { toast } from 'sonner';

export function CategoryModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!name.trim()) return toast.error('Nama kategori wajib diisi');
    setIsSubmitting(true);
    try {
      await categoryRepository.create({
        id: generateId('cat'),
        business_id: 'biz-apex',
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      });
      toast.success('Kategori baru berhasil dibuat!');
      setName('');
      setSlug('');
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Gagal menambahkan kategori');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Kategori Peralatan"
      description="Buat kelompok kategori baru untuk katalog dan inventaris."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button isLoading={isSubmitting} onClick={handleSubmit}>Simpan Kategori</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="Nama Kategori"
          placeholder="Contoh: Lighting & Strobist"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
          }}
        />
        <Input
          label="Slug URL"
          placeholder="lighting-strobist"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>
    </Modal>
  );
}
