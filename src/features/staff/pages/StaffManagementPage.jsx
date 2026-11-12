import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { userRepository } from '@/database/repositories/userRepository';
import { auditRepository } from '@/database/repositories/auditRepository';
import { StaffModal } from '../components/StaffModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ROLES } from '@/constants/roles';
import { useAuthStore } from '@/stores/authStore';
import { UserCheck, Plus, Shield, Check, X } from 'lucide-react';
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
    const perms = staff.permissions || { can_checkout: true, can_approve_booking: true, can_view_reports: false };
    const updatedPerms = { ...perms, [permKey]: !perms[permKey] };
    await userRepository.update(staff.id, { permissions: updatedPerms });
    await auditRepository.log(user?.id, 'PERMISSION_CHANGED', `Izin ${permKey} staf ${staff.name} diubah.`);
    toast.success('Hak akses staf diperbarui');
    loadData();
  };

  return (
    <PageContainer>
      <PageHeader
        title="Manajemen Akun Staf & Hak Akses"
        description="Kelola hak akses operasional staf untuk verifikasi booking, serah terima, dan laporan bisnis."
        action={
          <Button size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>
            Tambah Staf
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((st) => {
          const perms = st.permissions || { can_checkout: true, can_approve_booking: true, can_view_reports: false };
          return (
            <div key={st.id} className="bg-white border border-neutral-200 rounded-card p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <img src={st.avatar} alt="" className="w-11 h-11 rounded-full object-cover border border-neutral-200" />
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">{st.name}</h4>
                  <p className="text-xs text-neutral-500">{st.email}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs">
                <span className="font-semibold text-neutral-700 block text-[11px] uppercase tracking-wider">
                  Pengaturan Izin & Otoritas:
                </span>
                <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-btn">
                  <span>Proses Check-out / Return</span>
                  <button
                    onClick={() => togglePermission(st, 'can_checkout')}
                    className={`p-1 rounded cursor-pointer ${perms.can_checkout ? 'bg-success text-white' : 'bg-neutral-200 text-neutral-500'}`}
                  >
                    {perms.can_checkout ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-btn">
                  <span>Setujui / Tolak Booking</span>
                  <button
                    onClick={() => togglePermission(st, 'can_approve_booking')}
                    className={`p-1 rounded cursor-pointer ${perms.can_approve_booking ? 'bg-success text-white' : 'bg-neutral-200 text-neutral-500'}`}
                  >
                    {perms.can_approve_booking ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-btn">
                  <span>Akses Laporan Finansial</span>
                  <button
                    onClick={() => togglePermission(st, 'can_view_reports')}
                    className={`p-1 rounded cursor-pointer ${perms.can_view_reports ? 'bg-success text-white' : 'bg-neutral-200 text-neutral-500'}`}
                  >
                    {perms.can_view_reports ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
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
