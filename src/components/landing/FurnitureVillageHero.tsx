'use client';

import React from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, ShieldCheck } from 'lucide-react';

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
        staggerChildren: prefersReduced ? 0 : 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-[95vh] sm:min-h-screen w-full bg-[#FBF9F5] text-[#1A1816] flex flex-col justify-between pt-28 sm:pt-36 pb-12 sm:pb-16 px-6 sm:px-8 md:px-12 lg:px-16 overflow-hidden"
    >
      <span id="hero" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      {/* Main Architectural Hero Composition */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center my-auto"
      >
        {/* Left Column: Editorial Headline & Manifesto */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#C84D1B] font-semibold">
                Furniture Village · 2026 Collection
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] text-[#1A1816] font-normal tracking-tight leading-[1.05]">
              The Architecture <br />
              <span className="italic font-light text-[#57534E]">of Comfort.</span>
            </h1>

            <p className="font-sans text-base sm:text-lg text-[#57534E] max-w-xl font-normal leading-relaxed pt-2">
              Sculpted European white oak, honest American black walnut, and tactile bouclé. Thoughtfully crafted in Bangalore for relaxed everyday living and generational longevity.
            </p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <motion.button
              whileHover={prefersReduced ? {} : { scale: 1.01 }}
              whileTap={prefersReduced ? {} : { scale: 0.98 }}
              onClick={handleScrollToTour}
              className="inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-full bg-[#1A1816] hover:bg-[#C84D1B] text-white font-sans text-xs uppercase tracking-wider font-semibold shadow-sm transition-all duration-300 group cursor-pointer"
            >
              <span>Explore Residence Tour</span>
              <motion.div
                animate={prefersReduced ? {} : { y: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              >
                <ArrowDown className="w-4 h-4 text-white/90" />
              </motion.div>
            </motion.button>

            <motion.div
              whileHover={prefersReduced ? {} : { scale: 1.01 }}
              whileTap={prefersReduced ? {} : { scale: 0.98 }}
            >
              <Link
                href="/collections"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-full bg-white hover:bg-[#F2EFE9] text-[#1A1816] border border-[#1A1816]/15 font-sans text-xs uppercase tracking-wider font-semibold shadow-2xs transition-all duration-300"
              >
                <span>View Full Catalogue</span>
                <ArrowUpRight className="w-4 h-4 text-[#C84D1B]" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Hallmark Specifications Strip */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-8 border-t border-[#1A1816]/10 max-w-lg text-xs font-sans">
            <div className="space-y-0.5">
              <span className="font-serif text-2xl font-normal text-[#1A1816] block">05</span>
              <span className="text-[11px] uppercase tracking-wider text-[#57534E] font-medium">Curated Suites</span>
            </div>
            <div className="space-y-0.5">
              <span className="font-serif text-2xl font-normal text-[#1A1816] block">10-Yr</span>
              <span className="text-[11px] uppercase tracking-wider text-[#57534E] font-medium">Frame Guarantee</span>
            </div>
            <div className="space-y-0.5">
              <span className="font-serif text-2xl font-normal text-[#1A1816] block">White-Glove</span>
              <span className="text-[11px] uppercase tracking-wider text-[#57534E] font-medium">In-Home Assembly</span>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Architectural Hero Image */}
        <motion.div variants={itemVariants} className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] rounded-3xl overflow-hidden border border-[#1A1816]/10 shadow-[0_16px_48px_rgba(26,24,22,0.06)] bg-[#F2EFE9] group">
            <Image
              src="/images/collections/collection-sanctuary-seating.webp"
              alt="Furniture Village Residence Showroom — Sanctuary Seating Suite"
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Scroll Wayfinding Cue */}
      <div className="max-w-7xl mx-auto w-full pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#57534E] border-t border-[#1A1816]/10 gap-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#4C583E] shrink-0" />
          <span>FSC® Certified Solid Hardwoods & Traditional Mortise-Tenon Joinery</span>
        </div>

        <button
          onClick={handleScrollToTour}
          className="inline-flex items-center space-x-2 text-[#1A1816] hover:text-[#C84D1B] font-sans text-xs uppercase tracking-wider font-semibold transition-colors py-1 group cursor-pointer"
        >
          <span>Scroll into Cinematic Residence</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#C84D1B] transition-transform group-hover:translate-y-1" />
        </button>
      </div>
    </section>
  );
};
