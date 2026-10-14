'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';

export const ArtOfLivingSection: React.FC = () => {
  return (
    <section className="relative z-20 bg-cream py-24 sm:py-32 border-t border-checkerboard/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Narrative & Values */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="font-sans text-xs tracking-wider uppercase text-tangerine font-semibold bg-white/80 px-3.5 py-1.5 rounded-full border border-tangerine/20 inline-flex items-center space-x-1.5 shadow-2xs">
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

            <p className="font-sans text-sm sm:text-base text-checkerboard/80 leading-relaxed font-normal">
              We take inspiration from optimistic 1970s modernist residences: warm cream bouclés, solid European oak, rich smoked walnut, and cheerful tangerine accents. Every curve is sculpted to embrace natural seating postures, and every timber edge is hand-smoothed so children and pets can move freely around your home.
            </p>

            {/* 3 Core Editorial Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-checkerboard/10">
              <div className="space-y-2 bg-white/60 p-4 rounded-2xl border border-checkerboard/5 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-tangerine/10 flex items-center justify-center text-tangerine">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg text-checkerboard font-semibold">100% Solid Wood</h3>
                <p className="font-sans text-xs text-walnut leading-relaxed">
                  Genuine European Oak & Walnut with natural plant wax-oil finishes that let timber breathe.
                </p>
              </div>

              <div className="space-y-2 bg-white/60 p-4 rounded-2xl border border-checkerboard/5 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-olive/10 flex items-center justify-center text-olive">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-lg text-checkerboard font-semibold">Everyday Ergonomics</h3>
                <p className="font-sans text-xs text-walnut leading-relaxed">
                  Gentle 112° reclines and high-resilience foam cores calibrated for lasting comfort.
                </p>
              </div>

              <div className="space-y-2 bg-white/60 p-4 rounded-2xl border border-checkerboard/5 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-rust/10 flex items-center justify-center text-rust">
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
                className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-wider bg-tangerine hover:bg-coral text-white font-medium px-7 py-3.5 rounded-full shadow-warm transition-all duration-300"
              >
                <span>Explore All Handcrafted Pieces</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Large Architectural Image & Detail Callout */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full rounded-3xl overflow-hidden border border-checkerboard/15 shadow-retro bg-cream-dark group">
              <Image
                src="/images/film/interior-villa.jpg"
                alt="Furniture Village Warm Residence Interior"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-103"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

              {/* Floating Bottom Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-cream/90 backdrop-blur-md border border-checkerboard/15 shadow-warm space-y-1">
                <div className="flex items-center justify-between text-xs font-sans font-semibold text-tangerine uppercase tracking-wider">
                  <span>Residence Architecture</span>
                  <span>Scene 01</span>
                </div>
                <p className="font-serif text-base text-checkerboard font-medium">
                  The Light-Filled Residence Living Room
                </p>
                <p className="font-sans text-xs text-walnut">
                  Curved Cream Bouclé Sofa paired with Sculptural Tangerine Petal Coffee Table.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

