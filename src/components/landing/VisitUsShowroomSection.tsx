'use client';

import React, { useEffect, useRef } from 'react';
import Image from '@/components/common/Image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Clock, Phone, Mail, ArrowUpRight, Navigation, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';
import { SpotlightCard } from '@/components/ui/motion';

export const VisitUsShowroomSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.showroom-header',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
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
        '.showroom-card',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.showroom-grid',
            start: 'top 85%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Furniture World 100 Feet Road Indiranagar Bengaluru 560038'
  )}`;

  return (
    <section
      id="visit-us"
      ref={sectionRef}
      className="relative z-20 bg-[#FBF9F5] text-[#1A1816] py-20 sm:py-28 lg:py-36 border-t border-stone-200/80 overflow-hidden"
    >
      <span id="showroom" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <span id="atelier" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <span id="flagship" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="showroom-header flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-8 border-b border-stone-200/80 gap-6 sm:gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-sans text-[11px] tracking-widest uppercase text-[#C84D1B] font-semibold bg-[#C84D1B]/10 px-3.5 py-1.5 rounded-full border border-[#C84D1B]/20 inline-flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
                <span>Section 09 · Visit Us · Flagship Showroom</span>
              </span>
              <span className="font-sans text-[11px] uppercase tracking-widest text-[#57534E] bg-white px-3 py-1 rounded-full border border-stone-200 font-medium inline-flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-[#C84D1B]" />
                <span>Indiranagar, Bengaluru</span>
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1A1816] font-normal tracking-tight leading-[1.08]">
              Experience Furniture World <br />
              <span className="italic font-light text-[#57534E]">In Person.</span>
            </h2>
          </div>

          <div className="space-y-3 max-w-md">
            <p className="font-sans text-sm sm:text-base text-[#57534E] leading-relaxed font-normal">
              Furniture is an intimate, tactile presence in daily life. We invite you to our Indiranagar flagship showroom to test our curved seating, touch hand-rubbed timber finishes, and explore custom material swatches with our resident designers.
            </p>
            <div className="flex items-center space-x-2 text-xs font-sans text-[#78716C]">
              <Sparkles className="w-3.5 h-3.5 text-[#C84D1B]" />
              <span>Private walkthroughs and material consultations available daily</span>
            </div>
          </div>
        </div>

        {/* Showroom Feature Grid */}
        <div className="showroom-grid grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Architectural Showroom Photography */}
          <div className="showroom-card lg:col-span-7">
            <SpotlightCard
              className="group bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 overflow-hidden shadow-[0_12px_36px_rgba(26,24,22,0.05)] h-full flex flex-col justify-between"
              spotlightColor="rgba(200, 77, 27, 0.05)"
            >
              <div className="relative aspect-[16/11] sm:aspect-[16/10] w-full overflow-hidden bg-[#F2EFE9]">
                <Image
                  src="/images/showroom/flagship-indiranagar.webp"
                  alt="Furniture World Flagship Showroom Interior on 100 Feet Road, Indiranagar, Bengaluru"
                  fill
                  className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-stone-200 text-xs font-sans font-semibold text-[#1A1816] uppercase tracking-wider">
                  Flagship Atelier
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-3 bg-white">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-2xl text-[#1A1816] font-normal">
                    {BRAND_CONFIG.contact.showroom}
                  </h3>
                  <span className="text-[11px] font-sans uppercase tracking-wider text-[#2B5238] bg-[#2B5238]/10 px-3 py-1 rounded-full border border-[#2B5238]/20 font-semibold shrink-0">
                    Open for Visits
                  </span>
                </div>
                <p className="font-sans text-xs sm:text-sm text-[#57534E] leading-relaxed">
                  A sunlit architectural space featuring double-height ceilings, terrazzo floors, and complete room settings where you can experience the craft, weight, and comfort of every collection firsthand.
                </p>
              </div>
            </SpotlightCard>
          </div>

          {/* Right Column: Verified Details & Actions Card */}
          <div className="showroom-card lg:col-span-5 flex flex-col justify-between">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-6 sm:p-8 lg:p-9 shadow-[0_12px_36px_rgba(26,24,22,0.05)] space-y-6 flex-1 flex flex-col justify-between">
              {/* Showroom Identification */}
              <div className="space-y-2 pb-5 border-b border-stone-200/80">
                <span className="text-[11px] font-sans uppercase tracking-widest text-[#C84D1B] font-semibold block">
                  Store Information &amp; Appointments
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl text-[#1A1816] font-normal">
                  Plan Your Visit
                </h4>
              </div>

              {/* Information Blocks */}
              <div className="space-y-4">
                {/* Complete Address */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#C84D1B]/10 text-[#C84D1B] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-xs sm:text-sm">
                    <span className="font-sans text-[11px] uppercase tracking-wider text-[#78716C] font-semibold block">
                      Showroom Address
                    </span>
                    <p className="font-medium text-[#1A1816] leading-relaxed">
                      {BRAND_CONFIG.contact.address}
                    </p>
                  </div>
                </div>

                {/* Verified Business Hours */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#C84D1B]/10 text-[#C84D1B] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-xs sm:text-sm">
                    <span className="font-sans text-[11px] uppercase tracking-wider text-[#78716C] font-semibold block">
                      Opening Hours
                    </span>
                    <p className="font-medium text-[#1A1816]">
                      {BRAND_CONFIG.contact.hours}
                    </p>
                    <p className="text-[11px] text-[#78716C]">
                      Sunday: Closed for atelier maintenance
                    </p>
                  </div>
                </div>

                {/* Direct Contact Phone & Email */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#C84D1B]/10 text-[#C84D1B] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5 text-xs sm:text-sm">
                    <span className="font-sans text-[11px] uppercase tracking-wider text-[#78716C] font-semibold block">
                      Direct Telephone &amp; Care
                    </span>
                    <a
                      href={`tel:${BRAND_CONFIG.contact.phone.replace(/\s+/g, '')}`}
                      className="font-medium text-[#1A1816] hover:text-[#C84D1B] transition-colors block"
                    >
                      {BRAND_CONFIG.contact.phone}
                    </a>
                    <a
                      href={`mailto:${BRAND_CONFIG.contact.email}`}
                      className="text-xs text-[#78716C] hover:text-[#C84D1B] transition-colors flex items-center space-x-1 pt-0.5"
                    >
                      <Mail className="w-3 h-3 text-[#C84D1B]" />
                      <span>{BRAND_CONFIG.contact.email}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* In-Store Experience Standards */}
              <div className="p-4 rounded-xl sm:rounded-2xl bg-[#FBF9F5] border border-stone-200/80 space-y-2 text-xs font-sans">
                <span className="font-sans text-[10px] uppercase tracking-wider text-[#78716C] font-semibold block">
                  Available in the Showroom:
                </span>
                <ul className="space-y-1.5 text-[#57534E]">
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
                    <span>Complete tactile fabric &amp; leather swatch library</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
                    <span>Solid oak &amp; smoked walnut timber samples</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
                    <span>1-on-1 residential space planning consultations</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-[#1A1816] hover:bg-[#C84D1B] text-white font-semibold px-6 py-3.5 rounded-full shadow-2xs hover:shadow-xs transition-all duration-300 text-center min-h-[44px]"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`tel:${BRAND_CONFIG.contact.phone.replace(/\s+/g, '')}`}
                  className="inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-white hover:bg-stone-50 border border-stone-200 text-[#1A1816] font-semibold px-5 py-3.5 rounded-full shadow-2xs transition-all duration-300 min-h-[44px]"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C84D1B]" />
                  <span>Call Showroom</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
