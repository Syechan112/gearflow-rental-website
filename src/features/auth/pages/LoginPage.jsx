import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROLES, ROLE_LABELS } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Shield, UserCheck, ShoppingBag, Lock, Mail } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { switchRole } = useAuthStore();
  const navigate = useNavigate();

  const handleQuickLogin = async (role) => {
    const user = await switchRole(role);
    if (user) {
      if (role === ROLES.OWNER) navigate(ROUTES.OWNER_DASHBOARD);
      else if (role === ROLES.STAFF) navigate(ROUTES.STAFF_DASHBOARD);
      else navigate(ROUTES.CUSTOMER_PORTAL);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-modal p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-btn bg-primary text-white font-bold text-xl mb-3 shadow-sm">
            G
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">GearFlow Portal</h2>
          <p className="text-xs text-neutral-500 mt-1">Sistem Manajemen Rental Peralatan Profesional</p>
        </div>

        <div className="space-y-4">
          <Input
            label="Email Pengguna"
            icon={Mail}
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Kata Sandi"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="w-full mt-2"
            onClick={() => handleQuickLogin(ROLES.OWNER)}
          >
            Masuk ke Aplikasi
          </Button>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-neutral-200" /></div>
          <span className="relative bg-white px-3 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Akun Demo 1-Klik
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Shield}
            onClick={() => handleQuickLogin(ROLES.OWNER)}
            className="justify-start text-xs font-semibold"
          >
            Demo Owner (Budi Santoso)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={UserCheck}
            onClick={() => handleQuickLogin(ROLES.STAFF)}
            className="justify-start text-xs font-semibold"
          >
            Demo Staff (Siti Rahma)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={ShoppingBag}
            onClick={() => handleQuickLogin(ROLES.CUSTOMER)}
            className="justify-start text-xs font-semibold"
          >
            Demo Customer (Reza Pratama)
          </Button>
        </div>
      </div>
    </div>
  );
}
