'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowDown, Sparkles, ShieldCheck, Truck, Droplets, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { CinematicResidenceTour } from '@/components/cinema/CinematicResidenceTour';
import { AnimatedHeading, MagneticButton, SpotlightCard, TextRoll, MarqueeTicker } from '@/components/ui/motion';

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
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: promiseSectionRef.current,
            start: 'top 85%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      gsap.fromTo(
        '.promise-image-container',
        { opacity: 0, scale: 0.96, y: 28 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.65,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: promiseSectionRef.current,
            start: 'top 82%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      gsap.fromTo(
        '.promise-highlight-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.promise-highlights-grid',
            start: 'top 90%',
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
    <main className="relative min-h-screen bg-[#FAF8F5] text-checkerboard overflow-x-hidden w-full">
      {/* 1. Cinematic Scroll-Driven 7-Scene Home Tour (Signature Opening - UNTOUCHED) */}
      <CinematicResidenceTour />

      {/* 2. Brand Promise & Post-Tour Architectural Transition */}
      <section
        id="promise"
        ref={promiseSectionRef}
        className="relative z-20 bg-gradient-to-b from-[#F5EFE6] via-[#FAF7F2] to-[#F4EEE4] text-checkerboard border-t border-b border-checkerboard/12 pt-24 sm:pt-32 pb-24 sm:pb-32 px-5 sm:px-8 md:px-12 overflow-hidden"
      >
        {/* Subtle Architectural Grid Lines & Organic Warm Ambient Shimmer */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#29251F06_1px,transparent_1px),linear-gradient(to_bottom,#29251F06_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none select-none"
          aria-hidden="true"
        />
        <div
          className="absolute -top-32 right-1/4 w-[600px] h-[600px] rounded-full bg-[#E57A44]/[0.06] blur-3xl pointer-events-none select-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-10 left-10 w-[500px] h-[500px] rounded-full bg-[#626B3D]/[0.05] blur-3xl pointer-events-none select-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Editorial Kicker Strip Connecting Tour to Catalog */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-7 mb-12 sm:mb-16 border-b border-checkerboard/10 text-xs font-sans uppercase tracking-[0.22em] text-walnut font-medium">
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-tangerine animate-pulse" />
              <span>Volume IV · The 2024 Residence Collection</span>
            </div>
            <span className="hidden md:inline text-checkerboard/30">/</span>
            <span className="hidden sm:inline">Solid European Hardwoods · Natural Wax Oils</span>
            <span className="hidden md:inline text-checkerboard/30">/</span>
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-tangerine" />
              <span>Flagship: 100-Ft Rd, Indiranagar</span>
            </div>
          </div>

          {/* Master Architectural Spread: Content Container + Dual Photography */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column (lg:col-span-6): Editorial Narrative, Philosophy, and Dual CTAs */}
            <div className="lg:col-span-6 space-y-7 promise-content">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-checkerboard/12 text-[11px] font-sans uppercase tracking-widest text-tangerine font-semibold shadow-2xs backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-tangerine" />
                <span>Handcrafted Retro-Modern Furniture</span>
              </div>

              <AnimatedHeading
                text="Furniture Designed to Bring Joy to Your Home."
                highlightText="Your Home."
                highlightClassName="italic text-walnut font-normal"
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.75rem] text-checkerboard font-semibold tracking-tight leading-[1.1]"
              />

              <p className="font-sans text-base sm:text-lg text-walnut font-normal leading-relaxed">
                From deeply cushioned curved bouclé sofas to sturdy solid wood dining tables, every piece is built with high-quality materials, honest craftsmanship, and durable finishes that withstand family life.
              </p>

              {/* The TWO explicit CTA buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
                <MagneticButton
                  href="#collection"
                  className="group space-x-2 text-xs font-sans uppercase tracking-wider bg-tangerine hover:bg-coral text-white font-medium px-8 py-4 rounded-full shadow-warm transition-all duration-300 hover:shadow-lg inline-flex items-center justify-center"
                >
                  <TextRoll>Explore Furniture</TextRoll>
                  <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                </MagneticButton>

                <MagneticButton
                  href="/collections"
                  className="group space-x-2 text-xs font-sans uppercase tracking-wider bg-white/80 hover:bg-white border border-checkerboard/15 text-checkerboard font-medium px-7 py-4 rounded-full shadow-2xs transition-all duration-300 hover:shadow-warm inline-flex items-center justify-center"
                >
                  <TextRoll>Shop Collection</TextRoll>
                  <ArrowUpRight className="w-4 h-4 text-tangerine transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </MagneticButton>
              </div>

              {/* Editorial Quality Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-checkerboard/10 text-checkerboard">
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-semibold text-checkerboard block">100%</span>
                  <span className="text-[11px] font-sans uppercase tracking-wider text-walnut/80 mt-0.5 block">Solid Timber</span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-semibold text-checkerboard block">10-Yr</span>
                  <span className="text-[11px] font-sans uppercase tracking-wider text-walnut/80 mt-0.5 block">Frame Warranty</span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl font-semibold text-checkerboard block">White-Glove</span>
                  <span className="text-[11px] font-sans uppercase tracking-wider text-walnut/80 mt-0.5 block">Room Delivery</span>
                </div>
              </div>
            </div>

            {/* Right Column (lg:col-span-6): Composed Architectural Photography Frame */}
            <div className="lg:col-span-6 relative promise-image-container">
              <div className="relative rounded-3xl overflow-hidden bg-[#EFE9DF] border border-checkerboard/15 shadow-[0_24px_50px_rgba(40,30,20,0.12)] group">
                {/* Large High-Quality Interior Photography */}
                <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden" style={{ position: 'relative' }}>
                  <Image
                    src="/images/film/interior-villa.webp"
                    alt="Interior villa living room featuring handcrafted solid wood and curved bouclé furniture"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transform-gpu transition-transform duration-700 ease-out group-hover:scale-104"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

                  {/* Corner Architectural Stamp */}
                  <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 text-white">
                    <span className="text-[10px] sm:text-xs font-sans tracking-[0.25em] uppercase text-[#E7C89F] font-semibold block">
                      Villa Residence · Edition 2024
                    </span>
                    <span className="font-serif text-lg sm:text-xl text-white font-normal mt-0.5 block">
                      Sculptural Curves & Smoked Walnut
                    </span>
                  </div>
                </div>

                {/* Overlaid Inset Detail Plinth Card */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-28 sm:w-36 aspect-square rounded-2xl overflow-hidden border-2 border-white/80 shadow-[0_12px_28px_rgba(0,0,0,0.2)] bg-[#FAF8F5] hidden sm:block" style={{ position: 'absolute' }}>
                  <Image
                    src="/images/film/hero-plinth.webp"
                    alt="Tactile craft joinery detail on stone plinth"
                    fill
                    sizes="144px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/15 pointer-events-none" />
                  <div className="absolute bottom-1.5 left-2 right-2 text-center bg-white/90 backdrop-blur-xs py-0.5 rounded text-[9px] font-sans uppercase tracking-wider text-checkerboard font-semibold">
                    Detail View
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Architectural Hallmarks Spread */}
          <div className="promise-highlights-grid mt-16 pt-12 border-t border-checkerboard/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <SpotlightCard
              className="promise-highlight-card group p-7 rounded-3xl bg-white/90 hover:bg-white border border-checkerboard/10 hover:border-tangerine/40 shadow-xs hover:shadow-warm transition-all duration-400 hover:-translate-y-1.5"
              spotlightColor="rgba(244, 81, 11, 0.08)"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-3xl font-semibold text-checkerboard group-hover:text-tangerine transition-colors">
                    100%
                  </span>
                  <div className="w-10 h-10 rounded-full bg-tangerine/10 text-tangerine flex items-center justify-center transition-transform group-hover:scale-110">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-checkerboard font-semibold">
                    Solid European Hardwood
                  </h3>
                  <p className="text-xs font-sans text-walnut mt-1 leading-relaxed">
                    Kiln-dried European White Oak and Smoked Walnut. Zero synthetic veneers or hollow particleboard.
                  </p>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard
              className="promise-highlight-card group p-7 rounded-3xl bg-white/90 hover:bg-white border border-checkerboard/10 hover:border-olive/40 shadow-xs hover:shadow-warm transition-all duration-400 hover:-translate-y-1.5"
              spotlightColor="rgba(98, 107, 61, 0.12)"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-3xl font-semibold text-checkerboard group-hover:text-olive transition-colors">
                    10-Yr
                  </span>
                  <div className="w-10 h-10 rounded-full bg-olive/10 text-olive flex items-center justify-center transition-transform group-hover:scale-110">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-checkerboard font-semibold">
                    Structural Frame Warranty
                  </h3>
                  <p className="text-xs font-sans text-walnut mt-1 leading-relaxed">
                    Interlocking mortise-and-tenon timber joints reinforced by concealed steel anchors for generations.
                  </p>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard
              className="promise-highlight-card group p-7 rounded-3xl bg-white/90 hover:bg-white border border-checkerboard/10 hover:border-rust/40 shadow-xs hover:shadow-warm transition-all duration-400 hover:-translate-y-1.5"
              spotlightColor="rgba(184, 69, 24, 0.10)"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-3xl font-semibold text-checkerboard group-hover:text-rust transition-colors">
                    Free
                  </span>
                  <div className="w-10 h-10 rounded-full bg-rust/10 text-rust flex items-center justify-center transition-transform group-hover:scale-110">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-checkerboard font-semibold">
                    Room-of-Choice Delivery
                  </h3>
                  <p className="text-xs font-sans text-walnut mt-1 leading-relaxed">
                    White-glove two-person delivery up stairs and elevators directly into your room, complete with setup.
                  </p>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard
              className="promise-highlight-card group p-7 rounded-3xl bg-white/90 hover:bg-white border border-checkerboard/10 hover:border-mustard/50 shadow-xs hover:shadow-warm transition-all duration-400 hover:-translate-y-1.5"
              spotlightColor="rgba(217, 119, 6, 0.10)"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-3xl font-semibold text-checkerboard group-hover:text-mustard-dark transition-colors">
                    Pure
                  </span>
                  <div className="w-10 h-10 rounded-full bg-mustard/15 text-mustard-dark flex items-center justify-center transition-transform group-hover:scale-110">
                    <Droplets className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-checkerboard font-semibold">
                    Organic Plant Wax Oils
                  </h3>
                  <p className="text-xs font-sans text-walnut mt-1 leading-relaxed">
                    Smooth matte finishes that celebrate organic wood grain, emit zero toxic fumes, and patina gracefully.
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Architectural Luxury Editorial Ticker (Skiper UI / Aceternity Reference) */}
          <div className="mt-14 pt-8 border-t border-checkerboard/10 overflow-hidden">
            <MarqueeTicker
              items={[
                '100% Solid European Oak',
                'Hand-Rubbed Organic Plant Wax Oils',
                'Concealed Steel-Anchored Mortise & Tenon',
                '10-Year Structural Frame Guarantee',
                'Two-Person White-Glove Room Delivery',
                'Plush Heavyweight Looped Bouclé',
                'Supple Top-Grain Leathers',
                '30-Night In-Home Trial',
              ]}
              className="py-1"
              itemClassName="text-checkerboard/90 font-serif font-semibold text-xs sm:text-sm tracking-[0.2em]"
              speed={32}
            />
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
