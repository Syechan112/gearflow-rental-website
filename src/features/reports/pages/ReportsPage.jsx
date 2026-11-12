import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/ui/Button';
import { reportsRepository } from '@/database/repositories/reportsRepository';
import { RevenueBarChart } from '../components/RevenueBarChart';
import { TopEquipmentTable } from '../components/TopEquipmentTable';
import { exportToCsv } from '../utils/exportCsv';
import { generateReportPdf } from '../utils/generateReportPdf';
import { formatCurrency } from '@/utils/formatCurrency';
import { DollarSign, Receipt, AlertCircle, Users, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function ReportsPage() {
  const [summary, setSummary] = useState(null);
  const [dateRange, setDateRange] = useState('all');

  const loadData = async () => {
    let start = null;
    const now = new Date();
    if (dateRange === '7d') {
      const d = new Date(); d.setDate(now.getDate() - 7); start = d.toISOString().split('T')[0];
    } else if (dateRange === '30d') {
      const d = new Date(); d.setDate(now.getDate() - 30); start = d.toISOString().split('T')[0];
    }
    const data = await reportsRepository.getSummary(start, null);
    setSummary(data);
  };

  useEffect(() => { loadData(); }, [dateRange]);

  const handleExportCsv = () => {
    if (!summary || summary.filteredRentals.length === 0) return toast.error('Tidak ada data untuk diekspor');
    exportToCsv(
      `GearFlow-Transactions-${new Date().toISOString().split('T')[0]}`,
      summary.filteredRentals,
      [
        { key: 'id', label: 'ID Rental' },
        { key: 'customer_id', label: 'ID Pelanggan' },
        { key: 'equipment_id', label: 'ID Alat' },
        { key: 'start_date', label: 'Mulai' },
        { key: 'end_date', label: 'Selesai' },
        { key: 'total_amount', label: 'Tarif Pokok' },
        { key: 'deposit_amount', label: 'Deposit' },
        { key: 'late_fee', label: 'Denda' },
        { key: 'damage_fee', label: 'Kerusakan' },
        { key: 'paid_amount', label: 'Total Bayar' },
        { key: 'status', label: 'Status' },
      ]
    );
    toast.success('File CSV berhasil diunduh!');
  };

  const handleExportPdf = () => {
    if (!summary) return toast.error('Memuat data...');
    generateReportPdf(summary);
    toast.success('Laporan PDF eksekutif berhasil dibuat!');
  };

  if (!summary) return null;

  return (
    <PageContainer>
      <PageHeader
        title="Laporan Bisnis & Analytics"
        description="Analisis performa finansial, volume transaksi sewa, utilisasi alat, dan ekspor dokumen."
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" icon={Download} onClick={handleExportCsv}>
              Ekspor CSV
            </Button>
            <Button size="sm" icon={FileText} onClick={handleExportPdf}>
              Laporan PDF
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto">
        <span className="text-xs text-neutral-500 font-semibold mr-2">Rentang Waktu:</span>
        {[
          { key: 'all', label: 'Semua Waktu' },
          { key: '30d', label: '30 Hari Terakhir' },
          { key: '7d', label: '7 Hari Terakhir' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setDateRange(item.key)}
            className={`px-3 py-1.5 rounded-btn text-xs font-semibold cursor-pointer transition-colors ${
              dateRange === item.key ? 'bg-primary text-white shadow-sm' : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Pendapatan" value={formatCurrency(summary.totalRevenue)} subtitle="Termasuk sewa, denda, & biaya" icon={DollarSign} badgeText="Revenue" badgeType="success" />
        <StatCard title="Transaksi Selesai" value={`${summary.completedCount} Order`} subtitle={`Dari total ${summary.totalTransactions} rental`} icon={Receipt} badgeText="Completed" badgeType="neutral" />
        <StatCard title="Denda & Klaim Kerusakan" value={formatCurrency((summary.totalLateFees || 0) + (summary.totalDamageFees || 0))} subtitle="Kompensasi keterlambatan / servis" icon={AlertCircle} badgeText="Penalties" badgeType="warning" />
        <StatCard title="Pelanggan Terdaftar" value={`${summary.totalCustomers} Akun`} subtitle={`${summary.totalUnits} unit fisik tersedia`} icon={Users} badgeText="Active" badgeType="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueBarChart data={summary.topEquipment} />
        <TopEquipmentTable items={summary.topEquipment} />
      </div>
    </PageContainer>
  );
}
