import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { maintenanceRepository } from '@/database/repositories/maintenanceRepository';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { unitRepository } from '@/database/repositories/unitRepository';
import { auditRepository } from '@/database/repositories/auditRepository';
import { MaintenanceTable } from '../components/MaintenanceTable';
import { MaintenanceModal } from '../components/MaintenanceModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/stores/authStore';
import { Wrench, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

export function MaintenancePage() {
  const { user } = useAuthStore();
  const [records, setRecords] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [units, setUnits] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    const [m, eq, u] = await Promise.all([
      maintenanceRepository.getAll(),
      equipmentRepository.getAll(),
      unitRepository.getAll(),
    ]);
    setRecords(m);
    setEquipment(eq);
    setUnits(u);
  };

  useEffect(() => { loadData(); }, []);

  const handleComplete = async (record) => {
    const notes = prompt('Catatan penyelesaian servis (opsional):', 'Servis selesai, unit diuji normal');
    if (notes !== null) {
      await maintenanceRepository.complete(record.id, notes);
      await auditRepository.log(user?.id, 'MAINTENANCE_COMPLETED', `Servis selesai untuk unit ${record.unit_id}`);
      toast.success('Servis selesai! Unit fisik telah aktif dan siap disewa kembali.');
      loadData();
    }
  };

  const filtered = records.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || r.issue.toLowerCase().includes(q) || r.unit_id.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Jadwal Perawatan & Servis Unit"
        description="Kelola laporan kerusakan, log reparasi teknisi, dan pemulihan status unit fisik ke inventaris."
        action={
          <Button size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
            Catat Servis Unit
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white p-3 border border-neutral-200 rounded-card shadow-sm">
        <div className="w-full sm:w-72">
          <Input icon={Search} placeholder="Cari kendala atau ID unit..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'in_progress', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-btn text-xs font-semibold capitalize cursor-pointer transition-colors ${
                statusFilter === st ? 'bg-primary text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {st === 'all' ? 'Semua' : st === 'in_progress' ? 'Dalam Servis' : 'Selesai'}
            </button>
          ))}
        </div>
      </div>

      <MaintenanceTable
        records={filtered}
        units={units}
        equipment={equipment}
        onComplete={handleComplete}
      />

      <MaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        equipmentList={equipment}
        units={units}
        onSuccess={loadData}
      />
    </PageContainer>
  );
}
