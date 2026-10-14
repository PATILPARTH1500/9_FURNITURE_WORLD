'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';

export const ArtOfLivingSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Heading & text reveal
      gsap.fromTo(
        '.art-narrative',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 92%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      // Staggered pillars entrance
      gsap.fromTo(
        '.art-pillar',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.art-pillars-grid',
            start: 'top 90%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      // Gentle parallax and scale reveal on the architectural visual
      if (imageWrapperRef.current) {
        gsap.fromTo(
          imageWrapperRef.current,
          { scale: 1.04, y: 15 },
          {
            scale: 1,
            y: 0,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: imageWrapperRef.current,
              start: 'top 90%',
              once: true,
              fastScrollEnd: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="art-of-living"
      ref={sectionRef}
      className="relative z-20 bg-[#FAF5ED] py-24 sm:py-32 border-t border-checkerboard/10 overflow-hidden"
    >
      {/* Subtle Warm Organic Accent Blob */}
      <div
        className="absolute -left-32 top-1/4 w-96 h-96 rounded-full bg-tangerine/[0.03] blur-3xl pointer-events-none select-none"
        aria-hidden="true"
      />
      <div
        className="absolute -right-32 bottom-1/4 w-96 h-96 rounded-full bg-olive/[0.04] blur-3xl pointer-events-none select-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Narrative & Values */}
          <div className="art-narrative lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="font-sans text-xs tracking-wider uppercase text-tangerine font-semibold bg-white px-3.5 py-1.5 rounded-full border border-tangerine/20 inline-flex items-center space-x-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-tangerine" />
                <span>The Art of Living · Brand Story</span>
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-checkerboard font-semibold tracking-tight leading-[1.12]">
                Furniture Made to Be Lived In, <br />
                <span className="italic text-walnut font-normal">Not Just Looked At.</span>
              </h2>
            </div>

            <p className="font-sans text-base sm:text-lg text-walnut leading-relaxed font-normal">
              At Furniture Village, we believe modern homes should feel welcoming, colorful, and deeply comfortable. Too often, contemporary furniture is cold, delicate, and designed only for catalog photographs.
            </p>

            <p className="font-sans text-sm sm:text-base text-checkerboard/85 leading-relaxed font-normal">
              We take inspiration from optimistic 1970s modernist residences: warm cream bouclés, solid European oak, rich smoked walnut, and cheerful tangerine accents. Every curve is sculpted to embrace natural seating postures, and every timber edge is hand-smoothed so children and pets can move freely around your home.
            </p>

            {/* 3 Core Editorial Pillars */}
            <div className="art-pillars-grid grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-checkerboard/10">
              <div className="art-pillar space-y-2 bg-white/80 hover:bg-white p-5 rounded-2xl border border-checkerboard/8 hover:border-tangerine/30 shadow-2xs hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
                <div className="w-9 h-9 rounded-full bg-tangerine/10 flex items-center justify-center text-tangerine">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg text-checkerboard font-semibold">100% Solid Wood</h3>
                <p className="font-sans text-xs text-walnut leading-relaxed">
                  Genuine European Oak & Walnut with natural plant wax-oil finishes that let timber breathe.
                </p>
              </div>

              <div className="art-pillar space-y-2 bg-white/80 hover:bg-white p-5 rounded-2xl border border-checkerboard/8 hover:border-olive/30 shadow-2xs hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
                <div className="w-9 h-9 rounded-full bg-olive/10 flex items-center justify-center text-olive">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg text-checkerboard font-semibold">Everyday Ergonomics</h3>
                <p className="font-sans text-xs text-walnut leading-relaxed">
                  Gentle 112° reclines and high-resilience foam cores calibrated for lasting comfort.
                </p>
              </div>

              <div className="art-pillar space-y-2 bg-white/80 hover:bg-white p-5 rounded-2xl border border-checkerboard/8 hover:border-rust/30 shadow-2xs hover:shadow-warm transition-all duration-300 hover:-translate-y-1">
                <div className="w-9 h-9 rounded-full bg-rust/10 flex items-center justify-center text-rust">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg text-checkerboard font-semibold">Generational Joinery</h3>
                <p className="font-sans text-xs text-walnut leading-relaxed">
                  Interlocking mortise-and-tenon joints built to withstand decades of family life.
                </p>
              </div>
            </div>

            {/* Link to All Furniture */}
            <div className="pt-2">
              <Link
                href="/collections"
                className="group inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-wider bg-tangerine hover:bg-coral text-white font-medium px-7 py-3.5 rounded-full shadow-warm transition-all duration-300 hover:shadow-lg active:scale-98"
              >
                <span>Explore All Handcrafted Pieces</span>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Large Architectural Image & Detail Callout */}
          <div className="lg:col-span-5 relative">
            <div
              ref={imageWrapperRef}
              className="relative aspect-[4/5] sm:aspect-[3/4] w-full rounded-3xl overflow-hidden border border-checkerboard/15 shadow-retro bg-cream-dark group"
            >
              <Image
                src="/images/film/interior-villa.jpg"
                alt="Furniture Village Warm Residence Interior"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

              {/* Floating Bottom Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-checkerboard/15 shadow-warm space-y-1 transition-transform duration-300 group-hover:-translate-y-1">
                <div className="flex items-center justify-between text-xs font-sans font-semibold text-tangerine uppercase tracking-wider">
                  <span>Residence Architecture</span>
                  <span>Scene 01</span>
                </div>
                <p className="font-serif text-base text-checkerboard font-medium">
                  The Light-Filled Residence Living Room
                </p>
                <p className="text-[11px] font-sans text-walnut">
                  Curved seating, warm oak armchairs & natural daylight
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
