'use client';

import React from 'react';
import Image from 'next/image';
import { Sofa, Shield, Compass, Palette } from 'lucide-react';

interface PrincipleItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  accentColor: string;
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
    image: '/images/film/macro-boucle.jpg',
    accentColor: 'text-tangerine bg-tangerine/10 border-tangerine/20',
  },
  {
    id: 'proportions',
    number: '02',
    title: 'Thoughtful Human Proportions',
    subtitle: 'Safe rounded corners and generous walk-around clearance',
    description:
      'Real homes are full of life. We round table perimeters and seat armrests with gentle curves, avoiding sharp 90° corners so children and family can move past without painful bumps.',
    icon: Compass,
    image: '/images/film/exploded-view.jpg',
    accentColor: 'text-olive bg-olive/10 border-olive/20',
  },
  {
    id: 'materials',
    number: '03',
    title: 'Honest Natural Materials',
    subtitle: 'Solid European hardwoods and breathable protective finishes',
    description:
      'We use solid European oak, natural smoked walnut, and heavy-gauge woven bouclé. We never use cheap particleboard or paper foils. Hand-applied wax oils celebrate natural grain that improves with age.',
    icon: Shield,
    image: '/images/film/macro-joinery.jpg',
    accentColor: 'text-rust bg-rust/10 border-rust/20',
  },
  {
    id: 'character',
    number: '04',
    title: 'Colour and Architectural Character',
    subtitle: 'Terracotta, warm cream, olive velvet, and sunny orange notes',
    description:
      'We move beyond sterile cold grey interiors. Inspired by 1970s architectural residences, our palette blends joyful burnt oranges, calming olive greens, and warm creams that bring happiness home.',
    icon: Palette,
    image: '/images/film/hero-plinth.jpg',
    accentColor: 'text-mustard-dark bg-mustard/15 border-mustard/30',
  },
];

export const DesignPhilosophySection: React.FC = () => {
  return (
    <section className="relative z-20 bg-cream-dark py-24 sm:py-32 border-t border-checkerboard/15">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-checkerboard/15 gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="font-sans text-xs tracking-wider uppercase text-olive font-semibold bg-white/80 px-3.5 py-1.5 rounded-full border border-olive/20 inline-block shadow-2xs">
              Design Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-checkerboard font-semibold tracking-tight leading-[1.15]">
              Designed with Intention, <br />
              <span className="italic text-walnut font-normal">Crafted for Family Life.</span>
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-walnut leading-relaxed max-w-md font-normal">
            Every piece in our catalogue follows four uncompromised design tenets to guarantee beauty, structural integrity, and deep daily comfort.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESIGN_PRINCIPLES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group bg-white rounded-3xl border border-checkerboard/10 p-6 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-warm transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="space-y-4">
                  {/* Top Bar with Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl text-checkerboard/40 font-semibold group-hover:text-tangerine transition-colors">
                      {item.number}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${item.accentColor}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Visual Image Miniature */}
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-checkerboard/10 bg-cream">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h3 className="font-serif text-xl text-checkerboard font-semibold leading-snug group-hover:text-tangerine transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-sans text-tangerine font-medium mt-1">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-xs text-walnut leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Decorative Divider */}
                <div className="pt-4 border-t border-checkerboard/5 flex items-center justify-between text-[11px] font-sans text-walnut/70">
                  <span>Principle {item.number}</span>
                  <span className="font-medium text-checkerboard">Furniture Village Studio</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

