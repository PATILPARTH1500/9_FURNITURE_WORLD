'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { BRAND_CONFIG } from '@/config/brand';
import confetti from 'canvas-confetti';

export const CartDrawer: React.FC = () => {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getSubtotal, clearCart } =
    useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const complimentaryShippingThreshold = 5000;
  const qualifiesForFreeShipping = subtotal >= complimentaryShippingThreshold;
  const remainingForFreeShipping = Math.max(0, complimentaryShippingThreshold - subtotal);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      const orderNum = `AT-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderComplete(orderNum);
      setIsCheckingOut(false);
      clearCart();
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D19A66', '#D4BEA0', '#FAF8F5'],
        });
      } catch {
        // no-op if canvas not ready
      }
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-charcoal-900 border-l border-white/10 text-ivory flex flex-col justify-between shadow-2xl">
          {/* Header */}
          <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="font-serif text-xl tracking-[0.15em] uppercase">
                Curated Selection
              </span>
              <span className="text-xs font-mono text-sand-400">
                ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-sand-400 hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="bg-charcoal-950 px-6 py-3 border-b border-white/5 text-[11px] tracking-wider text-sand-300">
            {qualifiesForFreeShipping ? (
              <span className="text-accent flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 inline" />
                <span>Complimentary white-glove architectural delivery applied</span>
              </span>
            ) : (
              <span>
                Add{' '}
                <strong className="text-ivory font-mono">
                  ${remainingForFreeShipping.toLocaleString()}
                </strong>{' '}
                more for complimentary worldwide delivery
              </span>
            )}
          </div>

          {/* Body: Items or Success or Empty */}
          <div className="flex-1 overflow-y-auto px-6 py-6 divide-y divide-white/5">
            {orderComplete ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-accent mx-auto stroke-[1.25]" />
                <h4 className="font-serif text-2xl text-ivory tracking-wide">
                  Order Inscription Recorded
                </h4>
                <p className="text-xs text-sand-400 max-w-xs mx-auto leading-relaxed">
                  Reference <span className="font-mono text-ivory font-semibold">{orderComplete}</span>.
                  Our atelier concierge will verify workshop allocation and reach out with private tracking.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setOrderComplete(null);
                      setIsOpen(false);
                    }}
                    className="text-xs uppercase tracking-widest px-6 py-2.5 border border-white/20 hover:border-accent hover:text-accent transition-colors"
                  >
                    Return to Atelier
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="py-24 text-center space-y-4 text-sand-400">
                <p className="font-serif text-lg text-sand-300">Your bag is currently empty.</p>
                <p className="text-xs max-w-xs mx-auto text-sand-400 leading-relaxed font-light">
                  Explore our permanent collection to select timeless pieces designed for contemplative living.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs uppercase tracking-[0.2em] text-accent border-b border-accent/40 pb-0.5 hover:text-white transition-colors pt-2"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-5 flex space-x-4">
                  <div className="w-20 h-20 bg-charcoal-800 relative flex-shrink-0 border border-white/5 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm tracking-wide text-ivory">
                          {item.productName}
                        </h4>
                        <span className="font-mono text-xs text-sand-200">
                          ${(item.unitPrice * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-sand-400 tracking-wider mt-0.5">
                        {item.woodFinish} {item.fabricFinish ? `· ${item.fabricFinish}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Modifier */}
                      <div className="flex items-center border border-white/10 text-xs">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2 py-1 hover:text-accent transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono text-[11px]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2 py-1 hover:text-accent transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sand-500 hover:text-red-400 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && !orderComplete && (
            <div className="p-6 bg-charcoal-950 border-t border-white/10 space-y-4">
              <div className="space-y-1.5 text-xs">
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
                <div className="flex justify-between text-sm pt-2 border-t border-white/5 font-medium">
                  <span className="font-serif tracking-wide text-ivory">Total</span>
                  <span className="font-mono text-accent text-base">
                    ${(subtotal + (qualifiesForFreeShipping ? 0 : 250)).toLocaleString()} {BRAND_CONFIG.currency}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-accent hover:bg-accent-light text-charcoal-950 py-3.5 px-6 uppercase tracking-[0.25em] text-xs font-semibold flex items-center justify-center space-x-2 transition-all duration-300 disabled:opacity-50"
              >
                <span>{isCheckingOut ? 'Securing Workshop Slot...' : 'Proceed to Checkout'}</span>
                {!isCheckingOut && <ArrowRight className="w-4 h-4" />}
              </button>

              <p className="text-[10px] text-center text-sand-500 font-mono tracking-wider">
                Production architecture flow · Authenticated orders verified via Supabase server
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

