import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { db } from '@/database/local/db';
import { Button } from '@/components/ui/Button';
import { Plus, User, Phone, Mail } from 'lucide-react';

export function CustomersPage() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await db.customers.toArray();
      setCustomers(data);
    }
    load();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Data Pelanggan Terdaftar"
        description="Kelola profil pelanggan, kontak darurat, nomor KTP/ID, dan total riwayat transaksi rental."
        action={<Button size="sm" icon={Plus}>Tambah Pelanggan</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c) => (
          <div key={c.id} className="bg-white border border-neutral-200 rounded-card p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm">
                {c.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">{c.name}</h4>
                <p className="text-[11px] text-neutral-400">ID: {c.id}</p>
              </div>
            </div>
            <div className="text-xs text-neutral-600 space-y-1.5 pt-2 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>{c.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>{c.email}</span>
              </div>
            </div>
            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-neutral-500">Total Rental:</span>
              <span className="font-semibold text-primary">{c.total_rentals || 0} Kali</span>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
