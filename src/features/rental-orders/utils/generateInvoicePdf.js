import { jsPDF } from 'jspdf';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

export function generateInvoicePdf(rental, customer, equipment, unit) {
  const doc = new jsPDF({ format: 'a4', unit: 'mm' });
  const teal = [15, 61, 62], muted = [115, 125, 125], dark = [30, 41, 41];

  // Header Banner
  doc.setFillColor(...teal);
  doc.roundedRect(14, 12, 10, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('GF', 19, 18.5, { align: 'center' });

  doc.setTextColor(...dark);
  doc.setFontSize(14);
  doc.text('GearFlow Equipment Rentals', 28, 17);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text('Apex Gear Rentals Studio • Senopati No. 42, Jakarta • (021) 720-4499', 28, 22);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...teal);
  doc.text('FAKTUR SEWA RESMI', 196, 17, { align: 'right' });
  doc.setFontSize(9);
  doc.setTextColor(...dark);
  doc.text(`No. Faktur: ${rental.id}`, 196, 22, { align: 'right' });

  doc.setDrawColor(230, 235, 235);
  doc.line(14, 28, 196, 28);

  // Customer & Invoice Details Cards
  doc.setFillColor(248, 250, 250);
  doc.roundedRect(14, 33, 88, 30, 2, 2, 'F');
  doc.roundedRect(108, 33, 88, 30, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...teal);
  doc.text('DITAGIHKAN KEPADA:', 18, 39);
  doc.text('DETAIL TRANSAKSI:', 112, 39);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...dark);
  doc.text(customer?.name || rental.customer_id, 18, 45);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text(`Telepon / WA : ${customer?.phone || '-'}`, 18, 51);
  doc.text(`No. Identitas  : ${customer?.id_number || '-'}`, 18, 56);
  doc.text(`Tgl Dibuat   : ${formatDate(rental.createdAt || rental.start_date)}`, 112, 45);
  doc.text(`Periode Sewa : ${rental.start_date} s/d ${rental.end_date}`, 112, 51);
  doc.text(`Unit Fisik   : ${unit?.serial_number || rental.unit_id}`, 112, 56);

  // Table Header
  doc.setFillColor(...teal);
  doc.rect(14, 69, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Deskripsi Peralatan & Serial Unit', 18, 74.5);
  doc.text('Jadwal Sewa', 115, 74.5);
  doc.text('Jumlah', 192, 74.5, { align: 'right' });

  // Table Row
  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(equipment?.name || rental.equipment_id, 18, 83);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...muted);
  doc.text(`SN: ${unit?.serial_number || rental.unit_id} | Status: ${(rental.status || '').toUpperCase()}`, 18, 88);

  doc.setFontSize(8);
  doc.setTextColor(...dark);
  doc.text(`${rental.start_date} - ${rental.end_date}`, 115, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(rental.total_amount), 192, 85, { align: 'right' });
  doc.setDrawColor(230, 235, 235);
  doc.line(14, 93, 196, 93);

  // Summary Table
  let y = 101;
  const printRow = (label, val, isTotal = false) => {
    if (isTotal) {
      doc.setFillColor(240, 246, 246);
      doc.rect(115, y - 4, 81, 7.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...teal);
      doc.text(label, 118, y + 1);
      doc.text(formatCurrency(val), 192, y + 1, { align: 'right' });
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...muted);
      doc.text(label, 118, y);
      doc.setTextColor(...dark);
      doc.text(formatCurrency(val), 192, y, { align: 'right' });
    }
    y += 6.5;
  };

  printRow('Sewa Pokok Peralatan:', rental.total_amount);
  printRow('Uang Jaminan Deposit:', rental.deposit_amount);
  if (rental.late_fee > 0) printRow('Denda Keterlambatan:', rental.late_fee);
  if (rental.damage_fee > 0) printRow('Biaya Kerusakan Fisik:', rental.damage_fee);
  if (rental.deposit_refunded > 0) printRow('Deposit Dikembalikan:', -rental.deposit_refunded);
  printRow('TOTAL PEMBAYARAN:', rental.paid_amount || rental.total_amount, true);

  // Payment note
  doc.setFillColor(248, 250, 250);
  doc.roundedRect(14, 98, 92, 32, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...teal);
  doc.text('CATATAN PEMBAYARAN & DEPOSIT:', 18, 104);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...muted);
  doc.text('• Deposit dikembalikan utuh setelah unit lolos inspeksi fisik.', 18, 110);
  doc.text('• Pembayaran sah diterbitkan otomatis melalui sistem GearFlow.', 18, 116);
  doc.text('• Harap simpan dokumen ini sebagai bukti serah terima sah.', 18, 122);

  // Signatures
  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Penyewa (Customer)', 35, 150, { align: 'center' });
  doc.line(18, 175, 52, 175);
  doc.text(customer?.name || 'Pelanggan', 35, 180, { align: 'center' });

  doc.text('Petugas Studio (Staff GearFlow)', 160, 150, { align: 'center' });
  doc.line(140, 175, 180, 175);
  doc.text('Staff Operasional', 160, 180, { align: 'center' });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(160, 170, 170);
  doc.text('Terima kasih telah mempercayakan kebutuhan perlengkapan rental Anda kepada GearFlow.', 105, 195, { align: 'center' });

  doc.save(`GearFlow-Invoice-${rental.id}.pdf`);
}
