'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, ArrowUpRight } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';
import { useCartStore } from '@/store/useCartStore';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          mobileMenuOpen
            ? 'bg-charcoal-950 border-b border-white/5 py-4'
            : scrolled
            ? 'bg-charcoal-950/85 backdrop-blur-md border-b border-white/5 py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex flex-col tracking-widest text-left"
          >
            <span className="font-serif text-xl md:text-2xl tracking-[0.25em] text-ivory uppercase group-hover:text-accent transition-colors duration-300">
              {BRAND_CONFIG.shortName}
            </span>
            <span className="text-[9px] tracking-[0.3em] text-sand-400 uppercase -mt-0.5">
              ATELIER COPENHAGEN
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-xs tracking-widest uppercase text-sand-200">
            {BRAND_CONFIG.navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="hover:text-white transition-colors duration-200 py-1 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions: Cart & Mobile Menu */}
          <div className="flex items-center space-x-6">
            <Link
              href="/collections"
              className="hidden lg:inline-flex items-center space-x-1.5 text-[11px] uppercase tracking-widest text-sand-300 hover:text-white border border-white/10 px-3.5 py-1.5 rounded-none transition-all duration-200 hover:border-white/30"
            >
              <span>Catalog</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-ivory hover:text-accent transition-colors duration-200"
              aria-label={`Shopping bag with ${cartCount} items`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.25]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-0 w-4 h-4 rounded-full bg-accent text-charcoal-950 font-mono text-[10px] font-semibold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-ivory"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-charcoal-950 md:hidden flex flex-col justify-between p-8 pt-28 overflow-y-auto">
          <nav className="flex flex-col space-y-6 text-base tracking-[0.2em] uppercase font-serif text-sand-100">
            {BRAND_CONFIG.navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-white/5 hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 border-b border-white/5 hover:text-accent transition-colors text-accent"
            >
              All Collections →
            </Link>
          </nav>

          <div className="border-t border-white/10 pt-6 text-xs text-sand-400 space-y-2">
            <p className="font-serif italic">{BRAND_CONFIG.tagline}</p>
            <p className="tracking-widest uppercase text-[10px] text-sand-500">
              {BRAND_CONFIG.contact.showroom}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

