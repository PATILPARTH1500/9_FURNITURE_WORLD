'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Check, ShieldCheck, Truck, RotateCcw, Plus, Minus, Film, Camera } from 'lucide-react';
import { PRODUCTS_CATALOG, WOOD_MATERIALS, UPHOLSTERY_MATERIALS } from '@/data/catalog';
import { formatPrice } from '@/config/brand';
import { useSceneStore } from '@/store/useSceneStore';
import { useCartStore } from '@/store/useCartStore';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = PRODUCTS_CATALOG.find((p) => p.slug === params.slug) || PRODUCTS_CATALOG[0];
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'photos' | 'video'>('photos');
  const [selectedPhoto, setSelectedPhoto] = useState<'hero' | 'editorial' | 'detail' | 'inSitu'>('hero');

  const { selectedWoodId, selectedFabricId, setSelectedWood, setSelectedFabric } = useSceneStore();
  const { addItem, setIsOpen: setCartOpen } = useCartStore();

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
    setCartOpen(true);
  };

  const photoOptions = [
    { key: 'hero' as const, label: 'Main Angle', src: product.images.hero },
    { key: 'editorial' as const, label: 'In Room', src: product.images.editorial },
    { key: 'detail' as const, label: 'Close-Up', src: product.images.detail },
    { key: 'inSitu' as const, label: 'Lifestyle', src: product.images.inSitu },
  ];

  return (
    <main className="min-h-screen bg-cream text-checkerboard pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between text-xs font-sans text-checkerboard/70">
          <Link
            href="/collections"
            className="inline-flex items-center space-x-2 uppercase tracking-wider hover:text-tangerine transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Furniture</span>
          </Link>
          <span className="uppercase tracking-wider text-[11px] font-semibold text-tangerine bg-white/70 px-3 py-1 rounded-full border border-tangerine/20">
            Category: {product.category}
          </span>
        </div>

        {/* Main 2-Column Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: High-Res Photo Gallery & Room Video */}
          <div className="lg:col-span-7 space-y-6">
            {/* View Mode Toggle: Photos vs Room Video */}
            <div className="flex items-center space-x-2 text-xs font-sans tracking-wide overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('photos')}
                className={`py-2 px-4 rounded-xl border transition-all flex items-center space-x-2 ${
                  activeTab === 'photos'
                    ? 'border-tangerine bg-tangerine text-white font-semibold shadow-xs'
                    : 'border-checkerboard/15 bg-white text-checkerboard/70 hover:text-checkerboard hover:border-checkerboard/30 font-medium'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Product Photos (4)</span>
              </button>

              <button
                onClick={() => setActiveTab('video')}
                className={`py-2 px-4 rounded-xl border transition-all flex items-center space-x-2 ${
                  activeTab === 'video'
                    ? 'border-tangerine bg-tangerine text-white font-semibold shadow-xs'
                    : 'border-checkerboard/15 bg-white text-checkerboard/70 hover:text-checkerboard hover:border-checkerboard/30 font-medium'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Room Tour Video</span>
              </button>
            </div>

            {/* Display Area: Active Photo or Video */}
            {activeTab === 'photos' ? (
              <div className="space-y-4">
                {/* Main Large Photo */}
                <div className="relative aspect-[4/3] rounded-2xl border border-checkerboard/10 overflow-hidden bg-white shadow-sm">
                  <Image
                    src={product.images[selectedPhoto]}
                    alt={`${product.name} - ${selectedPhoto}`}
                    fill
                    className="object-cover transition-all duration-300"
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs border border-checkerboard/10 px-3 py-1 rounded-full text-xs font-sans font-medium text-checkerboard shadow-2xs">
                    {photoOptions.find((p) => p.key === selectedPhoto)?.label}
                  </div>
                </div>

                {/* Thumbnail Bar */}
                <div className="grid grid-cols-4 gap-3">
                  {photoOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSelectedPhoto(opt.key)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        selectedPhoto === opt.key
                          ? 'border-tangerine ring-2 ring-tangerine/30 scale-102 shadow-xs'
                          : 'border-checkerboard/10 hover:border-checkerboard/30 opacity-80 hover:opacity-100 bg-white'
                      }`}
                    >
                      <Image
                        src={opt.src}
                        alt={`${product.name} thumbnail`}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                      <span className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[9px] font-sans font-medium rounded py-0.5 text-center truncate px-1">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Room Tour Video */
              <div className="relative aspect-video w-full rounded-2xl border border-checkerboard/10 bg-black overflow-hidden shadow-xl">
                <video
                  src="/videos/scenes/scene-7-outro.mp4"
                  poster="/videos/scenes/posters/scene-7-outro.webp"
                  controls
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Design & Craftsmanship Story */}
            <div className="p-8 bg-white rounded-2xl border border-checkerboard/10 shadow-sm space-y-3">
              <span className="font-sans text-xs uppercase tracking-wider text-tangerine font-semibold">
                Design & Material Story
              </span>
              <p className="font-serif text-lg md:text-xl text-checkerboard italic font-normal leading-relaxed">
                &ldquo;{product.architecturalStatement}&rdquo;
              </p>
              <p className="font-sans text-xs text-walnut pt-2 font-medium">
                Designed by {product.designer}, {product.year}
              </p>
            </div>
          </div>

          {/* Right Column: Pricing, Finishes & Shopping Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3 pb-6 border-b border-checkerboard/10">
              <span className="font-sans text-xs tracking-wider uppercase text-tangerine font-semibold">
                {product.subtitle}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-checkerboard font-semibold tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline space-x-3 pt-2">
                <span className="font-sans text-3xl text-checkerboard font-bold">
                  {formatPrice(product.price, true)}
                </span>
                <span className="text-xs font-sans text-olive font-semibold bg-olive/10 px-2.5 py-1 rounded-full">
                  In Stock · Free Delivery
                </span>
              </div>
              <p className="text-xs text-walnut">Price includes all standard taxes and home delivery.</p>
            </div>

            <p className="text-sm text-checkerboard/85 font-normal leading-relaxed">
              {product.description}
            </p>

            {/* Finish Selection */}
            <div className="space-y-6 pt-4 border-t border-checkerboard/10">
              {/* Wood finish */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-sans">
                  <span className="uppercase text-walnut font-medium">Wood Finish</span>
                  <span className="text-checkerboard font-semibold">{selectedWood.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {WOOD_MATERIALS.map((wood) => (
                    <button
                      key={wood.id}
                      onClick={() => setSelectedWood(wood.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedWoodId === wood.id
                          ? 'border-tangerine bg-tangerine/5 ring-1 ring-tangerine shadow-xs'
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
                      <p className="text-xs font-medium text-checkerboard truncate">{wood.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upholstery finish */}
              {product.materials.upholsteryOptions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="uppercase text-walnut font-medium">Fabric Choice</span>
                    <span className="text-checkerboard font-semibold">{selectedFabric.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {UPHOLSTERY_MATERIALS.map((fab) => (
                      <button
                        key={fab.id}
                        onClick={() => setSelectedFabric(fab.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedFabricId === fab.id
                            ? 'border-tangerine bg-tangerine/5 ring-1 ring-tangerine shadow-xs'
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
                        <p className="text-xs font-medium text-checkerboard truncate">{fab.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity and Add to Bag */}
            <div className="space-y-4 pt-6 border-t border-checkerboard/10">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-checkerboard/20 bg-white rounded-xl px-3 py-3 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-tangerine transition-colors text-walnut"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 font-sans text-sm font-bold text-checkerboard">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:text-tangerine transition-colors text-walnut"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-tangerine hover:bg-coral text-white py-4 px-6 rounded-xl uppercase tracking-wider text-xs font-bold transition-all duration-300 shadow-warm hover:shadow-lg"
                >
                  Add to Bag · {formatPrice(product.price * quantity)}
                </button>
              </div>

              {/* Customer Promises */}
              <div className="grid grid-cols-2 gap-4 pt-4 text-xs text-walnut font-sans">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-tangerine shrink-0" />
                  <span>10-Year Frame Warranty</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-tangerine shrink-0" />
                  <span>Room-of-Choice Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-tangerine shrink-0" />
                  <span>30-Day Easy Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-tangerine shrink-0" />
                  <span>Free Setup & Assembly</span>
                </div>
              </div>
            </div>

            {/* Dimensions Specifications */}
            <div className="space-y-3 pt-6 border-t border-checkerboard/10">
              <h3 className="font-sans text-xs uppercase tracking-wider text-checkerboard font-semibold">
                Dimensions & Specifications
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs font-sans bg-white p-4 rounded-xl border border-checkerboard/10 shadow-sm">
                <div>
                  <span className="text-walnut block text-[11px]">Width:</span>
                  <span className="text-checkerboard font-semibold">{product.dimensions.widthCm} cm</span>
                </div>
                <div>
                  <span className="text-walnut block text-[11px]">Depth:</span>
                  <span className="text-checkerboard font-semibold">{product.dimensions.depthCm} cm</span>
                </div>
                <div>
                  <span className="text-walnut block text-[11px]">Height:</span>
                  <span className="text-checkerboard font-semibold">{product.dimensions.heightCm} cm</span>
                </div>
                <div>
                  <span className="text-walnut block text-[11px]">Net Weight:</span>
                  <span className="text-checkerboard font-semibold">{product.dimensions.weightKg} kg</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
