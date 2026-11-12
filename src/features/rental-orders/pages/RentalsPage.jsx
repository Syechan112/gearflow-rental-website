import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { rentalRepository } from '@/database/repositories/rentalRepository';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { customerRepository } from '@/database/repositories/customerRepository';
import { unitRepository } from '@/database/repositories/unitRepository';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { RentalTable } from '../components/RentalTable';
import { CheckoutModal } from '../components/CheckoutModal';
import { ReturnInspectionModal } from '../components/ReturnInspectionModal';
import { PaymentModal } from '../components/PaymentModal';
import { RentalDetailModal } from '../components/RentalDetailModal';
import { generateInvoicePdf } from '../utils/generateInvoicePdf';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RENTAL_STATUS, BOOKING_STATUS } from '@/constants/statuses';
import { Search, Plus, ArrowUpRight } from 'lucide-react';

export function RentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [units, setUnits] = useState([]);
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const [checkoutBooking, setCheckoutBooking] = useState(null);
  const [returnRental, setReturnRental] = useState(null);
  const [paymentRental, setPaymentRental] = useState(null);
  const [detailRental, setDetailRental] = useState(null);

  const loadData = async () => {
    const [r, eq, c, u, b] = await Promise.all([
      rentalRepository.getAll(),
      equipmentRepository.getAll(),
      customerRepository.getAll(),
      unitRepository.getAll(),
      bookingRepository.getAll(),
    ]);
    setRentals(r);
    setEquipment(eq);
    setCustomers(c);
    setUnits(u);
    setApprovedBookings(b.filter((item) => item.status === BOOKING_STATUS.APPROVED));
  };

  useEffect(() => { loadData(); }, []);

  const filtered = rentals.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || r.id.toLowerCase().includes(q) || r.customer_id.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Transaksi Rental Berjalan & Pengembalian"
        description="Pelacakan status order aktif, check-out serah terima unit, dan inspeksi pengembalian fisik."
        action={
          approvedBookings.length > 0 && (
            <Button size="sm" icon={ArrowUpRight} onClick={() => setCheckoutBooking(approvedBookings[0])}>
              Check-out Booking ({approvedBookings.length})
            </Button>
          )
        }
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white p-3 border border-neutral-200 rounded-card shadow-sm">
        <div className="w-full sm:w-72">
          <Input icon={Search} placeholder="Cari ID rental atau pelanggan..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', RENTAL_STATUS.ONGOING, RENTAL_STATUS.COMPLETED].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-btn text-xs font-semibold capitalize cursor-pointer transition-colors ${
                statusFilter === st ? 'bg-primary text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st === 'all' ? 'Semua' : st}
            </button>
          ))}
        </div>
      </div>

      <RentalTable
        rentals={filtered}
        equipment={equipment}
        customers={customers}
        units={units}
        onView={(r) => setDetailRental(r)}
        onReturn={(r) => setReturnRental(r)}
        onPayment={(r) => setPaymentRental(r)}
        onPrintInvoice={(r, c, eq, u) => generateInvoicePdf(r, c, eq, u)}
      />

      <CheckoutModal
        isOpen={!!checkoutBooking}
        booking={checkoutBooking}
        equipment={equipment.find((e) => e.id === checkoutBooking?.equipment_id)}
        customer={customers.find((c) => c.id === checkoutBooking?.customer_id)}
        onClose={() => setCheckoutBooking(null)}
        onSuccess={loadData}
      />
      <ReturnInspectionModal
        isOpen={!!returnRental}
        rental={returnRental}
        equipment={equipment.find((e) => e.id === returnRental?.equipment_id)}
        unit={units.find((u) => u.id === returnRental?.unit_id)}
        onClose={() => setReturnRental(null)}
        onSuccess={loadData}
      />
      <PaymentModal
        isOpen={!!paymentRental}
        rental={paymentRental}
        onClose={() => setPaymentRental(null)}
        onSuccess={loadData}
      />
      <RentalDetailModal
        isOpen={!!detailRental}
        rental={detailRental}
        equipment={equipment.find((e) => e.id === detailRental?.equipment_id)}
        customer={customers.find((c) => c.id === detailRental?.customer_id)}
        unit={units.find((u) => u.id === detailRental?.unit_id)}
        onClose={() => setDetailRental(null)}
      />
    </PageContainer>
  );
}
