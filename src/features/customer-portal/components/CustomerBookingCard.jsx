import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export function CustomerBookingCard({ booking, equipment, onCancelBooking }) {
  const isPending = booking.status === 'pending';
  const isApproved = booking.status === 'approved';

  const getStatusBadge = () => {
    if (isPending) return <Badge variant="warning" icon={Clock}>Menunggu Verifikasi Staff</Badge>;
    if (isApproved) return <Badge variant="success" icon={CheckCircle2}>Disetujui — Siap Diambil</Badge>;
    if (booking.status === 'rejected') return <Badge variant="danger" icon={XCircle}>Ditolak</Badge>;
    return <Badge variant="neutral">{booking.status}</Badge>;
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-card p-5 shadow-sm hover:border-primary/40 transition-all space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded text-[11px]">
            {booking.id}
          </span>
          <span className="text-neutral-400">•</span>
          <span className="text-neutral-500">
            Booking Diajukan: {new Date(booking.createdAt || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        {getStatusBadge()}
      </div>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <img
          src={equipment?.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80'}
          alt={equipment?.name || 'Peralatan'}
          className="w-20 h-20 rounded-btn object-cover border border-neutral-200 flex-shrink-0"
        />

        <div className="flex-1 min-w-0 space-y-1.5">
          <h4 className="font-bold text-neutral-900 text-sm truncate">{equipment?.name || booking.equipment_id}</h4>
          <p className="text-xs text-neutral-500">
            Tarif: <span className="font-semibold text-neutral-800">{formatCurrency(equipment?.daily_price || 0)}</span> / hari
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              <span>Jadwal: <strong className="text-neutral-800">{booking.start_date}</strong> s/d <strong className="text-neutral-800">{booking.end_date}</strong> ({booking.total_days} hari)</span>
            </div>
          </div>
          {booking.notes && (
            <p className="text-[11px] text-neutral-400 italic">Catatan: {booking.notes}</p>
          )}
        </div>

        {/* Pricing */}
        <div className="text-right sm:border-l sm:border-neutral-100 sm:pl-4 min-w-[140px] w-full sm:w-auto">
          <span className="text-[11px] text-neutral-400 block">Estimasi Biaya</span>
          <span className="text-base font-bold text-primary block">
            {formatCurrency(booking.total_price)}
          </span>
          <span className="text-[11px] text-neutral-500 block mt-0.5">
            Deposit: {formatCurrency(booking.deposit || 0)}
          </span>
        </div>
      </div>

      {/* Info Notice & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-neutral-100 text-xs">
        <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
          <AlertCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span>
            {isApproved
              ? 'Pemesanan disetujui. Silakan datangi store untuk pengambilan unit & serah terima.'
              : 'Menunggu konfirmasi admin. Kami akan mengabari ketersediaan unit secepatnya.'}
          </span>
        </div>

        {isPending && onCancelBooking && (
          <Button
            size="sm"
            variant="ghost"
            className="text-danger hover:bg-danger/10 hover:text-danger text-xs h-7"
            onClick={() => onCancelBooking(booking.id)}
          >
            Batalkan Permintaan
          </Button>
        )}
      </div>
    </div>
  );
}
