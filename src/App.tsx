import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

// Pages
import HomePage from '@/app/page';
import CollectionsPage from '@/app/collections/page';
import CollectionRoute from '@/pages/CollectionDetailPage';
import ProductRoute from '@/pages/ProductDetailPage';
import CartPage from '@/app/cart/page';
import NotFoundPage from '@/pages/NotFoundPage';

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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:slug" element={<CollectionRoute />} />
          <Route path="/products/:slug" element={<ProductRoute />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>

      {/* 4. Global Footer */}
      <Footer />
    </div>
  );
}

export default App;
