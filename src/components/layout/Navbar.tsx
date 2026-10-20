'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, ArrowUpRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_CONFIG } from '@/config/brand';
import { useCartStore } from '@/store/useCartStore';
import dynamic from 'next/dynamic';
import { MagneticButton } from '@/components/ui/motion';

const BrandFilmModal = dynamic(
  () => import('@/components/media/BrandFilmModal').then((mod) => mod.BrandFilmModal),
  { ssr: false }
);

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [filmModalOpen, setFilmModalOpen] = useState(false);
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
      {/* Floating Island Container */}
      <div
        ref={navRef}
        className={`pointer-events-auto w-full max-w-[1440px] transition-all duration-300 ease-out ${
          mobileMenuOpen
            ? 'rounded-3xl bg-[#E8DDC9]/96 shadow-[0_12px_40px_rgba(98,67,47,0.14)] border border-[#62432F]/20 py-4'
            : scrolled
            ? 'rounded-full bg-[#E8DDC9]/95 backdrop-blur-xl shadow-[0_12px_36px_rgba(98,67,47,0.12)] border border-[#62432F]/15 py-2.5 sm:py-3'
            : 'rounded-full bg-[#E8DDC9]/88 backdrop-blur-lg shadow-[0_8px_30px_rgba(98,67,47,0.08)] border border-[#62432F]/12 py-3 sm:py-3.5'
        } px-4 sm:px-7 md:px-8`}
      >
        <div className="flex items-center justify-between">
          {/* 1. Left Area: Brand Wordmark */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex flex-col text-left focus:outline-hidden py-0.5"
            aria-label={`${BRAND_CONFIG.name} — Home`}
          >
            <span className="font-serif text-lg sm:text-xl md:text-2xl tracking-wider text-checkerboard group-hover:text-[#B6532D] transition-colors duration-200 font-semibold leading-tight">
              {BRAND_CONFIG.name}
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-widest text-[#62432F] uppercase font-medium -mt-0.5 opacity-85">
              Handcrafted Furniture
            </span>
          </Link>

          {/* 2. Center Area: Room Navigation */}
          <nav
            aria-label="Room navigation"
            onMouseLeave={() => setHoveredNav(null)}
            className="hidden lg:flex items-center space-x-1 xl:space-x-2 text-xs font-sans tracking-wide uppercase text-checkerboard/85 font-medium"
          >
            {BRAND_CONFIG.navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={() => setHoveredNav(item.label)}
                className="relative px-3.5 py-1.5 rounded-full hover:text-[#B6532D] transition-colors duration-200 focus:outline-hidden focus-visible:text-[#B6532D]"
              >
                {hoveredNav === item.label && (
                  <motion.span
                    layoutId="navbar-hover-pill"
                    className="absolute inset-0 rounded-full bg-white/70 shadow-2xs -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* 3. Right Area: Shopping Actions (Watch Film, Shop Furniture, Cart, Mobile Toggle) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Watch Film Action */}
            <MagneticButton
              onClick={() => setFilmModalOpen(true)}
              className="hidden md:inline-flex items-center space-x-1.5 text-xs font-sans tracking-wide uppercase px-3 py-1.5 rounded-full text-[#62432F] hover:text-[#B6532D] hover:bg-white/50 border border-transparent hover:border-[#62432F]/10 transition-all font-medium group"
              ariaLabel="Watch cinematic brand film"
            >
              <span className="w-5 h-5 rounded-full bg-[#B6532D]/10 flex items-center justify-center transition-transform group-hover:scale-110">
                <Play className="w-2.5 h-2.5 text-[#B6532D] fill-current translate-x-0.5" />
              </span>
              <span>Watch Film</span>
            </MagneticButton>

            {/* Shop Furniture Button (Subtle outlined pill with burnt-orange arrow) */}
            <MagneticButton
              href="/collections"
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-sans tracking-wide uppercase px-4 py-2 rounded-full border border-[#62432F]/20 hover:border-[#B6532D] text-[#62432F] hover:text-[#B6532D] bg-white/40 hover:bg-white font-medium transition-all shadow-2xs group"
            >
              <span>Shop Furniture</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#B6532D] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>

            {/* Shopping Cart Button */}
            <MagneticButton
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 rounded-full bg-white/50 hover:bg-white text-[#62432F] hover:text-checkerboard border border-[#62432F]/15 shadow-2xs transition-all"
              ariaLabel={`Shopping bag with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B6532D] text-white text-[10px] font-sans font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </MagneticButton>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#62432F] hover:text-[#B6532D] transition-colors rounded-full hover:bg-white/40 focus:outline-hidden"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel inside the floating island structure */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden overflow-hidden pt-4 pb-2 border-t border-[#62432F]/10 mt-3 space-y-4"
            >
              <nav className="flex flex-col space-y-1.5" aria-label="Mobile room navigation">
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
                      className="text-xs font-sans tracking-wide uppercase text-[#62432F] hover:text-[#B6532D] font-medium py-2 px-3 rounded-xl hover:bg-white/50 active:bg-white/70 transition-colors flex items-center justify-between group"
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
                transition={{ delay: 0.2, duration: 0.2 }}
                className="pt-3 border-t border-[#62432F]/10 flex flex-col sm:flex-row gap-2"
              >
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setFilmModalOpen(true);
                  }}
                  className="w-full inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider border border-[#62432F]/20 bg-white/70 hover:bg-white text-[#62432F] font-medium px-4 py-2.5 rounded-full shadow-2xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-[#B6532D] fill-current" />
                  <span>Watch Brand Film</span>
                </button>

                <Link
                  href="/collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-[#B6532D] hover:bg-[#94320C] text-white font-medium px-4 py-2.5 rounded-full shadow-sm transition-colors"
                >
                  <span>Shop All Furniture</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen Brand Film Modal */}
      <BrandFilmModal isOpen={filmModalOpen} onClose={() => setFilmModalOpen(false)} />
    </header>
  );
};
