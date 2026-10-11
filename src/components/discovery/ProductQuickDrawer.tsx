'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Check, ArrowUpRight, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useSceneStore } from '@/store/useSceneStore';
import { useCartStore } from '@/store/useCartStore';
import { PRODUCTS_CATALOG, WOOD_MATERIALS, UPHOLSTERY_MATERIALS } from '@/data/catalog';

export const ProductQuickDrawer: React.FC = () => {
  const {
    activeProductId,
    isQuickDrawerOpen,
    setQuickDrawerOpen,
    selectedWoodId,
    selectedFabricId,
    setSelectedWood,
    setSelectedFabric,
  } = useSceneStore();

  const { addItem, setIsOpen: setCartOpen } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const product = PRODUCTS_CATALOG.find((p) => p.id === activeProductId) || PRODUCTS_CATALOG[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isQuickDrawerOpen) {
        setQuickDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuickDrawerOpen, setQuickDrawerOpen]);

  if (!isQuickDrawerOpen || !activeProductId) return null;

  const currentVariant = product.variants[0] || {
    id: `var-${product.id}`,
    name: 'Standard Edition',
    price: product.price,
  };

  const woodObj = WOOD_MATERIALS.find((w) => w.id === selectedWoodId) || WOOD_MATERIALS[0];
  const fabricObj = UPHOLSTERY_MATERIALS.find((f) => f.id === selectedFabricId) || UPHOLSTERY_MATERIALS[0];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: currentVariant.id,
      productName: product.name,
      variantName:
        product.materials.upholsteryOptions.length > 0
          ? `${woodObj.name} / ${fabricObj.name}`
          : woodObj.name,
      woodFinish: woodObj.name,
      fabricFinish: product.materials.upholsteryOptions.length > 0 ? fabricObj.name : 'None',
      unitPrice: product.price,
      quantity,
      image: product.images.hero,
    });

    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2400);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={() => setQuickDrawerOpen(false)}
      />

      {/* Slide-Over Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Product quick dossier: ${product.name}`}
        className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-charcoal-950/98 backdrop-blur-2xl border-l border-white/10 flex flex-col justify-between shadow-2xl animate-slideLeft overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.25em] text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span>Focal Product Dossier</span>
          </div>
          <button
            onClick={() => setQuickDrawerOpen(false)}
            className="p-1.5 text-sand-400 hover:text-white transition-colors"
            aria-label="Close product dossier drawer"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 flex-1">
          {/* Hero Thumbnail Preview */}
          <div className="relative aspect-[4/3] w-full border border-white/10 bg-charcoal-900 overflow-hidden">
            <Image
              src={product.images.hero}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
            <div className="absolute top-3 left-3 bg-charcoal-950/85 backdrop-blur-sm border border-white/10 px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-sand-300">
              {product.category} · {product.year}
            </div>
          </div>

          {/* Titles & Price */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-serif text-2xl md:text-3xl text-ivory font-light">
                {product.name}
              </h2>
              <span className="font-mono text-base text-accent font-semibold whitespace-nowrap">
                ${product.price.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-sand-300 font-light leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Timber Finishes (if applicable) */}
          {product.materials.woodOptions.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="uppercase tracking-widest text-sand-400">Timber Finish</span>
                <span className="text-ivory">{woodObj.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {WOOD_MATERIALS.map((wood) => (
                  <button
                    key={wood.id}
                    onClick={() => setSelectedWood(wood.id)}
                    className={`p-2 border text-left transition-all ${
                      selectedWoodId === wood.id
                        ? 'border-accent bg-accent/10'
                        : 'border-white/5 bg-charcoal-900/60 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${wood.swatchTone}`} />
                      {selectedWoodId === wood.id && <Check className="w-2.5 h-2.5 text-accent" />}
                    </div>
                    <p className="text-[10px] text-sand-200 line-clamp-1">{wood.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upholstery Finishes (if applicable) */}
          {product.materials.upholsteryOptions.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-white/5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="uppercase tracking-widest text-sand-400">Upholstery</span>
                <span className="text-ivory">{fabricObj.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {UPHOLSTERY_MATERIALS.map((fabric) => (
                  <button
                    key={fabric.id}
                    onClick={() => setSelectedFabric(fabric.id)}
                    className={`p-2 border text-left transition-all ${
                      selectedFabricId === fabric.id
                        ? 'border-accent bg-accent/10'
                        : 'border-white/5 bg-charcoal-900/60 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${fabric.swatchTone}`} />
                      {selectedFabricId === fabric.id && <Check className="w-2.5 h-2.5 text-accent" />}
                    </div>
                    <p className="text-[10px] text-sand-200 line-clamp-1">{fabric.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Architectural Dimensions */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5 text-center font-mono text-[10px]">
            <div className="bg-charcoal-900/40 p-2 border border-white/5">
              <span className="text-sand-500 uppercase block">Width</span>
              <span className="text-sand-200 font-semibold">{product.dimensions.widthCm} cm</span>
            </div>
            <div className="bg-charcoal-900/40 p-2 border border-white/5">
              <span className="text-sand-500 uppercase block">Depth</span>
              <span className="text-sand-200 font-semibold">{product.dimensions.depthCm} cm</span>
            </div>
            <div className="bg-charcoal-900/40 p-2 border border-white/5">
              <span className="text-sand-500 uppercase block">Height</span>
              <span className="text-sand-200 font-semibold">{product.dimensions.heightCm} cm</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 md:p-8 border-t border-white/10 bg-charcoal-950 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-white/15 bg-charcoal-900">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-sand-400 hover:text-white transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 text-xs font-mono text-ivory font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 text-sand-400 hover:text-white transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-ivory hover:bg-white text-charcoal-950 py-3.5 px-6 uppercase tracking-[0.25em] text-xs font-semibold transition-all duration-300 shadow-xl flex items-center justify-center space-x-2"
            >
              {addedFeedback ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added to Dossier</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Acquire Edition</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <Link
              href={`/products/${product.slug}`}
              className="text-sand-400 hover:text-accent inline-flex items-center space-x-1.5 uppercase tracking-widest text-[11px] transition-colors"
            >
              <span>Inspect Full 3D Dossier</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            <button
              onClick={() => {
                setQuickDrawerOpen(false);
                setCartOpen(true);
              }}
              className="text-accent hover:text-white uppercase tracking-widest text-[11px] transition-colors"
            >
              Open Bag →
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
