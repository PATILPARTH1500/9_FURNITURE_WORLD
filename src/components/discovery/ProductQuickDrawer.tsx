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
    setTimeout(() => {
      setAddedFeedback(false);
      setQuickDrawerOpen(false);
      setCartOpen(true);
    }, 900);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-checkerboard/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setQuickDrawerOpen(false)}
      />

      {/* Slide-Over Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Product quick view: ${product.name}`}
        className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-cream text-checkerboard border-l border-checkerboard/15 flex flex-col justify-between shadow-2xl overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-checkerboard/10 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2 text-xs font-sans uppercase tracking-wider text-tangerine font-semibold">
            <span>Quick Product View</span>
          </div>
          <button
            onClick={() => setQuickDrawerOpen(false)}
            className="p-1.5 rounded-full hover:bg-cream text-walnut hover:text-checkerboard transition-colors"
            aria-label="Close product view"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 flex-1 bg-cream">
          {/* Hero Thumbnail Preview */}
          <div className="relative aspect-[4/3] w-full rounded-xl border border-checkerboard/10 bg-cream-dark overflow-hidden">
            <Image
              src={product.images.hero}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              priority
            />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs border border-checkerboard/10 px-3 py-1 rounded-full text-xs font-sans font-semibold tracking-wide text-checkerboard shadow-2xs">
              {product.category}
            </div>
          </div>

          {/* Titles & Price */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-serif text-2xl md:text-3xl text-checkerboard font-semibold">
                {product.name}
              </h2>
              <span className="font-sans text-xl text-tangerine font-bold whitespace-nowrap">
                ${product.price.toLocaleString()}
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-walnut leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Timber Finishes (if applicable) */}
          {product.materials.woodOptions.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-checkerboard/10">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="uppercase tracking-wider text-walnut font-medium">Wood Finish</span>
                <span className="text-checkerboard font-semibold">{woodObj.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {WOOD_MATERIALS.map((wood) => (
                  <button
                    key={wood.id}
                    onClick={() => setSelectedWood(wood.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      selectedWoodId === wood.id
                        ? 'border-tangerine bg-white shadow-xs'
                        : 'border-checkerboard/10 bg-white/50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span className={`w-3 h-3 rounded-full ${wood.swatchTone} border border-checkerboard/20`} />
                      {selectedWoodId === wood.id && <Check className="w-3 h-3 text-tangerine" />}
                    </div>
                    <p className="font-sans text-xs text-checkerboard line-clamp-1 font-medium">{wood.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upholstery Finishes (if applicable) */}
          {product.materials.upholsteryOptions.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-checkerboard/10">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="uppercase tracking-wider text-walnut font-medium">Upholstery Fabric</span>
                <span className="text-checkerboard font-semibold">{fabricObj.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {UPHOLSTERY_MATERIALS.map((fabric) => (
                  <button
                    key={fabric.id}
                    onClick={() => setSelectedFabric(fabric.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      selectedFabricId === fabric.id
                        ? 'border-tangerine bg-white shadow-xs'
                        : 'border-checkerboard/10 bg-white/50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span className={`w-3 h-3 rounded-full ${fabric.swatchTone} border border-checkerboard/20`} />
                      {selectedFabricId === fabric.id && <Check className="w-3 h-3 text-tangerine" />}
                    </div>
                    <p className="font-sans text-xs text-checkerboard line-clamp-1 font-medium">{fabric.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Dimensions */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-checkerboard/10 text-center font-sans text-xs">
            <div className="bg-white p-2.5 rounded-lg border border-checkerboard/10">
              <span className="text-walnut uppercase tracking-wider text-[10px] block font-medium">Width</span>
              <span className="text-checkerboard font-bold">{product.dimensions.widthCm} cm</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-checkerboard/10">
              <span className="text-walnut uppercase tracking-wider text-[10px] block font-medium">Depth</span>
              <span className="text-checkerboard font-bold">{product.dimensions.depthCm} cm</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-checkerboard/10">
              <span className="text-walnut uppercase tracking-wider text-[10px] block font-medium">Height</span>
              <span className="text-checkerboard font-bold">{product.dimensions.heightCm} cm</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 md:p-8 border-t border-checkerboard/10 bg-white space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-checkerboard/15 bg-cream rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-walnut hover:text-checkerboard transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 text-xs font-sans text-checkerboard font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 text-walnut hover:text-checkerboard transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-tangerine hover:bg-coral text-white py-3.5 px-6 uppercase tracking-wider text-xs font-semibold rounded-full transition-all duration-300 shadow-warm flex items-center justify-center space-x-2"
            >
              {addedFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-sans pt-1">
            <Link
              href={`/products/${product.slug}`}
              className="text-walnut hover:text-tangerine inline-flex items-center space-x-1.5 font-medium transition-colors"
            >
              <span>View Full Details</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-tangerine" />
            </Link>

            <button
              onClick={() => {
                setQuickDrawerOpen(false);
                setCartOpen(true);
              }}
              className="text-tangerine hover:text-coral font-medium transition-colors"
            >
              Open Bag →
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
