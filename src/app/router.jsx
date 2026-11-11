import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/constants/roles';

import { LoginPage } from '@/features/auth/pages/LoginPage';
import { OwnerLayout } from '@/components/layout/OwnerLayout';
import { StaffLayout } from '@/components/layout/StaffLayout';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

import { OwnerDashboardPage } from '@/features/dashboard/pages/OwnerDashboardPage';
import { StaffDashboardPage } from '@/features/dashboard/pages/StaffDashboardPage';
import { CustomerDashboardPage } from '@/features/dashboard/pages/CustomerDashboardPage';
import { CatalogPage } from '@/features/customer-portal/pages/CatalogPage';
import { InventoryPage } from '@/features/inventory/pages/InventoryPage';
import { BookingsPage } from '@/features/bookings/pages/BookingsPage';
import { RentalsPage } from '@/features/rental-orders/pages/RentalsPage';
import { CustomersPage } from '@/features/customers/pages/CustomersPage';
import { ReportsPage } from '@/features/reports/pages/ReportsPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';

function RootRedirect() {
  const savedUser = localStorage.getItem('gearflow_user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      if (user.role === ROLES.OWNER) return <Navigate to={ROUTES.OWNER_DASHBOARD} replace />;
      if (user.role === ROLES.STAFF) return <Navigate to={ROUTES.STAFF_DASHBOARD} replace />;
      return <Navigate to={ROUTES.CUSTOMER_PORTAL} replace />;
    } catch {}
  }
  return <Navigate to={ROUTES.CATALOG} replace />;
}

export const router = createBrowserRouter([
  { path: ROUTES.HOME, element: <RootRedirect /> },
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  
  // Public catalog access
  {
    element: <CustomerLayout />,
    children: [
      { path: ROUTES.CATALOG, element: <CatalogPage /> },
    ],
  },

  // Owner Routes
  {
    element: <ProtectedRoute allowedRoles={[ROLES.OWNER]} />,
    children: [
      {
        element: <OwnerLayout />,
        children: [
          { path: ROUTES.OWNER_DASHBOARD, element: <OwnerDashboardPage /> },
          { path: ROUTES.OWNER_INVENTORY, element: <InventoryPage /> },
          { path: ROUTES.OWNER_BOOKINGS, element: <BookingsPage /> },
          { path: ROUTES.OWNER_RENTALS, element: <RentalsPage /> },
          { path: ROUTES.OWNER_CUSTOMERS, element: <CustomersPage /> },
          { path: ROUTES.OWNER_REPORTS, element: <ReportsPage /> },
          { path: ROUTES.OWNER_SETTINGS, element: <SettingsPage /> },
        ],
      },
    ],
  },

  // Staff Routes
  {
    element: <ProtectedRoute allowedRoles={[ROLES.STAFF, ROLES.OWNER]} />,
    children: [
      {
        element: <StaffLayout />,
        children: [
          { path: ROUTES.STAFF_DASHBOARD, element: <StaffDashboardPage /> },
          { path: ROUTES.STAFF_INVENTORY, element: <InventoryPage /> },
          { path: ROUTES.STAFF_BOOKINGS, element: <BookingsPage /> },
          { path: ROUTES.STAFF_RENTALS, element: <RentalsPage /> },
          { path: ROUTES.STAFF_CHECKOUT, element: <BookingsPage /> },
          { path: ROUTES.STAFF_RETURNS, element: <RentalsPage /> },
        ],
      },
    ],
  },

  // Customer Routes
  {
    element: <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.STAFF, ROLES.OWNER]} />,
    children: [
      {
        element: <CustomerLayout />,
        children: [
          { path: ROUTES.CUSTOMER_PORTAL, element: <CustomerDashboardPage /> },
          { path: ROUTES.CUSTOMER_BOOKINGS, element: <CustomerDashboardPage /> },
          { path: ROUTES.CUSTOMER_RENTALS, element: <CustomerDashboardPage /> },
          { path: ROUTES.CUSTOMER_PROFILE, element: <CustomerDashboardPage /> },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to={ROUTES.HOME} replace /> },
]);
