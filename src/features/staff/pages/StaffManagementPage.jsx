import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { userRepository } from '@/database/repositories/userRepository';
import { auditRepository } from '@/database/repositories/auditRepository';
import { StaffModal } from '../components/StaffModal';
import { Button } from '@/components/ui/Button';
import { ROLES } from '@/constants/roles';
import { getStaffPermissions } from '@/constants/permissions';
import { useAuthStore } from '@/stores/authStore';
import { Plus, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export function StaffManagementPage() {
  const { user } = useAuthStore();
  const [staffList, setStaffList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    const list = await userRepository.getByRole(ROLES.STAFF);
    setStaffList(list);
  };

  useEffect(() => { loadData(); }, []);

  const togglePermission = async (staff, permKey) => {
    const perms = getStaffPermissions(staff);
    const updatedPerms = { ...perms, [permKey]: !perms[permKey] };
    await userRepository.update(staff.id, { permissions: updatedPerms });
    await auditRepository.log(user?.id, 'PERMISSION_CHANGED', `Izin ${permKey} staf ${staff.name} diubah.`);

    if (user?.id === staff.id) {
      useAuthStore.getState().setUser({ ...user, permissions: updatedPerms });
    }

    toast.success(`Hak akses staf diperbarui: ${updatedPerms[permKey] ? 'Diaktifkan' : 'Dinonaktifkan'}`);
    loadData();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Manajemen Akun Staf & Hak Akses"
        description="Kelola otoritas operasional staf. Perubahan aturan langsung berlaku secara instan tanpa perlu reload."
        action={
          <Button size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
            Tambah Staf
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((st) => {
          const perms = getStaffPermissions(st);
          return (
            <div key={st.id} className="bg-white border border-neutral-200 rounded-card p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <img src={st.avatar} alt="" className="w-11 h-11 rounded-full object-cover border border-neutral-200" />
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">{st.name}</h4>
                  <p className="text-xs text-neutral-500">{st.email}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 space-y-2.5 text-xs">
                <span className="font-semibold text-neutral-700 block text-[11px] uppercase tracking-wider">
                  Pengaturan Izin & Otoritas:
                </span>
                <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-btn border border-neutral-100">
                  <span className="font-medium text-neutral-700">Proses Check-out / Return</span>
                  <button
                    type="button"
                    onClick={() => togglePermission(st, 'can_checkout')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-btn text-[11px] font-semibold cursor-pointer transition-all ${
                      perms.can_checkout
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-neutral-100 text-neutral-400 border border-neutral-200 hover:bg-neutral-200'
                    }`}
                  >
                    {perms.can_checkout ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>{perms.can_checkout ? 'Aktif' : 'Nonaktif'}</span>
                  </button>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-btn border border-neutral-100">
                  <span className="font-medium text-neutral-700">Setujui / Tolak Booking</span>
                  <button
                    type="button"
                    onClick={() => togglePermission(st, 'can_approve_booking')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-btn text-[11px] font-semibold cursor-pointer transition-all ${
                      perms.can_approve_booking
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-neutral-100 text-neutral-400 border border-neutral-200 hover:bg-neutral-200'
                    }`}
                  >
                    {perms.can_approve_booking ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>{perms.can_approve_booking ? 'Aktif' : 'Nonaktif'}</span>
                  </button>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-btn border border-neutral-100">
                  <span className="font-medium text-neutral-700">Akses Laporan Finansial</span>
                  <button
                    type="button"
                    onClick={() => togglePermission(st, 'can_view_reports')}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-btn text-[11px] font-semibold cursor-pointer transition-all ${
                      perms.can_view_reports
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-neutral-100 text-neutral-400 border border-neutral-200 hover:bg-neutral-200'
                    }`}
                  >
                    {perms.can_view_reports ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>{perms.can_view_reports ? 'Aktif' : 'Nonaktif'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <StaffModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={loadData} />
    </PageContainer>
  );
}
