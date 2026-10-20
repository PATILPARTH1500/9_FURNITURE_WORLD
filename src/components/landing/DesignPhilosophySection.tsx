'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sofa, Shield, Compass, Palette } from 'lucide-react';
import { AnimatedHeading, SpotlightCard } from '@/components/ui/motion';

interface PrincipleItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  accentBadge: string;
}

const DESIGN_PRINCIPLES: PrincipleItem[] = [
  {
    id: 'comfort',
    number: '01',
    title: 'Comfort for Everyday Living',
    subtitle: 'Cushion densities and seating angles designed for long evenings',
    description:
      'A sofa should welcome you the moment you sit down. We engineer multi-layer high-resilience foam wrapped in soft fiber fill, paired with relaxed 112° backrest angles for natural lumbar support.',
    icon: Sofa,
    image: '/images/film/macro-boucle.webp',
    accentBadge: 'text-tangerine bg-tangerine/20 border-tangerine/30',
  },
  {
    id: 'proportions',
    number: '02',
    title: 'Thoughtful Human Proportions',
    subtitle: 'Safe rounded corners and generous walk-around clearance',
    description:
      'Real homes are full of life. We round table perimeters and seat armrests with gentle curves, avoiding sharp 90° corners so children and family can move past without painful bumps.',
    icon: Compass,
    image: '/images/film/exploded-view.webp',
    accentBadge: 'text-[#D8E6A6] bg-[#D8E6A6]/15 border-[#D8E6A6]/30',
  },
  {
    id: 'materials',
    number: '03',
    title: 'Honest Natural Materials',
    subtitle: 'Solid European hardwoods and breathable protective finishes',
    description:
      'We use solid European oak, natural smoked walnut, and heavy-gauge woven bouclé. We never use cheap particleboard or paper foils. Hand-applied wax oils celebrate natural grain that improves with age.',
    icon: Shield,
    image: '/images/film/macro-joinery.webp',
    accentBadge: 'text-[#F5A89A] bg-[#F5A89A]/15 border-[#F5A89A]/30',
  },
  {
    id: 'character',
    number: '04',
    title: 'Colour and Architectural Character',
    subtitle: 'Terracotta, warm cream, olive velvet, and sunny orange notes',
    description:
      'We move beyond sterile cold grey interiors. Inspired by 1970s architectural residences, our palette blends joyful burnt oranges, calming olive greens, and warm creams that bring happiness home.',
    icon: Palette,
    image: '/images/film/hero-plinth.webp',
    accentBadge: 'text-mustard-light bg-mustard/20 border-mustard/30',
  },
];

export const DesignPhilosophySection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.philosophy-header',
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

      gsap.fromTo(
        '.philosophy-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
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
      id="design-philosophy"
      ref={sectionRef}
      className="relative z-20 bg-[#282F19] text-[#F4E9D8] py-24 sm:py-32 border-t border-checkerboard/30 overflow-hidden"
    >
      {/* Ambient Radial Glow on Deep Olive */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(244,81,11,0.09),transparent_70%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header with High Contrast Warm Content */}
        <div className="philosophy-header flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-white/12 gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="font-sans text-xs tracking-wider uppercase text-[#D8E6A6] font-semibold bg-white/10 px-3.5 py-1.5 rounded-full border border-[#D8E6A6]/25 inline-flex items-center space-x-1.5 shadow-2xs backdrop-blur-xs">
              <Compass className="w-3.5 h-3.5 text-[#D8E6A6]" />
              <span>Design Philosophy</span>
            </span>
            <AnimatedHeading
              text="Designed with Intention, Crafted for Family Life."
              highlightText="Crafted for Family Life."
              highlightClassName="italic text-[#E7D8BF] font-normal"
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#FAF5EE] font-semibold tracking-tight leading-[1.15]"
            />
          </div>
          <p className="font-sans text-sm sm:text-base text-[#D0C4B4] leading-relaxed max-w-md font-normal">
            Every piece in our catalogue follows four uncompromised design tenets to guarantee beauty, structural integrity, and deep daily comfort.
          </p>
        </div>

        {/* 4 Feature Cards Grid with Contrasting Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESIGN_PRINCIPLES.map((item) => {
            const Icon = item.icon;
            return (
              <SpotlightCard
                key={item.id}
                className="philosophy-card group bg-white/[0.05] hover:bg-white/[0.09] backdrop-blur-xs rounded-3xl border border-white/10 hover:border-tangerine/50 p-6 flex flex-col justify-between space-y-6 shadow-[0_12px_36px_rgba(0,0,0,0.25)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-2"
                contentClassName="flex flex-col justify-between h-full space-y-6"
                spotlightColor="rgba(216, 230, 166, 0.16)"
              >
                <div className="space-y-4">
                  {/* Top Bar with Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-3xl text-tangerine/80 font-semibold group-hover:text-tangerine group-hover:scale-105 transition-all">
                      {item.number}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:rotate-6 ${item.accentBadge}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#FAF5EE] font-semibold leading-snug group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-sans text-tangerine-light font-medium mt-1">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="font-sans text-xs sm:text-sm text-[#C8BCAC] leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Tactile Macro Detail Photo */}
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-black/30">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108 filter brightness-[0.9] group-hover:brightness-100"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
