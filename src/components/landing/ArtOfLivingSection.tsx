'use client';

import React, { useEffect, useRef } from 'react';
import Image from '@/components/common/Image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { MagneticButton, TextRoll } from '@/components/ui/motion';
import { AmbientParticles } from '@/components/ui/AmbientParticles';

export const ArtOfLivingSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageSpreadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.art-narrative',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 88%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      gsap.fromTo(
        '.art-commitment-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.art-commitments-grid',
            start: 'top 90%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      if (imageSpreadRef.current) {
        gsap.fromTo(
          imageSpreadRef.current,
          { clipPath: 'inset(8% 0% 8% 0%)', opacity: 0.8 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: imageSpreadRef.current,
              start: 'top 88%',
              once: true,
              fastScrollEnd: true,
            },
          }
        );

        // Subtle Parallax on Overlapping Macro Detail Inset
        gsap.to('.art-macro-inset', {
          y: -24,
          ease: 'none',
          scrollTrigger: {
            trigger: imageSpreadRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="art-of-living"
      ref={sectionRef}
      className="relative z-20 bg-[#1C1612] text-[#FAF8F5] py-28 sm:py-36 border-t border-white/10 overflow-hidden bg-architectural-grid-dark"
    >
      {/* Restrained Ambient Particles Floating in Warm Darkness */}
      <AmbientParticles count={18} tint="mixed" opacity={0.35} />

      {/* Ambient Radial Warmth on Deep Espresso */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(244,81,11,0.08),transparent_70%)] pointer-events-none select-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Layered Architectural Photography Composition (Cols 1-6) */}
          <div ref={imageSpreadRef} className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full rounded-3xl overflow-hidden border border-white/12 shadow-[0_24px_60px_rgba(0,0,0,0.5)] bg-black/40 group">
              <Image
                src="/images/film/interior-villa.webp"
                alt="Architectural Villa Living Room with Handcrafted Furniture"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.92]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

              <div className="absolute top-6 left-6 flex items-center space-x-2">
                <span className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-sans uppercase tracking-wider text-[#FAF8F5] border border-white/20 font-medium">
                  Residence Architecture · Sanctuary Suite
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/15">
                <div className="flex items-center space-x-2 text-xs font-sans uppercase tracking-wider text-tangerine-light mb-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>The Residence Sanctuary Series</span>
                </div>
                <p className="font-serif text-lg text-white font-medium">
                  The Light-Filled Residence Sanctuary
                </p>
                <p className="text-xs font-sans text-white/75 mt-1">
                  Sculpted solid oak framing, natural plant wax finishes, and curved bouclé contours.
                </p>
              </div>
            </div>

            {/* Overlapping Floating Macro Joinery Inset with Scrubbed Parallax */}
            <div className="art-macro-inset hidden sm:block absolute -bottom-8 -right-8 w-48 sm:w-56 aspect-square rounded-2xl overflow-hidden border-2 border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.6)] bg-black/60 group">
              <Image
                src="/images/film/macro-joinery.webp"
                alt="Precision Interlocking Mortise and Tenon Timber Joint"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="224px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-xs font-sans font-semibold text-white uppercase tracking-wider">
                Interlocking Mortise-Tenon Joint
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Commitments (Cols 7-12) */}
          <div className="lg:col-span-6 space-y-8 art-narrative">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-sans text-xs tracking-wider uppercase text-tangerine-light font-semibold bg-white/10 px-3.5 py-1.5 rounded-full border border-tangerine/30 inline-flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-tangerine" />
                  <span>Brand Manifesto · The Art of Living</span>
                </span>
                <span className="font-sans text-xs uppercase tracking-wider text-white/70 bg-white/10 px-3 py-1 rounded-full border border-white/15 font-medium">
                  Craft Philosophy
                </span>
              </div>

              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#FAF8F5] font-semibold tracking-tight leading-[1.08]">
                Furniture Made to Be Lived In, <br />
                <span className="italic font-normal text-tangerine-light">Not Just Looked At.</span>
              </h2>
            </div>

            <div className="space-y-4 text-[#D0C4B4] font-sans text-sm sm:text-base leading-relaxed">
              <p>
                At Furniture Village, we reject cold, delicate showroom pieces designed only for photoshoots. Real homes are meant for morning tea, energetic family dinners, afternoon reading, and quiet moments of stillness.
              </p>
              <p>
                We take inspiration from optimistic 1970s residences: organic curved contours, solid European oak, rich smoked walnut, and joyful burnt-orange accents. Every timber corner is hand-smoothed so children and pets can move freely around your home.
              </p>
            </div>

            {/* 3 Editorial Commitment Rows */}
            <div className="art-commitments-grid space-y-3.5 pt-4 border-t border-white/12">
              <div className="art-commitment-card p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-tangerine/50 transition-colors duration-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs uppercase tracking-wider text-tangerine-light bg-tangerine/15 px-3 py-0.5 rounded-full border border-tangerine/30 font-semibold">
                    Kiln-Dried Hardwood
                  </span>
                  <span className="font-serif text-lg font-bold text-white/60">01</span>
                </div>
                <h4 className="font-serif text-lg text-[#FAF8F5] font-semibold">
                  100% Solid European Oak & Smoked Walnut
                </h4>
                <p className="text-xs font-sans text-[#A69A8A] leading-relaxed">
                  Kiln-dried hardwoods selected for medullary grain richness. Never synthetic wood foils or hollow particleboard.
                </p>
              </div>

              <div className="art-commitment-card p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-tangerine/50 transition-colors duration-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs uppercase tracking-wider text-tangerine-light bg-tangerine/15 px-3 py-0.5 rounded-full border border-tangerine/30 font-semibold">
                    Ergonomics · 112° Recline
                  </span>
                  <span className="font-serif text-lg font-bold text-white/60">02</span>
                </div>
                <h4 className="font-serif text-lg text-[#FAF8F5] font-semibold">
                  Calibrated Human Comfort & Spine Support
                </h4>
                <p className="text-xs font-sans text-[#A69A8A] leading-relaxed">
                  Relaxed 112° reclines and multi-density foam cores that support natural spine curvature for hours of relaxation.
                </p>
              </div>

              <div className="art-commitment-card p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-tangerine/50 transition-colors duration-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs uppercase tracking-wider text-tangerine-light bg-tangerine/15 px-3 py-0.5 rounded-full border border-tangerine/30 font-semibold">
                    Hand-Smoothed Radii · Child-Safe
                  </span>
                  <span className="font-serif text-lg font-bold text-white/60">03</span>
                </div>
                <h4 className="font-serif text-lg text-[#FAF8F5] font-semibold">
                  Child-Safe Radii & Organic Hardwax Oils
                </h4>
                <p className="text-xs font-sans text-[#A69A8A] leading-relaxed">
                  Hand-applied botanical wax oils that protect without sealing the wood under plastic, allowing the grain to breathe naturally with zero toxic VOCs.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <MagneticButton
                href="/collections"
                className="group space-x-2 text-xs font-sans uppercase tracking-wider bg-tangerine hover:bg-coral text-white font-medium px-8 py-4 rounded-full shadow-warm transition-all duration-300 hover:shadow-lg inline-flex items-center"
              >
                <TextRoll>Explore Our Craftsmanship</TextRoll>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>

              <MagneticButton
                href="/collections/sanctuary-seating"
                className="group space-x-2 text-xs font-sans uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 text-[#FAF8F5] font-medium px-6 py-4 rounded-full transition-all duration-300 inline-flex items-center"
              >
                <TextRoll>View Living Series</TextRoll>
                <Compass className="w-4 h-4 text-tangerine" />
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
