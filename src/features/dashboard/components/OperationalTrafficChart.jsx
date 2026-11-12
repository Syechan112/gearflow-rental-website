import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function OperationalTrafficChart({ data = [] }) {
  // Fallback demo data if empty
  const chartData = data.length > 0 ? data : [
    { day: 'Sen', checkout: 3, checkin: 2 },
    { day: 'Sel', checkout: 4, checkin: 3 },
    { day: 'Rab', checkout: 2, checkin: 4 },
    { day: 'Kam', checkout: 5, checkin: 3 },
    { day: 'Jum', checkout: 7, checkin: 5 },
    { day: 'Sab', checkout: 8, checkin: 6 },
    { day: 'Min', checkout: 4, checkin: 7 },
  ];

  return (
    <div className="bg-white border border-neutral-200 rounded-card p-5 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Arus Lalu-Lintas Unit (7 Hari)</h3>
          <p className="text-xs text-neutral-500">Perbandingan volume serah terima (check-out) vs pengembalian (check-in)</p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary" />
            <span className="text-neutral-600">Check-out</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
            <span className="text-neutral-600">Check-in</span>
          </div>
        </div>
      </div>

      <div className="h-48 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="checkout" name="Check-out Unit" fill="#0F3D3E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="checkin" name="Check-in Fisik" fill="#16845B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span>Total Operasi Minggu Ini: <strong className="text-neutral-800">59 Unit</strong></span>
        <span className="text-primary font-semibold">Puncak: Jumat & Sabtu</span>
      </div>
    </div>
  );
}
