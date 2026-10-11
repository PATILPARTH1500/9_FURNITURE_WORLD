'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, ShieldCheck, Truck, RefreshCw, Plus, Minus } from 'lucide-react';
import { PRODUCTS_CATALOG, WOOD_MATERIALS, UPHOLSTERY_MATERIALS } from '@/data/catalog';
import { useSceneStore } from '@/store/useSceneStore';
import { useCartStore } from '@/store/useCartStore';

// Dynamically import ProductStudioViewer
const ProductStudioViewer = dynamic(
  () => import('@/components/3d/ProductStudioViewer').then((mod) => mod.ProductStudioViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[550px] lg:h-[700px] bg-charcoal-900 border border-white/10 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <span className="w-6 h-6 border border-white/20 border-t-accent rounded-full animate-spin" />
          <span className="text-[10px] font-mono tracking-widest uppercase text-sand-400">
            Initializing 3D Studio
          </span>
        </div>
      </div>
    ),
  }
);

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = PRODUCTS_CATALOG.find((p) => p.slug === params.slug) || PRODUCTS_CATALOG[0];
  const [quantity, setQuantity] = useState(1);
  const [viewMode, setViewMode] = useState<'3d' | 'editorial' | 'film'>('3d');

  const { selectedWoodId, selectedFabricId, setSelectedWood, setSelectedFabric } = useSceneStore();
  const { addItem } = useCartStore();

  const selectedWood = WOOD_MATERIALS.find((w) => w.id === selectedWoodId) || WOOD_MATERIALS[0];
  const selectedFabric =
    UPHOLSTERY_MATERIALS.find((f) => f.id === selectedFabricId) || UPHOLSTERY_MATERIALS[0];

  const handleAddToCart = () => {
    const currentVariant = product.variants[0];
    addItem({
      productId: product.id,
      variantId: currentVariant.id,
      productName: product.name,
      variantName: `${selectedWood.name} / ${selectedFabric.name}`,
      woodFinish: selectedWood.name,
      fabricFinish: selectedFabric.name,
      unitPrice: product.price,
      quantity,
      image: product.images.hero,
    });
  };

  return (
    <main className="min-h-screen bg-charcoal-950 text-sand-100 pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between text-xs font-mono text-sand-400">
          <Link
            href="/collections"
            className="inline-flex items-center space-x-2 uppercase tracking-widest hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Collections</span>
          </Link>
          <span className="uppercase tracking-widest text-[11px] text-accent">
            Series: {product.category}
          </span>
        </div>

        {/* Main 2-Column Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: 3D Studio Viewer / Editorial Images */}
          <div className="lg:col-span-7 space-y-6">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 text-xs font-mono tracking-widest uppercase overflow-x-auto">
              <button
                onClick={() => setViewMode('3d')}
                className={`py-2 px-4 border transition-all whitespace-nowrap ${
                  viewMode === '3d'
                    ? 'border-accent bg-accent/10 text-accent font-semibold'
                    : 'border-white/10 text-sand-400 hover:text-white'
                }`}
              >
                Interactive 3D Studio
              </button>
              <button
                onClick={() => setViewMode('editorial')}
                className={`py-2 px-4 border transition-all whitespace-nowrap ${
                  viewMode === 'editorial'
                    ? 'border-accent bg-accent/10 text-accent font-semibold'
                    : 'border-white/10 text-sand-400 hover:text-white'
                }`}
              >
                Editorial In Situ
              </button>
              <button
                onClick={() => setViewMode('film')}
                className={`py-2 px-4 border transition-all whitespace-nowrap ${
                  viewMode === 'film'
                    ? 'border-accent bg-accent/10 text-accent font-semibold'
                    : 'border-white/10 text-sand-400 hover:text-white'
                }`}
              >
                Brand Film (0:10)
              </button>
            </div>

            {viewMode === '3d' ? (
              <ProductStudioViewer />
            ) : viewMode === 'film' ? (
              <div className="relative aspect-video w-full border border-white/10 bg-black overflow-hidden shadow-2xl">
                <video
                  src="/videos/brand-film.mp4"
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-[4/3] border border-white/10 overflow-hidden bg-charcoal-900">
                  <Image
                    src={product.images.editorial}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative aspect-square border border-white/10 overflow-hidden bg-charcoal-900">
                    <Image
                      src={product.images.detail}
                      alt={`${product.name} detail`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square border border-white/10 overflow-hidden bg-charcoal-900">
                    <Image
                      src={product.images.inSitu}
                      alt={`${product.name} in situ`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Architectural Statement */}
            <div className="p-8 bg-charcoal-900/60 border border-white/5 space-y-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent">
                Architectural Statement
              </span>
              <p className="font-serif text-lg md:text-xl text-ivory italic font-light leading-relaxed">
                {product.architecturalStatement}
              </p>
              <p className="font-mono text-xs text-sand-400 pt-2">
                — {product.designer}, {product.year}
              </p>
            </div>
          </div>

          {/* Right Column: Specifications, Finishes & Commerce Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3 pb-6 border-b border-white/10">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-sand-400">
                {product.subtitle}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl text-ivory font-light tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline space-x-3 pt-2">
                <span className="font-mono text-2xl text-ivory font-light">
                  ${product.price.toLocaleString()} {product.currency}
                </span>
                <span className="text-[11px] font-mono text-sand-400 uppercase">
                  Made to Order · 4–6 Wks
                </span>
              </div>
            </div>

            <p className="text-sm text-sand-300 font-light leading-relaxed">
              {product.description}
            </p>

            {/* Finish Selection */}
            <div className="space-y-6 pt-4 border-t border-white/10">
              {/* Timber finish */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="uppercase text-sand-400">Timber Finish</span>
                  <span className="text-ivory font-medium">{selectedWood.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {WOOD_MATERIALS.map((wood) => (
                    <button
                      key={wood.id}
                      onClick={() => setSelectedWood(wood.id)}
                      className={`p-3 border text-left transition-all ${
                        selectedWoodId === wood.id
                          ? 'border-accent bg-charcoal-800'
                          : 'border-white/10 hover:border-white/30 bg-charcoal-900/40'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/40"
                          style={{ backgroundColor: wood.colorHex }}
                        />
                        {selectedWoodId === wood.id && <Check className="w-3 h-3 text-accent ml-auto" />}
                      </div>
                      <p className="text-[10px] text-ivory truncate">{wood.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upholstery finish */}
              {product.materials.upholsteryOptions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="uppercase text-sand-400">Upholstery Specification</span>
                    <span className="text-ivory font-medium">{selectedFabric.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {UPHOLSTERY_MATERIALS.map((fab) => (
                      <button
                        key={fab.id}
                        onClick={() => setSelectedFabric(fab.id)}
                        className={`p-3 border text-left transition-all ${
                          selectedFabricId === fab.id
                            ? 'border-accent bg-charcoal-800'
                            : 'border-white/10 hover:border-white/30 bg-charcoal-900/40'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/40"
                            style={{ backgroundColor: fab.colorHex }}
                          />
                          {selectedFabricId === fab.id && <Check className="w-3 h-3 text-accent ml-auto" />}
                        </div>
                        <p className="text-[10px] text-ivory truncate">{fab.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-white/15 px-3 py-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-accent transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 font-mono text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:text-accent transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-accent hover:bg-accent-light text-charcoal-950 py-4 px-6 uppercase tracking-[0.25em] text-xs font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl"
                >
                  Acquire Edition · ${(product.price * quantity).toLocaleString()}
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4 pt-4 text-[11px] text-sand-400 font-mono">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span>Lifetime Structural Joinery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-accent" />
                  <span>White-Glove Delivery</span>
                </div>
              </div>
            </div>

            {/* Architectural Dimensions Spec Sheet */}
            <div className="space-y-3 pt-6 border-t border-white/10">
              <h3 className="font-mono text-xs uppercase tracking-widest text-ivory">
                Dimensions & Craftsmanship Specs
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-charcoal-900/40 p-4 border border-white/5">
                <div>
                  <span className="text-sand-500 block text-[10px]">Width:</span>
                  <span className="text-ivory">{product.dimensions.widthCm} cm</span>
                </div>
                <div>
                  <span className="text-sand-500 block text-[10px]">Depth:</span>
                  <span className="text-ivory">{product.dimensions.depthCm} cm</span>
                </div>
                <div>
                  <span className="text-sand-500 block text-[10px]">Height:</span>
                  <span className="text-ivory">{product.dimensions.heightCm} cm</span>
                </div>
                <div>
                  <span className="text-sand-500 block text-[10px]">Net Weight:</span>
                  <span className="text-ivory">{product.dimensions.weightKg} kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

