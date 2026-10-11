'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, Minus, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { BRAND_CONFIG } from '@/config/brand';
import confetti from 'canvas-confetti';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const freeShippingThreshold = 5000;
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;
  const shippingCost = qualifiesForFreeShipping ? 0 : 250;
  const total = subtotal + shippingCost;

  const handleSimulateCheckout = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const orderRef = `AT-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderConfirmation(orderRef);
      setIsSubmitting(false);
      clearCart();
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D19A66', '#D4BEA0', '#FAF8F5'],
        });
      } catch {
        // no-op
      }
    }, 1400);
  };

  return (
    <main className="min-h-screen bg-charcoal-950 text-sand-100 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-accent">
              Acquisition Dossier
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-ivory font-light mt-1">
              Curated Bag
            </h1>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-sand-400 hover:text-white font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Exploring</span>
          </Link>
        </div>

        {orderConfirmation ? (
          <div className="max-w-xl mx-auto py-16 text-center space-y-6 bg-charcoal-900/60 border border-white/10 p-12">
            <CheckCircle2 className="w-16 h-16 text-accent mx-auto stroke-[1.25]" />
            <h2 className="font-serif text-3xl text-ivory">
              Commission Inscription Registered
            </h2>
            <p className="text-sm text-sand-300 font-light leading-relaxed">
              Order reference <span className="font-mono text-ivory font-bold">{orderConfirmation}</span> has been
              received by our Kyoto and Copenhagen ateliers. A client concierge will contact you to verify wood grain preferences and coordinate delivery logistics.
            </p>
            <div className="p-4 bg-charcoal-950 border border-white/5 text-[11px] font-mono text-sand-400">
              Development-Stage Flow: Supabase database ready for live payments & webhooks integration.
            </div>
            <div className="pt-4">
              <Link
                href="/collections"
                className="inline-block bg-accent hover:bg-accent-light text-charcoal-950 py-3.5 px-8 uppercase tracking-[0.2em] text-xs font-semibold transition-colors"
              >
                Return to Collections
              </Link>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="py-24 text-center space-y-6 max-w-md mx-auto">
            <p className="font-serif text-2xl text-sand-300">Your selection is currently empty.</p>
            <p className="text-xs text-sand-400 leading-relaxed font-light">
              No editions have been selected. Discover our permanent collection of Scandinavian-Japanese
              architectural furniture.
            </p>
            <div className="pt-4">
              <Link
                href="/collections"
                className="inline-block border border-accent text-accent hover:bg-accent hover:text-charcoal-950 py-3 px-8 uppercase tracking-[0.25em] text-xs font-semibold transition-all duration-300"
              >
                Browse Repertoire
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Items List */}
            <div className="lg:col-span-8 divide-y divide-white/10 border-t border-b border-white/10">
              {items.map((item) => (
                <div key={item.id} className="py-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative w-28 h-28 bg-charcoal-900 border border-white/5 flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-xl text-ivory tracking-wide">
                          {item.productName}
                        </h3>
                        <span className="font-mono text-base text-sand-200">
                          ${(item.unitPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-sand-400 font-mono mt-1">
                        Specification: {item.woodFinish} {item.fabricFinish ? `· ${item.fabricFinish}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-2">
                      <div className="flex items-center border border-white/15 text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-3 py-1.5 hover:text-accent transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 font-mono text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-3 py-1.5 hover:text-accent transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sand-500 hover:text-red-400 transition-colors flex items-center space-x-1.5 text-xs font-mono"
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
              <div className="bg-charcoal-900/70 border border-white/10 p-8 space-y-6">
                <h2 className="font-mono text-xs uppercase tracking-widest text-ivory border-b border-white/10 pb-4">
                  Summary Breakdown
                </h2>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-sand-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-sand-200">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sand-400">
                    <span>Architectural Delivery</span>
                    <span className="font-mono text-sand-200">
                      {qualifiesForFreeShipping ? 'Complimentary' : '$250'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sand-400">
                    <span>Sales Tax (Calculated at checkout)</span>
                    <span className="font-mono text-sand-200">$0.00</span>
                  </div>
                  <div className="flex justify-between text-base pt-4 border-t border-white/10 font-medium">
                    <span className="font-serif tracking-wide text-ivory">Total</span>
                    <span className="font-mono text-accent text-lg">
                      ${total.toLocaleString()} {BRAND_CONFIG.currency}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSimulateCheckout}
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent-light text-charcoal-950 py-4 px-6 uppercase tracking-[0.25em] text-xs font-semibold flex items-center justify-center space-x-2 transition-all duration-300 shadow-xl disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Securing Allocation...' : 'Proceed to Checkout'}</span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                </button>

                <div className="pt-2 text-[10px] text-sand-500 font-mono space-y-2 border-t border-white/5">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <span>White-glove uncrating & installation included</span>
                  </div>
                  <p>Production stage notice: Verified server auth flow.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

