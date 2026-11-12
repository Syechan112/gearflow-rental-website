import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import { generateInvoicePdf } from '@/features/rental-orders/utils/generateInvoicePdf';
import { Calendar, FileText, Repeat, Eye, ShieldCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function CustomerRentalCard({ rental, equipment, unit, customer, onOpenDetail, onBookAgain }) {
  const isOngoing = rental.status === 'ongoing';
  const isOverdue = rental.status === 'overdue';
  const isCompleted = rental.status === 'completed';

  const handleDownloadPdf = () => {
    generateInvoicePdf(rental, customer, equipment, unit);
    toast.success(`Invoice ${rental.id} berhasil diunduh!`);
  };

  const getStatusBadge = () => {
    if (isOverdue) return <Badge variant="danger" icon={AlertTriangle}>Terlambat</Badge>;
    if (isOngoing) return <Badge variant="warning">Sedang Berjalan</Badge>;
    return <Badge variant="success">Selesai</Badge>;
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-card p-5 shadow-sm hover:border-primary/40 transition-all space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
            {rental.id}
          </span>
          <span className="text-neutral-400">•</span>
          <span className="text-neutral-500">
            Dipesan: {new Date(rental.createdAt || rental.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Main Content Info */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <img
          src={equipment?.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80'}
          alt={equipment?.name || 'Equipment'}
          className="w-20 h-20 rounded-btn object-cover border border-neutral-200 flex-shrink-0"
        />

        <div className="flex-1 min-w-0 space-y-1.5">
          <h4 className="font-bold text-neutral-900 text-sm truncate">{equipment?.name || 'Peralatan Rental'}</h4>
          <p className="text-xs text-neutral-500">
            Unit ID: <span className="font-mono font-semibold text-primary">{unit?.serial_number || rental.unit_id}</span>
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>Sewa: <strong className="text-neutral-800">{rental.start_date}</strong> s/d <strong className="text-neutral-800">{rental.end_date}</strong></span>
            </div>
            {rental.actual_return_date && (
              <div className="flex items-center gap-1.5 text-success">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Kembali: {rental.actual_return_date}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing breakdown summary */}
        <div className="text-right sm:border-l sm:border-neutral-100 sm:pl-4 min-w-[140px] w-full sm:w-auto">
          <span className="text-[11px] text-neutral-400 block">Total Transaksi</span>
          <span className="text-base font-bold text-primary block">
            {formatCurrency(rental.paid_amount || rental.total_amount)}
          </span>
          <span className="text-[11px] text-neutral-500 block mt-0.5">
            Deposit: {formatCurrency(rental.deposit_amount)}
            {rental.deposit_refunded > 0 && ' (Dikembalikan)'}
          </span>
          {rental.late_fee > 0 && (
            <span className="text-[11px] font-semibold text-danger block">
              Denda: {formatCurrency(rental.late_fee)}
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-neutral-100 text-xs">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" icon={Eye} onClick={() => onOpenDetail(rental)}>
            Detail & Inspeksi
          </Button>
          <Button size="sm" variant="ghost" icon={FileText} onClick={handleDownloadPdf}>
            Invoice PDF
          </Button>
        </div>

        <Button
          size="sm"
          variant="outline"
          icon={Repeat}
          onClick={() => onBookAgain(equipment)}
        >
          Sewa Lagi
        </Button>
      </div>
    </div>
  );
}
