import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

// Eagerly loaded for instant first paint on homepage
import HomePage from '@/app/page';

// Route-level code splitting
const CollectionsPage = lazy(() => import('@/app/collections/page'));
const CollectionRoute = lazy(() => import('@/pages/CollectionDetailPage'));
const ProductRoute = lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/app/cart/page'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

function RouteLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-cream">
      <div className="w-7 h-7 rounded-full border-2 border-checkerboard/20 border-t-tangerine animate-spin" />
    </div>
  );
}

export function App() {
  const location = useLocation();

  // Scroll to top or handle hash scroll on location change
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace('#', '');
      const el = document.getElementById(elementId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="font-sans bg-cream text-checkerboard antialiased selection:bg-tangerine selection:text-white min-h-screen flex flex-col overflow-x-hidden">
      {/* 1. Global Navbar */}
      <Navbar />

      {/* 2. Global Sliding Cart Drawer */}
      <CartDrawer />

      {/* 3. Main Content Router */}
      <div className="grow">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/collections" element={<CollectionsPage />} />
            <Route path="/collections/:slug" element={<CollectionRoute />} />
            <Route path="/products/:slug" element={<ProductRoute />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>

      {/* 4. Global Footer */}
      <Footer />
    </div>
  );
}

export default App;

