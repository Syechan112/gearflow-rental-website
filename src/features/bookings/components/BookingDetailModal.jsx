import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { BOOKING_STATUS } from '@/constants/statuses';
import { formatCurrency } from '@/utils/formatCurrency';
import { Check, X, Ban } from 'lucide-react';
import { toast } from 'sonner';

export function BookingDetailModal({ booking, equipment, customer, isOpen, onClose, onUpdated, canApprove = true }) {
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  if (!booking) return null;

  const handleAction = async (status, notes = '') => {
    if (!canApprove) {
      toast.error('Otoritas ditolak: Anda tidak memiliki izin untuk mengubah status booking.');
      return;
    }
    await bookingRepository.updateStatus(booking.id, status, notes);
    toast.success(`Status booking diubah menjadi ${status}`);
    setIsRejecting(false);
    onUpdated?.();
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detail Pemesanan ${booking.id}`}
      description="Verifikasi informasi penyewa, kelengkapan alat, dan tanggal sewa."
      maxWidth="max-w-lg"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3 bg-neutral-50 rounded-btn border border-neutral-200 flex justify-between items-center">
          <div>
            <span className="text-neutral-500 block text-[11px]">Penyewa:</span>
            <span className="font-bold text-neutral-900 text-sm">{customer?.name || booking.customer_id}</span>
            <span className="text-neutral-500 block mt-0.5">{customer?.phone}</span>
          </div>
          <Badge variant={booking.status === 'approved' ? 'success' : booking.status === 'pending' ? 'warning' : 'danger'}>
            {booking.status}
          </Badge>
        </div>

        <div className="p-3 bg-neutral-50 rounded-btn border border-neutral-200 space-y-2">
          <div className="flex justify-between">
            <span className="text-neutral-500">Peralatan:</span>
            <span className="font-semibold text-neutral-900">{equipment?.name || booking.equipment_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Periode Sewa:</span>
            <span className="font-semibold text-neutral-900">{booking.start_date} s/d {booking.end_date} ({booking.total_days} hari)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Jaminan Deposit:</span>
            <span className="font-semibold text-neutral-900">{formatCurrency(booking.deposit)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-neutral-200 font-bold">
            <span className="text-neutral-700">Total Biaya Sewa:</span>
            <span className="text-sm text-primary">{formatCurrency(booking.total_price)}</span>
          </div>
        </div>

        {booking.notes && (
          <div className="p-2.5 bg-neutral-100 rounded-btn text-neutral-600">
            <span className="font-bold text-neutral-900">Catatan Penyewa: </span>{booking.notes}
          </div>
        )}

        {isRejecting ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-btn space-y-2">
            <Input label="Alasan Penolakan" placeholder="Unit sedang diservis / dokumen tidak lengkap..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setIsRejecting(false)}>Batal</Button>
              <Button size="sm" variant="destructive" onClick={() => handleAction(BOOKING_STATUS.REJECTED, rejectReason)}>Konfirmasi Tolak</Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            {booking.status === BOOKING_STATUS.PENDING && (
              canApprove ? (
                <>
                  <Button size="sm" variant="destructive" icon={X} onClick={() => setIsRejecting(true)}>Tolak Booking</Button>
                  <Button size="sm" icon={Check} onClick={() => handleAction(BOOKING_STATUS.APPROVED)}>Setujui Booking</Button>
                </>
              ) : (
                <div className="w-full p-2 text-center text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-btn">
                  Anda tidak memiliki hak akses untuk menyetujui atau menolak booking (Hubungi Owner).
                </div>
              )
            )}
            {booking.status === BOOKING_STATUS.APPROVED && canApprove && (
              <Button size="sm" variant="secondary" icon={Ban} onClick={() => handleAction(BOOKING_STATUS.CANCELLED, 'Dibatalkan oleh admin/pelanggan')}>
                Batalkan Booking
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
