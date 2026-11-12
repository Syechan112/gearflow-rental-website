import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { Input } from '@/components/ui/Input';
import { ReturnsTable } from '../components/ReturnsTable';
import { ReturnInspectionModal } from '../components/ReturnInspectionModal';
import { RentalDetailModal } from '../components/RentalDetailModal';
import { rentalRepository } from '@/database/repositories/rentalRepository';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { customerRepository } from '@/database/repositories/customerRepository';
import { unitRepository } from '@/database/repositories/unitRepository';
import { RENTAL_STATUS } from '@/constants/statuses';
import { Search, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function ReturnsPage() {
  const [rentals, setRentals] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [units, setUnits] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRentalForReturn, setSelectedRentalForReturn] = useState(null);
  const [selectedRentalForDetail, setSelectedRentalForDetail] = useState(null);

  const loadData = useCallback(async () => {
    const [r, eq, c, u] = await Promise.all([
      rentalRepository.getAll(),
      equipmentRepository.getAll(),
      customerRepository.getAll(),
      unitRepository.getAll(),
    ]);
    setRentals(r);
    setEquipmentList(eq);
    setCustomers(c);
    setUnits(u);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const activeRentals = useMemo(() => {
    return rentals.filter((r) => r.status === RENTAL_STATUS.ONGOING || r.status === 'overdue');
  }, [rentals]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return activeRentals.filter((r) => {
      const eq = equipmentList.find((e) => e.id === r.equipment_id);
      const cust = customers.find((c) => c.id === r.customer_id);
      const u = units.find((item) => item.id === r.unit_id);
      return !q || r.id.toLowerCase().includes(q) || eq?.name?.toLowerCase().includes(q) || cust?.name?.toLowerCase().includes(q) || u?.serial_number?.toLowerCase().includes(q);
    });
  }, [activeRentals, equipmentList, customers, units, search]);

  return (
    <PageContainer>
      <PageHeader
        title="Check-in & Inspeksi Pengembalian"
        description="Penerimaan unit fisik dari pelanggan, verifikasi kondisi fisik, kalkulasi denda, dan pengembalian uang deposit."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-neutral-200 rounded-card p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-500">Unit Sedang Disewa</p>
            <p className="text-xl font-bold text-amber-600">{activeRentals.filter((r) => r.status === 'ongoing').length} Unit</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-card p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-500">Unit Terlambat (Overdue)</p>
            <p className="text-xl font-bold text-red-600">{activeRentals.filter((r) => r.status === 'overdue').length} Unit</p>
          </div>
        </div>
        <div className="bg-white border border-neutral-200 rounded-card p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-neutral-500">Selesai Dikembalikan</p>
            <p className="text-xl font-bold text-emerald-600">{rentals.filter((r) => r.status === 'completed').length} Unit</p>
          </div>
        </div>
      </div>

      <div className="mb-4 max-w-sm">
        <Input icon={Search} placeholder="Cari ID rental, pelanggan, SN unit..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <ReturnsTable
        rentals={filtered}
        equipmentList={equipmentList}
        customers={customers}
        units={units}
        onReturn={(r) => setSelectedRentalForReturn(r)}
        onDetail={(r) => setSelectedRentalForDetail(r)}
      />

      <ReturnInspectionModal
        isOpen={!!selectedRentalForReturn}
        rental={selectedRentalForReturn}
        equipment={equipmentList.find((e) => e.id === selectedRentalForReturn?.equipment_id)}
        unit={units.find((u) => u.id === selectedRentalForReturn?.unit_id)}
        onClose={() => setSelectedRentalForReturn(null)}
        onSuccess={loadData}
      />
      <RentalDetailModal
        isOpen={!!selectedRentalForDetail}
        rental={selectedRentalForDetail}
        equipment={equipmentList.find((e) => e.id === selectedRentalForDetail?.equipment_id)}
        customer={customers.find((c) => c.id === selectedRentalForDetail?.customer_id)}
        unit={units.find((u) => u.id === selectedRentalForDetail?.unit_id)}
        onClose={() => setSelectedRentalForDetail(null)}
      />
    </PageContainer>
  );
}
