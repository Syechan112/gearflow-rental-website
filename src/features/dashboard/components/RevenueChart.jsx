import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/utils/formatCurrency';

const MOCK_REVENUE_TRENDS = [
  { month: 'Jun', revenue: 4200000 },
  { month: 'Jul', revenue: 5800000 },
  { month: 'Agu', revenue: 7100000 },
  { month: 'Sep', revenue: 6500000 },
  { month: 'Okt', revenue: 8900000 },
  { month: 'Nov', revenue: 10450000 },
];

export function RevenueChart({ data = MOCK_REVENUE_TRENDS, className }) {
  return (
    <div className={`bg-white border border-neutral-200 rounded-card p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Tren Pendapatan Rental</h3>
          <p className="text-xs text-neutral-500">Estimasi arus kas sewa 6 bulan terakhir</p>
        </div>
        <span className="text-xs font-bold text-success bg-success-light px-2.5 py-1 rounded-full">+18.4% MoM</span>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F3D3E" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0F3D3E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#858D8D' }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#858D8D' }}
              tickFormatter={(v) => `Rp ${(v / 1000000).toFixed(0)}Jt`}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/95 backdrop-blur p-2.5 rounded-btn shadow-tactile-light border border-neutral-200 text-xs">
                      <p className="font-semibold text-neutral-900">{label}</p>
                      <p className="text-primary font-bold mt-0.5">{formatCurrency(payload[0].value)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#0F3D3E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
