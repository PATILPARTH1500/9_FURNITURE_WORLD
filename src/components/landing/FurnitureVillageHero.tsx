'use client';

import React from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Compass, ShieldCheck, Sparkles, Layers, Box } from 'lucide-react';

interface FurnitureVillageHeroProps {
  onExploreTour?: () => void;
}

export const FurnitureVillageHero: React.FC<FurnitureVillageHeroProps> = ({ onExploreTour }) => {
  const prefersReduced = useReducedMotion();

  const handleScrollToTour = () => {
    if (onExploreTour) {
      onExploreTour();
      return;
    }
    const tourEl = document.getElementById('residence-tour') || document.getElementById('tour');
    if (tourEl) {
      tourEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.09,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen w-full bg-cream text-checkerboard flex flex-col justify-between pt-28 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden bg-architectural-grid">
      {/* Subtle fine paper grain overlay */}
      <div className="absolute inset-0 bg-fine-grain pointer-events-none" />

      {/* Top Architectural Brand Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-checkerboard/10">
        <div className="inline-flex items-center space-x-2">
          <span className="font-sans text-xs tracking-wider uppercase text-tangerine font-semibold bg-white/90 px-3.5 py-1 rounded-full border border-tangerine/20 shadow-2xs inline-flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-tangerine" />
            <span>Furniture Village · Atelier Showroom</span>
          </span>
          <span className="hidden md:inline-block font-sans text-xs uppercase tracking-wider text-walnut/70 bg-cream-dark px-3 py-1 rounded-full border border-checkerboard/10">
            2026 Residence Collection
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs font-sans text-walnut/80">
          <span className="flex items-center space-x-1.5">
            <Compass className="w-3.5 h-3.5 text-tangerine" />
            <span>Bengaluru Flagship · Indiranagar</span>
          </span>
          <span className="hidden sm:inline text-walnut/30">|</span>
          <span className="hidden sm:inline font-medium">Five Continuous Living Suites</span>
        </div>
      </div>

      {/* Main Hero Visual & Editorial Content Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto w-full py-8 sm:py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
      >
        {/* Left Column: Editorial Headline & Brand Manifesto */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-tangerine" />
              <span className="font-mono text-xs uppercase tracking-widest text-tangerine font-semibold">
                The Architecture of Comfort
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl xl:text-8xl text-checkerboard font-semibold tracking-tight leading-[1.05]">
              Furniture <br />
              <span className="italic font-normal text-walnut">Village</span>
            </h1>
            <p className="font-sans text-base sm:text-lg md:text-xl text-checkerboard/85 max-w-xl font-normal leading-relaxed pt-2">
              Where architectural precision meets everyday family warmth. Sculpted European oak, honest American walnut, and tactile bouclé crafted for modern living.
            </p>
          </motion.div>

          {/* Action CTAs with Motion.dev tactile feedback */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <motion.button
              whileHover={prefersReduced ? {} : { scale: 1.02 }}
              whileTap={prefersReduced ? {} : { scale: 0.98 }}
              onClick={handleScrollToTour}
              className="inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-full bg-tangerine hover:bg-coral text-white font-sans text-xs uppercase tracking-wider font-bold shadow-warm hover:shadow-lg transition-all group"
            >
              <span>Explore Residence Tour</span>
              <motion.div
                animate={prefersReduced ? {} : { y: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              >
                <ArrowDown className="w-4 h-4 text-white" />
              </motion.div>
            </motion.button>

            <motion.div
              whileHover={prefersReduced ? {} : { scale: 1.02 }}
              whileTap={prefersReduced ? {} : { scale: 0.98 }}
            >
              <Link
                href="/collections"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-full bg-white/90 hover:bg-white text-checkerboard border border-checkerboard/15 font-sans text-xs uppercase tracking-wider font-semibold shadow-2xs hover:shadow-sm transition-all"
              >
                <span>View Full Catalogue</span>
                <ArrowUpRight className="w-4 h-4 text-tangerine" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Notion-Style Hallmarks Spec Strip */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 pt-6 border-t border-checkerboard/10 max-w-lg text-xs font-sans">
            <div className="p-3 bg-white/60 rounded-xl border border-checkerboard/5">
              <span className="font-serif text-lg sm:text-xl font-bold text-checkerboard block">05</span>
              <span className="text-[11px] text-walnut font-medium">Living Suites</span>
            </div>
            <div className="p-3 bg-white/60 rounded-xl border border-checkerboard/5">
              <span className="font-serif text-lg sm:text-xl font-bold text-checkerboard block">10-Yr</span>
              <span className="text-[11px] text-walnut font-medium">Frame Guarantee</span>
            </div>
            <div className="p-3 bg-white/60 rounded-xl border border-checkerboard/5">
              <span className="font-serif text-lg sm:text-xl font-bold text-checkerboard block">White-Glove</span>
              <span className="text-[11px] text-walnut font-medium">Room Setup</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Architectural Hero Image Frame with Blueprint Details */}
        <motion.div variants={itemVariants} className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] rounded-3xl overflow-hidden border border-checkerboard/15 shadow-warm bg-cream-dark">
            <Image
              src="/images/collections/collection-sanctuary-seating.webp"
              alt="Furniture Village Residence Showroom — Sanctuary Seating Suite"
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out hover:scale-103"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
            {/* Architectural gradient wash */}
            <div className="absolute inset-0 bg-gradient-to-t from-checkerboard/85 via-checkerboard/20 to-transparent" />

            {/* Inset Corner Metadata Tag */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white font-sans text-xs uppercase px-3 py-1 rounded-full border border-white/20 flex items-center space-x-1.5">
              <Box className="w-3.5 h-3.5 text-tangerine" />
              <span>Suite 01 · Sanctuary</span>
            </div>

            {/* Bottom In-Image Story Badge */}
            <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-white">
              <div className="flex items-center justify-between mb-1 text-xs font-sans">
                <span className="text-tangerine-light font-semibold uppercase tracking-wider flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-tangerine" />
                  <span>Cinematic Residence Tour</span>
                </span>
                <span className="text-white/80">Five Curated Suites</span>
              </div>
              <p className="font-serif text-sm sm:text-base text-[#FAF8F5] font-medium leading-snug">
                Living Room · Dining Room · Kitchen · Family Lounge · Master Bedroom
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Scroll Wayfinding Cue */}
      <div className="relative z-10 max-w-7xl mx-auto w-full pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-walnut border-t border-checkerboard/10 gap-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-tangerine shrink-0" />
          <span>FSC® Certified Natural Hardwoods & Heirloom Joinery</span>
        </div>

        <button
          onClick={handleScrollToTour}
          className="inline-flex items-center space-x-2 text-checkerboard/80 hover:text-tangerine font-sans text-xs uppercase tracking-wider font-semibold transition-colors py-1 group"
        >
          <span>Scroll into Cinematic Residence</span>
          <ArrowDown className="w-3.5 h-3.5 text-tangerine transition-transform group-hover:translate-y-1" />
        </button>
      </div>
    </section>
  );
};
