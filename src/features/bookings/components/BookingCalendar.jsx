import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { format, addDays } from 'date-fns';
import { id } from 'date-fns/locale';

export function BookingCalendar({ bookings = [], equipment = [] }) {
  const today = new Date();
  const days = Array.from({ length: 10 }, (_, i) => addDays(today, i));

  return (
    <div className="bg-white border border-neutral-200 rounded-card p-5 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Jadwal Reservasi Peralatan (10 Hari Mendatang)</h3>
          <p className="text-xs text-neutral-500">Pantau ketersediaan slot sewa secara visual untuk menghindari bentrok jadwal.</p>
        </div>
      </div>

      <div className="min-w-[700px]">
        {/* Calendar Header */}
        <div className="grid grid-cols-11 gap-1 border-b border-neutral-200 pb-2 text-center text-xs">
          <div className="text-left font-semibold text-neutral-500 px-2">Peralatan</div>
          {days.map((d, i) => (
            <div key={i} className="font-medium text-neutral-700 bg-neutral-50 py-1 rounded">
              <span className="block text-[10px] text-neutral-400">{format(d, 'EEE', { locale: id })}</span>
              <span className="font-bold">{format(d, 'dd')}</span>
            </div>
          ))}
        </div>

        {/* Equipment Rows */}
        <div className="divide-y divide-neutral-100 mt-2">
          {equipment.map((eq) => {
            const eqBookings = bookings.filter((b) => b.equipment_id === eq.id && b.status !== 'cancelled' && b.status !== 'rejected');
            return (
              <div key={eq.id} className="grid grid-cols-11 gap-1 py-2.5 items-center text-xs">
                <div className="truncate px-2 font-medium text-neutral-900" title={eq.name}>
                  {eq.name}
                </div>
                {days.map((d, idx) => {
                  const dateStr = format(d, 'yyyy-MM-dd');
                  const match = eqBookings.find((b) => dateStr >= b.start_date && dateStr <= b.end_date);
                  return (
                    <div key={idx} className="h-8 flex items-center justify-center p-0.5">
                      {match ? (
                        <div
                          className={`w-full h-full rounded text-[10px] font-semibold flex items-center justify-center text-white px-1 truncate ${
                            match.status === 'approved' ? 'bg-success' : 'bg-warning'
                          }`}
                          title={`Booking ${match.id} (${match.status})`}
                        >
                          Booked
                        </div>
                      ) : (
                        <div className="w-full h-full rounded bg-neutral-50 border border-neutral-100" />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
