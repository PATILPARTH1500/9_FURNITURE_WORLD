import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { scrollToSection } from '@/utils/navigation';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoute';

// Lazy load cart drawer so catalog dependencies are deferred
const CartDrawer = lazy(() =>
  import('@/components/cart/CartDrawer').then((m) => ({ default: m.CartDrawer }))
);

// Eagerly loaded for instant first paint on homepage
import HomePage from '@/app/page';

// Route-level code splitting
const CollectionsPage = lazy(() => import('@/app/collections/page'));
const CollectionRoute = lazy(() => import('@/pages/CollectionDetailPage'));
const ProductRoute = lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/app/cart/page'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Authentication & Customer Sanctuary Routes
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const AuthCallbackPage = lazy(() => import('@/pages/auth/AuthCallbackPage'));
const AccountPage = lazy(() => import('@/pages/account/AccountPage'));

// Atelier Administration Routes (Phase 02 / Phase 04)
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminDashboardEntryPage = lazy(() => import('@/pages/admin/AdminDashboardEntryPage'));

function RouteLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-cream">
      <div className="w-7 h-7 rounded-full border-2 border-checkerboard/20 border-t-tangerine animate-spin" />
    </div>
  );
}

export function App() {
  const location = useLocation();

  // Scroll to top or handle hash scroll on location change with sticky-header offset
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        scrollToSection(location.hash, 76);
      }, 120);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <AuthProvider>
      <div className="font-sans bg-cream text-checkerboard antialiased selection:bg-tangerine selection:text-white min-h-screen flex flex-col overflow-x-hidden">
        {/* 1. Global Navbar */}
        <Navbar />

        {/* 2. Global Sliding Cart Drawer */}
        <Suspense fallback={null}>
          <CartDrawer />
        </Suspense>

        {/* 3. Main Content Router */}
        <div className="grow">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              {/* Public Storefront Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/collections/:slug" element={<CollectionRoute />} />
              <Route path="/products/:slug" element={<ProductRoute />} />
              <Route path="/cart" element={<CartPage />} />

              {/* Customer Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />

              {/* Protected Customer Sanctuary Dashboard */}
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />

              {/* Atelier Administration Routes (Protected by RBAC & Session Security) */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboardEntryPage />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboardEntryPage />
                  </AdminProtectedRoute>
                }
              />

              {/* Fallback 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>

        {/* 4. Global Footer */}
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
