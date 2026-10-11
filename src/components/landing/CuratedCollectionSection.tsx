'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { PRODUCTS_CATALOG, COLLECTIONS_DATA } from '@/data/catalog';
import { useCartStore } from '@/store/useCartStore';

export const CuratedCollectionSection: React.FC = () => {
  const { addItem } = useCartStore();

  const handleQuickAdd = (product: (typeof PRODUCTS_CATALOG)[0]) => {
    const variant = product.variants[0];
    addItem({
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      variantName: variant.name,
      woodFinish: product.materials.woodOptions[0]?.name || 'Standard',
      fabricFinish: product.materials.upholsteryOptions[0]?.name || '',
      unitPrice: product.price,
      quantity: 1,
      image: product.images.hero,
    });
  };

  return (
    <section className="relative z-20 bg-charcoal-950 text-sand-100 py-32 border-t border-white/10">
      {/* Smooth transition from 3D canvas */}
      <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-charcoal-950 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 pb-8 border-b border-white/10 gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent">
              05 · The Permanent Collection
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ivory font-light tracking-tight">
              Curated Works for <br />
              <span className="italic">Architectural Living</span>
            </h2>
          </div>
          <div className="space-y-3 max-w-sm">
            <p className="text-xs text-sand-400 font-light leading-relaxed">
              Every edition is handcrafted to order in our Kyoto & Copenhagen workshops, utilizing
              century-old mortise-and-tenon principles and certified botanical timber.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-accent hover:text-white transition-colors"
            >
              <span>Explore All Series</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Collections Overview Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {COLLECTIONS_DATA.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="group relative h-[380px] overflow-hidden border border-white/10 flex flex-col justify-end p-8 transition-all duration-500 hover:border-accent/50"
            >
              <Image
                src={col.coverImage}
                alt={col.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.7] group-hover:brightness-[0.8]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />

              <div className="relative z-10 space-y-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-accent">
                  {col.productCount} Works
                </span>
                <h3 className="font-serif text-2xl text-ivory group-hover:text-accent transition-colors">
                  {col.title}
                </h3>
                <p className="text-xs text-sand-300 font-light line-clamp-2">{col.subtitle}</p>
                <div className="pt-2 flex items-center space-x-1 text-[11px] uppercase tracking-widest text-sand-400 group-hover:text-white transition-colors">
                  <span>Enter Gallery</span>
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Products Grid */}
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-ivory">Iconic Individual Pieces</h3>
            <span className="font-mono text-xs text-sand-400">06 Selected Releases</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS_CATALOG.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col border border-white/5 hover:border-white/20 transition-all duration-300 bg-charcoal-900/40"
              >
                {/* Product Image */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-[4/3] overflow-hidden bg-charcoal-900"
                >
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
                </Link>

                {/* Product Info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between">
                      <Link href={`/products/${product.slug}`}>
                        <h4 className="font-serif text-lg text-ivory group-hover:text-accent transition-colors">
                          {product.name}
                        </h4>
                      </Link>
                      <span className="font-mono text-sm text-sand-200">
                        ${product.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-sand-400 font-light mt-1 line-clamp-2">
                      {product.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                    <Link
                      href={`/products/${product.slug}`}
                      className="uppercase tracking-widest text-[11px] text-sand-300 hover:text-white flex items-center space-x-1"
                    >
                      <span>Specifications</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>

                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="border border-white/10 hover:border-accent hover:text-accent p-2 text-sand-300 transition-colors"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Architectural Statement Banner */}
        <div className="mt-32 p-12 md:p-20 bg-charcoal-900 border border-white/10 relative overflow-hidden">
          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent">
              Material Commitment
            </span>
            <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-ivory leading-relaxed font-light italic">
              “True luxury is not ornament, but the quiet resonance of raw material shaped by human hands.”
            </blockquote>
            <p className="text-xs text-sand-400 font-mono tracking-widest uppercase">
              — Søren Lind, Co-Founder & Master Joiner
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

