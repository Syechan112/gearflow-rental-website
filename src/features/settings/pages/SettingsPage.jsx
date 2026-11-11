import React from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SEED_BUSINESS } from '@/database/seeders/seedData';

export function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Pengaturan Bisnis & Kebijakan Rental"
        description="Konfigurasi nama toko, mata uang, alamat fisik operasional, dan syarat sewa."
      />

      <div className="bg-white border border-neutral-200 rounded-card p-6 shadow-sm max-w-2xl space-y-4">
        <h3 className="text-sm font-semibold text-neutral-900 border-b border-neutral-100 pb-3">Profil Rental</h3>
        <Input label="Nama Bisnis" defaultValue={SEED_BUSINESS.name} />
        <Input label="Nomor Kontak WhatsApp" defaultValue={SEED_BUSINESS.phone} />
        <Input label="Alamat Studio / Gudang" defaultValue={SEED_BUSINESS.address} />
        <Input label="Mata Uang Standar" defaultValue="IDR (Rupiah)" disabled />

        <div className="pt-4 flex justify-end">
          <Button size="sm">Simpan Perubahan</Button>
        </div>
      </div>
    </PageContainer>
  );
}
