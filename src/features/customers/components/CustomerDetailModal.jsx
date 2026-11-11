import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { customerRepository } from '@/database/repositories/customerRepository';
import { formatCurrency } from '@/utils/formatCurrency';
import { Badge } from '@/components/ui/Badge';
import { User, Phone, Mail, CreditCard, Calendar, History } from 'lucide-react';

export function CustomerDetailModal({ customer, isOpen, onClose }) {
  const [history, setHistory] = useState({ bookings: [], rentals: [] });

  useEffect(() => {
    async function load() {
      if (customer?.id) {
        const data = await customerRepository.getHistory(customer.id);
        setHistory(data);
      }
    }
    if (isOpen) load();
  }, [customer, isOpen]);

  if (!customer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Profil Pelanggan — ${customer.name}`}
      description={`ID Pelanggan: ${customer.id}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-neutral-50 rounded-btn border border-neutral-200">
          <div>
            <span className="text-neutral-400 block text-[11px]">Email</span>
            <span className="font-semibold text-neutral-900 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-neutral-400" /> {customer.email}
            </span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px]">WhatsApp / Telepon</span>
            <span className="font-semibold text-neutral-900 flex items-center gap-1.5 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-neutral-400" /> {customer.phone}
            </span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px]">Nomor Identitas (KTP)</span>
            <span className="font-semibold text-neutral-900 flex items-center gap-1.5 mt-0.5">
              <CreditCard className="w-3.5 h-3.5 text-neutral-400" /> {customer.id_number}
            </span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px]">Total Transaksi</span>
            <span className="font-bold text-primary text-sm mt-0.5 block">{customer.total_rentals || 0} Kali Rental</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-neutral-900 mb-2 flex items-center gap-1.5">
            <History className="w-4 h-4 text-primary" /> Riwayat Booking ({history.bookings.length})
          </h4>
          {history.bookings.length === 0 ? (
            <p className="text-neutral-400 py-3 text-center bg-white border border-dashed border-neutral-200 rounded-btn">
              Belum ada riwayat booking tercatat.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.bookings.map((b) => (
                <div key={b.id} className="p-2.5 bg-white border border-neutral-200 rounded-btn flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-neutral-900">{b.id}</span>
                    <p className="text-neutral-500 text-[11px]">{b.start_date} s/d {b.end_date}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-neutral-900">{formatCurrency(b.total_price)}</span>
                    <Badge variant={b.status === 'approved' ? 'success' : 'warning'} className="ml-2">
                      {b.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
