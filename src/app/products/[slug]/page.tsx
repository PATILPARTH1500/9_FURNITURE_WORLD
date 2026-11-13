'use client';

import React, { useState } from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import { Check, ShieldCheck, Truck, RotateCcw, Plus, Minus, Film, Camera, ArrowUpRight, Ruler, Award } from 'lucide-react';
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

  // Dynamic contextual room tour video matching the product's living space
  const roomTourVideo = (() => {
    switch (product.category) {
      case 'seating':
        return {
          src: '/videos/scenes/desktop/scene-1-living.mp4',
          poster: '/videos/scenes/posters/scene-1-living.webp',
          roomName: 'Living Room Setting',
        };
      case 'tables':
        return {
          src: '/videos/scenes/desktop/scene-2-dining.mp4',
          poster: '/videos/scenes/posters/scene-2-dining.webp',
          roomName: 'Dining Room Setting',
        };
      case 'beds':
        return {
          src: '/videos/scenes/desktop/scene-5-bedroom.mp4',
          poster: '/videos/scenes/posters/scene-5-bedroom.webp',
          roomName: 'Bedroom Setting',
        };
      case 'lighting':
        return {
          src: '/videos/scenes/desktop/scene-3-kitchen.mp4',
          poster: '/videos/scenes/posters/scene-3-kitchen.webp',
          roomName: 'Kitchen & Ambient Studio',
        };
      default:
        return {
          src: '/videos/scenes/scene-7-outro.mp4',
          poster: '/videos/scenes/posters/scene-7-outro.webp',
          roomName: 'Architectural Showroom Tour',
        };
    }
  })();

  // Related companion pieces to complete the room
  const relatedProducts = PRODUCTS_CATALOG.filter((p) => p.id !== product.id).slice(0, 3);

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
    <main className="min-h-screen bg-[#FBF9F5] text-[#1A1816] pt-28 pb-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-sans text-[#78716C] gap-2 border-b border-stone-200/80 pb-4">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2">
            <Link href="/" className="hover:text-[#1A1816] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-[#1A1816] transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-[#1A1816] font-medium">{product.name}</span>
          </nav>
          <span className="uppercase tracking-widest text-[11px] font-semibold text-[#C84D1B]">
            {product.category}
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
                className={`py-2 px-4 rounded-full border transition-all flex items-center space-x-2 ${
                  activeTab === 'photos'
                    ? 'border-[#1A1816] bg-[#1A1816] text-white font-medium shadow-xs'
                    : 'border-stone-200/80 bg-white text-[#57534E] hover:text-[#1A1816] font-normal'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Product Photography (4 Angles)</span>
              </button>

              <button
                onClick={() => setActiveTab('video')}
                className={`py-2 px-4 rounded-full border transition-all flex items-center space-x-2 ${
                  activeTab === 'video'
                    ? 'border-[#1A1816] bg-[#1A1816] text-white font-medium shadow-xs'
                    : 'border-stone-200/80 bg-white text-[#57534E] hover:text-[#1A1816] font-normal'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>{roomTourVideo.roomName} Video</span>
              </button>
            </div>

            {/* Display Area: Active Photo or Video */}
            {activeTab === 'photos' ? (
              <div className="space-y-4">
                {/* Main Large Photo */}
                <div className="relative aspect-[4/3] rounded-2xl border border-stone-200/80 overflow-hidden bg-white shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
                  <Image
                    src={product.images[selectedPhoto]}
                    alt={`${product.name} - ${selectedPhoto}`}
                    fill
                    className="object-cover transition-all duration-300"
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                </div>

                {/* Thumbnail Bar */}
                <div className="grid grid-cols-4 gap-3">
                  {photoOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSelectedPhoto(opt.key)}
                      className={`relative aspect-square rounded-xl overflow-hidden border transition-all ${
                        selectedPhoto === opt.key
                          ? 'border-[#1A1816] ring-1 ring-[#1A1816] shadow-2xs'
                          : 'border-stone-200/80 hover:border-stone-400 opacity-80 hover:opacity-100 bg-white'
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
              <div className="relative aspect-video w-full rounded-2xl border border-stone-200/80 bg-black overflow-hidden shadow-xl">
                <video
                  src={roomTourVideo.src}
                  poster={roomTourVideo.poster}
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
            <div className="p-8 bg-white rounded-2xl border border-stone-200/80 shadow-[0_4px_20px_rgba(26,24,22,0.03)] space-y-3">
              <span className="font-sans text-[11px] uppercase tracking-widest text-[#C84D1B] font-semibold block">
                Design & Material Philosophy
              </span>
              <p className="font-serif text-lg md:text-xl text-[#1A1816] italic font-light leading-relaxed">
                &ldquo;{product.architecturalStatement}&rdquo;
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-[#78716C] border-t border-stone-200/80 font-normal">
                <span>Designed by {product.designer}</span>
                <span className="font-sans text-[#C84D1B] font-medium">{product.year} Collection</span>
              </div>
            </div>

            {/* Architectural Blueprint Specifications */}
            <div className="p-8 bg-white rounded-2xl border border-stone-200/80 shadow-[0_4px_20px_rgba(26,24,22,0.03)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
                <div className="flex items-center space-x-2">
                  <Ruler className="w-4 h-4 text-[#C84D1B]" />
                  <h3 className="font-sans text-xs uppercase tracking-widest text-[#1A1816] font-medium">
                    Dimensions & Specifications
                  </h3>
                </div>
                <span className="font-sans text-xs text-[#78716C]">Metric (cm / kg)</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                <div className="p-3 bg-[#F2EFE9]/60 rounded-xl border border-stone-200/80 text-center">
                  <span className="text-[#78716C] block text-[10px] font-sans uppercase tracking-wider">Width</span>
                  <span className="text-[#1A1816] font-sans text-base font-semibold">{product.dimensions.widthCm} cm</span>
                </div>
                <div className="p-3 bg-[#F2EFE9]/60 rounded-xl border border-stone-200/80 text-center">
                  <span className="text-[#78716C] block text-[10px] font-sans uppercase tracking-wider">Depth</span>
                  <span className="text-[#1A1816] font-sans text-base font-semibold">{product.dimensions.depthCm} cm</span>
                </div>
                <div className="p-3 bg-[#F2EFE9]/60 rounded-xl border border-stone-200/80 text-center">
                  <span className="text-[#78716C] block text-[10px] font-sans uppercase tracking-wider">Height</span>
                  <span className="text-[#1A1816] font-sans text-base font-semibold">{product.dimensions.heightCm} cm</span>
                </div>
                <div className="p-3 bg-[#F2EFE9]/60 rounded-xl border border-stone-200/80 text-center">
                  <span className="text-[#78716C] block text-[10px] font-sans uppercase tracking-wider">Net Weight</span>
                  <span className="text-[#1A1816] font-sans text-base font-semibold">{product.dimensions.weightKg} kg</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-sans text-[#78716C]">
                <span className="flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 text-[#C84D1B]" />
                  <span>FSC® 100% Certified Sustainable Timber</span>
                </span>
                <span>Crafted in Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing, Finishes & Shopping Actions */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3 pb-6 border-b border-stone-200/80">
              <span className="font-sans text-xs tracking-widest uppercase text-[#C84D1B] font-semibold">
                {product.subtitle}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1A1816] font-light tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline space-x-3 pt-2">
                <span className="font-sans text-3xl text-[#1A1816] font-semibold">
                  {formatPrice(product.price, true)}
                </span>
                <span className="text-xs font-sans text-[#2B5238] font-semibold bg-[#2B5238]/10 px-3 py-1 rounded-full border border-[#2B5238]/20">
                  In Stock · White Glove Setup
                </span>
              </div>
              <p className="text-xs text-[#78716C]">
                Inclusive of all applicable GST, delivery to room of choice, and full packaging removal.
              </p>
            </div>

            <p className="text-sm text-[#57534E] font-normal leading-relaxed">
              {product.description}
            </p>

            {/* Finish Selection */}
            <div className="space-y-6 pt-4 border-t border-stone-200/80">
              {/* Wood finish */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-sans">
                  <span className="uppercase text-[#78716C] font-medium tracking-wider">Wood Finish</span>
                  <span className="text-[#1A1816] font-medium">{selectedWood.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {WOOD_MATERIALS.map((wood) => (
                    <button
                      key={wood.id}
                      onClick={() => setSelectedWood(wood.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedWoodId === wood.id
                          ? 'border-[#1A1816] bg-[#1A1816]/5 ring-1 ring-[#1A1816] shadow-2xs'
                          : 'border-stone-200/80 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/15"
                          style={{ backgroundColor: wood.colorHex }}
                        />
                        {selectedWoodId === wood.id && <Check className="w-3 h-3 text-[#1A1816] ml-auto" />}
                      </div>
                      <p className="text-xs font-medium text-[#1A1816] truncate">{wood.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upholstery finish */}
              {product.materials.upholsteryOptions.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="uppercase text-[#78716C] font-medium tracking-wider">Tactile Fabric</span>
                    <span className="text-[#1A1816] font-medium">{selectedFabric.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {UPHOLSTERY_MATERIALS.map((fab) => (
                      <button
                        key={fab.id}
                        onClick={() => setSelectedFabric(fab.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedFabricId === fab.id
                            ? 'border-[#1A1816] bg-[#1A1816]/5 ring-1 ring-[#1A1816] shadow-2xs'
                            : 'border-stone-200/80 hover:border-stone-400 bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15"
                            style={{ backgroundColor: fab.colorHex }}
                          />
                          {selectedFabricId === fab.id && <Check className="w-3 h-3 text-[#1A1816] ml-auto" />}
                        </div>
                        <p className="text-xs font-medium text-[#1A1816] truncate">{fab.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity and Add to Bag */}
            <div className="space-y-4 pt-6 border-t border-stone-200/80">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-stone-200/80 bg-white rounded-xl px-3 py-3 shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:text-[#1A1816] transition-colors text-[#78716C]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 font-sans text-sm font-semibold text-[#1A1816]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 hover:text-[#1A1816] transition-colors text-[#78716C]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#1A1816] hover:bg-[#C84D1B] text-white py-4 px-6 rounded-xl uppercase tracking-wider text-xs font-semibold transition-all duration-300 shadow-sm hover:shadow-md active:scale-98"
                >
                  Add to Cart · {formatPrice(product.price * quantity)}
                </button>
              </div>

              {/* Customer Promises */}
              <div className="grid grid-cols-2 gap-4 pt-4 text-xs text-[#57534E] font-sans bg-white p-4 rounded-xl border border-stone-200/80">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#C84D1B] shrink-0" />
                  <span>10-Year Frame Warranty</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-[#C84D1B] shrink-0" />
                  <span>Room-of-Choice Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RotateCcw className="w-4 h-4 text-[#C84D1B] shrink-0" />
                  <span>30-Day Easy Returns</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#C84D1B] shrink-0" />
                  <span>Free Setup & Assembly</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complete the Living Space: Companion Pieces */}
        <div className="mt-28 pt-16 border-t border-stone-200/80">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-stone-200/80">
            <div>
              <span className="font-sans text-[11px] uppercase tracking-widest text-[#C84D1B] font-semibold block">
                Harmonious Living
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1A1816] font-light mt-1">
                Complete the Living Space
              </h2>
            </div>
            <Link
              href="/collections"
              className="font-sans text-xs text-[#C84D1B] hover:text-[#A73D12] transition-colors font-medium flex items-center space-x-1"
            >
              <span>Explore All Suites</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedProducts.map((rel) => (
              <Link
                key={rel.id}
                href={`/products/${rel.slug}`}
                className="group flex flex-col rounded-2xl border border-stone-200/80 bg-white overflow-hidden hover:border-[#1A1816]/30 transition-all duration-500 shadow-[0_4px_20px_rgba(26,24,22,0.03)] hover:shadow-[0_12px_32px_rgba(26,24,22,0.08)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EFE9]">
                  <Image
                    src={rel.images.hero}
                    alt={rel.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-104"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-widest text-[#C84D1B] font-semibold block mb-1">
                      {rel.category}
                    </span>
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="font-serif text-lg text-[#1A1816] group-hover:text-[#C84D1B] transition-colors font-normal">
                        {rel.name}
                      </h4>
                      <span className="font-sans text-sm font-semibold text-[#1A1816]">
                        {formatPrice(rel.price)}
                      </span>
                    </div>
                    <p className="text-xs text-[#78716C] mt-1 line-clamp-1">{rel.subtitle}</p>
                  </div>
                  <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs">
                    <span className="font-sans text-xs uppercase tracking-wider text-[#1A1816] font-medium group-hover:text-[#C84D1B] flex items-center space-x-1">
                      <span>View Details</span>
                      <ArrowUpRight className="w-3 h-3 text-[#C84D1B]" />
                    </span>
                    <span className="text-xs text-[#78716C] font-normal">{rel.designer}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
