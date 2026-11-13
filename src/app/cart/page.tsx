'use client';

import React, { useState } from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import { ArrowLeft, Trash2, Plus, Minus, ShieldCheck, ArrowRight, CheckCircle2, Truck, ShoppingBag, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { BRAND_CONFIG, formatPrice } from '@/config/brand';
import { COLLECTIONS_DATA } from '@/data/catalog';
import confetti from 'canvas-confetti';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const freeShippingThreshold = BRAND_CONFIG.freeShippingThreshold;
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = qualifiesForFreeShipping ? 0 : 250;
  const total = subtotal + shippingCost;

  const handleSimulateCheckout = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const orderRef = `FW-${Math.floor(100000 + Math.random() * 900000)}`;
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
    <main className="min-h-screen bg-cream text-checkerboard pt-8 sm:pt-12 pb-24 relative overflow-hidden bg-architectural-grid">
      <div className="absolute inset-0 bg-fine-grain pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-checkerboard/10 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-tangerine" />
              <span className="font-sans text-xs tracking-widest uppercase text-tangerine font-semibold">
                Shopping Cart
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl text-checkerboard font-semibold">
              Your Shopping Cart
            </h1>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-checkerboard/80 hover:text-tangerine font-sans font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {orderConfirmation ? (
          <div className="max-w-xl mx-auto py-16 text-center space-y-6 bg-white/95 backdrop-blur-xs rounded-2xl border border-checkerboard/10 p-12 shadow-retro">
            <CheckCircle2 className="w-16 h-16 text-olive mx-auto stroke-[1.5]" />
            <span className="font-sans text-xs uppercase tracking-wider text-tangerine font-semibold block">
              Order Confirmed
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-checkerboard font-semibold">
              Thank You for Your Order
            </h2>
            <p className="text-sm text-checkerboard/80 font-normal leading-relaxed">
              Order reference <span className="font-sans text-checkerboard font-bold bg-cream px-2 py-0.5 rounded border border-checkerboard/10">{orderConfirmation}</span> has been confirmed. Our Bengaluru customer care team will contact you within 24 hours to coordinate room delivery and assembly.
            </p>
            <div className="p-4 bg-cream/70 rounded-xl border border-checkerboard/10 text-xs font-sans text-checkerboard/80 text-left space-y-1.5">
              <p className="font-semibold text-checkerboard">Delivery & Assembly Services:</p>
              <p>• Delivery to your room of choice</p>
              <p>• Unboxing and furniture inspection</p>
              <p>• Removal of packaging materials</p>
            </div>
            <div className="pt-4">
              <Link
                href="/collections"
                className="inline-block bg-tangerine hover:bg-coral text-white py-3.5 px-8 rounded-full uppercase tracking-wider text-xs font-bold transition-all shadow-warm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 space-y-12 max-w-4xl mx-auto">
            <div className="text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto rounded-full bg-cream-dark flex items-center justify-center border border-checkerboard/10">
                <ShoppingBag className="w-7 h-7 text-walnut" />
              </div>
              <h2 className="font-serif text-3xl text-checkerboard font-semibold">Your cart is empty</h2>
              <p className="text-xs text-walnut leading-relaxed font-normal">
                Discover comfortable sofas, dining tables, and bedroom furniture designed for your home.
              </p>
            </div>

            {/* Direct Suite Cards for Empty Bag State */}
            <div>
              <div className="text-center mb-6">
                <span className="font-mono text-[10px] uppercase tracking-widest text-tangerine font-semibold">
                  Featured Curations
                </span>
                <h3 className="font-serif text-xl text-checkerboard font-semibold mt-0.5">
                  Explore by Living Collection
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {COLLECTIONS_DATA.map((col) => (
                  <Link
                    key={col.id}
                    href={`/collections/${col.slug}`}
                    className="group relative h-64 rounded-2xl border border-checkerboard/15 flex flex-col justify-end p-6 overflow-hidden transition-all duration-300 hover:border-tangerine shadow-retro hover:shadow-warm"
                  >
                    <Image
                      src={col.coverImage}
                      alt={col.title}
                      fill
                      className="object-cover brightness-[0.72] group-hover:brightness-[0.82] transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-checkerboard/90 via-checkerboard/40 to-transparent" />
                    <div className="relative z-10 space-y-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-mustard font-semibold">
                        {col.productCount} Works
                      </span>
                      <h4 className="font-serif text-xl text-white group-hover:text-mustard transition-colors font-medium">
                        {col.title}
                      </h4>
                      <p className="text-[11px] text-cream-light font-light line-clamp-1">
                        {col.subtitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Items List */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free shipping progress bar */}
              <div className="p-5 bg-white/95 backdrop-blur-xs rounded-2xl border border-checkerboard/10 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="flex items-center space-x-2 text-checkerboard font-semibold">
                    <Truck className="w-4 h-4 text-tangerine" />
                    <span>
                      {qualifiesForFreeShipping
                        ? 'Free Delivery & Assembly Unlocked'
                        : `Add ${formatPrice(remainingForFreeShipping)} for Free Delivery & Assembly`}
                    </span>
                  </span>
                  <span className="text-tangerine font-bold">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-cream-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tangerine rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 bg-white/95 backdrop-blur-xs rounded-2xl border border-checkerboard/10 shadow-retro flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-start"
                  >
                    <div className="relative w-28 h-28 bg-cream-dark rounded-xl border border-checkerboard/10 shrink-0 overflow-hidden">
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
                          <span className="font-serif text-lg font-semibold text-checkerboard">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                        <p className="text-xs text-walnut mt-1">
                          Finishes: {item.woodFinish} {item.fabricFinish ? `· ${item.fabricFinish}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-2 border-t border-checkerboard/5">
                        <div className="flex items-center border border-checkerboard/20 rounded-lg bg-cream/40 text-xs">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-3 py-1.5 hover:text-tangerine transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 font-sans text-xs font-semibold">{item.quantity}</span>
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
                          className="text-walnut/70 hover:text-coral transition-colors flex items-center space-x-1.5 text-xs font-sans font-medium"
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
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white/95 backdrop-blur-xs rounded-2xl border border-checkerboard/10 p-8 space-y-6 shadow-retro">
                <div className="flex items-center space-x-2 border-b border-checkerboard/10 pb-4">
                  <Sparkles className="w-4 h-4 text-tangerine" />
                  <h2 className="font-sans text-xs uppercase tracking-wider text-checkerboard font-semibold">
                    Order Summary
                  </h2>
                </div>

                <div className="space-y-3 text-xs font-sans">
                  <div className="flex justify-between text-walnut">
                    <span>Subtotal</span>
                    <span className="font-sans text-checkerboard font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-walnut">
                    <span>Delivery & Assembly</span>
                    <span className="font-sans text-checkerboard font-semibold">
                      {qualifiesForFreeShipping ? (
                        <span className="text-olive font-bold">Free</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-walnut">
                    <span>Taxes (GST)</span>
                    <span className="font-sans text-checkerboard font-medium">Included in Total</span>
                  </div>
                  <div className="flex justify-between text-base pt-4 border-t border-checkerboard/10 font-bold">
                    <span className="font-serif tracking-wide text-checkerboard">Total Amount</span>
                    <span className="font-sans text-tangerine text-2xl font-bold">
                      {formatPrice(total, true)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSimulateCheckout}
                  disabled={isSubmitting}
                  className="w-full bg-tangerine hover:bg-coral text-white py-4 px-6 rounded-xl uppercase tracking-wider text-xs font-bold flex items-center justify-center space-x-2 transition-all duration-300 shadow-warm hover:shadow-lg disabled:opacity-50 active:scale-98"
                >
                  <span>{isSubmitting ? 'Processing Order...' : 'Proceed to Checkout'}</span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>

                <div className="pt-2 text-[11px] text-walnut font-sans space-y-2 border-t border-checkerboard/10">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-tangerine shrink-0" />
                    <span className="font-medium">10-year structural frame guarantee</span>
                  </div>
                  <p>Our delivery team unboxes and sets up each furniture piece in your room of choice.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
