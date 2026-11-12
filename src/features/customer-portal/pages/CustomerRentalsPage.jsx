import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { CustomerRentalCard } from '../components/CustomerRentalCard';
import { CustomerBookingCard } from '../components/CustomerBookingCard';
import { CustomerRentalDetailModal } from '../components/CustomerRentalDetailModal';
import { CustomerRentalStats } from '../components/CustomerRentalStats';
import { CustomerRentalFilterBar } from '../components/CustomerRentalFilterBar';
import { BookingModal } from '../components/BookingModal';
import { rentalRepository } from '@/database/repositories/rentalRepository';
import { bookingRepository } from '@/database/repositories/bookingRepository';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { unitRepository } from '@/database/repositories/unitRepository';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';
import { Link } from 'react-router-dom';
import { ShoppingBag, History } from 'lucide-react';
import { toast } from 'sonner';

export function CustomerRentalsPage() {
  const { user } = useAuthStore();
  const [rentals, setRentals] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailRental, setDetailRental] = useState(null);
  const [rebookEquipment, setRebookEquipment] = useState(null);

  const loadData = useCallback(async () => {
    if (user?.id) {
      const [rList, bList, eqList, uList] = await Promise.all([
        rentalRepository.getByCustomerId(user.id),
        bookingRepository.getByCustomerId(user.id),
        equipmentRepository.getAll(),
        unitRepository.getAll(),
      ]);
      setRentals(rList);
      setBookings(bList);
      setEquipmentList(eqList);
      setUnitList(uList);
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
    total: rentals.length + bookings.length,
    ongoing: rentals.filter((r) => r.status === 'ongoing').length,
    bookings: bookings.filter((b) => b.status === 'pending' || b.status === 'approved').length,
    completed: rentals.filter((r) => r.status === 'completed').length,
  }), [rentals, bookings]);

  const combinedItems = useMemo(() => {
    const rItems = rentals.map((r) => ({ type: 'rental', id: r.id, item: r, status: r.status, date: r.createdAt || r.start_date, eqId: r.equipment_id }));
    const bItems = bookings.map((b) => ({ type: 'booking', id: b.id, item: b, status: 'booking', date: b.createdAt, eqId: b.equipment_id }));
    const all = [...rItems, ...bItems].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    return all.filter((entry) => {
      const eq = equipmentList.find((e) => e.id === entry.eqId);
      const matchesTab = activeTab === 'all'
        ? true
        : activeTab === 'booking'
        ? entry.type === 'booking'
        : entry.type === 'rental' && entry.status === activeTab;

      const q = searchQuery.toLowerCase();
      const matchesSearch = entry.id.toLowerCase().includes(q) || (eq?.name && eq.name.toLowerCase().includes(q));
      return matchesTab && matchesSearch;
    });
  }, [rentals, bookings, equipmentList, activeTab, searchQuery]);

  return (
    <PageContainer>
      <PageHeader
        title="Riwayat Rental Peralatan"
        description="Pantau status peralatan yang sedang Anda bawa, histori pengembalian, dan rincian transaksi."
        action={<Link to={ROUTES.CATALOG}><Button size="sm" icon={ShoppingBag}>Sewa Alat Baru</Button></Link>}
      />

      <CustomerRentalStats stats={stats} />
      <CustomerRentalFilterBar activeTab={activeTab} onTabChange={setActiveTab} searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {combinedItems.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-card p-12 text-center max-w-md mx-auto shadow-sm">
          <History className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h4 className="font-bold text-neutral-900 mb-1">Belum Ada Riwayat Rental</h4>
          <p className="text-xs text-neutral-500 mb-5">{searchQuery ? 'Tidak ada transaksi yang cocok.' : 'Anda belum memiliki transaksi rental pada filter ini.'}</p>
          <Link to={ROUTES.CATALOG}><Button size="sm" icon={ShoppingBag}>Mulai Sewa Peralatan</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {combinedItems.map((entry) => entry.type === 'rental' ? (
            <CustomerRentalCard
              key={entry.id}
              rental={entry.item}
              equipment={equipmentList.find((e) => e.id === entry.item.equipment_id)}
              unit={unitList.find((u) => u.id === entry.item.unit_id)}
              customer={user}
              onOpenDetail={(r) => setDetailRental(r)}
              onBookAgain={(eq) => setRebookEquipment(eq)}
            />
          ) : (
            <CustomerBookingCard
              key={entry.id}
              booking={entry.item}
              equipment={equipmentList.find((e) => e.id === entry.item.equipment_id)}
              onCancelBooking={handleCancelBooking}
            />
          ))}
        </div>
      )}

      <CustomerRentalDetailModal
        rental={detailRental}
        equipment={equipmentList.find((e) => e.id === detailRental?.equipment_id)}
        unit={unitList.find((u) => u.id === detailRental?.unit_id)}
        customer={user}
        isOpen={!!detailRental}
        onClose={() => setDetailRental(null)}
      />

      <BookingModal
        equipment={rebookEquipment}
        isOpen={!!rebookEquipment}
        onClose={() => setRebookEquipment(null)}
        onSuccess={loadData}
      />
    </PageContainer>
  );
}
