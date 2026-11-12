import React from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RENTAL_STATUS } from '@/constants/statuses';
import { Eye, ArrowDownLeft, DollarSign, FileText } from 'lucide-react';

export function RentalTable({ rentals, equipment, customers, units, onView, onReturn, onPayment, onPrintInvoice, canCheckout = true }) {
  if (rentals.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-neutral-500 bg-white border border-neutral-200 rounded-card">
        Tidak ada data transaksi rental yang sesuai dengan filter.
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
            <tr>
              <th className="px-5 py-3.5">ID Rental</th>
              <th className="px-5 py-3.5">Penyewa & Peralatan</th>
              <th className="px-5 py-3.5">No. Seri Unit</th>
              <th className="px-5 py-3.5">Masa Sewa</th>
              <th className="px-5 py-3.5">Total & Terbayar</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Tindakan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rentals.map((r) => {
              const eq = equipment.find((e) => e.id === r.equipment_id);
              const cust = customers.find((c) => c.id === r.customer_id);
              const unit = units.find((u) => u.id === r.unit_id);
              const isOngoing = r.status === RENTAL_STATUS.ONGOING;

              return (
                <tr key={r.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-neutral-900">{r.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-neutral-900">{cust?.name || r.customer_id}</p>
                    <p className="text-[11px] text-neutral-500">{eq?.name || r.equipment_id}</p>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-neutral-700">
                    {unit?.serial_number || r.unit_id}
                  </td>
                  <td className="px-5 py-3.5 text-neutral-600">
                    {r.start_date} s/d {r.end_date}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-neutral-900">{formatCurrency(r.paid_amount || r.total_amount)}</span>
                    <span className="text-[10px] text-neutral-400 block">Dep: {formatCurrency(r.deposit_amount)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={isOngoing ? 'warning' : 'success'}>{r.status}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end items-center gap-1.5">
                      <button onClick={() => onView(r)} title="Lihat Detail" className="p-1.5 text-neutral-400 hover:text-primary rounded-btn cursor-pointer">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => onPrintInvoice(r, cust, eq, unit)} title="Invoice PDF" className="p-1.5 text-neutral-400 hover:text-primary rounded-btn cursor-pointer">
                        <FileText className="w-4 h-4" />
                      </button>
                      {isOngoing && (
                        <>
                          <Button size="sm" variant="secondary" icon={DollarSign} onClick={() => onPayment(r)}>
                            Bayar
                          </Button>
                          {canCheckout ? (
                            <Button size="sm" icon={ArrowDownLeft} onClick={() => onReturn(r)}>
                              Check-in
                            </Button>
                          ) : (
                            <span className="px-2 py-1 text-[10px] text-neutral-400 italic bg-neutral-100 rounded">
                              Izin Check-in Dibatasi
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
