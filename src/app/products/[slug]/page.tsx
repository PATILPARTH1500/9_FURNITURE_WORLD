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
      <div className="w-full h-[550px] lg:h-[700px] bg-white/80 border border-checkerboard/10 rounded-2xl flex items-center justify-center shadow-sm">
        <div className="flex flex-col items-center space-y-3">
          <span className="w-7 h-7 border-2 border-checkerboard/20 border-t-tangerine rounded-full animate-spin" />
          <span className="text-[11px] font-mono tracking-wider uppercase text-checkerboard/60">
            Loading 3D Studio
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
    <main className="min-h-screen bg-cream text-checkerboard pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between text-xs font-mono text-checkerboard/60">
          <Link
            href="/collections"
            className="inline-flex items-center space-x-2 uppercase tracking-wider hover:text-tangerine transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Collections</span>
          </Link>
          <span className="uppercase tracking-wider text-[11px] font-semibold text-tangerine">
            Category: {product.category}
          </span>
        </div>

        {/* Main 2-Column Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: 3D Studio Viewer / Editorial Images */}
          <div className="lg:col-span-7 space-y-6">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 text-xs font-mono tracking-wider uppercase overflow-x-auto pb-1">
              <button
                onClick={() => setViewMode('3d')}
                className={`py-2 px-4 rounded-lg border transition-all whitespace-nowrap ${
                  viewMode === '3d'
                    ? 'border-tangerine bg-tangerine text-white font-semibold shadow-sm'
                    : 'border-checkerboard/15 bg-white/70 text-checkerboard/70 hover:text-checkerboard hover:border-checkerboard/30'
                }`}
              >
                Interactive 3D Studio
              </button>
              <button
                onClick={() => setViewMode('editorial')}
                className={`py-2 px-4 rounded-lg border transition-all whitespace-nowrap ${
                  viewMode === 'editorial'
                    ? 'border-tangerine bg-tangerine text-white font-semibold shadow-sm'
                    : 'border-checkerboard/15 bg-white/70 text-checkerboard/70 hover:text-checkerboard hover:border-checkerboard/30'
                }`}
              >
                In The Room
              </button>
              <button
                onClick={() => setViewMode('film')}
                className={`py-2 px-4 rounded-lg border transition-all whitespace-nowrap ${
                  viewMode === 'film'
                    ? 'border-tangerine bg-tangerine text-white font-semibold shadow-sm'
                    : 'border-checkerboard/15 bg-white/70 text-checkerboard/70 hover:text-checkerboard hover:border-checkerboard/30'
                }`}
              >
                Brand Film (0:10)
              </button>
            </div>

            {viewMode === '3d' ? (
              <ProductStudioViewer />
            ) : viewMode === 'film' ? (
              <div className="relative aspect-video w-full rounded-2xl border border-checkerboard/10 bg-black overflow-hidden shadow-xl">
                <video
                  src="/videos/scenes/scene-7-outro.mp4"
                  poster="/videos/scenes/posters/scene-7-outro.jpg"
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-[4/3] rounded-2xl border border-checkerboard/10 overflow-hidden bg-white shadow-sm">
                  <Image
                    src={product.images.editorial}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative aspect-square rounded-xl border border-checkerboard/10 overflow-hidden bg-white shadow-sm">
                    <Image
                      src={product.images.detail}
                      alt={`${product.name} detail`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square rounded-xl border border-checkerboard/10 overflow-hidden bg-white shadow-sm">
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

            {/* Design Story */}
            <div className="p-8 bg-white/80 rounded-2xl border border-checkerboard/10 shadow-sm space-y-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-tangerine font-semibold">
                Design Story
              </span>
              <p className="font-serif text-lg md:text-xl text-checkerboard italic font-normal leading-relaxed">
                &ldquo;{product.architecturalStatement}&rdquo;
              </p>
              <p className="font-mono text-xs text-checkerboard/60 pt-2">
                Designed by {product.designer}, {product.year}
              </p>
            </div>
          </div>

          {/* Right Column: Specifications, Finishes & Commerce Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3 pb-6 border-b border-checkerboard/10">
              <span className="font-mono text-[10px] tracking-wider uppercase text-tangerine font-semibold">
                {product.subtitle}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl text-checkerboard font-normal tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline space-x-3 pt-2">
                <span className="font-mono text-2xl text-checkerboard font-semibold">
                  ${product.price.toLocaleString()} {product.currency}
                </span>
                <span className="text-[11px] font-mono text-olive font-medium uppercase bg-olive/10 px-2 py-0.5 rounded">
                  In Stock · Free Delivery
                </span>
              </div>
            </div>

            <p className="text-sm text-checkerboard/80 font-normal leading-relaxed">
              {product.description}
            </p>

            {/* Finish Selection */}
            <div className="space-y-6 pt-4 border-t border-checkerboard/10">
              {/* Timber finish */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="uppercase text-checkerboard/60">Wood Finish</span>
                  <span className="text-checkerboard font-semibold">{selectedWood.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {WOOD_MATERIALS.map((wood) => (
                    <button
                      key={wood.id}
                      onClick={() => setSelectedWood(wood.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedWoodId === wood.id
                          ? 'border-tangerine bg-tangerine/5 ring-1 ring-tangerine'
                          : 'border-checkerboard/15 hover:border-checkerboard/30 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: wood.colorHex }}
                        />
                        {selectedWoodId === wood.id && <Check className="w-3 h-3 text-tangerine ml-auto" />}
                      </div>
                      <p className="text-[11px] font-medium text-checkerboard truncate">{wood.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upholstery finish */}
              {product.materials.upholsteryOptions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="uppercase text-checkerboard/60">Fabric Choice</span>
                    <span className="text-checkerboard font-semibold">{selectedFabric.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {UPHOLSTERY_MATERIALS.map((fab) => (
                      <button
                        key={fab.id}
                        onClick={() => setSelectedFabric(fab.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedFabricId === fab.id
                            ? 'border-tangerine bg-tangerine/5 ring-1 ring-tangerine'
                            : 'border-checkerboard/15 hover:border-checkerboard/30 bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: fab.colorHex }}
                          />
                          {selectedFabricId === fab.id && <Check className="w-3 h-3 text-tangerine ml-auto" />}
                        </div>
                        <p className="text-[11px] font-medium text-checkerboard truncate">{fab.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4 pt-6 border-t border-checkerboard/10">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-checkerboard/20 bg-white rounded-xl px-3 py-3 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-tangerine transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 font-mono text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:text-tangerine transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-tangerine hover:bg-tangerine-hover text-white py-4 px-6 rounded-xl uppercase tracking-wider text-xs font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Add to Bag · ${(product.price * quantity).toLocaleString()}
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-4 pt-4 text-[11px] text-checkerboard/70 font-mono">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-tangerine" />
                  <span>10-Year Frame Guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-tangerine" />
                  <span>Room-of-Choice Delivery</span>
                </div>
              </div>
            </div>

            {/* Dimensions Spec Sheet */}
            <div className="space-y-3 pt-6 border-t border-checkerboard/10">
              <h3 className="font-mono text-xs uppercase tracking-wider text-checkerboard font-semibold">
                Dimensions & Specifications
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-white/80 p-4 rounded-xl border border-checkerboard/10 shadow-sm">
                <div>
                  <span className="text-checkerboard/50 block text-[10px]">Width:</span>
                  <span className="text-checkerboard font-medium">{product.dimensions.widthCm} cm</span>
                </div>
                <div>
                  <span className="text-checkerboard/50 block text-[10px]">Depth:</span>
                  <span className="text-checkerboard font-medium">{product.dimensions.depthCm} cm</span>
                </div>
                <div>
                  <span className="text-checkerboard/50 block text-[10px]">Height:</span>
                  <span className="text-checkerboard font-medium">{product.dimensions.heightCm} cm</span>
                </div>
                <div>
                  <span className="text-checkerboard/50 block text-[10px]">Net Weight:</span>
                  <span className="text-checkerboard font-medium">{product.dimensions.weightKg} kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

