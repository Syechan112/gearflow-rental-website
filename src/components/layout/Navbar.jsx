import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { RoleSwitcher } from '../common/RoleSwitcher';
import { LogOut, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-neutral-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 lg:hidden"
            >
              <Layers className="w-5 h-5" />
            </button>
          )}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-btn bg-primary flex items-center justify-center text-white font-bold text-base shadow-sm">
              G
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-neutral-900 tracking-tight text-base leading-none">GearFlow</span>
              <span className="text-[10px] text-neutral-500 font-medium">Rental Management</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <RoleSwitcher />
          {user && (
            <div className="flex items-center gap-2.5 pl-2 border-l border-neutral-200">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-neutral-200"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-neutral-900 leading-tight">{user.name}</span>
                <span className="text-[10px] text-neutral-500 capitalize">{user.role}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Keluar"
                className="p-1.5 text-neutral-400 hover:text-danger hover:bg-neutral-100 rounded-btn transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
