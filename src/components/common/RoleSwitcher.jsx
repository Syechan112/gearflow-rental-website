import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { ROLES, ROLE_LABELS } from '@/constants/roles';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Shield, UserCheck, ShoppingBag } from 'lucide-react';
import { cn } from '@/utils/cn';

const ROLE_ICONS = {
  [ROLES.OWNER]: Shield,
  [ROLES.STAFF]: UserCheck,
  [ROLES.CUSTOMER]: ShoppingBag,
};

const ROLE_REDIRECTS = {
  [ROLES.OWNER]: ROUTES.OWNER_DASHBOARD,
  [ROLES.STAFF]: ROUTES.STAFF_DASHBOARD,
  [ROLES.CUSTOMER]: ROUTES.CUSTOMER_PORTAL,
};

export function RoleSwitcher({ className }) {
  const { user, switchRole } = useAuthStore();
  const navigate = useNavigate();

  const handleSelectRole = async (role) => {
    if (user?.role === role) return;
    const switched = await switchRole(role);
    if (switched && ROLE_REDIRECTS[role]) {
      navigate(ROLE_REDIRECTS[role]);
    }
  };

  return (
    <div className={cn('flex items-center gap-1 p-1 bg-neutral-100 rounded-btn border border-neutral-200/80', className)}>
      {Object.values(ROLES).map((role) => {
        const Icon = ROLE_ICONS[role];
        const isActive = user?.role === role;
        return (
          <button
            key={role}
            type="button"
            onClick={() => handleSelectRole(role)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-[7px] transition-all cursor-pointer',
              isActive
                ? 'bg-white text-primary shadow-sm font-semibold'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{ROLE_LABELS[role]}</span>
          </button>
        );
      })}
    </div>
  );
}
