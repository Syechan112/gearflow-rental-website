import React from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function ReportsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Laporan Bisnis & Analytics"
        description="Analisis performa pendapatan, utilisasi alat, dan tren pemesanan bulanan."
        action={<Button size="sm" variant="secondary" icon={Download}>Ekspor CSV</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Rata-rata Durasi Sewa" value="2.8 Hari" subtitle="Konsisten meningkat di akhir pekan" icon={Calendar} />
        <StatCard title="Utilisasi Alat" value="76%" subtitle="Sony A7 IV paling diminati" icon={TrendingUp} badgeText="+12%" badgeType="success" />
        <StatCard title="Repeat Customer" value="45%" subtitle="Pelanggan dengan 2+ booking" icon={BarChart3} />
      </div>

      <div className="bg-white border border-neutral-200 rounded-card p-6 shadow-sm text-center py-12">
        <BarChart3 className="w-10 h-10 text-primary/40 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-neutral-900">Grafik Analytics Siap Ditampilkan</h4>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
          Pada fase berikutnya data analytics dihitung otomatis secara lokal menggunakan Recharts.
        </p>
      </div>
    </PageContainer>
  );
}
