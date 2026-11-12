import React from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Eye } from 'lucide-react';

export function EquipmentCard({ item, onSelectForBooking, onOpenDetail }) {
  return (
    <div className="group bg-white border border-neutral-200 rounded-card overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div
          onClick={() => onOpenDetail(item)}
          className="relative aspect-square overflow-hidden bg-neutral-100 cursor-pointer"
        >
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="success" dot>Tersedia</Badge>
          </div>
          <div className="absolute inset-0 bg-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/90 backdrop-blur text-neutral-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Lihat Detail
            </span>
          </div>
        </div>

        <div className="p-4">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">{item.brand}</span>
          <h3
            onClick={() => onOpenDetail(item)}
            className="text-sm font-semibold text-neutral-900 mt-0.5 line-clamp-1 hover:text-primary cursor-pointer transition-colors"
          >
            {item.name}
          </h3>
          <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{item.description}</p>
        </div>
      </div>

      <div className="p-4 pt-0 border-t border-neutral-100 mt-2 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-neutral-400 block">Tarif Sewa</span>
          <span className="text-sm font-bold text-primary">{formatCurrency(item.daily_price)}</span>
          <span className="text-[10px] text-neutral-400"> / hari</span>
        </div>
        <div className="flex gap-1.5">
          <Button size="sm" icon={ShoppingBag} onClick={() => onSelectForBooking(item)}>
            Sewa
          </Button>
        </div>
      </div>
    </div>
  );
}
