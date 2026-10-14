'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PRODUCTS_CATALOG, COLLECTIONS_DATA } from '@/data/catalog';

type CategoryFilter = 'all' | 'seating' | 'tables' | 'beds' | 'lighting';

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Pieces' },
  { id: 'seating', label: 'Sofas & Seating' },
  { id: 'tables', label: 'Dining & Coffee Tables' },
  { id: 'beds', label: 'Beds' },
  { id: 'lighting', label: 'Lighting' },
];

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filteredProducts =
    activeCategory === 'all'
      ? PRODUCTS_CATALOG
      : PRODUCTS_CATALOG.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-cream text-checkerboard pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-2xl space-y-4 mb-16">
          <span className="font-sans text-xs tracking-wider uppercase text-tangerine font-semibold bg-white/80 px-3.5 py-1.5 rounded-full border border-tangerine/20 inline-block shadow-2xs">
            Furniture Village Collections
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-checkerboard font-semibold tracking-tight">
            Furniture for Every Room
          </h1>
          <p className="text-sm sm:text-base text-walnut leading-relaxed font-normal">
            Explore our complete range of comfortable seating, solid walnut dining tables, cheerful pendant lighting, and thoughtful home pieces made for everyday living.
          </p>
        </div>

        {/* Featured Series Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {COLLECTIONS_DATA.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group relative h-[360px] rounded-2xl border border-checkerboard/15 flex flex-col justify-end p-8 overflow-hidden transition-all duration-300 hover:border-tangerine shadow-retro hover:shadow-warm"
            >
              <Image
                src={col.coverImage}
                alt={col.title}
                fill
                className="object-cover brightness-[0.75] group-hover:brightness-[0.85] transition-all duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-checkerboard/90 via-checkerboard/40 to-transparent" />
              <div className="relative z-10 space-y-2">
                <span className="font-sans text-[11px] uppercase tracking-wider text-mustard font-semibold bg-checkerboard/60 px-2.5 py-0.5 rounded-sm inline-block">
                  {col.productCount} Designs
                </span>
                <h3 className="font-serif text-2xl text-white group-hover:text-mustard transition-colors font-medium">
                  {col.title}
                </h3>
                <p className="text-xs text-cream-light font-light line-clamp-2 leading-relaxed">{col.subtitle}</p>
                <div className="pt-2 flex items-center space-x-1.5 text-xs uppercase tracking-wider text-mustard group-hover:text-white transition-colors font-semibold">
                  <span>View Collection</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-12 border-b border-checkerboard/15">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs font-sans uppercase tracking-wider font-semibold">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`py-2 px-4 rounded-full transition-all ${
                  activeCategory === tab.id
                    ? 'text-white bg-tangerine shadow-xs'
                    : 'text-walnut bg-white/70 hover:bg-white border border-checkerboard/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="font-sans text-xs text-walnut font-medium">
            {filteredProducts.length} Pieces Available
          </span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex flex-col rounded-2xl border border-checkerboard/10 bg-white overflow-hidden hover:border-tangerine/50 transition-all duration-300 shadow-retro hover:shadow-warm"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
                <Image
                  src={product.images.hero}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-cream/90 backdrop-blur-xs border border-checkerboard/10 px-3 py-1 rounded-full text-xs font-sans font-semibold tracking-wider text-checkerboard shadow-2xs capitalize">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-xl text-checkerboard group-hover:text-tangerine transition-colors font-medium">
                      {product.name}
                    </h3>
                    <span className="font-sans text-base font-bold text-tangerine">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-walnut mt-1.5 line-clamp-2 leading-relaxed">
                    {product.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-checkerboard/10 flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider text-xs font-semibold text-checkerboard group-hover:text-tangerine flex items-center space-x-1 transition-colors">
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-tangerine" />
                  </span>
                  <span className="text-xs text-walnut">
                    {product.designer}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
