'use client';

import React from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';
import { scrollToSection } from '@/utils/navigation';

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
    scrollToSection('residence-tour', 76);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      id="home"
      aria-label="Introduction & Architecture of Comfort"
      className="relative min-h-[95vh] sm:min-h-screen w-full bg-[#FBF9F5] text-[#1A1816] flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 lg:pb-14 px-5 sm:px-8 md:px-12 lg:px-16 overflow-hidden"
    >
      <span id="hero" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      {/* Main Architectural Hero Composition */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-14 xl:gap-16 items-center my-auto"
      >
        {/* Left Column: Editorial Headline & Manifesto */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-7 xl:space-y-8">
          <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
            {/* Curated Brand Pre-title Badge */}
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B54113] shrink-0" aria-hidden="true" />
              <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.22em] text-[#B54113] font-semibold">
                {BRAND_CONFIG.name} · Collection 2026
              </span>
            </div>

            {/* Editorial Serif Headline */}
            <h1 className="font-serif text-[2.65rem] sm:text-5xl md:text-6xl lg:text-[4.75rem] xl:text-[5.25rem] text-[#1A1816] font-normal tracking-[-0.025em] leading-[1.04] sm:leading-[1.02] text-balance">
              The Architecture <br />
              <span className="italic font-light text-[#57534E]">of Comfort.</span>
            </h1>

            {/* Architectural Manifesto Paragraph */}
            <p className="font-sans text-sm sm:text-base lg:text-[1.0625rem] text-[#57534E] max-w-xl font-normal leading-[1.65] pt-1 text-pretty">
              Sculpted European white oak, honest American black walnut, and tactile bouclé. Thoughtfully crafted in Bangalore for relaxed everyday living and generational longevity.
            </p>
          </motion.div>

          {/* Action CTAs: High-contrast primary & subtle bordered secondary */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 pt-1 sm:pt-2"
          >
            {/* Primary Action: Explore Virtual Tour */}
            <motion.button
              whileHover={prefersReduced ? {} : { scale: 1.01 }}
              whileTap={prefersReduced ? {} : { scale: 0.98 }}
              onClick={handleScrollToTour}
              className="min-h-[48px] inline-flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-full bg-[#1A1816] hover:bg-[#C84D1B] text-white font-sans text-xs uppercase tracking-[0.14em] font-semibold shadow-xs hover:shadow-md transition-all duration-200 group cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C84D1B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF9F5]"
            >
              <span>Explore Virtual Tour</span>
              <motion.div
                animate={prefersReduced ? {} : { y: [0, 2.5, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              >
                <ArrowDown className="w-3.5 h-3.5 text-white/90" aria-hidden="true" />
              </motion.div>
            </motion.button>

            {/* Secondary Action: View Full Catalogue */}
            <motion.div
              whileHover={prefersReduced ? {} : { scale: 1.01 }}
              whileTap={prefersReduced ? {} : { scale: 0.98 }}
              className="contents sm:block"
            >
              <Link
                href="/collections"
                className="min-h-[48px] w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-full bg-white hover:bg-[#F2EFE9] text-[#1A1816] border border-[#1A1816]/15 hover:border-[#1A1816]/30 font-sans text-xs uppercase tracking-[0.14em] font-semibold shadow-2xs transition-all duration-200 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C84D1B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FBF9F5]"
              >
                <span>Explore All Furniture</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#C84D1B] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Hallmark Specifications Strip: Unified baseline alignment and prevented mobile wrap */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-2.5 sm:gap-6 pt-6 sm:pt-7 border-t border-[#1A1816]/10 max-w-lg"
          >
            {/* Stat 01: 05 Curated Rooms */}
            <div className="space-y-1 min-w-0">
              <span className="font-serif text-xl sm:text-2xl font-normal text-[#1A1816] block tracking-tight leading-none">
                05
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-[#57534E] font-medium block leading-tight">
                Curated Rooms
              </span>
            </div>

            {/* Stat 02: 10-Yr Frame Warranty */}
            <div className="space-y-1 min-w-0">
              <span className="font-serif text-xl sm:text-2xl font-normal text-[#1A1816] block tracking-tight leading-none">
                10-Yr
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-[#57534E] font-medium block leading-tight">
                Frame Warranty
              </span>
            </div>

            {/* Stat 03: Free Setup */}
            <div className="space-y-1 min-w-0">
              <span className="font-serif text-xl sm:text-2xl font-normal text-[#1A1816] block tracking-tight leading-none whitespace-nowrap">
                Free Setup
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-[#57534E] font-medium block leading-tight">
                Room Assembly
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Architectural Hero Image (Immediate first paint for instant LCP) */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[16/11] sm:aspect-[16/10] lg:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#1A1816]/10 shadow-[0_16px_48px_rgba(26,24,22,0.06)] bg-[#F2EFE9] group">
            <Image
              src="/images/collections/collection-sanctuary-seating.webp"
              alt="Furniture World Living Seating — Handcrafted Bouclé and White Oak Lounge"
              fill
              priority
              className="object-cover object-[center_42%] transition-transform duration-700 ease-out group-hover:scale-103"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 42vw"
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom Scroll Wayfinding Cue & Certification Strip */}
      <div className="max-w-7xl mx-auto w-full pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#57534E] border-t border-[#1A1816]/10 gap-3">
        {/* Left: FSC Certification Hallmark */}
        <div className="flex items-center space-x-2 text-[11px] sm:text-xs">
          <ShieldCheck className="w-4 h-4 text-[#3E5C38] shrink-0" aria-hidden="true" />
          <span>FSC® Certified Solid Hardwoods & Traditional Mortise-Tenon Joinery</span>
        </div>

        {/* Right: Interactive Scroll Prompt (Accessible touch target >= 44px) */}
        <button
          onClick={handleScrollToTour}
          aria-label="Scroll to virtual tour"
          className="min-h-[44px] inline-flex items-center space-x-2 text-[#1A1816] hover:text-[#C84D1B] font-sans text-[11px] sm:text-xs uppercase tracking-[0.14em] font-semibold transition-colors py-2 px-3 -mx-3 rounded-full hover:bg-[#1A1816]/5 cursor-pointer group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C84D1B]"
        >
          <span>Scroll to Virtual Tour</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#C84D1B] transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
