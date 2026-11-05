'use client';

import React, { useEffect, useRef } from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { SpotlightCard, MagneticButton, TextRoll } from '@/components/ui/motion';

export const CollectibleToyCarSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.toycar-header',
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
        '.toycar-card',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.toycar-grid',
            start: 'top 85%',
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
      id="collectible-cars"
      ref={sectionRef}
      className="relative z-20 bg-[#FBF9F5] text-[#1A1816] py-24 sm:py-32 border-t border-stone-200/80 overflow-hidden"
    >
      <span id="lifestyle-curations" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <span id="cars" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="toycar-header flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-stone-200/80 gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-sans text-[11px] tracking-widest uppercase text-[#C84D1B] font-semibold bg-[#C84D1B]/10 px-3.5 py-1.5 rounded-full border border-[#C84D1B]/20 inline-flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
                <span>Family Lounge Curations · Scene 04</span>
              </span>
              <span className="font-sans text-[11px] uppercase tracking-widest text-[#78716C] bg-white px-3 py-1 rounded-full border border-stone-200 font-medium">
                Collector Atelier · Scale 1:18
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1A1816] font-light tracking-tight leading-[1.08]">
              Playful Nostalgia, <br />
              <span className="italic font-normal text-[#57534E]">Crafted as Art.</span>
            </h2>
          </div>

          <div className="space-y-4 max-w-md">
            <p className="font-sans text-sm sm:text-base text-[#57534E] leading-relaxed font-normal">
              Real homes are made for living, laughing, and play. Our collectible miniature vehicles celebrate classic racing silhouettes, hand-turned European hardwoods, and vibrant gloss lacquer finishes that look just as commanding on an architectural credenza as they do on a wool family rug.
            </p>
            <Link
              href="/#lounge"
              className="inline-flex items-center space-x-1.5 text-xs font-sans uppercase tracking-widest text-[#C84D1B] hover:text-[#A73D12] font-semibold group"
            >
              <span>Explore Scene 04: Family Lounge</span>
              <ArrowUpRight className="w-4 h-4 text-[#C84D1B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* 4-Item Curated Architectural Grid */}
        <div className="toycar-grid grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* Card 1: Vintage Grand Prix Racer (Col 1-7) */}
          <div className="toycar-card md:col-span-7">
            <SpotlightCard
              className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-[0_4px_20px_rgba(26,24,22,0.04)] hover:shadow-[0_14px_36px_rgba(26,24,22,0.08)] transition-all duration-500 h-full flex flex-col justify-between"
              spotlightColor="rgba(200, 77, 27, 0.05)"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F2EFE9]">
                <Image
                  src="/images/lifestyle/toy-car-vintage-racer.webp"
                  alt="Collectible Vintage Grand Prix Miniature Racer in Tangerine Lacquer"
                  fill
                  className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 58vw"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1816] font-normal group-hover:text-[#C84D1B] transition-colors">
                    The Monoposto Grand Prix Racer
                  </h3>
                  <span className="text-[11px] font-sans uppercase tracking-widest text-[#C84D1B] font-semibold bg-[#C84D1B]/10 px-3 py-1 rounded-full border border-[#C84D1B]/20 w-fit shrink-0">
                    Hand-Polished Enamel
                  </span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Sculpted with aerodynamic 1970s proportions, polished brass spoke wheels, and hand-rubbed tangerine gloss lacquer. Designed as an heirloom piece for design-conscious residences.
                </p>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 2: Minimalist Solid Walnut Roadster (Col 8-12) */}
          <div className="toycar-card md:col-span-5">
            <SpotlightCard
              className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-[0_4px_20px_rgba(26,24,22,0.04)] hover:shadow-[0_14px_36px_rgba(26,24,22,0.08)] transition-all duration-500 h-full flex flex-col justify-between"
              spotlightColor="rgba(87, 83, 78, 0.05)"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2EFE9]">
                <Image
                  src="/images/lifestyle/toy-car-wooden-minimal.webp"
                  alt="Handcrafted Solid Walnut and Brass Minimalist Toy Roadster"
                  fill
                  className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl text-[#1A1816] font-normal group-hover:text-[#C84D1B] transition-colors">
                  Solid Walnut Architectural Roadster
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Hand-turned solid American walnut timber with satin plant-oil wax. Built with zero plastics, celebrating organic wood grain that deepens with family use.
                </p>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 3: Family Lounge Play Atmosphere (Col 1-8) */}
          <div className="toycar-card md:col-span-8">
            <SpotlightCard
              className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-[0_4px_20px_rgba(26,24,22,0.04)] hover:shadow-[0_14px_36px_rgba(26,24,22,0.08)] transition-all duration-500 h-full flex flex-col justify-between"
              spotlightColor="rgba(87, 83, 78, 0.05)"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F2EFE9]">
                <Image
                  src="/images/lifestyle/family-lounge-play.webp"
                  alt="Warm Family Lounge Floor with Handcrafted Toys and Olive Velvet Sofa"
                  fill
                  className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-serif text-2xl text-[#1A1816] font-normal">
                    Where Design Meets Daily Wonder
                  </h3>
                  <div className="flex items-center space-x-1.5 text-[11px] font-sans text-[#2B5238] font-semibold bg-[#2B5238]/10 px-3 py-1 rounded-full border border-[#2B5238]/20 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Non-Toxic Plant Hardwax</span>
                  </div>
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Natural oak flooring, plush geometric wool rugs, and relaxed 112° seating. Our spaces invite creative exploration without sacrificing refined architectural beauty.
                </p>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 4: Macro Wheel & Enamel Craft Detail (Col 9-12) */}
          <div className="toycar-card md:col-span-4">
            <SpotlightCard
              className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-[0_4px_20px_rgba(26,24,22,0.04)] hover:shadow-[0_14px_36px_rgba(26,24,22,0.08)] transition-all duration-500 h-full flex flex-col justify-between"
              spotlightColor="rgba(200, 77, 27, 0.05)"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#F2EFE9]">
                <Image
                  src="/images/lifestyle/toy-car-macro-detail.webp"
                  alt="Precision Craft Joinery Detail on Hand-Turned Miniature Brass Wheels"
                  fill
                  className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 34vw"
                />
              </div>

              <div className="p-6 space-y-2">
                <h3 className="font-serif text-xl text-[#1A1816] font-normal">
                  Precision Metal & Timber Joinery
                </h3>
                <p className="font-sans text-xs text-[#57534E] leading-relaxed">
                  Turned solid brass axles, hand-stitched leather seat pads, and chamfered edges designed to endure for generations.
                </p>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Bottom Banner Triggering Scene 04 */}
        <div className="mt-14 pt-8 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans text-[#78716C] uppercase tracking-wider font-medium">
            Residence Living Collection · Handcrafted Hardwoods & Natural Waxes
          </p>
          <MagneticButton
            href="/#lounge"
            className="space-x-2 text-xs font-sans uppercase tracking-wider bg-[#1A1816] hover:bg-[#C84D1B] text-white font-medium px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all inline-flex items-center shrink-0"
          >
            <TextRoll>View Family Lounge Tour</TextRoll>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};
