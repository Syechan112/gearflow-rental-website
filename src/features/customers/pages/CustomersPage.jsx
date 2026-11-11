import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { customerRepository } from '@/database/repositories/customerRepository';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CustomerModal } from '../components/CustomerModal';
import { CustomerDetailModal } from '../components/CustomerDetailModal';
import { Plus, Search, Phone, Mail, Edit3, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [viewingCustomer, setViewingCustomer] = useState(null);

  const loadData = async () => {
    const data = await customerRepository.getAll();
    setCustomers(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Hapus pelanggan ini?')) {
      await customerRepository.delete(id);
      toast.success('Pelanggan berhasil dihapus');
      loadData();
    }
  };

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <PageContainer>
      <PageHeader
        title="Data Pelanggan Terdaftar"
        description="Kelola profil pelanggan, kontak darurat, nomor KTP/ID, dan total riwayat transaksi rental."
        action={
          <Button size="sm" icon={Plus} onClick={() => { setEditingCustomer(null); setIsModalOpen(true); }}>
            Tambah Pelanggan
          </Button>
        }
      />

      <div className="mb-6 max-w-md">
        <Input icon={Search} placeholder="Cari nama, email, atau nomor HP..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white border border-neutral-200 rounded-card p-5 shadow-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-neutral-900">{c.name}</h4>
                    <p className="text-[11px] text-neutral-400">ID: {c.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setViewingCustomer(c)} className="p-1.5 text-neutral-400 hover:text-primary rounded-btn cursor-pointer">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setEditingCustomer(c); setIsModalOpen(true); }} className="p-1.5 text-neutral-400 hover:text-primary rounded-btn cursor-pointer">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-1.5 text-neutral-400 hover:text-danger rounded-btn cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-neutral-600 space-y-1.5 pt-3 mt-3 border-t border-neutral-100">
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-neutral-400" /><span>{c.phone}</span></div>
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-neutral-400" /><span>{c.email}</span></div>
              </div>
            </div>
            <div className="pt-2 border-t border-neutral-100 flex justify-between items-center text-xs">
              <span className="text-neutral-500">Total Rental:</span>
              <span className="font-semibold text-primary">{c.total_rentals || 0} Kali</span>
            </div>
          </div>
        ))}
      </div>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCustomer(null); }}
        initialData={editingCustomer}
        onSuccess={loadData}
      />
      <CustomerDetailModal
        isOpen={!!viewingCustomer}
        customer={viewingCustomer}
        onClose={() => setViewingCustomer(null)}
      />
    </PageContainer>
  );
}
