'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_CONFIG } from '@/config/brand';
import { useCartStore } from '@/store/useCartStore';
import { MagneticButton } from '@/components/ui/motion';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const { getTotalCount, setIsOpen } = useCartStore();
  const [cartCount, setCartCount] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCartCount(getTotalCount());
    const unsub = useCartStore.subscribe((state) => {
      setCartCount(state.items.reduce((acc, i) => acc + i.quantity, 0));
    });
    return () => unsub();
  }, [getTotalCount]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-3.5 sm:top-5 left-0 right-0 z-50 pointer-events-none flex justify-center px-3 sm:px-6">
      {/* Floating Island Container - Clean, borderless warm ivory glass */}
      <div
        ref={navRef}
        className={`pointer-events-auto w-full max-w-[1440px] transition-all duration-300 ease-out ${
          mobileMenuOpen
            ? 'rounded-3xl bg-[#FAF8F5]/98 shadow-[0_12px_40px_rgba(40,30,20,0.12)] py-4'
            : scrolled
            ? 'rounded-full bg-[#FAF8F5]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(40,30,20,0.08)] py-2.5 sm:py-3'
            : 'rounded-full bg-[#FAF8F5]/90 backdrop-blur-lg shadow-[0_6px_28px_rgba(40,30,20,0.06)] py-3 sm:py-3.5'
        } px-5 sm:px-8 md:px-10`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* 1. Left Area: Brand Wordmark */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex flex-col text-left focus:outline-hidden py-0.5 shrink-0"
            aria-label={`${BRAND_CONFIG.name} — Home`}
          >
            <span className="font-serif text-lg sm:text-xl md:text-2xl tracking-wider text-checkerboard group-hover:text-[#B6532D] transition-colors duration-200 font-semibold leading-tight">
              {BRAND_CONFIG.name}
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-widest text-[#62432F] uppercase font-medium -mt-0.5 opacity-85">
              Handcrafted Furniture
            </span>
          </Link>

          {/* 2. Center Area: Room Navigation with native Flexbox gap and whitespace protection */}
          <nav
            aria-label="Room navigation"
            onMouseLeave={() => setHoveredNav(null)}
            className="hidden xl:flex items-center gap-2 2xl:gap-5 text-xs font-sans tracking-[0.15em] uppercase text-checkerboard/85 font-medium shrink-0"
          >
            {BRAND_CONFIG.navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={() => setHoveredNav(item.label)}
                className="relative px-3 2xl:px-4 py-2 rounded-full whitespace-nowrap hover:text-[#B6532D] transition-colors duration-200 focus:outline-hidden focus-visible:text-[#B6532D] group shrink-0"
              >
                {hoveredNav === item.label && (
                  <motion.span
                    layoutId="navbar-hover-pill"
                    className="absolute inset-0 rounded-full bg-[#EDE5D8]/80 shadow-2xs -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <span className="relative z-10 whitespace-nowrap">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* 3. Right Area: Shopping Actions (Shop Furniture, Cart, Accessible Menu Toggle) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Shop Furniture Button (Warm pill without harsh border) */}
            <MagneticButton
              href="/collections"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-sans tracking-wide uppercase px-4 py-2 rounded-full text-[#62432F] hover:text-[#B6532D] bg-[#EDE5D8]/70 hover:bg-[#EDE5D8] font-medium transition-all shadow-2xs group shrink-0 whitespace-nowrap"
            >
              <span className="whitespace-nowrap">Shop Furniture</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#B6532D] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
            </MagneticButton>

            {/* Shopping Cart Button */}
            <MagneticButton
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 rounded-full bg-[#EDE5D8]/70 hover:bg-[#EDE5D8] text-[#62432F] hover:text-checkerboard shadow-2xs transition-all shrink-0"
              ariaLabel={`Shopping bag with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B6532D] text-white text-[10px] font-sans font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </MagneticButton>

            {/* Tablet & Mobile Accessible Menu Hamburger Toggle (< xl widths) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-[#62432F] hover:text-[#B6532D] transition-colors rounded-full hover:bg-[#EDE5D8]/70 focus:outline-hidden shrink-0"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Tablet & Mobile Dropdown Panel inside floating island structure (< xl) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="xl:hidden overflow-hidden pt-4 pb-2 border-t border-[#62432F]/10 mt-3 space-y-4"
            >
              <nav className="flex flex-col space-y-1.5" aria-label="Mobile and tablet room navigation">
                {BRAND_CONFIG.navigation.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + idx * 0.03, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-xs font-sans tracking-wide uppercase text-[#62432F] hover:text-[#B6532D] font-medium py-2.5 px-3.5 rounded-xl hover:bg-white/60 active:bg-white/80 transition-colors flex items-center justify-between group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{item.label}</span>
                      <span className="text-[10px] text-[#62432F]/50 uppercase group-hover:text-[#B6532D] transition-colors">Explore →</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, duration: 0.2 }}
                className="pt-3 border-t border-[#62432F]/10 flex flex-col gap-2"
              >
                <Link
                  href="/collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-[#B6532D] hover:bg-[#94320C] text-white font-medium px-4 py-3 rounded-full shadow-sm transition-colors"
                >
                  <span>Shop All Furniture</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
