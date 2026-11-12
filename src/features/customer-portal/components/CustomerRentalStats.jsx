import React from 'react';
import { History, Clock, CheckCircle2 } from 'lucide-react';

export function CustomerRentalStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-neutral-200 rounded-card p-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <History className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-neutral-500">Total Transaksi</p>
          <p className="text-xl font-bold text-neutral-900">{stats.total} Pesanan</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-card p-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-neutral-500">Sedang Digunakan</p>
          <p className="text-xl font-bold text-amber-600">{stats.ongoing} Unit</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-card p-4 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-neutral-500">Selesai Dikembalikan</p>
          <p className="text-xl font-bold text-emerald-600">{stats.completed} Unit</p>
        </div>
      </div>
    </div>
  );
}
