import React, { useState, useEffect, useMemo } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/Button';
import { CustomerRentalCard } from '../components/CustomerRentalCard';
import { CustomerRentalDetailModal } from '../components/CustomerRentalDetailModal';
import { CustomerRentalStats } from '../components/CustomerRentalStats';
import { CustomerRentalFilterBar } from '../components/CustomerRentalFilterBar';
import { BookingModal } from '../components/BookingModal';
import { rentalRepository } from '@/database/repositories/rentalRepository';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { unitRepository } from '@/database/repositories/unitRepository';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';
import { Link } from 'react-router-dom';
import { ShoppingBag, History } from 'lucide-react';

export function CustomerRentalsPage() {
  const { user } = useAuthStore();
  const [rentals, setRentals] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailRental, setDetailRental] = useState(null);
  const [rebookEquipment, setRebookEquipment] = useState(null);

  useEffect(() => {
    async function load() {
      if (user?.id) {
        const [rList, eqList, uList] = await Promise.all([
          rentalRepository.getByCustomerId(user.id),
          equipmentRepository.getAll(),
          unitRepository.getAll(),
        ]);
        setRentals(rList);
        setEquipmentList(eqList);
        setUnitList(uList);
      }
    }
    load();
  }, [user]);

  const stats = useMemo(() => ({
    total: rentals.length,
    ongoing: rentals.filter((r) => r.status === 'ongoing').length,
    completed: rentals.filter((r) => r.status === 'completed').length,
  }), [rentals]);

  const filteredRentals = useMemo(() => {
    return rentals.filter((r) => {
      const eq = equipmentList.find((e) => e.id === r.equipment_id);
      const matchesTab = activeTab === 'all' || r.status === activeTab;
      const matchesSearch =
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (eq?.name && eq.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [rentals, equipmentList, activeTab, searchQuery]);

  return (
    <PageContainer>
      <PageHeader
        title="Riwayat Rental Peralatan"
        description="Pantau status peralatan yang sedang Anda bawa, histori pengembalian, dan rincian transaksi."
        action={
          <Link to={ROUTES.CATALOG}>
            <Button size="sm" icon={ShoppingBag}>Sewa Alat Baru</Button>
          </Link>
        }
      />

      <CustomerRentalStats stats={stats} />

      <CustomerRentalFilterBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {filteredRentals.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-card p-12 text-center max-w-md mx-auto shadow-sm">
          <History className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h4 className="font-bold text-neutral-900 mb-1">Belum Ada Riwayat Rental</h4>
          <p className="text-xs text-neutral-500 mb-5">
            {searchQuery ? 'Tidak ada transaksi yang cocok.' : 'Anda belum memiliki transaksi rental pada filter ini.'}
          </p>
          <Link to={ROUTES.CATALOG}>
            <Button size="sm" icon={ShoppingBag}>Mulai Sewa Peralatan</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRentals.map((rental) => (
            <CustomerRentalCard
              key={rental.id}
              rental={rental}
              equipment={equipmentList.find((e) => e.id === rental.equipment_id)}
              unit={unitList.find((u) => u.id === rental.unit_id)}
              customer={user}
              onOpenDetail={(r) => setDetailRental(r)}
              onBookAgain={(eq) => setRebookEquipment(eq)}
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
        onSuccess={() => {}}
      />
    </PageContainer>
  );
}
