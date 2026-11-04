'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import { Search, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { PRODUCTS_CATALOG } from '@/data/catalog';
import { formatPrice } from '@/config/brand';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = PRODUCTS_CATALOG.filter((p) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.materials.woodOptions.some((w) => w.name.toLowerCase().includes(q)) ||
      p.materials.upholsteryOptions.some((u) => u.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#FAF8F5] border border-checkerboard/15 shadow-[0_24px_60px_rgba(0,0,0,0.3)] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Architectural Search Bar */}
        <div className="p-4 sm:p-6 border-b border-checkerboard/10 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-tangerine shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by furniture, room, timber, or bouclé..."
            className="w-full font-sans text-sm sm:text-base text-checkerboard bg-transparent placeholder:text-walnut/50 outline-hidden"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full hover:bg-cream text-walnut transition-colors"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="hidden sm:inline-block text-[10px] uppercase font-sans tracking-wider px-2 py-0.5 rounded bg-cream border border-checkerboard/10 text-walnut/70">
              ESC
            </span>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-cream text-walnut hover:text-checkerboard transition-colors ml-1"
            aria-label="Close search modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Pill Suggestions */}
        <div className="px-4 sm:px-6 py-2.5 bg-cream/50 border-b border-checkerboard/8 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-sans">
          <span className="text-[10px] uppercase tracking-wider text-walnut/70 font-semibold mr-1 shrink-0">
            Suggested:
          </span>
          {['Bouclé', 'Walnut', 'Seating', 'Tables', 'Bed', 'Oak'].map((term) => (
            <button
              key={term}
              onClick={() => setQuery(term)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-white/80 border border-checkerboard/10 text-checkerboard text-[11px] font-medium transition-colors whitespace-nowrap"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-checkerboard/8">
          {filtered.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <p className="font-serif text-lg text-checkerboard">No matching furniture found</p>
              <p className="text-xs text-walnut">Try searching for &quot;chair&quot;, &quot;table&quot;, or &quot;velvet&quot;.</p>
            </div>
          ) : (
            filtered.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group hover:bg-white/60 -mx-2 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-cream-dark shrink-0 border border-checkerboard/10">
                    <Image
                      src={product.images.hero}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-serif text-sm sm:text-base font-semibold text-checkerboard group-hover:text-tangerine transition-colors truncate">
                        {product.name}
                      </span>
                      <span className="text-[10px] uppercase font-sans tracking-wider px-2 py-0.2 rounded-full bg-cream border border-checkerboard/10 text-walnut shrink-0">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-xs text-walnut truncate font-normal">
                      {product.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center space-x-3">
                  <span className="font-serif text-sm font-semibold text-checkerboard">
                    {formatPrice(product.price)}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-cream group-hover:bg-tangerine text-walnut group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-white border-t border-checkerboard/10 px-6 flex items-center justify-between text-[11px] font-sans text-walnut">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-tangerine" />
            <span>Furniture World Atelier Catalog</span>
          </div>
          <Link
            href="/collections"
            onClick={onClose}
            className="hover:text-tangerine font-medium transition-colors"
          >
            Browse All Collections →
          </Link>
        </div>
      </div>
    </div>
  );
};

