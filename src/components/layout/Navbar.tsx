'use client';

import React, { useState, useEffect } from 'react';
import Link from '@/components/common/Link';
import { ShoppingBag, Menu, X, ArrowUpRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_CONFIG } from '@/config/brand';
import { useCartStore } from '@/store/useCartStore';
import { SearchModal } from '@/components/discovery/SearchModal';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
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
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut: Cmd+K / Ctrl+K opens search, Escape closes mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          scrolled
            ? 'bg-[#FBF9F5]/92 backdrop-blur-md border-b border-[#1A1816]/8 shadow-[0_4px_24px_rgba(26,24,22,0.03)] py-3 sm:py-3.5'
            : 'bg-[#FBF9F5]/80 backdrop-blur-xs border-b border-transparent py-4 sm:py-5 lg:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between gap-4">
          {/* 1. Brand Wordmark */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex flex-col text-left focus:outline-hidden shrink-0"
            aria-label={`${BRAND_CONFIG.name} — Home`}
          >
            <span className="font-serif text-lg sm:text-xl lg:text-2xl tracking-[0.06em] text-[#1A1816] group-hover:text-[#C84D1B] transition-colors duration-200 font-semibold leading-tight">
              {BRAND_CONFIG.name}
            </span>
            <span className="font-sans text-[9px] uppercase tracking-[0.24em] text-[#666059] block -mt-0.5">
              Atelier & Residence
            </span>
          </Link>

          {/* 2. Room Navigation Links */}
          <nav
            aria-label="Room categories"
            className="hidden md:flex items-center gap-5 lg:gap-8 text-xs font-sans tracking-[0.1em] uppercase text-[#1A1816]/75 font-medium shrink-0"
          >
            {BRAND_CONFIG.navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group relative py-1 hover:text-[#1A1816] transition-colors duration-200 focus:outline-hidden"
              >
                <span>{item.label}</span>
                <span
                  className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#C84D1B] rounded-full transition-all duration-300 ease-out group-hover:w-full"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </nav>

          {/* 3. Right Action Area: Search, Bag, Direct Catalogue CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center space-x-1.5 p-2 rounded-full text-[#1A1816]/75 hover:text-[#1A1816] hover:bg-[#1A1816]/5 transition-colors"
              aria-label="Search furniture collection"
              title="Search (Cmd+K)"
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="hidden xl:inline text-xs font-sans tracking-wide uppercase text-[#666059]">
                Search
              </span>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 rounded-full text-[#1A1816]/85 hover:text-[#C84D1B] hover:bg-[#1A1816]/5 transition-colors shrink-0"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#C84D1B] text-white text-[10px] font-sans font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Catalogue Direct CTA */}
            <Link
              href="/collections"
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-sans uppercase tracking-wider font-semibold text-white bg-[#1A1816] hover:bg-[#C84D1B] px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300 shadow-xs group shrink-0"
            >
              <span>Explore Works</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#1A1816] hover:text-[#C84D1B] transition-colors rounded-full hover:bg-[#1A1816]/5 focus:outline-hidden shrink-0"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Full-Overlay Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed inset-x-0 top-[60px] sm:top-[68px] bottom-0 bg-[#FBF9F5] border-t border-[#1A1816]/8 px-6 py-8 flex flex-col justify-between overflow-y-auto z-40"
            >
              <div className="space-y-6">
                <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#666059] block">
                  Showroom Galleries
                </span>

                <nav className="flex flex-col space-y-3" aria-label="Mobile room navigation">
                  {BRAND_CONFIG.navigation.map((item, idx) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + idx * 0.03, duration: 0.2 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="font-serif text-2xl text-[#1A1816] hover:text-[#C84D1B] transition-colors py-1 flex items-center justify-between group"
                      >
                        <span>{item.label}</span>
                        <ArrowUpRight className="w-4 h-4 text-[#666059] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              <div className="pt-8 border-t border-[#1A1816]/10 space-y-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="w-full inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-white border border-[#1A1816]/15 text-[#1A1816] font-semibold px-4 py-3 rounded-full shadow-2xs hover:bg-[#F2EFE9] transition-colors"
                >
                  <Search className="w-3.5 h-3.5 text-[#C84D1B]" />
                  <span>Search Furniture Collection</span>
                </button>

                <Link
                  href="/collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-[#1A1816] hover:bg-[#C84D1B] text-white font-semibold px-4 py-3.5 rounded-full shadow-sm transition-colors"
                >
                  <span>Explore Complete Catalogue</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                </Link>

                <div className="text-center pt-2">
                  <p className="font-serif text-sm text-[#1A1816] font-medium">Flagship Showroom</p>
                  <p className="text-xs text-[#666059] mt-0.5">100 Feet Road, Indiranagar, Bengaluru</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
