import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ShoppingBag, SearchSlash } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';
import { useAuthStore } from '@/stores/authStore';

export function NotFoundPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const getHomeRoute = () => {
    if (!user) return ROUTES.CATALOG;
    if (user.role === ROLES.OWNER) return ROUTES.OWNER_DASHBOARD;
    if (user.role === ROLES.STAFF) return ROUTES.STAFF_DASHBOARD;
    return ROUTES.CUSTOMER_PORTAL;
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-between text-neutral-900">
      <header className="border-b border-neutral-200 bg-white/80 backdrop-blur px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-btn bg-primary flex items-center justify-center text-white font-bold text-base shadow-sm">
              G
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-neutral-900 tracking-tight text-base leading-none">GearFlow</span>
              <span className="text-[10px] text-neutral-500 font-medium">Rental Management</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            icon={ArrowLeft}
            onClick={() => navigate(-1)}
          >
            Kembali
          </Button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-white border border-neutral-200 rounded-card p-8 sm:p-10 shadow-card">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6 ring-8 ring-primary/5">
            <SearchSlash className="w-8 h-8" />
          </div>

          <div className="inline-block px-3 py-1 mb-3 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700">
            Error 404 • Not Found
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-2">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-neutral-600 mb-8 leading-relaxed">
            Maaf, halaman atau rute yang Anda tuju tidak ditemukan, sudah dipindahkan, atau alamat URL yang dimasukkan kurang tepat.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              className="w-full sm:w-auto"
              icon={Home}
              onClick={() => navigate(getHomeRoute())}
            >
              {user ? 'Ke Dashboard' : 'Ke Beranda'}
            </Button>
            <Button
              variant="secondary"
              className="w-full sm:w-auto"
              icon={ShoppingBag}
              onClick={() => navigate(ROUTES.CATALOG)}
            >
              Buka Katalog
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-500 bg-white">
        &copy; {new Date().getFullYear()} GearFlow Studio. Seluruh hak cipta dilindungi.
      </footer>
    </div>
  );
}
