'use client';

import React, { useState } from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import { X, Plus, Minus, Trash2, ArrowUpRight, ShieldCheck, CheckCircle2, ShoppingBag, Truck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { BRAND_CONFIG, formatPrice } from '@/config/brand';

export const CartDrawer: React.FC = () => {
  const { isOpen, setIsOpen, items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const freeShippingThreshold = BRAND_CONFIG.freeShippingThreshold;
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleCheckout = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const randomOrderId = `FW-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderComplete(randomOrderId);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-checkerboard/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream text-checkerboard shadow-2xl flex flex-col border-l border-checkerboard/15 relative overflow-hidden bg-architectural-grid">
          <div className="absolute inset-0 bg-fine-grain pointer-events-none" />

          {/* Header */}
          <div className="p-6 border-b border-checkerboard/10 flex items-center justify-between bg-white/95 backdrop-blur-xs relative z-10">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-tangerine" />
              <h3 className="font-serif text-2xl font-semibold text-checkerboard">
                Your Shopping Bag
              </h3>
              <span className="font-mono text-xs text-walnut font-medium bg-cream px-2 py-0.5 rounded-full border border-checkerboard/10">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-cream text-walnut hover:text-checkerboard transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar with Progress */}
          <div className="bg-cream-dark/90 px-6 py-3.5 border-b border-checkerboard/10 text-xs font-sans text-walnut relative z-10 space-y-1.5">
            <div className="flex items-center justify-between">
              {qualifiesForFreeShipping ? (
                <span className="text-olive font-semibold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 inline text-olive" />
                  <span>Free room-of-choice home delivery unlocked!</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-tangerine inline shrink-0" />
                  <span>
                    Add{' '}
                    <strong className="text-checkerboard font-semibold">
                      {formatPrice(remainingForFreeShipping)}
                    </strong>{' '}
                    for free delivery
                  </span>
                </span>
              )}
              <span className="font-mono text-[11px] font-bold text-tangerine">{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-cream rounded-full overflow-hidden border border-checkerboard/5">
              <div
                className="h-full bg-tangerine rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 divide-y divide-checkerboard/10 relative z-10">
            {orderComplete ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-olive mx-auto" />
                <h4 className="font-serif text-3xl text-checkerboard font-semibold">
                  Order Confirmed!
                </h4>
                <p className="text-sm text-walnut max-w-xs mx-auto leading-relaxed">
                  Your order reference is <span className="font-semibold text-checkerboard">{orderComplete}</span>.
                  We&apos;ve sent your confirmation and delivery details to your email.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setOrderComplete(null);
                      setIsOpen(false);
                    }}
                    className="text-xs uppercase tracking-wider px-6 py-3 bg-tangerine text-white rounded-full font-medium hover:bg-coral transition-colors shadow-warm"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="py-24 text-center space-y-4 text-walnut">
                <p className="font-serif text-xl text-checkerboard font-medium">Your bag is currently empty.</p>
                <p className="text-xs max-w-xs mx-auto text-walnut leading-relaxed font-normal">
                  Browse our handcrafted collections to discover comfortable, architectural pieces for your home.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-xs uppercase tracking-wider px-5 py-2.5 rounded-full bg-tangerine text-white font-medium hover:bg-coral transition-colors shadow-warm"
                  >
                    Explore Furniture
                  </button>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-5 flex space-x-4">
                  <div className="w-20 h-20 bg-cream-dark relative shrink-0 rounded-lg border border-checkerboard/10 overflow-hidden shadow-2xs">
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
                        <h4 className="font-serif text-base text-checkerboard font-medium leading-snug">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-walnut/60 hover:text-coral transition-colors p-1"
                          aria-label={`Remove ${item.productName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-walnut mt-0.5">
                        {item.woodFinish}
                        {item.fabricFinish && item.fabricFinish !== 'None' ? ` / ${item.fabricFinish}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2 border border-checkerboard/15 bg-white rounded-md px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-walnut hover:text-tangerine p-1"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-1 text-checkerboard">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-walnut hover:text-tangerine p-1"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-sans text-sm font-semibold text-checkerboard">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {!orderComplete && items.length > 0 && (
            <div className="p-6 border-t border-checkerboard/10 bg-white/95 backdrop-blur-xs space-y-4 relative z-10">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-walnut">
                  <span>Subtotal</span>
                  <span className="font-semibold text-checkerboard">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-walnut">
                  <span>White-Glove Delivery</span>
                  <span>{qualifiesForFreeShipping ? 'FREE' : formatPrice(250)}</span>
                </div>
                <div className="pt-2 border-t border-checkerboard/10 flex items-center justify-between">
                  <span className="font-serif text-lg font-semibold text-checkerboard">Total</span>
                  <span className="font-sans text-lg font-bold text-tangerine">
                    {formatPrice(subtotal + (qualifiesForFreeShipping ? 0 : 250), true)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-tangerine hover:bg-coral text-white font-medium text-xs uppercase tracking-wider rounded-full shadow-warm transition-all flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span>Proceed to Checkout</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="w-full block text-center py-2 text-xs font-sans text-walnut hover:text-checkerboard transition-colors"
                >
                  View Full Cart & Summary
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
