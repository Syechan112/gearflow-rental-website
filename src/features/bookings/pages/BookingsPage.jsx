import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { customerRepository } from '@/database/repositories/customerRepository';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CreateBookingModal } from '../components/CreateBookingModal';
import { BookingDetailModal } from '../components/BookingDetailModal';
import { BookingCalendar } from '../components/BookingCalendar';
import { BookingTable } from '../components/BookingTable';
import { BOOKING_STATUS } from '@/constants/statuses';
import { useAuthStore } from '@/stores/authStore';
import { hasPermission } from '@/constants/permissions';
import { Plus, Search, Calendar, Table } from 'lucide-react';
import { toast } from 'sonner';

export function BookingsPage() {
  const { user } = useAuthStore();
  const canApprove = hasPermission(user, 'can_approve_booking');
  const [bookings, setBookings] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('table');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingBooking, setViewingBooking] = useState(null);

  const loadData = async () => {
    const [b, eq, c] = await Promise.all([
      bookingRepository.getAll(),
      equipmentRepository.getAll(),
      customerRepository.getAll(),
    ]);
    setBookings(b);
    setEquipment(eq);
    setCustomers(c);
  };

  useEffect(() => { loadData(); }, []);

  const handleUpdateStatus = async (id, status) => {
    if (!canApprove) {
      toast.error('Otoritas ditolak: Anda tidak memiliki izin untuk menyetujui atau menolak booking.');
      return;
    }
    await bookingRepository.updateStatus(id, status);
    toast.success(`Booking ${id} ${status}!`);
    loadData();
  };

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || b.id.toLowerCase().includes(q) || b.customer_id.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Daftar Pemesanan (Bookings)"
        description="Kelola persetujuan reservasi pelanggan, tanggal sewa, dan pencegahan double-booking."
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" icon={viewMode === 'table' ? Calendar : Table} onClick={() => setViewMode(viewMode === 'table' ? 'calendar' : 'table')}>
              {viewMode === 'table' ? 'Tampilan Kalender' : 'Tampilan Tabel'}
            </Button>
            <Button size="sm" icon={Plus} onClick={() => setIsCreateOpen(true)}>Booking Manual</Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white p-3 border border-neutral-200 rounded-card shadow-sm">
        <div className="w-full sm:w-72">
          <Input icon={Search} placeholder="Cari ID booking / customer..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', BOOKING_STATUS.PENDING, BOOKING_STATUS.APPROVED, BOOKING_STATUS.REJECTED, BOOKING_STATUS.CANCELLED].map((st) => (
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

      {viewMode === 'calendar' ? (
        <BookingCalendar bookings={bookings} equipment={equipment} />
      ) : (
        <BookingTable
          bookings={filtered}
          equipment={equipment}
          customers={customers}
          canApprove={canApprove}
          onView={(b) => setViewingBooking(b)}
          onApprove={(id) => handleUpdateStatus(id, BOOKING_STATUS.APPROVED)}
          onReject={(id) => handleUpdateStatus(id, BOOKING_STATUS.REJECTED)}
        />
      )}

      <CreateBookingModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} equipmentList={equipment} customerList={customers} onSuccess={loadData} />
      <BookingDetailModal
        isOpen={!!viewingBooking}
        booking={viewingBooking}
        canApprove={canApprove}
        equipment={equipment.find((e) => e.id === viewingBooking?.equipment_id)}
        customer={customers.find((c) => c.id === viewingBooking?.customer_id)}
        onClose={() => setViewingBooking(null)}
        onUpdated={loadData}
      />
    </PageContainer>
  );
}
