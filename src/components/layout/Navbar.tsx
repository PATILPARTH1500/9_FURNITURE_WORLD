'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, ArrowUpRight, Play } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';
import { useCartStore } from '@/store/useCartStore';
import { BrandFilmModal } from '@/components/media/BrandFilmModal';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filmModalOpen, setFilmModalOpen] = useState(false);
  const { getTotalCount, setIsOpen } = useCartStore();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(getTotalCount());
    const unsub = useCartStore.subscribe((state) => {
      setCartCount(state.items.reduce((acc, i) => acc + i.quantity, 0));
    });
    return () => unsub();
  }, [getTotalCount]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        mobileMenuOpen
          ? 'bg-cream/95 backdrop-blur-md border-b border-checkerboard/10 py-4 shadow-sm'
          : scrolled
          ? 'bg-cream/90 backdrop-blur-md border-b border-checkerboard/10 py-3.5 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex flex-col text-left focus:outline-hidden"
        >
          <span className="font-serif text-xl sm:text-2xl tracking-wider text-checkerboard group-hover:text-tangerine transition-colors duration-200 font-semibold">
            {BRAND_CONFIG.name}
          </span>
          <span className="text-[10px] tracking-widest text-walnut uppercase -mt-0.5 font-medium">
            Handcrafted Furniture
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-7 text-xs font-sans tracking-wide uppercase text-checkerboard/80 font-medium">
          {BRAND_CONFIG.navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="hover:text-tangerine transition-colors duration-200 py-1 relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-tangerine transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Actions: Catalog, Watch Film & Cart */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={() => setFilmModalOpen(true)}
            className="hidden lg:inline-flex items-center space-x-1.5 text-xs font-sans tracking-wide uppercase px-3.5 py-2 rounded-full text-checkerboard/80 hover:text-tangerine hover:bg-white/60 border border-transparent hover:border-checkerboard/10 transition-all font-medium"
          >
            <Play className="w-3.5 h-3.5 text-tangerine fill-current" />
            <span>Watch Film</span>
          </button>

          <Link
            href="/collections"
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-sans tracking-wide uppercase px-4 py-2 rounded-full border border-checkerboard/20 hover:border-tangerine text-checkerboard hover:text-tangerine font-medium transition-all"
          >
            <span>Shop Furniture</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-tangerine" />
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2.5 rounded-full bg-cream-light hover:bg-white text-checkerboard border border-checkerboard/15 shadow-xs transition-colors"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4 text-checkerboard" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-tangerine text-white text-[10px] font-sans font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-checkerboard hover:text-tangerine transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream border-b border-checkerboard/10 px-6 py-6 space-y-4 animate-in fade-in duration-200 shadow-md">
          <nav className="flex flex-col space-y-3">
            {BRAND_CONFIG.navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-sans tracking-wide uppercase text-checkerboard hover:text-tangerine font-medium py-1.5 border-b border-checkerboard/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setFilmModalOpen(true);
              }}
              className="w-full inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider border border-checkerboard/20 bg-white text-checkerboard font-medium px-5 py-3 rounded-full shadow-xs"
            >
              <Play className="w-3.5 h-3.5 text-tangerine fill-current" />
              <span>Watch Brand Film</span>
            </button>

            <Link
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-tangerine text-white font-medium px-5 py-3 rounded-full shadow-sm"
            >
              <span>Shop All Furniture</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Fullscreen Brand Film Modal */}
      <BrandFilmModal isOpen={filmModalOpen} onClose={() => setFilmModalOpen(false)} />
    </header>
  );
};
