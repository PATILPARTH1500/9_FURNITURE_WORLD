'use client';

import React, { useState } from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import { ArrowUpRight, Layers } from 'lucide-react';
import { PRODUCTS_CATALOG, COLLECTIONS_DATA } from '@/data/catalog';
import { formatPrice } from '@/config/brand';

type CategoryFilter = 'all' | 'seating' | 'tables' | 'beds' | 'lighting';

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Pieces' },
  { id: 'seating', label: 'Sofas & Seating' },
  { id: 'tables', label: 'Dining & Accent Tables' },
  { id: 'beds', label: 'Bedrooms' },
  { id: 'lighting', label: 'Architectural Lighting' },
];

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filteredProducts =
    activeCategory === 'all'
      ? PRODUCTS_CATALOG
      : PRODUCTS_CATALOG.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-cream text-checkerboard pt-32 pb-24 relative overflow-hidden bg-architectural-grid">
      <div className="absolute inset-0 bg-fine-grain pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-tangerine" />
            <span className="font-mono text-xs uppercase tracking-widest text-tangerine font-semibold">
              Permanent Collection
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-checkerboard font-semibold tracking-tight">
            Furniture for Every Living Space
          </h1>
          <p className="text-sm sm:text-base text-walnut leading-relaxed font-normal">
            Sculptural lounge chairs, solid American walnut dining tables, ambient mouth-blown lighting, and serene bedroom suites crafted for mindful living and architectural longevity.
          </p>
        </div>

        {/* Featured Series Hero Cards */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-checkerboard/10">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-tangerine" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-checkerboard font-semibold">
                Curated Design Suites
              </h2>
            </div>
            <span className="font-mono text-xs text-walnut">3 Suites</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLLECTIONS_DATA.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="group relative h-[380px] rounded-2xl border border-checkerboard/15 flex flex-col justify-end p-8 overflow-hidden transition-all duration-300 hover:border-tangerine shadow-retro hover:shadow-warm"
              >
                <Image
                  src={col.coverImage}
                  alt={col.title}
                  fill
                  className="object-cover brightness-[0.72] group-hover:brightness-[0.82] transition-all duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-checkerboard/95 via-checkerboard/45 to-transparent" />
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-mustard font-semibold bg-checkerboard/70 border border-mustard/30 px-2.5 py-0.5 rounded-sm inline-block backdrop-blur-xs">
                      {col.productCount} Designs
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-white group-hover:text-mustard transition-colors font-medium">
                    {col.title}
                  </h3>
                  <p className="text-xs text-cream-light font-light line-clamp-2 leading-relaxed">
                    {col.subtitle}
                  </p>
                  <div className="pt-2 flex items-center space-x-1.5 text-xs uppercase tracking-wider text-mustard group-hover:text-white transition-colors font-semibold">
                    <span>Inspect Suite</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-12 border-b border-checkerboard/15">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs font-sans uppercase tracking-wider font-semibold">
            {CATEGORY_TABS.map((tab) => {
              const count =
                tab.id === 'all'
                  ? PRODUCTS_CATALOG.length
                  : PRODUCTS_CATALOG.filter((p) => p.category === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`py-2 px-4 rounded-full transition-all flex items-center space-x-1.5 ${
                    activeCategory === tab.id
                      ? 'text-white bg-tangerine shadow-xs'
                      : 'text-walnut bg-white/80 hover:bg-white border border-checkerboard/10'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                      activeCategory === tab.id ? 'bg-white/20 text-white' : 'bg-cream text-walnut'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="font-mono text-xs text-walnut font-medium">
            Showing {filteredProducts.length} Architectural Pieces
          </span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex flex-col rounded-2xl border border-checkerboard/10 bg-white/95 backdrop-blur-xs overflow-hidden hover:border-tangerine/60 transition-all duration-300 shadow-retro hover:shadow-warm"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
                <Image
                  src={product.images.hero}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="font-sans text-[11px] uppercase tracking-wider text-tangerine font-semibold block mb-1">
                    {product.category}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-xl text-checkerboard group-hover:text-tangerine transition-colors font-semibold">
                      {product.name}
                    </h3>
                    <span className="font-sans text-base font-bold text-tangerine">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <p className="text-xs text-walnut mt-1.5 line-clamp-2 leading-relaxed">
                    {product.subtitle}
                  </p>
                </div>

                {/* Swatches preview */}
                <div className="flex items-center space-x-1.5 pt-2">
                  {product.materials.woodOptions.slice(0, 3).map((w) => (
                    <span
                      key={w.id}
                      title={w.name}
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: w.colorHex }}
                    />
                  ))}
                  {product.materials.upholsteryOptions.length > 0 && (
                    <>
                      <span className="text-walnut/30 text-xs px-0.5">/</span>
                      {product.materials.upholsteryOptions.slice(0, 3).map((f) => (
                        <span
                          key={f.id}
                          title={f.name}
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{ backgroundColor: f.colorHex }}
                        />
                      ))}
                    </>
                  )}
                  <span className="text-[10px] font-mono text-walnut/70 pl-1">
                    +{product.materials.woodOptions.length + product.materials.upholsteryOptions.length} finishes
                  </span>
                </div>

                <div className="pt-4 border-t border-checkerboard/10 flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider text-xs font-semibold text-checkerboard group-hover:text-tangerine flex items-center space-x-1 transition-colors">
                    <span>Inspect Piece</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-tangerine transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                  <span className="text-xs text-walnut font-medium">
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
