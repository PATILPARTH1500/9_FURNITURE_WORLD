'use client';

import React, { useEffect, useRef } from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

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
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      gsap.fromTo(
        '.art-commitment-item',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.art-commitments-grid',
            start: 'top 88%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      // Subtle parallax on macro joinery detail
      gsap.to('.art-macro-inset', {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: imageSpreadRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="art-of-living"
      ref={sectionRef}
      className="relative z-20 bg-[#161412] text-[#FBF9F5] py-28 sm:py-36 border-t border-white/10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Layered Architectural Photography */}
          <div ref={imageSpreadRef} className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full rounded-3xl overflow-hidden border border-white/12 shadow-[0_24px_60px_rgba(0,0,0,0.5)] bg-black/40 group">
              <Image
                src="/images/film/interior-villa.webp"
                alt="Architectural Villa Living Room with Handcrafted Furniture"
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-104 filter brightness-[0.92]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Overlapping Macro Joinery Inset */}
            <div className="art-macro-inset hidden sm:block absolute -bottom-8 -right-8 w-48 sm:w-56 aspect-square rounded-2xl overflow-hidden border-2 border-white/20 shadow-[0_20px_48px_rgba(0,0,0,0.6)] bg-black/60 group">
              <Image
                src="/images/film/macro-joinery.webp"
                alt="Precision Interlocking Mortise and Tenon Timber Joint"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-108"
                sizes="224px"
              />
            </div>
          </div>

          {/* Right Column: Editorial Narrative & Commitments */}
          <div className="lg:col-span-6 space-y-8 art-narrative">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
                <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#E7C89F] font-semibold">
                  Craft Philosophy
                </span>
              </div>

              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#FAF8F5] font-normal tracking-tight leading-[1.08]">
                Furniture Made to Be Lived In, <br />
                <span className="italic font-light text-[#E7C89F]">Not Just Looked At.</span>
              </h2>
            </div>

            <div className="space-y-4 text-[#D0C4B4] font-sans text-sm sm:text-base leading-relaxed font-normal">
              <p>
                We reject cold, fragile showroom pieces built solely for exhibitions. Real homes are meant for morning coffee, family dinners, late-night reading, and quiet moments of stillness.
              </p>
              <p>
                Every timber edge is calibrated with soft, child-safe radii. We use kiln-dried European white oak, American black walnut, and organic cold-pressed wax finishes that let the natural grain breathe without toxic VOCs.
              </p>
            </div>

            {/* 3 Editorial Craftsmanship Commitments */}
            <div className="art-commitments-grid space-y-4 pt-6 border-t border-white/12">
              <div className="art-commitment-item p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#C84D1B]/50 transition-colors duration-300">
                <div className="flex items-baseline justify-between mb-1.5">
                  <h3 className="font-serif text-lg sm:text-xl text-[#FAF8F5] font-medium">
                    Solid Hardwood Joinery
                  </h3>
                  <span className="font-serif text-base text-[#E7C89F] font-light">01</span>
                </div>
                <p className="text-xs font-sans text-[#A69A8A] leading-relaxed">
                  Kiln-dried European Oak and Smoked Walnut joined by hand with traditional mortise-and-tenon joints. Zero particleboard or synthetic foils.
                </p>
              </div>

              <div className="art-commitment-item p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#C84D1B]/50 transition-colors duration-300">
                <div className="flex items-baseline justify-between mb-1.5">
                  <h3 className="font-serif text-lg sm:text-xl text-[#FAF8F5] font-medium">
                    Calibrated 112° Human Recline
                  </h3>
                  <span className="font-serif text-base text-[#E7C89F] font-light">02</span>
                </div>
                <p className="text-xs font-sans text-[#A69A8A] leading-relaxed">
                  Ergonomically tuned seat pitch and multi-density natural latex foam cores that support natural spine posture for hours of comfortable living.
                </p>
              </div>

              <div className="art-commitment-item p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#C84D1B]/50 transition-colors duration-300">
                <div className="flex items-baseline justify-between mb-1.5">
                  <h3 className="font-serif text-lg sm:text-xl text-[#FAF8F5] font-medium">
                    Zero-VOC Botanical Hardwaxes
                  </h3>
                  <span className="font-serif text-base text-[#E7C89F] font-light">03</span>
                </div>
                <p className="text-xs font-sans text-[#A69A8A] leading-relaxed">
                  Hand-rubbed natural plant oil and beeswax finishes that protect the timber against daily spills while deepening in patina over generations.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/collections"
                className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-wider bg-[#C84D1B] hover:bg-[#D9531E] text-white font-semibold px-8 py-4 rounded-full shadow-sm transition-all duration-300"
              >
                <span>Explore Full Collection</span>
                <ArrowUpRight className="w-4 h-4 text-white" />
              </Link>

              <Link
                href="/collections/sanctuary-seating"
                className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-wider bg-white/10 hover:bg-white/15 border border-white/20 text-[#FAF8F5] font-semibold px-7 py-4 rounded-full transition-all duration-300"
              >
                <span>View Living Suite</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/70" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
