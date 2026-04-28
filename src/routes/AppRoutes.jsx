import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';

// Layouts
import { MainLayout } from '../components/layout/MainLayout';
import { RequireAuth } from '../components/layout/RequireAuth';
import { GlobalLoader } from '../components/ui/GlobalLoader';

// Auth Pages (Eagerly loaded for fast paint)
import { LoginFormSmart } from '../features/auth/components/LoginFormSmart';
import { RegisterFormSmart } from '../features/auth/components/RegisterFormSmart';
import { ForgotPasswordSmart } from '../features/auth/components/ForgotPasswordSmart';
import { ResetPasswordSmart } from '../features/auth/components/ResetPasswordSmart';

// Lazy loaded feature domains
const DashboardModule = lazy(() => import('../features/dashboard/DashboardRouter'));
const POSModule = lazy(() => import('../features/pos/POSRouter'));
const InventoryModule = lazy(() => import('../features/inventory/InventoryRouter'));
const ClientsModule = lazy(() => import('../features/clients/ClientRouter'));
const SuppliersModule = lazy(() => import('../features/suppliers/SupplierRouter'));
const ComprasModule = lazy(() => import('../features/compras/ComprasRouter'));
const InvoicesModule = lazy(() => import('../features/invoices/InvoiceRouter'));
const ReportsModule = lazy(() => import('../features/reports/ReportRouter'));
const SettingsModule = lazy(() => import('../features/settings/SettingsRouter'));
const UsersModule = lazy(() => import('../features/users/UsersRouter'));
const CajasModule = lazy(() => import('../features/cajas/CajaRouter'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginFormSmart />} />
        <Route path="/register" element={<RegisterFormSmart />} />
        <Route path="/forgot-password" element={<ForgotPasswordSmart />} />
        <Route path="/reset-password/*" element={<ResetPasswordSmart />} />

        {/* Protected Routes inside MainLayout */}
        <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard/*" element={<DashboardModule />} />
          <Route path="/pos/*" element={<POSModule />} />
          <Route path="/inventory/*" element={<InventoryModule />} />
          <Route path="/clients/*" element={<ClientsModule />} />
           <Route path="/suppliers/*" element={<SuppliersModule />} />
           <Route path="/compras/*" element={<ComprasModule />} />
           <Route path="/invoices/*" element={<InvoicesModule />} />

          <Route path="/reports/*" element={<ReportsModule />} />
            <Route path="/settings/*" element={<SettingsModule />} />
          <Route path="/users/*" element={<UsersModule />} />
          <Route path="/cajas/*" element={<CajasModule />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
