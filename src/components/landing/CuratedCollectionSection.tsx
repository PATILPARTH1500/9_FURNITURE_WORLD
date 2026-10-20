'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ShoppingBag, Check, Sparkles, Eye } from 'lucide-react';
import { PRODUCTS_CATALOG, COLLECTIONS_DATA } from '@/data/catalog';
import { Product } from '@/types';
import { formatPrice } from '@/config/brand';
import { useCartStore } from '@/store/useCartStore';
import { useSceneStore } from '@/store/useSceneStore';
import { AnimatedHeading, MagneticButton, SpotlightCard, TextRoll, DirectionAwareHover } from '@/components/ui/motion';
import dynamic from 'next/dynamic';

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
      variantId: variant.id,
      productName: product.name,
      variantName: variant.name,
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
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 92%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      gsap.fromTo(
        '.collection-concept-panel',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.collection-concepts-grid',
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
      id="collection"
      ref={sectionRef}
      className="relative z-20 bg-[#F4E9D8] text-checkerboard py-24 sm:py-32 border-t border-checkerboard/12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="collection-header flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-checkerboard/15 gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="font-sans text-xs tracking-wider uppercase text-tangerine font-semibold bg-white/80 px-3.5 py-1.5 rounded-full border border-tangerine/20 inline-flex items-center space-x-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-tangerine" />
              <span>Curated Series · 2024 Collection</span>
            </span>
            <AnimatedHeading
              text="Three Living Concepts."
              highlightText="Living Concepts."
              highlightClassName="italic text-walnut font-normal"
              className="font-serif text-4xl sm:text-5xl md:text-6xl text-checkerboard font-semibold tracking-tight leading-[1.1]"
            />
          </div>
          <div className="space-y-3 max-w-md">
            <p className="font-sans text-sm sm:text-base text-walnut leading-relaxed font-normal">
              Each series is conceived around how family gathers, rests, and celebrates. Built in solid timber and finished in tactile natural upholstery.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center space-x-1.5 text-xs font-sans uppercase tracking-wider text-tangerine hover:text-coral font-semibold group"
            >
              <span>Explore All Curated Collections</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* 1. Asymmetric 3-Concept Showcase Grid with Direction-Aware Hover (Aceternity UI Reference) */}
        <div className="collection-concepts-grid grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-24">
          {/* Large Hero Concept Panel (Cols 1-7) */}
          {COLLECTIONS_DATA[0] && (
            <div className="collection-concept-panel lg:col-span-7">
              <Link
                href={`/collections/${COLLECTIONS_DATA[0].slug}`}
                className="block group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-tangerine rounded-3xl"
              >
                <DirectionAwareHover
                  imageUrl={COLLECTIONS_DATA[0].coverImage}
                  imageAlt={COLLECTIONS_DATA[0].title}
                  className="h-[440px] sm:h-[500px] lg:h-[540px] w-full border border-checkerboard/15 shadow-retro hover:shadow-warm transition-all duration-500 hover:border-tangerine bg-[#29251F]"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                >
                  <div className="space-y-3 pointer-events-auto">
                    <div className="flex items-center space-x-2">
                      <span className="font-sans text-[11px] uppercase tracking-widest text-mustard font-semibold bg-white/10 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                        Flagship Series · 01
                      </span>
                      <span className="text-white/70 text-xs font-sans">
                        {COLLECTIONS_DATA[0].productCount} Designs
                      </span>
                    </div>
                    <h3 className="font-serif text-3xl sm:text-4xl text-white group-hover:text-mustard-light transition-colors font-medium">
                      {COLLECTIONS_DATA[0].title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-cream-light/90 font-light max-w-lg leading-relaxed">
                      {COLLECTIONS_DATA[0].subtitle}
                    </p>
                    <div className="pt-2 flex items-center space-x-1.5 text-xs font-sans uppercase tracking-wider text-mustard group-hover:text-white transition-colors font-medium">
                      <TextRoll>Enter Collection</TextRoll>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </DirectionAwareHover>
              </Link>
            </div>
          )}

          {/* Stacked Concept Duo (Cols 8-12) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            {COLLECTIONS_DATA.slice(1, 3).map((col, idx) => (
              <div key={col.id} className="collection-concept-panel flex-1">
                <Link
                  href={`/collections/${col.slug}`}
                  className="block group focus:outline-hidden focus-visible:ring-2 focus-visible:ring-tangerine rounded-3xl"
                >
                  <DirectionAwareHover
                    imageUrl={col.coverImage}
                    imageAlt={col.title}
                    className="h-[210px] sm:h-[235px] lg:h-[254px] w-full border border-checkerboard/15 shadow-retro hover:shadow-warm transition-all duration-500 hover:border-tangerine bg-[#29251F]"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  >
                    <div className="space-y-1.5 pointer-events-auto">
                      <span className="font-sans text-[10px] uppercase tracking-widest text-mustard font-semibold bg-white/10 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/20 inline-block">
                        Series 0{idx + 2} · {col.productCount} Designs
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl text-white group-hover:text-mustard-light transition-colors font-medium">
                        {col.title}
                      </h3>
                      <p className="font-sans text-xs text-cream-light/80 font-light line-clamp-1">
                        {col.subtitle}
                      </p>
                      <div className="pt-1 flex items-center space-x-1 text-[11px] font-sans uppercase tracking-wider text-mustard group-hover:text-white transition-colors font-medium">
                        <TextRoll>View Series</TextRoll>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </DirectionAwareHover>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Showroom Floor Interactive Catalog */}
        <div className="space-y-10 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-checkerboard/12">
            <div>
              <span className="text-[11px] font-sans uppercase tracking-widest text-walnut font-semibold">
                Showroom Floor
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-checkerboard font-semibold mt-1">
                Signature Handcrafted Furniture
              </h3>
            </div>

            {/* Category Filter Tabs with Aceternity-style Animated Pill Indicator */}
            <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {(
                [
                  { id: 'all', label: 'All Pieces' },
                  { id: 'seating', label: 'Seating' },
                  { id: 'tables', label: 'Tables' },
                  { id: 'lighting', label: 'Lighting & Storage' },
                ] as const
              ).map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`relative px-4 py-2 rounded-full text-xs font-sans uppercase tracking-wider font-semibold transition-colors duration-200 whitespace-nowrap focus:outline-hidden ${
                      isActive ? 'text-white' : 'text-checkerboard/75 hover:text-checkerboard'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="catalog-active-pill"
                        className="absolute inset-0 rounded-full bg-tangerine shadow-warm -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      />
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid with Varied Proportions & Rich Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => {
                const isAdded = addedProductId === product.id;
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SpotlightCard
                      className="group flex flex-col bg-white rounded-3xl border border-checkerboard/12 overflow-hidden hover:border-tangerine/50 transition-all duration-400 shadow-xs hover:shadow-warm hover:-translate-y-1.5 h-full"
                      contentClassName="flex flex-col h-full"
                      spotlightColor="rgba(244, 81, 11, 0.08)"
                    >
                      {/* Image Container with Floating Action Triggers */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF7F2] border-b border-checkerboard/8">
                        <Link
                          href={`/products/${product.slug}`}
                          className="block w-full h-full"
                          aria-label={`View ${product.name} details`}
                        >
                          <Image
                            src={product.images.hero}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </Link>

                        {/* Top Badges */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                          <span className="font-sans text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-checkerboard border border-checkerboard/10 shadow-2xs">
                            {product.category}
                          </span>
                          <span className="font-serif text-sm font-semibold text-checkerboard bg-white/95 backdrop-blur-xs px-3 py-0.5 rounded-full border border-checkerboard/10 shadow-2xs">
                            {formatPrice(product.price)}
                          </span>
                        </div>

                        {/* Quick Inspect Floating Overlay Trigger */}
                        <button
                          type="button"
                          onClick={() => handleInspect(product.id)}
                          className="absolute bottom-3.5 right-3.5 p-2.5 rounded-full bg-white/90 hover:bg-white text-checkerboard hover:text-tangerine border border-checkerboard/15 shadow-2xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
                          aria-label={`Inspect ${product.name} specifications`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Product Content & Swatches */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          <h4 className="font-serif text-xl text-checkerboard font-semibold group-hover:text-tangerine transition-colors">
                            <Link href={`/products/${product.slug}`}>{product.name}</Link>
                          </h4>
                          <p className="font-sans text-xs text-walnut line-clamp-2 leading-relaxed">
                            {product.subtitle}
                          </p>
                        </div>

                        {/* Wood Finishes Preview Swatches */}
                        <div className="pt-2 border-t border-checkerboard/8 flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            {product.materials.woodOptions.slice(0, 3).map((w) => (
                              <span
                                key={w.id}
                                title={w.name}
                                className={`w-3.5 h-3.5 rounded-full border border-checkerboard/20 ${w.swatchTone}`}
                              />
                            ))}
                            <span className="text-[10px] font-sans text-walnut/70 uppercase tracking-wider ml-1">
                              {product.materials.woodOptions[0]?.name.split(' ')[0]}
                            </span>
                          </div>

                          <span className="text-[10px] font-sans text-olive font-medium">
                            In Stock
                          </span>
                        </div>

                        {/* Actions Row */}
                        <div className="pt-2 flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(product, e)}
                            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-semibold transition-all duration-300 ${
                              isAdded
                                ? 'bg-olive text-white'
                                : 'bg-checkerboard hover:bg-tangerine text-white shadow-2xs hover:shadow-warm'
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
                                <span>Quick Add</span>
                              </>
                            )}
                          </button>

                          <Link
                            href={`/products/${product.slug}`}
                            className="p-3 rounded-full border border-checkerboard/15 hover:border-tangerine text-checkerboard hover:text-tangerine transition-colors"
                            aria-label={`View ${product.name} details`}
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </SpotlightCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <ProductQuickDrawer />
    </section>
  );
};
