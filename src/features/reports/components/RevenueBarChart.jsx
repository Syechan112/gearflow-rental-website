import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/utils/formatCurrency';

export function RevenueBarChart({ data = [] }) {
  const chartData = data.slice(0, 6).map((item) => ({
    name: item.name.length > 16 ? item.name.substring(0, 16) + '...' : item.name,
    fullName: item.name,
    revenue: item.revenue,
  }));

  return (
    <div className="bg-white border border-neutral-200 rounded-card p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-neutral-900">Kontribusi Pendapatan per Peralatan</h3>
        <p className="text-xs text-neutral-500">Peralatan dengan perolehan omzet sewa tertinggi</p>
      </div>

      <div className="h-64 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-neutral-400">
            Belum ada data pendapatan sewa.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#858D8D' }} angle={-15} textAnchor="end" />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#858D8D' }}
                tickFormatter={(v) => `Rp ${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const row = payload[0].payload;
                    return (
                      <div className="bg-white/95 backdrop-blur p-2.5 rounded-btn shadow-tactile-light border border-neutral-200 text-xs">
                        <p className="font-semibold text-neutral-900">{row.fullName}</p>
                        <p className="text-primary font-bold mt-0.5">{formatCurrency(row.revenue)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="revenue" fill="#0F3D3E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
