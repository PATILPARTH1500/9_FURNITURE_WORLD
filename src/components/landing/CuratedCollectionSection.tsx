'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ShoppingBag, Check } from 'lucide-react';
import { PRODUCTS_CATALOG, COLLECTIONS_DATA } from '@/data/catalog';
import { formatPrice } from '@/config/brand';
import { useCartStore } from '@/store/useCartStore';

export const CuratedCollectionSection: React.FC = () => {
  const { addItem, setIsOpen } = useCartStore();
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleQuickAdd = (product: (typeof PRODUCTS_CATALOG)[0]) => {
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
      // Header
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

      // 3 Collection Cards
      gsap.fromTo(
        '.collection-banner-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.collection-banners-grid',
            start: 'top 90%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      // Product Cards
      gsap.fromTo(
        '.product-grid-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.products-grid-container',
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
      className="relative z-20 bg-gradient-to-b from-[#F4E9D8] via-[#FAF7F2] to-[#FAF7F2] text-checkerboard py-28 border-t border-checkerboard/10 overflow-hidden"
    >
      {/* Subtle Warm Ambient Lighting */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-[radial-gradient(ellipse_at_top,rgba(244,81,11,0.04),transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="collection-header flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-checkerboard/15 gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="font-sans text-xs tracking-wider uppercase text-tangerine font-semibold bg-white px-3 py-1 rounded-full border border-tangerine/20 inline-block shadow-2xs">
              Furniture Collections
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-checkerboard font-semibold tracking-tight leading-[1.15]">
              Explore Our Collections for <br />
              <span className="italic text-walnut">Joyful Home Living</span>
            </h2>
          </div>
          <div className="space-y-3 max-w-sm">
            <p className="font-sans text-sm text-walnut leading-relaxed font-normal">
              Each piece is crafted with comfortable proportions, vibrant retro-modern colours, and natural timber built for busy homes.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-wider text-tangerine hover:text-coral font-semibold transition-colors group"
            >
              <span>Explore All Furniture</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Collections Overview Banner */}
        <div className="collection-banners-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {COLLECTIONS_DATA.map((col) => (
            <Link
              key={col.id}
              href={`/collections/${col.slug}`}
              className="collection-banner-card group relative h-[380px] rounded-2xl overflow-hidden border border-checkerboard/15 flex flex-col justify-end p-8 transition-all duration-500 hover:border-tangerine shadow-retro hover:shadow-warm hover:-translate-y-1.5"
            >
              <Image
                src={col.coverImage}
                alt={col.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-106 filter brightness-[0.75] group-hover:brightness-[0.88]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-checkerboard/90 via-checkerboard/40 to-transparent" />

              <div className="relative z-10 space-y-2">
                <span className="font-sans text-[11px] uppercase tracking-wider text-mustard font-semibold bg-checkerboard/60 px-2 py-0.5 rounded-sm inline-block">
                  {col.productCount} Designs
                </span>
                <h3 className="font-serif text-2xl text-white group-hover:text-mustard transition-colors font-medium">
                  {col.title}
                </h3>
                <p className="font-sans text-xs text-cream-light font-light line-clamp-2 leading-relaxed">{col.subtitle}</p>
                <div className="pt-2 flex items-center space-x-1 text-xs font-sans uppercase tracking-wider text-mustard group-hover:text-white transition-colors font-medium">
                  <span>View Collection</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Products Grid */}
        <div className="space-y-10">
          <div className="flex items-center justify-between pb-4 border-b border-checkerboard/10">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl text-checkerboard font-semibold">Popular Pieces for Your Home</h3>
              <p className="text-xs text-walnut mt-1">Comfortable, durable designs tested for everyday life</p>
            </div>
            <span className="font-sans text-xs text-tangerine font-semibold tracking-wide">06 Selected Pieces</span>
          </div>

          <div className="products-grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS_CATALOG.map((product) => (
              <div
                key={product.id}
                className="product-grid-card group flex flex-col bg-white rounded-3xl border border-checkerboard/10 overflow-hidden hover:border-tangerine/50 transition-all duration-400 shadow-retro hover:shadow-warm hover:-translate-y-1.5"
              >
                {/* Product Image */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-[4/3] overflow-hidden bg-cream-dark"
                >
                  <Image
                    src={product.images.hero}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/92 backdrop-blur-xs border border-checkerboard/10 px-3 py-1 rounded-full text-[11px] uppercase font-sans font-semibold tracking-wider text-checkerboard shadow-2xs capitalize">
                      {product.category}
                    </span>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between">
                      <Link href={`/products/${product.slug}`}>
                        <h4 className="font-serif text-xl text-checkerboard group-hover:text-tangerine transition-colors font-medium">
                          {product.name}
                        </h4>
                      </Link>
                      <span className="font-sans text-base text-tangerine font-semibold">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-walnut mt-1.5 line-clamp-2 leading-relaxed">
                      {product.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-checkerboard/10 flex items-center justify-between text-xs">
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-sans uppercase tracking-wider text-xs text-checkerboard hover:text-tangerine flex items-center space-x-1 font-semibold transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-tangerine transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>

                    <button
                      onClick={() => handleQuickAdd(product)}
                      className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full font-medium text-xs shadow-xs transition-all duration-300 active:scale-95 ${
                        addedProductId === product.id
                          ? 'bg-olive text-white'
                          : 'bg-tangerine hover:bg-coral text-white'
                      }`}
                      aria-label={`Add ${product.name} to bag`}
                    >
                      {addedProductId === product.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Promise Banner */}
        <div className="mt-28 p-10 md:p-16 rounded-3xl bg-cream-dark border border-checkerboard/15 relative overflow-hidden shadow-retro">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="font-sans text-xs tracking-wider uppercase text-tangerine font-semibold bg-white/90 px-3 py-1 rounded-full border border-tangerine/20 inline-block shadow-2xs">
              Made for Real Homes
            </span>
            <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-checkerboard leading-snug font-medium">
              “We believe furniture should bring warmth and energy to your home. Simple shapes, honest wood, and cheerful colours make everyday living better.”
            </blockquote>
            <p className="text-xs text-walnut font-sans tracking-wider uppercase font-semibold">
              — The Furniture Village Design Studio
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
