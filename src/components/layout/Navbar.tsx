'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Link from '@/components/common/Link';
import { ShoppingBag, Menu, X, ArrowUpRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_CONFIG } from '@/config/brand';
import { useCartStore } from '@/store/useCartStore';
import { SearchModal } from '@/components/discovery/SearchModal';
import { scrollToSection } from '@/utils/navigation';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const { getTotalCount, setIsOpen } = useCartStore();
  const [cartCount, setCartCount] = useState(0);
  const navRef = useRef<HTMLElement>(null);

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
      if (e.key === 'Escape') {
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (searchOpen) setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, searchOpen]);

  // Lock body scroll strictly when mobile menu is open, ensuring clean unlock on close
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [mobileMenuOpen]);

  // Active section tracking via IntersectionObserver on homepage
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sections = [
      { id: 'home', hash: 'home' },
      { id: 'residence-tour', hash: 'explore' },
      { id: 'collections', hash: 'collections' },
      { id: 'our-story', hash: 'our-story' },
      { id: 'materials', hash: 'materials' },
      { id: 'journal', hash: 'journal' },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            const found = sections.find((s) => s.id === entry.target.id);
            if (found) {
              setActiveSection(found.hash);
            }
          }
        });
      },
      {
        rootMargin: '-80px 0px -50% 0px',
        threshold: [0.1, 0.25, 0.5],
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  const handleMobileNavClick = (href: string) => {
    setMobileMenuOpen(false);
    // Allow state to update and body lock to release before scrolling
    setTimeout(() => {
      if (href.startsWith('/#') || href.startsWith('#')) {
        scrollToSection(href, 76);
      }
    }, 60);
  };

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          scrolled
            ? 'bg-[#FBF9F5]/94 backdrop-blur-md border-b border-[#1A1816]/8 shadow-[0_4px_24px_rgba(26,24,22,0.03)] py-3 sm:py-3.5'
            : 'bg-[#FBF9F5]/85 backdrop-blur-xs border-b border-transparent py-4 sm:py-5 lg:py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between gap-4">
          {/* 1. Brand Wordmark */}
          <Link
            href="/"
            onClick={() => {
              if (mobileMenuOpen) setMobileMenuOpen(false);
              scrollToSection('home');
            }}
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

          {/* 2. Desktop Navigation Links with Active State */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-5 lg:gap-8 text-xs font-sans tracking-[0.1em] uppercase shrink-0 font-medium"
          >
            {BRAND_CONFIG.navigation.map((item) => {
              const targetKey = item.href.replace(/^\/?#/, '');
              const isActive = location.pathname === '/' && (activeSection === targetKey || (targetKey === 'explore' && activeSection === 'residence-tour'));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group relative py-1 transition-colors duration-200 focus:outline-hidden ${
                    isActive ? 'text-[#C84D1B] font-semibold' : 'text-[#1A1816]/75 hover:text-[#1A1816]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-[#C84D1B] rounded-full transition-all duration-300 ease-out ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Action Area: Search, Bag, Direct Catalogue CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center space-x-1.5 p-2 rounded-full text-[#1A1816]/75 hover:text-[#1A1816] hover:bg-[#1A1816]/5 transition-colors cursor-pointer"
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
              className="relative p-2 rounded-full text-[#1A1816]/85 hover:text-[#C84D1B] hover:bg-[#1A1816]/5 transition-colors shrink-0 cursor-pointer"
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

            {/* Mobile Hamburger Toggle with 48px touch target */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1A1816] hover:text-[#C84D1B] transition-colors rounded-full hover:bg-[#1A1816]/5 focus:outline-hidden shrink-0 cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Navigation Drawer & Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
            {/* Backdrop Dismiss Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Drawer Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-md bg-[#FBF9F5] shadow-2xl flex flex-col justify-between overflow-y-auto px-6 py-6 border-l border-[#1A1816]/10"
            >
              {/* Drawer Top Row: Wordmark & Close Button */}
              <div className="flex items-center justify-between pb-5 border-b border-[#1A1816]/10">
                <div className="flex flex-col text-left">
                  <span className="font-serif text-lg tracking-[0.06em] text-[#1A1816] font-semibold leading-tight">
                    {BRAND_CONFIG.name}
                  </span>
                  <span className="font-sans text-[9px] uppercase tracking-[0.24em] text-[#666059]">
                    Atelier & Residence
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1A1816] hover:text-[#C84D1B] rounded-full hover:bg-[#1A1816]/5 transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="py-6 space-y-6">
                <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#666059] block">
                  Residence Navigation
                </span>

                <nav className="flex flex-col space-y-2" aria-label="Mobile residence navigation">
                  {BRAND_CONFIG.navigation.map((item, idx) => {
                    const targetKey = item.href.replace(/^\/?#/, '');
                    const isActive = location.pathname === '/' && (activeSection === targetKey || (targetKey === 'explore' && activeSection === 'residence-tour'));

                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 + idx * 0.03, duration: 0.2 }}
                      >
                        <button
                          onClick={() => handleMobileNavClick(item.href)}
                          className={`w-full text-left font-serif text-2xl py-3 px-3 rounded-xl flex items-center justify-between transition-colors min-h-[48px] group cursor-pointer ${
                            isActive
                              ? 'text-[#C84D1B] bg-[#C84D1B]/8 font-medium'
                              : 'text-[#1A1816] hover:text-[#C84D1B] hover:bg-[#1A1816]/4'
                          }`}
                        >
                          <span className="flex items-center space-x-3">
                            {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />}
                            <span>{item.label}</span>
                          </span>
                          <ArrowUpRight
                            className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                              isActive ? 'text-[#C84D1B] opacity-100' : 'text-[#666059] opacity-40 group-hover:opacity-100'
                            }`}
                          />
                        </button>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Actions: Search, Complete Catalogue & Bag */}
              <div className="pt-6 border-t border-[#1A1816]/10 space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSearchOpen(true);
                    }}
                    className="inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-white border border-[#1A1816]/15 text-[#1A1816] font-semibold px-4 py-3 rounded-full shadow-2xs hover:bg-[#F2EFE9] transition-colors min-h-[44px] cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-[#C84D1B]" />
                    <span>Search</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsOpen(true);
                    }}
                    className="inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-white border border-[#1A1816]/15 text-[#1A1816] font-semibold px-4 py-3 rounded-full shadow-2xs hover:bg-[#F2EFE9] transition-colors min-h-[44px] cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C84D1B]" />
                    <span>Bag ({cartCount})</span>
                  </button>
                </div>

                <Link
                  href="/collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-[#1A1816] hover:bg-[#C84D1B] text-white font-semibold px-4 py-3.5 rounded-full shadow-sm transition-colors min-h-[48px]"
                >
                  <span>Explore Complete Catalogue</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                </Link>

                <div className="text-center pt-2 text-[#666059]">
                  <p className="font-serif text-xs text-[#1A1816] font-medium">Flagship Experience Store</p>
                  <p className="text-[11px] mt-0.5">100 Feet Road, Indiranagar, Bengaluru</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
