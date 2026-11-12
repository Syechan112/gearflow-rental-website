import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Input } from '@/components/ui/Input';
import { CheckoutTable } from '../components/CheckoutTable';
import { CheckoutModal } from '../components/CheckoutModal';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { customerRepository } from '@/database/repositories/customerRepository';
import { BOOKING_STATUS } from '@/constants/statuses';
import { Search, CheckCircle2, Clock, PackageCheck } from 'lucide-react';

export function CheckoutPage() {
  const [bookings, setBookings] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const loadData = useCallback(async () => {
    const [b, eq, c] = await Promise.all([
      bookingRepository.getAll(),
      equipmentRepository.getAll(),
      customerRepository.getAll(),
    ]);
    setBookings(b);
    setEquipmentList(eq);
    setCustomers(c);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const approvedBookings = useMemo(() => {
    return bookings.filter((b) => b.status === BOOKING_STATUS.APPROVED);
  }, [bookings]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return approvedBookings.filter((b) => {
      const eq = equipmentList.find((e) => e.id === b.equipment_id);
      const cust = customers.find((c) => c.id === b.customer_id);
      return !q || b.id.toLowerCase().includes(q) || eq?.name?.toLowerCase().includes(q) || cust?.name?.toLowerCase().includes(q);
    });
  }, [approvedBookings, equipmentList, customers, search]);

  return (
    <PageContainer>
      <PageHeader
        title="Check-out & Serah Terima Barang"
        description="Pemeriksaan fisik awal, pencatatan deposit, dan penyerahan unit kepada pelanggan untuk booking yang telah disetujui."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-neutral-200 rounded-card p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-500">Siap Serah Terima</p>
            <p className="text-xl font-bold text-neutral-900">{approvedBookings.length} Pesanan</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-card p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-500">Booking Menunggu Approval</p>
            <p className="text-xl font-bold text-amber-600">
              {bookings.filter((b) => b.status === BOOKING_STATUS.PENDING).length} Pesanan
            </p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-card p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-500">Selesai Check-out</p>
            <p className="text-xl font-bold text-emerald-600">
              {bookings.filter((b) => b.status === BOOKING_STATUS.COMPLETED).length} Selesai
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 max-w-sm">
        <Input icon={Search} placeholder="Cari ID booking, pelanggan, atau alat..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <CheckoutTable
        bookings={filtered}
        equipmentList={equipmentList}
        customers={customers}
        onCheckout={(b) => setSelectedBooking(b)}
      />

      <CheckoutModal
        isOpen={!!selectedBooking}
        booking={selectedBooking}
        equipment={equipmentList.find((e) => e.id === selectedBooking?.equipment_id)}
        customer={customers.find((c) => c.id === selectedBooking?.customer_id)}
        onClose={() => setSelectedBooking(null)}
        onSuccess={loadData}
      />
    </PageContainer>
  );
}
