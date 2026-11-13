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
import { CustomerBookingsPage } from '@/features/customer-portal/pages/CustomerBookingsPage';
import { CustomerRentalsPage } from '@/features/customer-portal/pages/CustomerRentalsPage';
import { CustomerProfilePage } from '@/features/customer-portal/pages/CustomerProfilePage';
import { CatalogPage } from '@/features/customer-portal/pages/CatalogPage';
import { InventoryPage } from '@/features/inventory/pages/InventoryPage';
import { BookingsPage } from '@/features/bookings/pages/BookingsPage';
import { RentalsPage } from '@/features/rental-orders/pages/RentalsPage';
import { CheckoutPage } from '@/features/rental-orders/pages/CheckoutPage';
import { ReturnsPage } from '@/features/rental-orders/pages/ReturnsPage';
import { CustomersPage } from '@/features/customers/pages/CustomersPage';
import { MaintenancePage } from '@/features/maintenance/pages/MaintenancePage';
import { BundlesPage } from '@/features/bundles/pages/BundlesPage';
import { StaffManagementPage } from '@/features/staff/pages/StaffManagementPage';
import { ReportsPage } from '@/features/reports/pages/ReportsPage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';
import { NotFoundPage } from '@/features/errors/pages/NotFoundPage';

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
  {
    element: <CustomerLayout />,
    children: [{ path: ROUTES.CATALOG, element: <CatalogPage /> }],
  },
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
          { path: ROUTES.OWNER_MAINTENANCE, element: <MaintenancePage /> },
          { path: ROUTES.OWNER_BUNDLES, element: <BundlesPage /> },
          { path: ROUTES.OWNER_STAFF, element: <StaffManagementPage /> },
          { path: ROUTES.OWNER_REPORTS, element: <ReportsPage /> },
          { path: ROUTES.OWNER_SETTINGS, element: <SettingsPage /> },
        ],
      },
    ],
  },
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
          {
            path: ROUTES.STAFF_CHECKOUT,
            element: (
              <ProtectedRoute requiredPermission="can_checkout">
                <CheckoutPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ROUTES.STAFF_RETURNS,
            element: (
              <ProtectedRoute requiredPermission="can_checkout">
                <ReturnsPage />
              </ProtectedRoute>
            ),
          },
          { path: ROUTES.STAFF_MAINTENANCE, element: <MaintenancePage /> },
          {
            path: ROUTES.STAFF_REPORTS,
            element: (
              <ProtectedRoute requiredPermission="can_view_reports">
                <ReportsPage />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[ROLES.CUSTOMER, ROLES.STAFF, ROLES.OWNER]} />,
    children: [
      {
        element: <CustomerLayout />,
        children: [
          { path: ROUTES.CUSTOMER_PORTAL, element: <CustomerDashboardPage /> },
          { path: ROUTES.CUSTOMER_BOOKINGS, element: <CustomerBookingsPage /> },
          { path: ROUTES.CUSTOMER_RENTALS, element: <CustomerRentalsPage /> },
          { path: ROUTES.CUSTOMER_PROFILE, element: <CustomerProfilePage /> },
        ],
      },
    ],
  },
  { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
