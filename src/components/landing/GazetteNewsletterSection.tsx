'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, ArrowRight, Check, Sparkles } from 'lucide-react';

export const GazetteNewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const sectionRef = useRef<HTMLElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 700);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gazette-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 88%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gazette"
      ref={sectionRef}
      className="relative z-20 bg-[#FAF8F5] text-checkerboard py-24 sm:py-32 border-t border-checkerboard/10 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        <div className="gazette-card rounded-3xl bg-white border border-checkerboard/12 p-8 sm:p-14 shadow-retro relative overflow-hidden text-center space-y-7">
          {/* Subtle Ambient Grain & Top Accent Strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-tangerine via-mustard to-rust" />

          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cream border border-checkerboard/10 text-[10px] font-mono uppercase tracking-[0.18em] text-walnut font-medium">
            <Sparkles className="w-3.5 h-3.5 text-tangerine" />
            <span>[ PRIVATE DISPATCH · VOL. IV / 2026 ]</span>
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-checkerboard font-semibold tracking-tight">
              The Furniture Village Gazette
            </h3>
            <p className="font-sans text-sm sm:text-base text-walnut leading-relaxed font-normal">
              Receive our seasonal architectural gazette, early access to limited timber releases, invitations to private showroom previews, and thoughtful essays on home craft.
            </p>
          </div>

          {/* Subscription Form */}
          {status === 'success' ? (
            <div className="p-4 rounded-2xl bg-cream/70 border border-tangerine/30 max-w-md mx-auto flex items-center justify-center space-x-2.5 text-tangerine font-sans text-sm font-semibold">
              <Check className="w-5 h-5" />
              <span>You have been subscribed to The Gazette. Welcome.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-walnut/60 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-[#FAF8F5] border border-checkerboard/15 focus:border-tangerine focus:ring-2 focus:ring-tangerine/20 rounded-full pl-11 pr-4 py-3.5 text-xs sm:text-sm font-sans text-checkerboard placeholder:text-walnut/50 outline-hidden transition-all shadow-2xs"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-full bg-tangerine hover:bg-coral text-white font-sans text-xs uppercase tracking-wider font-semibold transition-all shadow-warm hover:shadow-lg disabled:opacity-50 shrink-0 cursor-pointer"
                >
                  <span>{status === 'loading' ? 'Joining...' : 'Subscribe'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-walnut/70">
                [ DISPATCHED QUARTERLY · ZERO SPAM · INSTANT ONE-CLICK OPT-OUT ]
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
