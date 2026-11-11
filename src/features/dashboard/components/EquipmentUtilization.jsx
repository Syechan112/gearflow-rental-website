import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function EquipmentUtilization({ available = 0, rented = 0, maintenance = 0, total = 0 }) {
  const chartData = [
    { name: 'Available', value: available || 1, color: '#16845B' },
    { name: 'Rented', value: rented, color: '#0F3D3E' },
    { name: 'Maintenance', value: maintenance, color: '#B7791F' },
  ];

  const utilizationRate = total > 0 ? Math.round((rented / total) * 100) : 0;

  return (
    <div className="bg-white border border-neutral-200 rounded-card p-5 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-semibold text-neutral-900">Utilisasi Unit Fisik</h3>
        <p className="text-xs text-neutral-500">Alokasi dan ketersediaan unit di lapangan</p>
      </div>

      <div className="h-44 relative my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-neutral-900">{utilizationRate}%</span>
          <span className="text-[10px] text-neutral-400 font-medium">Tersewa</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100 text-center">
        <div>
          <span className="text-[10px] text-neutral-500 block">Siap Sewa</span>
          <span className="text-xs font-bold text-success">{available} Unit</span>
        </div>
        <div>
          <span className="text-[10px] text-neutral-500 block">Sedang Sewa</span>
          <span className="text-xs font-bold text-primary">{rented} Unit</span>
        </div>
        <div>
          <span className="text-[10px] text-neutral-500 block">Maintenance</span>
          <span className="text-xs font-bold text-warning">{maintenance} Unit</span>
        </div>
      </div>
    </div>
  );
}
