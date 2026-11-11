import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { rentalRepository } from '@/database/repositories/rentalRepository';
import { formatCurrency } from '@/utils/formatCurrency';
import { Badge } from '@/components/ui/Badge';
import { RENTAL_STATUS } from '@/constants/statuses';

export function RentalsPage() {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await rentalRepository.getAll();
      setRentals(data);
    }
    load();
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Transaksi Rental Berjalan"
        description="Pelacakan order rental aktif, tanggal pengembalian, status deposit, dan inspeksi."
      />

      <div className="bg-white border border-neutral-200 rounded-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-5 py-3.5">ID Rental</th>
                <th className="px-5 py-3.5">Unit Terpasang</th>
                <th className="px-5 py-3.5">Masa Sewa</th>
                <th className="px-5 py-3.5">Total & Terbayar</th>
                <th className="px-5 py-3.5">Deposit</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rentals.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-neutral-900">{r.id}</td>
                  <td className="px-5 py-3.5 text-neutral-700">{r.unit_id || 'Unit Otomatis'}</td>
                  <td className="px-5 py-3.5 text-neutral-600">{r.start_date} s/d {r.end_date}</td>
                  <td className="px-5 py-3.5 font-semibold text-neutral-900">{formatCurrency(r.total_amount)}</td>
                  <td className="px-5 py-3.5 text-neutral-600">{formatCurrency(r.deposit_amount)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={r.status === RENTAL_STATUS.ONGOING ? 'warning' : 'success'}>
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
