'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Compass, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import { CinematicResidenceTour } from '@/components/cinema/CinematicResidenceTour';

const CuratedCollectionSection = dynamic(
  () => import('@/components/landing/CuratedCollectionSection').then((mod) => mod.CuratedCollectionSection),
  { ssr: true }
);
const ArtOfLivingSection = dynamic(
  () => import('@/components/landing/ArtOfLivingSection').then((mod) => mod.ArtOfLivingSection),
  { ssr: true }
);
const DesignPhilosophySection = dynamic(
  () => import('@/components/landing/DesignPhilosophySection').then((mod) => mod.DesignPhilosophySection),
  { ssr: true }
);
const CustomerReviewsCarousel = dynamic(
  () => import('@/components/landing/CustomerReviewsCarousel').then((mod) => mod.CustomerReviewsCarousel),
  { ssr: true }
);
const MaterialsCraftSection = dynamic(
  () => import('@/components/landing/MaterialsCraftSection').then((mod) => mod.MaterialsCraftSection),
  { ssr: true }
);
const RoomDiscoverySection = dynamic(
  () => import('@/components/landing/RoomDiscoverySection').then((mod) => mod.RoomDiscoverySection),
  { ssr: true }
);
const ThoughtfulServiceSection = dynamic(
  () => import('@/components/landing/ThoughtfulServiceSection').then((mod) => mod.ThoughtfulServiceSection),
  { ssr: true }
);

export default function HomePage() {
  const promiseSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.promise-content',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: promiseSectionRef.current,
            start: 'top 92%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      gsap.fromTo(
        '.promise-highlight-card',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.promise-highlights-grid',
            start: 'top 92%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );
    }, promiseSectionRef);

    // Refresh ScrollTrigger on direct anchor navigation
    const handleHash = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('hashchange', handleHash);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      ctx.revert();
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-cream text-checkerboard overflow-x-hidden w-full">
      {/* 1. Cinematic Scroll-Driven 7-Scene Home Tour */}
      <CinematicResidenceTour />

      {/* 2. Brand Promise & Quality Craftsmanship Section */}
      <section
        ref={promiseSectionRef}
        className="relative z-20 bg-gradient-to-b from-[#F2E7D5] via-[#EDE0CB] to-[#F4E9D8] border-t border-b border-checkerboard/15 py-24 px-6 md:px-12 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 promise-content">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-wider text-tangerine font-semibold bg-white/90 px-3.5 py-1.5 rounded-full border border-tangerine/20 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-tangerine" />
              <span>Made for Everyday Living</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-checkerboard font-semibold tracking-tight leading-[1.15]">
              Furniture Designed to Bring Joy to <br />
              <span className="italic text-walnut">Your Home</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-walnut font-normal leading-relaxed max-w-xl">
              From comfortable bouclé sofas to sturdy solid wood dining tables, every piece is built with high-quality materials, honest craftsmanship, and durable finishes that withstand family life.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <Link
              href="/collections"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-tangerine hover:bg-coral text-white font-medium px-8 py-4 rounded-full shadow-warm transition-all duration-300 hover:shadow-lg active:scale-98 group"
            >
              <span>Shop All Furniture</span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>

            <Link
              href="/collections/sanctuary-seating"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-white hover:bg-cream border border-checkerboard/20 text-checkerboard font-medium px-8 py-4 rounded-full shadow-retro transition-all duration-300 hover:shadow-warm active:scale-98"
            >
              <span>View Living Room</span>
              <Compass className="w-4 h-4 text-tangerine" />
            </Link>
          </div>
        </div>

        {/* Feature Highlights Bar in Simple English */}
        <div className="promise-highlights-grid max-w-7xl mx-auto mt-14 pt-8 border-t border-checkerboard/12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="promise-highlight-card group space-y-2 bg-white/75 hover:bg-white p-6 rounded-2xl border border-checkerboard/8 hover:border-tangerine/30 shadow-2xs hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center space-x-1.5 text-tangerine text-xs uppercase tracking-wider font-semibold">
              <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
              <span>Solid Wood</span>
            </div>
            <p className="font-serif text-lg text-checkerboard font-medium group-hover:text-tangerine transition-colors">
              Genuine Oak & Walnut
            </p>
            <p className="font-sans text-xs text-walnut leading-relaxed">
              Durable natural hardwood with smooth protective wax oil finishes
            </p>
          </div>

          <div className="promise-highlight-card group space-y-2 bg-white/75 hover:bg-white p-6 rounded-2xl border border-checkerboard/8 hover:border-olive/30 shadow-2xs hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center space-x-1.5 text-olive text-xs uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>10-Year Guarantee</span>
            </div>
            <p className="font-serif text-lg text-checkerboard font-medium group-hover:text-olive transition-colors">
              Solid Frame Warranty
            </p>
            <p className="font-sans text-xs text-walnut leading-relaxed">
              Strong interlocking mortise-and-tenon joints built for generations
            </p>
          </div>

          <div className="promise-highlight-card group space-y-2 bg-white/75 hover:bg-white p-6 rounded-2xl border border-checkerboard/8 hover:border-rust/30 shadow-2xs hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center space-x-1.5 text-rust text-xs uppercase tracking-wider font-semibold">
              <Truck className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              <span>Room Delivery</span>
            </div>
            <p className="font-serif text-lg text-checkerboard font-medium group-hover:text-rust transition-colors">
              Delivered to Your Room
            </p>
            <p className="font-sans text-xs text-walnut leading-relaxed">
              Careful two-person delivery directly to your chosen room with setup
            </p>
          </div>

          <div className="promise-highlight-card group space-y-2 bg-white/75 hover:bg-white p-6 rounded-2xl border border-checkerboard/8 hover:border-mustard/40 shadow-2xs hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center space-x-1.5 text-mustard-dark text-xs uppercase tracking-wider font-semibold">
              <Clock className="w-4 h-4 transition-transform group-hover:rotate-45" />
              <span>Customer Support</span>
            </div>
            <p className="font-serif text-lg text-checkerboard font-medium group-hover:text-mustard-dark transition-colors">
              Dedicated Assistance
            </p>
            <p className="font-sans text-xs text-walnut leading-relaxed">
              Help via phone or email for sizing, fabric swatches, and delivery updates
            </p>
          </div>
        </div>
      </section>

      {/* 3. Permanent Collection & Discovery Section */}
      <CuratedCollectionSection />

      {/* 4. Section A — The Art of Living (Editorial Brand Story) */}
      <ArtOfLivingSection />

      {/* 5. Section B — Designed with Intention (Design Philosophy) */}
      <DesignPhilosophySection />

      {/* 6. Section C — Loved in Real Homes (Customer Reviews Carousel) */}
      <CustomerReviewsCarousel />

      {/* 7. Section D — Materials That Tell a Story (Materials & Tactile Craft) */}
      <MaterialsCraftSection />

      {/* 8. Section E — Find Your Room's Personality (Interactive Room Discovery) */}
      <RoomDiscoverySection />

      {/* 9. Section F — Thoughtful Service (Customer Care & Confidence) */}
      <ThoughtfulServiceSection />
    </main>
  );
}
