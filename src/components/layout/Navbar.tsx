'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Link from '@/components/common/Link';
import { ShoppingBag, Menu, X, ArrowUpRight, Search, ChevronDown } from 'lucide-react';
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
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const { getTotalCount, setIsOpen } = useCartStore();
  const [cartCount, setCartCount] = useState(0);

  const navRef = useRef<HTMLElement>(null);
  const moreDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Keyboard shortcut: Cmd+K / Ctrl+K opens search, Escape closes mobile menu / dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        if (moreDropdownOpen) setMoreDropdownOpen(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moreDropdownOpen, mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-more-dropdown]')) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Active section tracking across the 9 canonical homepage sections
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const sectionIds = [
      'home',
      'residence-tour',
      'collections',
      'our-story',
      'materials-craft',
      'collectible-cars',
      'room-finder',
      'journal',
      'visit-us',
    ];

    const updateActiveSection = () => {
      // Check if scrolled near the bottom of page (Visit Us / Footer)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 160) {
        setActiveSection('visit-us');
        return;
      }

      const scrollPos = window.scrollY + 130; // 130px offset below header

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(id);
            return;
          }
        }
      }
      setActiveSection('home');
    };

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, [location.pathname]);

  const handleMobileNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setTimeout(() => {
      scrollToSection(href, 76);
    }, 60);
  };

  const handleDropdownEnter = () => {
    if (moreDropdownTimeoutRef.current) {
      clearTimeout(moreDropdownTimeoutRef.current);
      moreDropdownTimeoutRef.current = null;
    }
    setMoreDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    moreDropdownTimeoutRef.current = setTimeout(() => {
      setMoreDropdownOpen(false);
    }, 180);
  };

  // Split navigation items: 5 primary visible + 4 in More dropdown on desktop
  const primaryNavItems = BRAND_CONFIG.navigation.slice(0, 5);
  const secondaryNavItems = BRAND_CONFIG.navigation.slice(5);

  const isSecondaryActive = secondaryNavItems.some(
    (item) => item.href.replace(/^\/?#/, '') === activeSection
  );

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          scrolled
            ? 'bg-[#FBF9F5]/96 backdrop-blur-md border-b border-[#1A1816]/10 shadow-[0_4px_24px_rgba(26,24,22,0.04)] py-3 sm:py-3.5'
            : 'bg-[#FBF9F5]/90 backdrop-blur-sm border-b border-[#1A1816]/6 py-4 sm:py-5 lg:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex items-center justify-between gap-4">
          {/* 1. Brand Wordmark */}
          <Link
            href="/"
            onClick={() => {
              if (mobileMenuOpen) setMobileMenuOpen(false);
              scrollToSection('home', 76);
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

          {/* 2. Desktop Navigation with Considered 9-Section Layout */}
          <nav
            aria-label="Primary residence navigation"
            className="hidden md:flex items-center gap-5 lg:gap-7 text-xs font-sans tracking-[0.1em] uppercase font-medium shrink-0"
          >
            {/* Primary 5 Anchors */}
            {primaryNavItems.map((item) => {
              const targetKey = item.href.replace(/^\/?#/, '');
              const isActive = location.pathname === '/' && activeSection === targetKey;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group relative py-1 transition-colors duration-200 focus:outline-hidden ${
                    isActive ? 'text-[#C84D1B] font-semibold' : 'text-[#1A1816]/80 hover:text-[#1A1816]'
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

            {/* "More ▾" Dropdown for Remaining Sections (Clean, balanced layout) */}
            <div
              data-more-dropdown
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                onClick={() => setMoreDropdownOpen((prev) => !prev)}
                aria-expanded={moreDropdownOpen}
                aria-haspopup="true"
                className={`group relative inline-flex items-center space-x-1 py-1 transition-colors duration-200 focus:outline-hidden cursor-pointer ${
                  isSecondaryActive ? 'text-[#C84D1B] font-semibold' : 'text-[#1A1816]/80 hover:text-[#1A1816]'
                }`}
              >
                <span>More</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    moreDropdownOpen ? 'rotate-180 text-[#C84D1B]' : 'text-[#1A1816]/60 group-hover:text-[#1A1816]'
                  }`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-[#C84D1B] rounded-full transition-all duration-300 ease-out ${
                    isSecondaryActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {moreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute top-full left-0 mt-2 w-56 bg-[#FBF9F5] border border-[#1A1816]/12 rounded-2xl shadow-[0_12px_36px_rgba(26,24,22,0.12)] p-2 z-50 backdrop-blur-md"
                  >
                    <div className="flex flex-col space-y-1">
                      {secondaryNavItems.map((item, idx) => {
                        const targetKey = item.href.replace(/^\/?#/, '');
                        const isActive = location.pathname === '/' && activeSection === targetKey;

                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setMoreDropdownOpen(false)}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-sans tracking-wide transition-colors ${
                              isActive
                                ? 'bg-[#C84D1B]/10 text-[#C84D1B] font-semibold'
                                : 'text-[#1A1816]/80 hover:text-[#1A1816] hover:bg-[#1A1816]/5'
                            }`}
                          >
                            <span className="flex items-center space-x-2">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isActive ? 'bg-[#C84D1B]' : 'bg-[#1A1816]/20'
                                }`}
                              />
                              <span>{item.label}</span>
                            </span>
                            <span className="text-[10px] text-[#666059] font-mono">0{6 + idx}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* 3. Right Action Area: Search, Bag, Direct Catalogue CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center space-x-1.5 p-2 rounded-full text-[#1A1816]/80 hover:text-[#1A1816] hover:bg-[#1A1816]/5 transition-colors cursor-pointer"
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

            {/* Mobile Hamburger Toggle (>=44px touch target) */}
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
            {/* Backdrop Dismiss Button */}
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 w-full h-full bg-black/45 backdrop-blur-xs border-none cursor-pointer p-0"
              aria-label="Close navigation overlay"
            />

            {/* Drawer Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-md bg-[#FBF9F5] shadow-2xl flex flex-col justify-between overflow-y-auto px-6 py-6 border-l border-[#1A1816]/10"
            >
              {/* Drawer Top Bar */}
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

              {/* All 9 Major Navigation Destinations */}
              <div className="py-6 space-y-6">
                <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[#666059] block">
                  Residence Navigation
                </span>

                <nav className="flex flex-col space-y-1.5" aria-label="Mobile residence navigation">
                  {BRAND_CONFIG.navigation.map((item, idx) => {
                    const targetKey = item.href.replace(/^\/?#/, '');
                    const isActive = location.pathname === '/' && activeSection === targetKey;

                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 + idx * 0.025, duration: 0.2 }}
                      >
                        <button
                          type="button"
                          onClick={() => handleMobileNavClick(item.href)}
                          className={`w-full text-left font-serif text-xl sm:text-2xl py-2.5 px-3 rounded-xl flex items-center justify-between transition-colors min-h-[44px] group cursor-pointer ${
                            isActive
                              ? 'bg-[#C84D1B]/10 text-[#C84D1B] font-semibold'
                              : 'text-[#1A1816] hover:bg-[#1A1816]/5'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="font-mono text-xs text-[#666059] opacity-70">
                              0{idx + 1}
                            </span>
                            <span>{item.label}</span>
                          </div>
                          <ArrowUpRight
                            className={`w-4 h-4 transition-transform ${
                              isActive
                                ? 'text-[#C84D1B] translate-x-0.5 -translate-y-0.5'
                                : 'text-[#666059] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                            }`}
                          />
                        </button>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-6 border-t border-[#1A1816]/10 space-y-3.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="w-full inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-white border border-[#1A1816]/15 text-[#1A1816] font-semibold px-4 py-3 rounded-full shadow-2xs hover:bg-[#F2EFE9] transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-[#C84D1B]" />
                  <span>Search Furniture Collection</span>
                </button>

                <Link
                  href="/collections"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-[#1A1816] hover:bg-[#C84D1B] text-white font-semibold px-4 py-3 rounded-full shadow-sm transition-colors"
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
          </div>
        )}
      </AnimatePresence>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
