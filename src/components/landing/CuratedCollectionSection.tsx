'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ShoppingBag, Check, Eye } from 'lucide-react';
import { PRODUCTS_CATALOG, COLLECTIONS_DATA } from '@/data/catalog';
import { Product } from '@/types';
import { formatPrice } from '@/config/brand';
import { useCartStore } from '@/store/useCartStore';
import { useSceneStore } from '@/store/useSceneStore';
import dynamic from '@/components/common/dynamic';

const ProductQuickDrawer = dynamic(
  () => import('@/components/discovery/ProductQuickDrawer').then((mod) => mod.ProductQuickDrawer),
  { ssr: false }
);

type CategoryFilter = 'all' | 'seating' | 'tables' | 'lighting';

export const CuratedCollectionSection: React.FC = () => {
  const { addItem, setIsOpen } = useCartStore();
  const { setActiveProduct } = useSceneStore();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const filteredProducts = PRODUCTS_CATALOG.filter((p) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'seating') return p.category === 'seating';
    if (activeCategory === 'tables') return p.category === 'tables';
    if (activeCategory === 'lighting') return p.category === 'lighting' || p.category === 'storage';
    return true;
  });

  const handleInspect = (productId: string) => {
    setActiveProduct(productId);
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants[0];
    addItem({
      productId: product.id,
      variantId: variant?.id || `var-${product.id}`,
      productName: product.name,
      variantName: variant?.name || 'Standard Edition',
      woodFinish: product.materials.woodOptions[0]?.name || 'Solid Oak',
      fabricFinish: product.materials.upholsteryOptions[0]?.name || '',
      unitPrice: product.price,
      quantity: 1,
      image: product.images.hero,
    });

    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
      setIsOpen(true);
    }, 600);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.collection-header',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="collections"
      ref={sectionRef}
      className="relative z-20 bg-[#FBF9F5] text-[#1A1816] py-24 sm:py-32 border-t border-[#1A1816]/10 overflow-hidden"
    >
      <span id="collection" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="collection-header flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#1A1816]/10 gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-[#C84D1B] font-semibold">
                Permanent Showroom Catalogue
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#1A1816] font-normal tracking-tight leading-[1.08]">
              Curated Collections <br />
              <span className="italic font-light text-[#57534E]">& Living Suites.</span>
            </h2>
          </div>
          <div className="space-y-3 max-w-md">
            <p className="font-sans text-sm sm:text-base text-[#57534E] leading-relaxed font-normal">
              Each series is conceived around how family gathers, rests, and celebrates. Handcrafted from sustainably harvested timber and tactile upholstery.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center space-x-1.5 text-xs font-sans uppercase tracking-wider text-[#C84D1B] hover:text-[#1A1816] font-semibold group transition-colors"
            >
              <span>Explore All Suites</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* 1. Asymmetric 3-Suite Lookbook Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          {/* Sanctuary Living Suite (Col 1-7) */}
          {COLLECTIONS_DATA[0] && (
            <div className="lg:col-span-7">
              <Link
                href={`/collections/${COLLECTIONS_DATA[0].slug}`}
                className="group block relative h-[480px] sm:h-[540px] rounded-3xl overflow-hidden border border-[#1A1816]/10 shadow-[0_16px_40px_rgba(26,24,22,0.06)] bg-[#1A1816] focus:outline-hidden"
              >
                <Image
                  src={COLLECTIONS_DATA[0].coverImage}
                  alt={COLLECTIONS_DATA[0].title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-104 filter brightness-[0.85]"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 space-y-3 text-white">
                  <span className="font-sans text-xs uppercase tracking-widest text-[#E7C89F] font-semibold block">
                    Suite 01 · {COLLECTIONS_DATA[0].productCount} Handcrafted Pieces
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-white font-normal tracking-tight">
                    {COLLECTIONS_DATA[0].title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-white/80 max-w-lg leading-relaxed line-clamp-2">
                    {COLLECTIONS_DATA[0].subtitle}
                  </p>
                  <div className="pt-2 flex items-center space-x-1.5 text-xs font-sans uppercase tracking-wider text-[#FAF8F5] font-semibold group-hover:text-[#E7C89F] transition-colors">
                    <span>Inspect Suite Lookbook</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Stacked Duo Suites (Col 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {COLLECTIONS_DATA.slice(1, 3).map((col, idx) => (
              <div key={col.id} className="flex-1">
                <Link
                  href={`/collections/${col.slug}`}
                  className="group block relative h-[225px] sm:h-[254px] rounded-3xl overflow-hidden border border-[#1A1816]/10 shadow-[0_12px_32px_rgba(26,24,22,0.05)] bg-[#1A1816] focus:outline-hidden"
                >
                  <Image
                    src={col.coverImage}
                    alt={col.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-104 filter brightness-[0.82]"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2 text-white">
                    <span className="font-sans text-[11px] uppercase tracking-widest text-[#E7C89F] font-semibold block">
                      Suite 0{idx + 2} · {col.productCount} Pieces
                    </span>
                    <h3 className="font-serif text-2xl text-white font-normal">
                      {col.title}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs font-sans uppercase tracking-wider text-[#FAF8F5] font-semibold group-hover:text-[#E7C89F] transition-colors">
                      <span>View Suite</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Showroom Floor: Curated Product Grid */}
        <div className="space-y-12 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#1A1816]/10">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
                <span className="text-xs font-sans uppercase tracking-[0.16em] text-[#C84D1B] font-semibold">
                  Individual Pieces
                </span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1816] font-normal mt-1">
                Showroom Floor Works
              </h3>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {(
                [
                  { id: 'all', label: 'All Works' },
                  { id: 'seating', label: 'Seating & Sofas' },
                  { id: 'tables', label: 'Dining Tables' },
                  { id: 'lighting', label: 'Lighting & Storage' },
                ] as const
              ).map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`relative px-4 py-2 rounded-full text-xs font-sans uppercase tracking-wider font-semibold transition-colors duration-200 whitespace-nowrap focus:outline-hidden ${
                      isActive ? 'text-white bg-[#1A1816]' : 'text-[#57534E] hover:text-[#1A1816] bg-white border border-[#1A1816]/10'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => {
                const isAdded = addedProductId === product.id;
                const woodName = product.materials.woodOptions[0]?.name.split(' ')[0] || 'Oak';

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.3 }}
                    className="group flex flex-col bg-white rounded-3xl border border-[#1A1816]/10 overflow-hidden hover:border-[#C84D1B]/40 transition-all duration-300 shadow-[0_8px_30px_rgba(26,24,22,0.04)] hover:shadow-[0_16px_40px_rgba(26,24,22,0.08)] h-full"
                  >
                    {/* Image Container with Restrained Hover Feedback */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2EFE9] border-b border-[#1A1816]/6">
                      <Link
                        href={`/products/${product.slug}`}
                        className="block w-full h-full"
                        aria-label={`View ${product.name} details`}
                      >
                        <Image
                          src={product.images.hero}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </Link>

                      {/* Quick Inspect Trigger */}
                      <button
                        type="button"
                        onClick={() => handleInspect(product.id)}
                        className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/95 hover:bg-white text-[#1A1816] hover:text-[#C84D1B] border border-[#1A1816]/10 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 cursor-pointer"
                        aria-label={`Quick view ${product.name}`}
                        title="Quick View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Product Card Body */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-[#C84D1B] font-semibold block">
                          {product.category} · {woodName} Timber
                        </span>

                        <div className="flex items-baseline justify-between gap-3">
                          <h4 className="font-serif text-xl sm:text-2xl text-[#1A1816] font-normal group-hover:text-[#C84D1B] transition-colors">
                            <Link href={`/products/${product.slug}`}>{product.name}</Link>
                          </h4>
                          <span className="font-sans text-base font-semibold text-[#1A1816] shrink-0">
                            {formatPrice(product.price)}
                          </span>
                        </div>

                        <p className="font-sans text-xs text-[#57534E] line-clamp-2 leading-relaxed pt-1">
                          {product.subtitle}
                        </p>
                      </div>

                      {/* Swatches & In-Stock Indicator */}
                      <div className="pt-3 border-t border-[#1A1816]/8 flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          {product.materials.woodOptions.slice(0, 3).map((w) => (
                            <span
                              key={w.id}
                              title={w.name}
                              className={`w-3 h-3 rounded-full border border-black/15 ${w.swatchTone}`}
                            />
                          ))}
                          <span className="text-[10px] font-sans text-[#666059] uppercase tracking-wider ml-1">
                            {product.materials.woodOptions.length} Wood Options
                          </span>
                        </div>

                        <span className="font-sans text-[11px] text-[#4C583E] font-semibold bg-[#4C583E]/10 px-2.5 py-0.5 rounded-full border border-[#4C583E]/20">
                          In Stock · Ready to Ship
                        </span>
                      </div>

                      {/* Actions Row */}
                      <div className="pt-2 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(product, e)}
                          className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-semibold transition-all duration-300 cursor-pointer ${
                            isAdded
                              ? 'bg-[#4C583E] text-white'
                              : 'bg-[#1A1816] hover:bg-[#C84D1B] text-white shadow-2xs'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Bag</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleInspect(product.id)}
                          className="px-4 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-semibold border border-[#1A1816]/15 hover:border-[#1A1816] text-[#1A1816] bg-white hover:bg-[#F2EFE9] transition-all cursor-pointer"
                        >
                          <span>Details</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Shoppable Product Quick Drawer */}
      <ProductQuickDrawer />
    </section>
  );
};
