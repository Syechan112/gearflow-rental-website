import { jsPDF } from 'jspdf';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

export function generateReportPdf(summary) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(15, 61, 62); // #0F3D3E Dark Teal
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Laporan Rekapitulasi Bisnis GearFlow', 14, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tanggal Cetak: ${formatDate(new Date().toISOString())} | Apex Gear Rentals`, 14, 27);

  // Summary Metrics Section
  doc.setTextColor(30, 41, 41);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Ringkasan Kinerja Finansial & Operasional', 14, 46);

  const renderMetricBox = (x, y, w, h, label, val) => {
    doc.setDrawColor(229, 232, 232);
    doc.setFillColor(248, 250, 250);
    doc.roundedRect(x, y, w, h, 2, 2, 'FD');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(133, 141, 141);
    doc.text(label, x + 4, y + 7);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 61, 62);
    doc.text(val, x + 4, y + 15);
  };

  renderMetricBox(14, 52, 42, 20, 'Total Pendapatan', formatCurrency(summary.totalRevenue));
  renderMetricBox(60, 52, 42, 20, 'Total Transaksi', `${summary.totalTransactions} Sewa`);
  renderMetricBox(106, 52, 42, 20, 'Denda & Kerusakan', formatCurrency((summary.totalLateFees || 0) + (summary.totalDamageFees || 0)));
  renderMetricBox(152, 52, 42, 20, 'Total Pelanggan', `${summary.totalCustomers} Akun`);

  // Top Equipment Table
  doc.setTextColor(30, 41, 41);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Peralatan Paling Berkinerja (Top Performing Equipment)', 14, 86);

  doc.setFillColor(15, 61, 62);
  doc.rect(14, 92, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('Peringkat & Nama Alat', 18, 97.5);
  doc.text('Merk', 110, 97.5);
  doc.text('Frekuensi Sewa', 140, 97.5);
  doc.text('Total Revenue', 170, 97.5);

  let y = 107;
  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'normal');
  (summary.topEquipment || []).slice(0, 8).forEach((item, idx) => {
    doc.text(`${idx + 1}. ${item.name}`, 18, y);
    doc.text(item.brand || '-', 110, y);
    doc.text(`${item.rentalCount} Kali`, 140, y);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(item.revenue), 170, y);
    doc.setFont('helvetica', 'normal');
    doc.line(14, y + 3, 196, y + 3);
    y += 10;
  });

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(133, 141, 141);
  doc.text('Laporan ini dihasilkan secara otomatis oleh sistem GearFlow Management dari data transaksi lokal IndexedDB.', 14, 275);

  doc.save(`GearFlow-Business-Report-${new Date().toISOString().split('T')[0]}.pdf`);
}
