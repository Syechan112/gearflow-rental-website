import React from 'react';
import { History, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export function CustomerRentalStats({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <div className="bg-white border border-neutral-200 rounded-card p-3.5 sm:p-4 flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          <History className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <p className="text-[11px] sm:text-xs text-neutral-500">Total Transaksi</p>
          <p className="text-lg sm:text-xl font-bold text-neutral-900">{stats.total}</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-card p-3.5 sm:p-4 flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <p className="text-[11px] sm:text-xs text-neutral-500">Sedang Disewa</p>
          <p className="text-lg sm:text-xl font-bold text-amber-600">{stats.ongoing}</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-card p-3.5 sm:p-4 flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <p className="text-[11px] sm:text-xs text-neutral-500">Selesai Dikembalikan</p>
          <p className="text-lg sm:text-xl font-bold text-emerald-600">{stats.completed}</p>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-card p-3.5 sm:p-4 flex items-center gap-3 shadow-sm">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-600 flex-shrink-0">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <p className="text-[11px] sm:text-xs text-neutral-500">Terlambat</p>
          <p className="text-lg sm:text-xl font-bold text-red-600">{stats.overdue || 0}</p>
        </div>
      </div>
    </div>
  );
}
