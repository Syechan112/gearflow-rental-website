import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';
import { hasPermission } from '@/constants/permissions';
import { toast } from 'sonner';

export function ProtectedRoute({ allowedRoles = [], requiredPermission = null, children }) {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-neutral-500 font-medium">Memuat sesi GearFlow...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    if (user.role === ROLES.OWNER) return <Navigate to={ROUTES.OWNER_DASHBOARD} replace />;
    if (user.role === ROLES.STAFF) return <Navigate to={ROUTES.STAFF_DASHBOARD} replace />;
    return <Navigate to={ROUTES.CUSTOMER_PORTAL} replace />;
  }

  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    toast.error('Akses ditolak: Anda tidak memiliki izin untuk halaman tersebut.');
    return <Navigate to={user.role === ROLES.OWNER ? ROUTES.OWNER_DASHBOARD : ROUTES.STAFF_DASHBOARD} replace />;
  }

  return children ? children : <Outlet />;
}
