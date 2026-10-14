'use client';

import React from 'react';
import Link from 'next/link';
import { Box, ArrowUpRight, Compass, Sparkles, ShieldCheck, Truck, Clock } from 'lucide-react';
import { CinematicResidenceTour } from '@/components/cinema/CinematicResidenceTour';
import { CuratedCollectionSection } from '@/components/landing/CuratedCollectionSection';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-cream text-checkerboard">
      {/* 1. Cinematic Scroll-Driven 7-Scene Home Tour */}
      <CinematicResidenceTour />

      {/* 2. Interactive 3D WebGL Studio Callout */}
      <section className="relative z-20 bg-cream-dark border-t border-b border-checkerboard/15 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-wider text-tangerine font-semibold bg-white/80 px-3.5 py-1.5 rounded-full border border-tangerine/20 shadow-2xs">
              <Box className="w-3.5 h-3.5 text-tangerine" />
              <span>Interactive 3D Studio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-checkerboard font-semibold tracking-tight leading-[1.15]">
              Inspect the Details in <br />
              <span className="italic text-walnut">Interactive 3D</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-walnut font-normal leading-relaxed max-w-xl">
              Rotate each piece 360 degrees, inspect solid wood joints up close, test exploded views,
              and try different fabric and timber finishes in real time right in your browser.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <Link
              href="/products/kronos-lounge-chair"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-tangerine hover:bg-coral text-white font-medium px-8 py-4 rounded-full shadow-warm transition-all duration-300"
            >
              <span>Launch 3D Studio</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="/collections"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-white hover:bg-cream border border-checkerboard/20 text-checkerboard font-medium px-8 py-4 rounded-full shadow-retro transition-all duration-300"
            >
              <span>Explore All Furniture</span>
              <Compass className="w-4 h-4 text-tangerine" />
            </Link>
          </div>
        </div>

        {/* Feature Highlights Bar in Simple English */}
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-checkerboard/10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1.5 bg-white/60 p-4 rounded-xl border border-checkerboard/5">
            <div className="flex items-center space-x-1.5 text-tangerine text-xs uppercase tracking-wider font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Solid Timber</span>
            </div>
            <p className="font-serif text-base text-checkerboard font-medium">Genuine Oak & Walnut</p>
            <p className="font-sans text-xs text-walnut">Sustainably sourced wood with natural wax oils</p>
          </div>

          <div className="space-y-1.5 bg-white/60 p-4 rounded-xl border border-checkerboard/5">
            <div className="flex items-center space-x-1.5 text-tangerine text-xs uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Real Comfort</span>
            </div>
            <p className="font-serif text-base text-checkerboard font-medium">Durable Soft Fabrics</p>
            <p className="font-sans text-xs text-walnut">Plush cream bouclé and olive velvet made to last</p>
          </div>

          <div className="space-y-1.5 bg-white/60 p-4 rounded-xl border border-checkerboard/5">
            <div className="flex items-center space-x-1.5 text-tangerine text-xs uppercase tracking-wider font-semibold">
              <Truck className="w-3.5 h-3.5" />
              <span>Home Delivery</span>
            </div>
            <p className="font-serif text-base text-checkerboard font-medium">Room of Choice</p>
            <p className="font-sans text-xs text-walnut">Delivered carefully into your chosen room</p>
          </div>

          <div className="space-y-1.5 bg-white/60 p-4 rounded-xl border border-checkerboard/5">
            <div className="flex items-center space-x-1.5 text-tangerine text-xs uppercase tracking-wider font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Friendly Support</span>
            </div>
            <p className="font-serif text-base text-checkerboard font-medium">Here to Help</p>
            <p className="font-sans text-xs text-walnut">Direct customer assistance and simple returns</p>
          </div>
        </div>
      </section>

      {/* 3. Permanent Collection & Discovery Section */}
      <CuratedCollectionSection />
    </main>
  );
}
