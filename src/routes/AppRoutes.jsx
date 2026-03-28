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
const BillingModule = lazy(() => import('../features/billing/BillingRouter'));
const InventoryModule = lazy(() => import('../features/inventory/InventoryRouter'));
const CoreModule = lazy(() => import('../features/core/CoreRouter'));
const FinanceModule = lazy(() => import('../features/finance/FinanceRouter'));
const QualityModule = lazy(() => import('../features/quality/QualityRouter'));

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
          {/* Default redirect to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Domain Routing */}
          <Route path="/dashboard/*" element={<DashboardModule />} />
          <Route path="/pos/*" element={<POSModule />} />
          <Route path="/billing/*" element={<BillingModule />} />
          <Route path="/inventory/*" element={<InventoryModule />} />
          <Route path="/core/*" element={<CoreModule />} />
          <Route path="/finance/*" element={<FinanceModule />} />
          <Route path="/quality/*" element={<QualityModule />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

