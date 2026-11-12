import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { CustomerBookingCard } from '../components/CustomerBookingCard';
import { CustomerRentalFilterBar } from '../components/CustomerRentalFilterBar';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';
import { Link } from 'react-router-dom';
import { ShoppingBag, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const BOOKING_TABS = [
  { id: 'all', label: 'Semua Booking' },
  { id: 'pending', label: 'Menunggu Konfirmasi' },
  { id: 'approved', label: 'Disetujui (Siap Ambil)' },
  { id: 'completed', label: 'Sudah Diambil' },
  { id: 'cancelled', label: 'Dibatalkan' },
];

export function CustomerBookingsPage() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    if (user?.id) {
      const [bList, eqList] = await Promise.all([
        bookingRepository.getByCustomerId(user.id),
        equipmentRepository.getAll(),
      ]);
      setBookings(bList);
      setEquipmentList(eqList);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingRepository.updateStatus(bookingId, 'cancelled', 'Dibatalkan oleh pelanggan');
      toast.success('Permintaan booking berhasil dibatalkan.');
      loadData();
    } catch {
      toast.error('Gagal membatalkan booking.');
    }
  };

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    approved: bookings.filter((b) => b.status === 'approved').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
  }), [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const eq = equipmentList.find((e) => e.id === b.equipment_id);
      const matchesTab = activeTab === 'all' || b.status === activeTab;
      const q = searchQuery.toLowerCase();
      const matchesSearch = b.id.toLowerCase().includes(q) || (eq?.name && eq.name.toLowerCase().includes(q));
      return matchesTab && matchesSearch;
    }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [bookings, equipmentList, activeTab, searchQuery]);

  return (
    <PageContainer>
      <PageHeader
        title="Booking & Pemesanan Saya"
        description="Pantau status permohonan reservasi unit sewa Anda, jadwal pengambilan alat, dan konfirmasi staff."
        action={<Link to={ROUTES.CATALOG}><Button size="sm" icon={ShoppingBag}>Booking Alat Baru</Button></Link>}
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white border border-neutral-200 rounded-card p-3.5 sm:p-4 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs text-neutral-500">Total Booking</p>
            <p className="text-lg sm:text-xl font-bold text-neutral-900">{stats.total}</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-card p-3.5 sm:p-4 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs text-neutral-500">Menunggu Konfirmasi</p>
            <p className="text-lg sm:text-xl font-bold text-amber-600">{stats.pending}</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-card p-3.5 sm:p-4 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs text-neutral-500">Disetujui Siap Ambil</p>
            <p className="text-lg sm:text-xl font-bold text-blue-600">{stats.approved}</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-card p-3.5 sm:p-4 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs text-neutral-500">Sudah Diambil</p>
            <p className="text-lg sm:text-xl font-bold text-emerald-600">{stats.completed}</p>
          </div>
        </div>
      </div>

      <CustomerRentalFilterBar
        tabs={BOOKING_TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Cari ID booking atau alat..."
      />

      {filteredBookings.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-card p-12 text-center max-w-md mx-auto shadow-sm">
          <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h4 className="font-bold text-neutral-900 mb-1">Belum Ada Reservasi Booking</h4>
          <p className="text-xs text-neutral-500 mb-5">{searchQuery ? 'Tidak ada booking yang cocok.' : 'Anda belum memiliki permohonan booking peralatan.'}</p>
          <Link to={ROUTES.CATALOG}><Button size="sm" icon={ShoppingBag}>Jelajahi Katalog & Booking</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <CustomerBookingCard
              key={b.id}
              booking={b}
              equipment={equipmentList.find((e) => e.id === b.equipment_id)}
              onCancelBooking={handleCancelBooking}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
