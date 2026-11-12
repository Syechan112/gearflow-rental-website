import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { inspectionRepository } from '@/database/repositories/inspectionRepository';
import { formatCurrency } from '@/utils/formatCurrency';
import { generateInvoicePdf } from '../utils/generateInvoicePdf';
import { FileText, ClipboardCheck, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export function RentalDetailModal({ rental, equipment, customer, unit, isOpen, onClose }) {
  const [inspections, setInspections] = useState([]);

  useEffect(() => {
    async function loadInsp() {
      if (rental?.id) {
        const list = await inspectionRepository.getByRentalId(rental.id);
        setInspections(list);
      }
    }
    if (isOpen) loadInsp();
  }, [rental, isOpen]);

  if (!rental) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detail Transaksi Rental ${rental.id}`}
      description="Laporan operasional, rincian biaya sewa, dan audit inspeksi fisik."
      maxWidth="max-w-xl"
      footer={
        <Button
          size="sm"
          icon={FileText}
          onClick={() => generateInvoicePdf(rental, customer, equipment, unit)}
        >
          Cetak Invoice PDF
        </Button>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-50 rounded-btn border border-neutral-200">
          <div>
            <span className="text-neutral-500 block">Pelanggan:</span>
            <span className="font-bold text-neutral-900">{customer?.name || rental.customer_id}</span>
            <span className="text-neutral-500 block">{customer?.phone}</span>
          </div>
          <div>
            <span className="text-neutral-500 block">Unit Fisik & Nomor Seri:</span>
            <span className="font-bold text-primary">{unit?.serial_number || rental.unit_id}</span>
            <span className="text-neutral-500 block">{equipment?.name}</span>
          </div>
        </div>

        <div className="p-3 bg-white border border-neutral-200 rounded-btn space-y-1.5">
          <div className="flex justify-between">
            <span className="text-neutral-500">Masa Sewa Terjadwal:</span>
            <span className="font-medium text-neutral-900">{rental.start_date} s/d {rental.end_date}</span>
          </div>
          {rental.actual_return_date && (
            <div className="flex justify-between">
              <span className="text-neutral-500">Waktu Pengembalian Fisik:</span>
              <span className="font-semibold text-neutral-900">{rental.actual_return_date}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-neutral-500">Tarif Sewa Pokok:</span>
            <span className="font-semibold text-neutral-900">{formatCurrency(rental.total_amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Jaminan Deposit:</span>
            <span className="font-semibold text-neutral-900">{formatCurrency(rental.deposit_amount)}</span>
          </div>
          {rental.late_fee > 0 && (
            <div className="flex justify-between text-danger">
              <span>Denda Keterlambatan:</span>
              <span className="font-bold">{formatCurrency(rental.late_fee)}</span>
            </div>
          )}
          {rental.damage_fee > 0 && (
            <div className="flex justify-between text-danger">
              <span>Biaya Kerusakan Fisik:</span>
              <span className="font-bold">{formatCurrency(rental.damage_fee)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-neutral-100 font-bold text-sm">
            <span className="text-neutral-900">Total Terbayar:</span>
            <span className="text-primary">{formatCurrency(rental.paid_amount || rental.total_amount)}</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
            <ClipboardCheck className="w-4 h-4 text-primary" /> Riwayat Inspeksi Fisik ({inspections.length})
          </h4>
          {inspections.length === 0 ? (
            <p className="text-neutral-400 py-3 text-center bg-neutral-50 rounded-btn">Belum ada catatan inspeksi.</p>
          ) : (
            <div className="space-y-2">
              {inspections.map((insp) => (
                <div key={insp.id} className="p-2.5 bg-neutral-50 rounded-btn border border-neutral-200">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="flex items-center gap-1.5">
                      {insp.type === 'checkout' ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-success" />
                      ) : (
                        <ArrowDownLeft className="w-3.5 h-3.5 text-primary" />
                      )}
                      Inspeksi {insp.type === 'checkout' ? 'Check-out (Serah Terima)' : 'Check-in (Pengembalian)'}
                    </span>
                    <Badge variant={insp.type === 'checkout' ? 'success' : 'primary'}>{insp.type}</Badge>
                  </div>
                  <p className="text-neutral-600 mt-1">{insp.condition_notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
