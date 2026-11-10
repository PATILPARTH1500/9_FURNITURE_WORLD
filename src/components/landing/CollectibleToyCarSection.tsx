'use client';

import React, { useEffect, useRef } from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ShieldCheck, BatteryCharging, Gauge, Sparkles } from 'lucide-react';
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
      className="relative z-20 bg-[#FBF9F5] text-[#1A1816] py-20 sm:py-28 lg:py-32 border-t border-stone-200/80 overflow-hidden"
    >
      <span id="kids-cars" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <span id="ride-on-cars" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <span id="lifestyle-curations" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <span id="cars" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="toycar-header flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-8 border-b border-stone-200/80 gap-6 sm:gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-sans text-[11px] tracking-widest uppercase text-[#C84D1B] font-semibold bg-[#C84D1B]/10 px-3.5 py-1.5 rounded-full border border-[#C84D1B]/20 inline-flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
                <span>Section 06 · Family Play Lounge · Scene 04</span>
              </span>
              <span className="font-sans text-[11px] uppercase tracking-widest text-[#57534E] bg-white px-3 py-1 rounded-full border border-stone-200 font-medium inline-flex items-center space-x-1">
                <BatteryCharging className="w-3 h-3 text-[#C84D1B]" />
                <span>Electric Ride-On Vehicles</span>
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1A1816] font-normal tracking-tight leading-[1.08]">
              The Joy of Motion, <br />
              <span className="italic font-light text-[#57534E]">Crafted for Family Living.</span>
            </h2>
          </div>

          <div className="space-y-4 max-w-md">
            <p className="font-sans text-sm sm:text-base text-[#57534E] leading-relaxed font-normal">
              Real homes are made for living, laughter, and active family life. Our battery-powered children&apos;s ride-on sports cars bring timeless automotive silhouettes, rich gloss finishes, and quiet indoor cruising to the open checkerboard floors of our Family Lounge.
            </p>
            <Link
              href="/#residence-tour"
              className="inline-flex items-center space-x-1.5 text-xs font-sans uppercase tracking-widest text-[#C84D1B] hover:text-[#A73D12] font-semibold group"
            >
              <span>Explore Scene 04: Family Lounge</span>
              <ArrowUpRight className="w-4 h-4 text-[#C84D1B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* 4-Item Showcase Architectural Grid */}
        <div className="toycar-grid grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* Card 1: The Grand Prix Electric Ride-On Racer (Col 1-7) */}
          <div className="toycar-card md:col-span-7">
            <SpotlightCard
              className="group bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 overflow-hidden shadow-[0_4px_20px_rgba(26,24,22,0.04)] hover:shadow-[0_14px_36px_rgba(26,24,22,0.08)] transition-all duration-500 h-full flex flex-col justify-between"
              spotlightColor="rgba(200, 77, 27, 0.06)"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#F2EFE9]">
                <Image
                  src="/images/lifestyle/ride-on-grand-prix-racer.webp"
                  alt="Child-Sized Grand Prix Electric Ride-On Sports Car in Gloss Tangerine Lacquer"
                  fill
                  className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 58vw"
                  priority
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-stone-200 text-[11px] font-sans font-semibold text-[#C84D1B] uppercase tracking-wider">
                    Tangerine Gloss
                  </span>
                  <span className="bg-[#1A1816]/80 text-white backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-sans font-medium uppercase tracking-wider">
                    Ages 3–6
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1816] font-normal group-hover:text-[#C84D1B] transition-colors">
                    The Grand Prix Electric Ride-On Racer
                  </h3>
                  <span className="text-[11px] font-sans uppercase tracking-widest text-[#2B5238] font-semibold bg-[#2B5238]/10 px-3 py-1 rounded-full border border-[#2B5238]/20 w-fit shrink-0">
                    Quiet Rubber Wheels
                  </span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  A child-sized vintage sports car engineered for smooth indoor cruising. Features a low-slung aerodynamic chassis, durable gloss lacquer bodywork, contoured tan bucket seat, and gentle single-pedal acceleration tuned for residential hardwood and tile floors.
                </p>

                <div className="pt-2 border-t border-stone-200/80 flex flex-wrap items-center gap-3 text-xs font-sans text-[#78716C]">
                  <span className="flex items-center space-x-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-[#C84D1B]" />
                    <span>Rechargeable Battery Drive</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2B5238]" />
                    <span>Non-Marking Floor Tires</span>
                  </span>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 2: Classic Heritage Roadster Ride-On (Col 8-12) */}
          <div className="toycar-card md:col-span-5">
            <SpotlightCard
              className="group bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 overflow-hidden shadow-[0_4px_20px_rgba(26,24,22,0.04)] hover:shadow-[0_14px_36px_rgba(26,24,22,0.08)] transition-all duration-500 h-full flex flex-col justify-between"
              spotlightColor="rgba(87, 83, 78, 0.05)"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2EFE9]">
                <Image
                  src="/images/lifestyle/ride-on-heritage-roadster.webp"
                  alt="Classic Heritage Roadster Children Ride-On Vehicle in Warm Cream Finish"
                  fill
                  className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-stone-200 text-[11px] font-sans font-semibold text-[#1A1816] uppercase tracking-wider">
                  Warm Cream & Chrome
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-xl sm:text-2xl text-[#1A1816] font-normal group-hover:text-[#C84D1B] transition-colors">
                    Classic Heritage Roadster Ride-On
                  </h3>
                  <span className="text-[10px] font-sans uppercase tracking-wider text-[#78716C] bg-stone-100 px-2.5 py-1 rounded-full shrink-0">
                    Grand Touring
                  </span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Timeless 1950s automotive curves with polished chrome grille accents, a cushioned cognac driver seat, and whisper-quiet rubberized wheels that glide effortlessly over wood and tile without marking floors.
                </p>
                <div className="pt-2 border-t border-stone-200/80 flex items-center space-x-2 text-xs font-sans text-[#78716C]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C84D1B]" />
                  <span>Soft-start gentle acceleration for young drivers</span>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 3: Family Lounge Play Atmosphere (Col 1-8) */}
          <div className="toycar-card md:col-span-8">
            <SpotlightCard
              className="group bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 overflow-hidden shadow-[0_4px_20px_rgba(26,24,22,0.04)] hover:shadow-[0_14px_36px_rgba(26,24,22,0.08)] transition-all duration-500 h-full flex flex-col justify-between"
              spotlightColor="rgba(87, 83, 78, 0.05)"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#F2EFE9]">
                <Image
                  src="/images/lifestyle/family-lounge-ride-on-play.webp"
                  alt="Child driving ride-on sports car across checkerboard floor in sun-drenched family lounge under adult supervision"
                  fill
                  className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-stone-200 text-xs font-sans font-medium text-[#1A1816] flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#2B5238]" />
                  <span>Scene 04 Checkerboard Floor Experience</span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="font-serif text-2xl text-[#1A1816] font-normal">
                    Adventures on the Checkerboard Floor
                  </h3>
                  <div className="flex items-center space-x-1.5 text-[11px] font-sans text-[#2B5238] font-semibold bg-[#2B5238]/10 px-3 py-1 rounded-full border border-[#2B5238]/20 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Attentive Adult Supervision</span>
                  </div>
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  Directly connected to our Scene 04 Family Lounge. Open floor plans and classic black-and-cream checkerboard tiling provide the perfect indoor course for children to explore, drive, and imagine within comfortable sight of parents relaxing nearby.
                </p>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 4: Driver Cockpit & Ergonomic Controls (Col 9-12) */}
          <div className="toycar-card md:col-span-4">
            <SpotlightCard
              className="group bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 overflow-hidden shadow-[0_4px_20px_rgba(26,24,22,0.04)] hover:shadow-[0_14px_36px_rgba(26,24,22,0.08)] transition-all duration-500 h-full flex flex-col justify-between"
              spotlightColor="rgba(200, 77, 27, 0.05)"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[#F2EFE9]">
                <Image
                  src="/images/lifestyle/ride-on-cockpit-detail.webp"
                  alt="Close-up of children ride-on car driver cockpit, soft-grip steering wheel, speedometer gauge and padded seat"
                  fill
                  className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 34vw"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full border border-stone-200 text-[11px] font-sans font-semibold text-[#1A1816] uppercase tracking-wider">
                  Driver Cockpit
                </div>
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-xl text-[#1A1816] font-normal">
                    Thoughtful Child Ergonomics
                  </h3>
                  <Gauge className="w-4 h-4 text-[#C84D1B] shrink-0" />
                </div>
                <p className="font-sans text-xs text-[#57534E] leading-relaxed">
                  Tactile soft-grip steering wheel, push-button power ignition, and a supportive high-back seat designed for easy handling by young drivers.
                </p>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Bottom Banner Triggering Scene 04 */}
        <div className="mt-12 sm:mt-14 pt-8 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans text-[#78716C] uppercase tracking-wider font-medium text-center sm:text-left">
            Residence Living Collection · Family Lounge Living &amp; Active Play
          </p>
          <MagneticButton
            href="/#residence-tour"
            className="space-x-2 text-xs font-sans uppercase tracking-wider bg-[#1A1816] hover:bg-[#C84D1B] text-white font-medium px-6 py-3.5 rounded-full shadow-2xs hover:shadow-xs transition-all inline-flex items-center shrink-0"
          >
            <TextRoll>Tour The Family Lounge Scene</TextRoll>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};
