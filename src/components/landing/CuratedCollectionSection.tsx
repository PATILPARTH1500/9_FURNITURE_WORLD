'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ShoppingBag, Check } from 'lucide-react';
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

type CategoryFilter = 'all' | 'seating' | 'tables' | 'lighting-bedroom';

interface CategoryTab {
  id: CategoryFilter;
  label: string;
  count: number;
}

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
    if (activeCategory === 'lighting-bedroom') {
      return p.category === 'lighting' || p.category === 'beds' || p.category === 'storage';
    }
    return true;
  });

  const categories: CategoryTab[] = [
    { id: 'all', label: 'All Furniture', count: PRODUCTS_CATALOG.length },
    {
      id: 'seating',
      label: 'Seating & Sofas',
      count: PRODUCTS_CATALOG.filter((p) => p.category === 'seating').length,
    },
    {
      id: 'tables',
      label: 'Dining & Tables',
      count: PRODUCTS_CATALOG.filter((p) => p.category === 'tables').length,
    },
    {
      id: 'lighting-bedroom',
      label: 'Lighting & Bedroom',
      count: PRODUCTS_CATALOG.filter(
        (p) => p.category === 'lighting' || p.category === 'beds' || p.category === 'storage'
      ).length,
    },
  ];

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
      className="relative z-20 bg-[#FAF8F5] text-[#1A1816] py-24 sm:py-28 md:py-32 border-t border-[#1A1816]/10 overflow-hidden"
    >
      {/* Top Architectural Ambient Transition from Scene 05 Bedroom (Dark Video) to Atelier Daylight */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#141210]/15 via-transparent to-transparent pointer-events-none" />

      {/* Anchor alias for hash-based navigation with sticky navbar offset */}
      <span id="collection" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Architectural Demarcation Ribbon */}
        <div className="flex items-center justify-between border-b border-[#1A1816]/10 pb-4 mb-10 text-[11px] font-sans uppercase tracking-[0.2em] text-[#666059]">
          <div className="flex items-center space-x-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B] animate-pulse" />
            <span className="text-[#1A1816] font-semibold">Section 03 · Showroom Catalogue</span>
          </div>
          <div className="hidden sm:flex items-center space-x-6 text-[#57534E]">
            <span>03 Living Suites</span>
            <span className="w-1 h-1 rounded-full bg-[#1A1816]/20" />
            <span>06 Signature Pieces</span>
            <span className="w-1 h-1 rounded-full bg-[#1A1816]/20" />
            <span>Solid FSC® Hardwoods</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="collection-header grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16 pb-12 border-b border-[#1A1816]/10">
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-[#B54113] font-semibold">
                Permanent Living Suites
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-[#1A1816] font-normal tracking-tight leading-[1.1]">
              Curated Collections <br />
              <span className="italic font-light text-[#57534E]">& Living Suites.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <p className="font-sans text-sm sm:text-base text-[#57534E] leading-relaxed font-normal">
              Each series is conceived around how family gathers, rests, and celebrates. Handcrafted from sustainably harvested timber, honest joinery, and tactile bouclé upholstery.
            </p>
            <div className="pt-1 flex items-center justify-between">
              <Link
                href="/collections"
                className="group inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-wider text-[#C84D1B] hover:text-[#1A1816] font-semibold transition-colors"
              >
                <span>Explore All 3 Suites Lookbook</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 1. Balanced 3-Suite Architectural Lookbook Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {COLLECTIONS_DATA.map((col, idx) => {
            const suiteNumber = String(idx + 1).padStart(2, '0');
            const roomZone =
              idx === 0 ? 'Living Room' : idx === 1 ? 'Dining Room' : 'Bedroom & Lounge';

            return (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="group flex flex-col bg-white rounded-3xl border border-[#1A1816]/10 overflow-hidden shadow-[0_8px_30px_rgba(26,24,22,0.03)] hover:shadow-[0_20px_48px_rgba(26,24,22,0.08)] hover:border-[#C84D1B]/40 transition-all duration-300 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C84D1B]"
              >
                {/* Collection Image Frame with Clean Light Scrim */}
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#EFECE6]">
                  <Image
                    src={col.coverImage}
                    alt={col.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Subtle natural lighting vignette - NO heavy black gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                  {/* Top Architectural Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.16em] bg-black/45 backdrop-blur-md text-white border border-white/20 shadow-sm">
                      Suite {suiteNumber} · {roomZone}
                    </span>
                  </div>

                  {/* Bottom Piece Count Tag */}
                  <div className="absolute bottom-3 right-4 z-10">
                    <span className="text-[11px] font-sans tracking-wider uppercase text-white/90 drop-shadow-sm font-medium">
                      {col.productCount} Handcrafted Pieces
                    </span>
                  </div>
                </div>

                {/* Collection Card Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
                      <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-[#C84D1B] font-semibold">
                        Lookbook Series
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#1A1816] font-normal tracking-tight group-hover:text-[#C84D1B] transition-colors leading-tight">
                      {col.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-relaxed line-clamp-2">
                      {col.subtitle}
                    </p>
                  </div>

                  {/* Curator Note / Hallmark Quote */}
                  {col.curatorNote && (
                    <div className="border-l-2 border-[#C84D1B]/30 pl-3 py-0.5">
                      <p className="font-serif italic text-xs text-[#666059] line-clamp-2 leading-relaxed">
                        {col.curatorNote}
                      </p>
                    </div>
                  )}

                  {/* Card Footer CTA */}
                  <div className="pt-3 border-t border-[#1A1816]/8 flex items-center justify-between text-xs font-sans uppercase tracking-wider font-semibold text-[#1A1816] group-hover:text-[#C84D1B] transition-colors">
                    <span>Inspect Suite Lookbook</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 2. Showroom Floor: Curated Product Grid */}
        <div className="space-y-12 pt-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1A1816]/10">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B54113]" />
                <span className="text-xs font-sans uppercase tracking-[0.16em] text-[#B54113] font-semibold">
                  Individual Furniture Pieces
                </span>
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1816] font-normal">
                Showroom Floor Pieces
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#57534E]">
                Explore individual handcrafted models, materials, and dimensional profiles.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none -mx-6 px-6 md:mx-0 md:px-0">
              {categories.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveCategory(tab.id)}
                    className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-sans uppercase tracking-wider font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C84D1B] ${
                      isActive
                        ? 'text-white bg-[#1A1816] shadow-sm'
                        : 'text-[#57534E] hover:text-[#1A1816] bg-white border border-[#1A1816]/10 hover:border-[#1A1816]/30'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`ml-1.5 text-[10px] ${isActive ? 'text-white/80' : 'text-[#57534E]'}`}>({tab.count})</span>
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
                const primaryWood =
                  product.materials.woodOptions[0]?.name.split(' ')[0] || 'Oak';

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.3 }}
                    className="group flex flex-col bg-white rounded-3xl border border-[#1A1816]/10 overflow-hidden hover:border-[#C84D1B]/40 transition-all duration-300 shadow-[0_8px_30px_rgba(26,24,22,0.03)] hover:shadow-[0_16px_40px_rgba(26,24,22,0.08)] h-full"
                  >
                    {/* Product Image Frame */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F1EA] border-b border-[#1A1816]/6 block cursor-pointer"
                      aria-label={`View ${product.name} specifications`}
                    >
                      <Image
                        src={product.images.hero}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </Link>

                    {/* Product Body */}
                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-[#C84D1B] font-semibold block">
                            {product.category} · {primaryWood} Timber
                          </span>
                          <span className="text-[11px] font-sans text-[#666059] uppercase tracking-wider">
                            {product.dimensions.widthCm}×{product.dimensions.depthCm} cm
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between gap-3 pt-0.5">
                          <h4 className="font-serif text-xl sm:text-2xl text-[#1A1816] font-normal group-hover:text-[#C84D1B] transition-colors leading-tight">
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

                      {/* Material Swatches & Craft Details */}
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
                            {product.materials.woodOptions.length} Timber Finishes
                          </span>
                        </div>

                        <span className="text-[11px] font-sans text-[#57534E] font-medium">
                          10-Yr Guarantee
                        </span>
                      </div>

                      {/* Actions: Add to Bag & Quick View */}
                      <div className="pt-2 flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(product, e)}
                          className={`flex-1 min-h-[44px] flex items-center justify-center space-x-2 px-4 rounded-full text-xs font-sans uppercase tracking-wider font-semibold transition-all duration-300 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C84D1B] ${
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
                          className="min-h-[44px] px-4 rounded-full text-xs font-sans uppercase tracking-wider font-semibold border border-[#1A1816]/15 hover:border-[#1A1816] text-[#1A1816] bg-white hover:bg-[#F2EFE9] transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C84D1B]"
                          aria-label={`Quick view ${product.name} details`}
                        >
                          <span>Quick View</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Curatorial Guarantee Strip */}
        <div className="mt-20 pt-8 border-t border-[#1A1816]/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-sans text-[#666059]">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4C583E]" />
              <span>FSC® Certified Solid Hardwoods</span>
            </span>
            <span className="hidden md:inline-flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
              <span>White-Glove Assembly Included</span>
            </span>
            <span className="hidden lg:inline-flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#57534E]" />
              <span>10-Year Frame Structural Warranty</span>
            </span>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center space-x-1.5 font-semibold uppercase tracking-wider text-[#B54113] hover:text-[#1A1816] transition-colors"
          >
            <span>View All Living Suites</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Shoppable Product Quick Drawer */}
      <ProductQuickDrawer />
    </section>
  );
};
