import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { bundleRepository } from '@/database/repositories/bundleRepository';
import { equipmentRepository } from '@/database/repositories/equipmentRepository';
import { auditRepository } from '@/database/repositories/auditRepository';
import { BundleModal } from '../components/BundleModal';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAuthStore } from '@/stores/authStore';
import { Package, Plus, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function BundlesPage() {
  const { user } = useAuthStore();
  const [bundles, setBundles] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    const [b, eq] = await Promise.all([
      bundleRepository.getAll(),
      equipmentRepository.getAll(),
    ]);
    setBundles(b);
    setEquipment(eq);
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (bundle) => {
    if (window.confirm(`Hapus ${bundle.name}?`)) {
      await bundleRepository.delete(bundle.id);
      await auditRepository.log(user?.id, 'BUNDLE_DELETED', `Paket dihapus: ${bundle.name}`);
      toast.success('Paket bundling dihapus');
      loadData();
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Paket Bundling Peralatan"
        description="Kelola paket hemat gabungan kamera, lensa, audio, dan lighting untuk meningkatkan nilai transaksi sewa."
        action={
          <Button size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
            Buat Paket Baru
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((bundle) => (
          <div key={bundle.id} className="bg-white border border-neutral-200 rounded-card p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="p-2.5 rounded-btn bg-primary-light text-primary">
                  <Package className="w-5 h-5" />
                </div>
                <button
                  onClick={() => handleDelete(bundle)}
                  className="p-1.5 text-neutral-400 hover:text-danger rounded-btn transition-colors cursor-pointer"
                  title="Hapus Paket"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-neutral-900 mt-3">{bundle.name}</h3>
              <p className="text-xs text-neutral-500 mt-1">{bundle.description || 'Paket bundling siap sewa.'}</p>

              <div className="mt-4 pt-3 border-t border-neutral-100">
                <span className="text-[11px] font-semibold text-neutral-500 block mb-2">Isi Peralatan Paket:</span>
                <div className="space-y-1.5">
                  {(bundle.equipment_ids || []).map((eqId) => {
                    const eq = equipment.find((e) => e.id === eqId);
                    return (
                      <div key={eqId} className="flex items-center gap-2 text-xs text-neutral-700">
                        <CheckCircle className="w-3.5 h-3.5 text-success shrink-0" />
                        <span className="truncate">{eq?.name || eqId}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block">Tarif Paket Hemat</span>
                <span className="text-base font-bold text-primary">{formatCurrency(bundle.daily_price)}</span>
                <span className="text-[10px] text-neutral-400"> / hari</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BundleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        equipmentList={equipment}
        onSuccess={loadData}
      />
    </PageContainer>
  );
}
