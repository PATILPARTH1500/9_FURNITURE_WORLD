'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import { ArrowUpRight, Layers, SlidersHorizontal, Loader2 } from 'lucide-react';
import { COLLECTIONS_DATA, PRODUCTS_CATALOG } from '@/data/catalog';
import { productService, DbCategory } from '@/lib/services/productService';
import { Product } from '@/types';
import { formatPrice } from '@/config/brand';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS_CATALOG);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  useEffect(() => {
    let isMounted = true;
    async function loadStorefront() {
      setIsLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getPublishedProducts(),
          productService.getCategories(),
        ]);

        if (isMounted) {
          if (prodRes.data && prodRes.data.length > 0) {
            setProducts(prodRes.data);
          }
          if (catRes.data && catRes.data.length > 0) {
            setCategories(catRes.data);
          }
        }
      } catch (err: unknown) {
        console.warn('[Collections] Falling back to default catalogue:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadStorefront();
    return () => {
      isMounted = false;
    };
  }, []);

  // Category Tabs
  const categoryTabs = useMemo(() => {
    const defaultTabs = [
      { id: 'all', label: 'All Pieces' },
      { id: 'seating', label: 'Sofas & Seating' },
      { id: 'tables', label: 'Dining & Accent Tables' },
      { id: 'beds', label: 'Bedrooms' },
      { id: 'lighting', label: 'Architectural Lighting' },
    ];

    if (categories.length === 0) return defaultTabs;

    return [
      { id: 'all', label: 'All Pieces' },
      ...categories.map((c) => ({ id: c.slug, label: c.name })),
    ];
  }, [categories]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    const sorted = [...result];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'featured':
      default:
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    return sorted;
  }, [products, activeCategory, sortBy]);

  return (
    <main className="min-h-screen bg-[#FBF9F5] text-[#1A1816] pt-8 sm:pt-12 pb-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/80 text-[11px] font-sans uppercase tracking-widest text-[#C84D1B] font-semibold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
            <span>Furniture Collections 2026</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#1A1816] font-light tracking-tight leading-[1.08]">
            Furniture for Every Living Space
          </h1>
          <p className="text-sm sm:text-base text-[#57534E] leading-relaxed font-normal">
            Sculptural lounge chairs, solid American walnut dining tables, ambient mouth-blown lighting, and serene bedroom suites crafted for mindful living and architectural longevity.
          </p>
        </div>

        {/* Featured Series Hero Cards */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-stone-200/80">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#C84D1B]" />
              <h2 className="font-sans text-xs uppercase tracking-widest text-[#1A1816] font-medium">
                Featured Collections
              </h2>
            </div>
            <span className="font-sans text-xs text-[#78716C]">3 Suites</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLLECTIONS_DATA.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="group relative h-[400px] rounded-2xl border border-stone-200/80 flex flex-col justify-end p-8 overflow-hidden transition-all duration-500 shadow-[0_4px_20px_rgba(26,24,22,0.04)] hover:shadow-[0_16px_40px_rgba(26,24,22,0.12)]"
              >
                <Image
                  src={col.coverImage}
                  alt={col.title}
                  fill
                  className="object-cover brightness-[0.72] group-hover:brightness-[0.82] transition-all duration-700 group-hover:scale-104"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-sans text-[11px] uppercase tracking-wider text-white/90 font-medium bg-white/15 border border-white/20 px-3 py-0.5 rounded-full inline-block backdrop-blur-xs">
                      {col.productCount} Designs
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-white group-hover:text-[#FBF9F5] transition-colors font-light">
                    {col.title}
                  </h3>
                  <p className="text-xs text-white/80 font-normal line-clamp-2 leading-relaxed">
                    {col.subtitle}
                  </p>
                  <div className="pt-2 flex items-center space-x-1.5 text-xs font-sans uppercase tracking-wider text-white font-medium">
                    <span>Inspect Suite</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#C84D1B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Filter Navigation and Sorting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200/80">
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categoryTabs.map((tab) => {
              const count =
                tab.id === 'all'
                  ? products.length
                  : products.filter((p) => p.category === tab.id).length;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-sans font-medium transition-all shrink-0 flex items-center space-x-2 cursor-pointer ${
                    activeCategory === tab.id
                      ? 'text-white bg-[#1A1816] shadow-xs'
                      : 'text-[#57534E] bg-white hover:bg-stone-50 border border-stone-200/80'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[11px] font-sans px-2 py-0.2 rounded-full ${
                      activeCategory === tab.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#78716C]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="flex items-center space-x-2 bg-white border border-stone-200/80 px-3 py-1.5 rounded-full text-xs text-[#57534E] shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C84D1B]" />
              <label htmlFor="sort-by-select" className="sr-only">Sort by</label>
              <select
                id="sort-by-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort products by"
                className="bg-transparent text-xs text-[#1A1816] font-medium outline-none cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Additions</option>
              </select>
            </div>
            <span className="font-sans text-xs text-[#78716C] font-normal hidden sm:inline">
              Showing {filteredProducts.length} pieces
            </span>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && products.length === 0 ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 text-[#C84D1B] animate-spin mx-auto mb-3" />
            <p className="text-sm font-serif text-[#1A1816]">Loading Furniture Village Catalogue...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center space-y-3 bg-white rounded-3xl border border-stone-200/80 p-8">
            <p className="font-serif text-2xl text-[#1A1816]">No furniture found in this category</p>
            <p className="text-xs text-[#78716C]">Please choose another category or reset your filter.</p>
            <button
              onClick={() => setActiveCategory('all')}
              className="px-4 py-2 bg-[#1A1816] text-white text-xs rounded-full cursor-pointer hover:bg-stone-800 transition-colors"
            >
              View All Pieces
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const primaryVariant = product.variants?.[0];
              const isInStock = product.variants?.some((v) => v.inStock && (v.stock === undefined || v.stock > 0)) ?? true;

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group flex flex-col rounded-2xl border border-stone-200/80 bg-white overflow-hidden hover:border-[#1A1816]/30 transition-all duration-500 shadow-[0_4px_20px_rgba(26,24,22,0.03)] hover:shadow-[0_12px_32px_rgba(26,24,22,0.08)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EFE9]">
                    <Image
                      src={product.images.hero}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-104"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Stock badge */}
                    <div className="absolute top-3 right-3 z-10">
                      {isInStock ? (
                        <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-sans tracking-wider px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs border border-stone-200 text-emerald-800 font-medium shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>In Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-[10px] uppercase font-sans tracking-wider px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-xs border border-stone-200 text-stone-600 font-medium shadow-2xs">
                          <span>Out of Stock</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="font-sans text-[11px] uppercase tracking-widest text-[#C84D1B] font-semibold block mb-1">
                        {product.category}
                      </span>
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-serif text-xl text-[#1A1816] group-hover:text-[#C84D1B] transition-colors font-normal">
                          {product.name}
                        </h3>
                        <div className="text-right">
                          <span className="font-sans text-base font-semibold text-[#1A1816]">
                            {formatPrice(product.price)}
                          </span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="block text-[11px] text-[#78716C] line-through font-normal">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-[#57534E] mt-1.5 line-clamp-2 leading-relaxed">
                        {product.subtitle}
                      </p>
                    </div>

                    {/* Finishes preview */}
                    <div className="flex items-center space-x-1.5 pt-2">
                      {product.materials.woodOptions.slice(0, 3).map((w) => (
                        <span
                          key={w.id}
                          title={w.name}
                          className="w-3 h-3 rounded-full border border-black/15"
                          style={{ backgroundColor: w.colorHex }}
                        />
                      ))}
                      {product.materials.upholsteryOptions.length > 0 && (
                        <>
                          <span className="text-[#78716C]/40 text-xs px-0.5">/</span>
                          {product.materials.upholsteryOptions.slice(0, 3).map((f) => (
                            <span
                              key={f.id}
                              title={f.name}
                              className="w-3 h-3 rounded-full border border-black/15"
                              style={{ backgroundColor: f.colorHex }}
                            />
                          ))}
                        </>
                      )}
                      <span className="text-[11px] font-sans text-[#78716C] pl-1">
                        {product.variants.length > 1
                          ? `${product.variants.length} finishes available`
                          : primaryVariant?.finishName || 'Custom Finish'}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between text-xs">
                      <span className="uppercase tracking-wider text-xs font-semibold text-[#1A1816] group-hover:text-[#C84D1B] flex items-center space-x-1 transition-colors">
                        <span>Inspect Piece</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#C84D1B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                      <span className="text-xs text-[#78716C] font-normal">
                        {product.designer}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
