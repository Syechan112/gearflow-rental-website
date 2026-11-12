import { jsPDF } from 'jspdf';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

export function generateInvoicePdf(rental, customer, equipment, unit) {
  const doc = new jsPDF();

  // Primary Header Banner
  doc.setFillColor(15, 61, 62); // #0F3D3E Dark Teal
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('GearFlow Rental Invoice', 14, 20);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Apex Gear Rentals Studio | Jl. Senopati No. 42, Jakarta', 14, 27);

  // Invoice Meta
  doc.setTextColor(30, 41, 41);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`INVOICE: ${rental.id}`, 14, 44);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Tanggal: ${formatDate(rental.createdAt || rental.start_date)}`, 14, 50);
  doc.text(`Status Rental: ${(rental.status || 'ongoing').toUpperCase()}`, 14, 56);

  // Customer Details Block
  doc.setDrawColor(229, 232, 232);
  doc.setFillColor(248, 250, 250);
  doc.roundedRect(14, 62, 182, 26, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.text('Informasi Penyewa:', 20, 70);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nama: ${customer?.name || rental.customer_id}`, 20, 76);
  doc.text(`WhatsApp: ${customer?.phone || '-'} | No. KTP: ${customer?.id_number || '-'}`, 20, 82);

  // Rental Item Table
  doc.setFillColor(15, 61, 62);
  doc.rect(14, 96, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Deskripsi Peralatan', 18, 101.5);
  doc.text('Unit Serial No.', 90, 101.5);
  doc.text('Periode Sewa', 135, 101.5);
  doc.text('Subtotal', 170, 101.5);

  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'normal');
  doc.text(equipment?.name || rental.equipment_id, 18, 112);
  doc.text(unit?.serial_number || rental.unit_id || 'Unit Alokasi', 90, 112);
  doc.text(`${rental.start_date} s/d ${rental.end_date}`, 135, 112);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(rental.total_amount), 170, 112);

  doc.line(14, 118, 196, 118);

  // Financial Breakdown
  let y = 126;
  const renderRow = (label, value, isBold = false) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(label, 120, y);
    doc.text(formatCurrency(value), 170, y);
    y += 7;
  };

  renderRow('Tarif Sewa Harian:', rental.total_amount);
  renderRow('Jaminan Deposit:', rental.deposit_amount);
  if (rental.late_fee > 0) renderRow('Denda Keterlambatan:', rental.late_fee);
  if (rental.damage_fee > 0) renderRow('Biaya Perbaikan Fisik:', rental.damage_fee);
  if (rental.deposit_refunded > 0) renderRow('Deposit Dikembalikan:', -rental.deposit_refunded);

  doc.line(120, y - 2, 196, y - 2);
  y += 3;
  renderRow('Total Tagihan Terbayar:', rental.paid_amount || rental.total_amount, true);

  // Footer / Terms
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(133, 141, 141);
  doc.text('Syarat & Ketentuan:', 14, 240);
  doc.text('1. Unit peralatan wajib dijaga kebersihannya dan dikembalikan tepat waktu.', 14, 246);
  doc.text('2. Kerusakan sensor, bodi kamera, atau kehilangan aksesoris menjadi tanggung jawab penyewa.', 14, 252);
  doc.text('3. Uang jaminan deposit dikembalikan penuh setelah unit lolos inspeksi fisik serah terima.', 14, 258);

  doc.save(`GearFlow-Invoice-${rental.id}.pdf`);
}
