'use client';

import React, { useEffect, useRef } from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowUpRight, Compass, ShieldCheck } from 'lucide-react';
import { SpotlightCard, MagneticButton, TextRoll } from '@/components/ui/motion';
import { AmbientParticles } from '@/components/ui/AmbientParticles';

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
      id="lifestyle-curations"
      ref={sectionRef}
      className="relative z-20 bg-[#FAF6F0] text-checkerboard py-24 sm:py-32 border-t border-checkerboard/12 overflow-hidden bg-architectural-grid"
    >
      {/* Subtle Ambient Particle Drift in Background */}
      <AmbientParticles count={16} tint="gold" opacity={0.3} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header with Notion Blueprint Tag */}
        <div className="toycar-header flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-checkerboard/12 gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-sans text-xs tracking-wider uppercase text-tangerine font-semibold bg-white/90 px-3.5 py-1.5 rounded-full border border-tangerine/20 inline-flex items-center space-x-1.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-tangerine" />
                <span>Family Lounge Story · Scene 04</span>
              </span>
              <span className="font-sans text-xs uppercase tracking-wider text-walnut/80 bg-white/70 px-3 py-1 rounded-full border border-checkerboard/10 font-medium">
                Collectible Atelier · Scale 1:18
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-checkerboard font-semibold tracking-tight leading-[1.08]">
              Playful Nostalgia, <br />
              <span className="italic font-normal text-walnut">Crafted as Art.</span>
            </h2>
          </div>

          <div className="space-y-4 max-w-md">
            <p className="font-sans text-sm sm:text-base text-walnut leading-relaxed font-normal">
              Real homes are made for living, laughing, and play. Our collectible miniature vehicles celebrate classic racing silhouettes, hand-turned European hardwoods, and vibrant gloss finishes that look just as elegant on an architectural credenza as they do on the family rug.
            </p>
            <Link
              href="/#lounge"
              className="inline-flex items-center space-x-1.5 text-xs font-sans uppercase tracking-wider text-tangerine hover:text-coral font-semibold group"
            >
              <span>Explore Scene 04: Family Lounge</span>
              <Compass className="w-4 h-4 text-tangerine transition-transform group-hover:rotate-45" />
            </Link>
          </div>
        </div>

        {/* 4-Item Curated Architectural Grid */}
        <div className="toycar-grid grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* Card 1: Vintage Grand Prix Racer (Col 1-7) */}
          <div className="toycar-card md:col-span-7">
            <SpotlightCard
              className="group bg-white rounded-3xl border border-checkerboard/12 overflow-hidden shadow-retro hover:shadow-warm transition-all duration-500 h-full flex flex-col justify-between"
              spotlightColor="rgba(244, 81, 11, 0.08)"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream-dark">
                <Image
                  src="/images/lifestyle/toy-car-vintage-racer.webp"
                  alt="Collectible Vintage Grand Prix Miniature Racer in Tangerine Lacquer"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 58vw"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="font-serif text-2xl sm:text-3xl text-checkerboard font-semibold group-hover:text-tangerine transition-colors">
                    The Monoposto Grand Prix Racer
                  </h3>
                  <span className="text-xs font-sans uppercase tracking-wider text-tangerine font-semibold bg-tangerine/10 px-3 py-0.5 rounded-full border border-tangerine/20 w-fit">
                    Hand-Polished Enamel
                  </span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-walnut leading-relaxed">
                  Sculpted with aerodynamic 1970s proportions, polished brass spoke wheels, and hand-rubbed tangerine gloss lacquer. Designed as an heirloom piece for design-conscious homes.
                </p>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 2: Minimalist Solid Walnut Roadster (Col 8-12) */}
          <div className="toycar-card md:col-span-5">
            <SpotlightCard
              className="group bg-white rounded-3xl border border-checkerboard/12 overflow-hidden shadow-retro hover:shadow-warm transition-all duration-500 h-full flex flex-col justify-between"
              spotlightColor="rgba(128, 84, 56, 0.1)"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-dark">
                <Image
                  src="/images/lifestyle/toy-car-wooden-minimal.webp"
                  alt="Handcrafted Solid Walnut and Brass Minimalist Toy Roadster"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 42vw"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <h3 className="font-serif text-xl sm:text-2xl text-checkerboard font-semibold group-hover:text-walnut transition-colors">
                  Solid Walnut Architectural Roadster
                </h3>
                <p className="font-sans text-xs text-walnut leading-relaxed">
                  Hand-turned solid American walnut timber with satin plant-oil wax. Built with zero plastics, celebrating organic wood grain that deepens with family use.
                </p>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 3: Family Lounge Play Atmosphere (Col 1-8) */}
          <div className="toycar-card md:col-span-8">
            <SpotlightCard
              className="group bg-white rounded-3xl border border-checkerboard/12 overflow-hidden shadow-retro hover:shadow-warm transition-all duration-500 h-full flex flex-col justify-between"
              spotlightColor="rgba(98, 107, 61, 0.08)"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-cream-dark">
                <Image
                  src="/images/lifestyle/family-lounge-play.webp"
                  alt="Warm Family Lounge Floor with Handcrafted Toys and Olive Velvet Sofa"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
              </div>

              <div className="p-6 sm:p-8 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-2xl text-checkerboard font-semibold group-hover:text-olive transition-colors">
                    Where Design Meets Daily Wonder
                  </h3>
                  <div className="flex items-center space-x-1.5 text-xs font-sans text-olive font-semibold bg-olive/10 px-3 py-1 rounded-full border border-olive/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Non-Toxic Plant Hardwax</span>
                  </div>
                </div>
                <p className="font-sans text-xs sm:text-sm text-walnut leading-relaxed">
                  Natural oak flooring, plush geometric wool rugs, and relaxed 112° seating. Our spaces invite creative exploration without sacrificing refined architectural beauty.
                </p>
              </div>
            </SpotlightCard>
          </div>

          {/* Card 4: Macro Wheel & Enamel Craft Detail (Col 9-12) */}
          <div className="toycar-card md:col-span-4">
            <SpotlightCard
              className="group bg-white rounded-3xl border border-checkerboard/12 overflow-hidden shadow-retro hover:shadow-warm transition-all duration-500 h-full flex flex-col justify-between"
              spotlightColor="rgba(244, 184, 46, 0.12)"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-cream-dark">
                <Image
                  src="/images/lifestyle/toy-car-macro-detail.webp"
                  alt="Precision Craft Joinery Detail on Hand-Turned Miniature Brass Wheels"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 34vw"
                />
              </div>

              <div className="p-6 space-y-2">
                <h3 className="font-serif text-xl text-checkerboard font-semibold">
                  Precision Metal & Timber Joinery
                </h3>
                <p className="font-sans text-xs text-walnut leading-relaxed">
                  Turned solid brass axles, hand-stitched leather seat pads, and chamfered edges designed for generations.
                </p>
              </div>
            </SpotlightCard>
          </div>
        </div>

        {/* Bottom Banner Triggering Scene 04 */}
        <div className="mt-14 pt-8 border-t border-checkerboard/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans text-walnut uppercase tracking-wider font-medium">
            Residence Living Collection · Handcrafted Hardwoods & Natural Waxes
          </p>
          <MagneticButton
            href="/#lounge"
            className="space-x-2 text-xs font-sans uppercase tracking-wider bg-tangerine hover:bg-coral text-white font-medium px-6 py-3 rounded-full shadow-warm transition-all inline-flex items-center shrink-0"
          >
            <TextRoll>View Family Lounge Tour</TextRoll>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};
