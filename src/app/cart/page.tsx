'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Minus, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { BRAND_CONFIG, formatPrice } from '@/config/brand';
import confetti from 'canvas-confetti';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const freeShippingThreshold = BRAND_CONFIG.freeShippingThreshold;
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = qualifiesForFreeShipping ? 0 : 250;
  const total = subtotal + shippingCost;

  const handleSimulateCheckout = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const orderRef = `FV-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderConfirmation(orderRef);
      setIsSubmitting(false);
      clearCart();
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F4510B', '#F4B82E', '#626B3D', '#E66B45'],
        });
      } catch {
        // no-op
      }
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-cream text-checkerboard pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between pb-6 border-b border-checkerboard/10">
          <div>
            <span className="font-mono text-[10px] tracking-wider uppercase text-tangerine font-semibold">
              Your Order
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-checkerboard font-normal mt-1">
              Shopping Bag
            </h1>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-checkerboard/70 hover:text-tangerine font-mono font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {orderConfirmation ? (
          <div className="max-w-xl mx-auto py-16 text-center space-y-6 bg-white rounded-2xl border border-checkerboard/10 p-12 shadow-md">
            <CheckCircle2 className="w-16 h-16 text-leaf mx-auto stroke-[1.5]" />
            <h2 className="font-serif text-3xl text-checkerboard">
              Thank You for Your Order!
            </h2>
            <p className="text-sm text-checkerboard/80 font-normal leading-relaxed">
              Order number <span className="font-mono text-checkerboard font-bold bg-cream px-2 py-0.5 rounded">{orderConfirmation}</span> has been confirmed. Our Furniture Village customer care team will contact you to coordinate delivery logistics and room setup.
            </p>
            <div className="p-4 bg-cream/70 rounded-xl border border-checkerboard/10 text-[11px] font-mono text-checkerboard/70">
              Free room-of-choice delivery and packaging removal are included with your order.
            </div>
            <div className="pt-4">
              <Link
                href="/collections"
                className="inline-block bg-tangerine hover:bg-tangerine-hover text-white py-3.5 px-8 rounded-xl uppercase tracking-wider text-xs font-bold transition-all shadow-md"
              >
                Explore More Furniture
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="py-24 text-center space-y-6 max-w-md mx-auto">
            <p className="font-serif text-2xl text-checkerboard">Your shopping bag is empty.</p>
            <p className="text-xs text-checkerboard/70 leading-relaxed">
              Explore our handcrafted sofas, solid oak dining tables, and warm bedroom suites to begin furnishing your home.
            </p>
            <div className="pt-4">
              <Link
                href="/collections"
                className="inline-block bg-tangerine hover:bg-tangerine-hover text-white py-3.5 px-8 rounded-xl uppercase tracking-wider text-xs font-bold transition-all shadow-md"
              >
                Browse Collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-6 bg-white rounded-2xl border border-checkerboard/10 shadow-sm flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-start"
                >
                  <div className="relative w-28 h-28 bg-cream/50 rounded-xl border border-checkerboard/10 flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between w-full h-full min-h-[7rem]">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-xl text-checkerboard tracking-wide font-medium">
                          {item.productName}
                        </h3>
                        <span className="font-mono text-base font-bold text-checkerboard">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                      <p className="text-xs text-checkerboard/60 font-mono mt-1">
                        Finishes: {item.woodFinish} {item.fabricFinish ? `· ${item.fabricFinish}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-checkerboard/5">
                      <div className="flex items-center border border-checkerboard/20 rounded-lg bg-cream/30 text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-3 py-1.5 hover:text-tangerine transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 font-mono text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-1.5 hover:text-tangerine transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-checkerboard/50 hover:text-red-500 transition-colors flex items-center space-x-1.5 text-xs font-mono font-medium"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl border border-checkerboard/10 p-8 space-y-6 shadow-sm">
                <h2 className="font-mono text-xs uppercase tracking-wider text-checkerboard font-semibold border-b border-checkerboard/10 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-checkerboard/70">
                    <span>Subtotal</span>
                    <span className="font-mono text-checkerboard font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-checkerboard/70">
                    <span>Delivery</span>
                    <span className="font-mono text-checkerboard font-medium">
                      {qualifiesForFreeShipping ? `Free (Orders over ${formatPrice(freeShippingThreshold)})` : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-checkerboard/70">
                    <span>GST (Estimated)</span>
                    <span className="font-mono text-checkerboard font-medium">Included in product price</span>
                  </div>
                  <div className="flex justify-between text-base pt-4 border-t border-checkerboard/10 font-bold">
                    <span className="font-serif tracking-wide text-checkerboard">Total</span>
                    <span className="font-mono text-tangerine text-xl">
                      {formatPrice(total, true)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSimulateCheckout}
                  disabled={isSubmitting}
                  className="w-full bg-tangerine hover:bg-tangerine-hover text-white py-4 px-6 rounded-xl uppercase tracking-wider text-xs font-bold flex items-center justify-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Placing Order...' : 'Proceed to Checkout'}</span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>

                <div className="pt-2 text-[11px] text-checkerboard/60 font-mono space-y-2 border-t border-checkerboard/10">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-tangerine" />
                    <span>10-year frame guarantee & free returns</span>
                  </div>
                  <p>Our two-person delivery team will bring everything directly to your room of choice.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

