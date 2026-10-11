'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { PRODUCTS_CATALOG, COLLECTIONS_DATA } from '@/data/catalog';

type CategoryFilter = 'all' | 'seating' | 'tables' | 'lighting';

export default function CollectionsPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filteredProducts =
    activeCategory === 'all'
      ? PRODUCTS_CATALOG
      : PRODUCTS_CATALOG.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-charcoal-950 text-sand-100 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-2xl space-y-4 mb-16">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent">
            ARCHETYP PERMANENT REPERTOIRE
          </span>
          <h1 className="font-serif text-5xl md:text-6xl text-ivory font-light tracking-tight">
            The Collections
          </h1>
          <p className="text-sm text-sand-300 font-light leading-relaxed">
            Explorations in proportion, gravity, and sustainable timber joinery. Each edition is
            individually serialized and produced in limited seasonal releases.
          </p>
        </div>

        {/* Featured Series Hero Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {COLLECTIONS_DATA.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group relative h-[340px] border border-white/10 flex flex-col justify-end p-8 overflow-hidden transition-all duration-500 hover:border-accent/40"
            >
              <Image
                src={col.coverImage}
                alt={col.title}
                fill
                className="object-cover brightness-[0.65] group-hover:brightness-[0.75] transition-all duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="relative z-10 space-y-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-accent">
                  Series Dossier
                </span>
                <h3 className="font-serif text-2xl text-ivory group-hover:text-accent transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-sand-300 font-light line-clamp-2">{col.subtitle}</p>
                <div className="pt-2 flex items-center space-x-1.5 text-[11px] uppercase tracking-widest text-sand-400 group-hover:text-white transition-colors">
                  <span>Explore Series</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-12 border-b border-white/10">
          <div className="flex items-center space-x-2 md:space-x-6 text-xs uppercase tracking-widest font-mono">
            {(['all', 'seating', 'tables', 'lighting'] as CategoryFilter[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-1.5 px-3 transition-colors ${
                  activeCategory === cat
                    ? 'text-accent border-b border-accent bg-white/5'
                    : 'text-sand-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="font-mono text-xs text-sand-400">
            {filteredProducts.length} Editions Available
          </span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex flex-col border border-white/5 hover:border-white/20 transition-all duration-300 bg-charcoal-900/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-900">
                <Image
                  src={product.images.hero}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-charcoal-950/80 backdrop-blur-sm border border-white/10 px-2.5 py-1 text-[9px] uppercase font-mono tracking-widest text-sand-300">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-lg text-ivory group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-mono text-sm text-sand-200">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-sand-400 font-light mt-1 line-clamp-2">
                    {product.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="uppercase tracking-widest text-[11px] text-sand-400 group-hover:text-white flex items-center space-x-1">
                    <span>Inspect Edition</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                  <span className="text-[10px] font-mono text-sand-500">
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

