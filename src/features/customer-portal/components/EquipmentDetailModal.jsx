import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils/formatCurrency';
import { ShoppingBag, CheckCircle, Shield, Sparkles } from 'lucide-react';

export function EquipmentDetailModal({ equipment, isOpen, onClose, onBookNow }) {
  if (!equipment) return null;

  const inclusions = [
    'Unit Bodi / Perangkat Utama',
    '2x Baterai Original Berkapasitas Penuh',
    'Dual Charger + Kabel Power',
    'Memory Card High Speed (V90 / U3)',
    'Shoulder Strap & Hard Protective Case',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={equipment.name}
      description={`${equipment.brand} • Model ${equipment.model || 'Standard'}`}
      maxWidth="max-w-xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            <span className="text-[10px] text-neutral-400 block">Tarif Harian</span>
            <span className="text-base font-bold text-primary">{formatCurrency(equipment.daily_price)}</span>
            <span className="text-[10px] text-neutral-400"> / hari</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Tutup</Button>
            <Button icon={ShoppingBag} onClick={() => { onClose(); onBookNow(equipment); }}>
              Sewa Sekarang
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <div className="relative aspect-video rounded-card overflow-hidden bg-neutral-100 border border-neutral-200">
          <img src={equipment.image_url} alt={equipment.name} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3">
            <Badge variant="success" dot>Unit Terverifikasi</Badge>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-neutral-900 text-sm mb-1">Deskripsi Peralatan</h4>
          <p className="text-neutral-600 leading-relaxed">{equipment.description || 'Peralatan fotografi dan videografi profesional dalam kondisi prima siap sewa.'}</p>
        </div>

        <div className="p-3.5 bg-neutral-50 rounded-btn border border-neutral-200">
          <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" /> Kelengkapan Paket Sewa (Included)
          </h4>
          <div className="space-y-1.5">
            {inclusions.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-neutral-700">
                <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-primary-light/40 rounded-btn flex items-center gap-2.5 text-neutral-700">
          <Shield className="w-4 h-4 text-primary shrink-0" />
          <span>Jaminan sewa: KTP asli penyewa + uang jaminan deposit {formatCurrency(equipment.deposit_amount || 0)} (dikembalikan utuh saat unit kembali).</span>
        </div>
      </div>
    </Modal>
  );
}
