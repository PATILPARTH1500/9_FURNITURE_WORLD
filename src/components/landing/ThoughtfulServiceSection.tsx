'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Truck, ShieldCheck, Wrench, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';
import { AnimatedHeading, MagneticButton, SpotlightCard, TextRoll, MovingBorder } from '@/components/ui/motion';

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CONFIRMED_SERVICES: ServiceItem[] = [
  {
    id: 'room-delivery',
    title: 'Room-of-Choice Delivery',
    subtitle: 'Directly into your chosen room',
    description:
      'Our white-glove two-person delivery team carries your furniture up staircases or elevators directly into the room you want it in, with zero heavy lifting on your part.',
    icon: Truck,
  },
  {
    id: 'assembly',
    title: 'Free Setup & Assembly',
    subtitle: 'Fully built by trained technicians',
    description:
      'Our delivery crew unboxes, joins table legs, fits bed slats, and positions seating with level precision, removing all cardboard and protective wrapping when finished.',
    icon: Wrench,
  },
  {
    id: 'materials-touch',
    title: 'Touch Swatches & Timber',
    subtitle: 'Visit our Bengaluru Flagship',
    description:
      'Visit our experience store at 100 Feet Road, Indiranagar, Bengaluru to feel solid oak and walnut finishes in person, or request fabric swatches sent directly to your home.',
    icon: MapPin,
  },
  {
    id: 'warranty',
    title: '10-Year Frame Warranty',
    subtitle: 'Built for family generations',
    description:
      'Every solid timber frame and interlocking mortise-and-tenon joint is covered by a 10-year warranty against structural defects, warping, and separation.',
    icon: ShieldCheck,
  },
];

export const ThoughtfulServiceSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.service-header',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      gsap.fromTo(
        '.service-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.service-cards-grid',
            start: 'top 90%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      gsap.fromTo(
        '.service-cta-banner',
        { opacity: 0, y: 20, scale: 0.99 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.service-cta-banner',
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
      id="thoughtful-service"
      ref={sectionRef}
      className="relative z-20 bg-[#EEE5D8] py-24 sm:py-32 border-t border-checkerboard/15 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="service-header flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-checkerboard/15 gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="font-sans text-xs tracking-wider uppercase text-olive font-semibold bg-white px-3.5 py-1.5 rounded-full border border-olive/20 inline-flex items-center space-x-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-olive" />
              <span>Customer Care & Confidence</span>
            </span>
            <AnimatedHeading
              text="Thoughtful Service, From Workshop to Your Room."
              highlightText="From Workshop to Your Room."
              highlightClassName="italic text-walnut font-normal"
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-checkerboard font-semibold tracking-tight leading-[1.15]"
            />
          </div>
          <p className="font-sans text-sm sm:text-base text-walnut leading-relaxed max-w-md font-normal">
            Buying furniture should be reassuring. Here are the confirmed promises and customer care services included with every Furniture Village order.
          </p>
        </div>

        {/* 4 Services Grid with Distinctive Cards */}
        <div className="service-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {CONFIRMED_SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <SpotlightCard
                key={srv.id}
                className="service-card group bg-white/95 rounded-3xl border border-checkerboard/12 p-7 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-warm transition-all duration-400 hover:-translate-y-1.5"
                contentClassName="flex flex-col justify-between h-full space-y-6"
                spotlightColor="rgba(98, 107, 61, 0.12)"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4E9D8] flex items-center justify-center text-tangerine border border-checkerboard/10 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-checkerboard font-semibold leading-snug group-hover:text-tangerine transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs font-sans text-tangerine font-medium mt-1">
                      {srv.subtitle}
                    </p>
                  </div>
                  <p className="font-sans text-xs text-walnut leading-relaxed font-normal">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-checkerboard/8 text-[11px] font-sans font-semibold text-olive uppercase tracking-wider flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-olive" />
                  <span>Guaranteed Included</span>
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        {/* Strong Closing Consultation Banner */}
        <div className="service-cta-banner bg-[#2A311B] text-white rounded-3xl p-8 sm:p-12 border border-white/12 shadow-[0_16px_40px_rgba(0,0,0,0.2)] flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <span className="font-sans text-xs uppercase tracking-wider text-[#D8E6A6] font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/15 inline-block">
              Showroom & Consultation
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FAF5EE] font-semibold leading-tight">
              Experience the Craftsmanship in Person
            </h3>
            <p className="font-sans text-sm text-[#D0C4B4] leading-relaxed">
              Touch genuine timber finishes, test sofa seat cushions, and consult with our interior specialists at our flagship store.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-sans text-[#E7D8BF]">
              <span className="inline-flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-tangerine" />
                <span>100-Ft Road, Indiranagar, Bengaluru</span>
              </span>
              <span className="hidden sm:inline text-white/30">·</span>
              <span className="inline-flex items-center space-x-1.5">
                <Phone className="w-4 h-4 text-tangerine" />
                <span>+91 80 4000 8879</span>
              </span>
              <span className="hidden sm:inline text-white/30">·</span>
              <span className="inline-flex items-center space-x-1.5">
                <Mail className="w-4 h-4 text-tangerine" />
                <span>care@furniturevillage.com</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto shrink-0">
            {/* Moving Border Aceternity UI Effect on Concierge Conversion Button */}
            <MovingBorder
              as="div"
              borderRadius="9999px"
              duration={3.5}
              containerClassName="w-full sm:w-auto"
              borderClassName="bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_280deg,#F4510B_320deg,#F59E0B_360deg)]"
              className="bg-transparent"
            >
              <MagneticButton
                onClick={() => { window.location.href = 'tel:+918040008879'; }}
                className="space-x-2 text-xs font-sans uppercase tracking-wider bg-tangerine hover:bg-coral text-white font-medium px-7 py-4 rounded-full shadow-warm transition-all duration-300 hover:shadow-lg w-full sm:w-auto justify-center"
              >
                <Phone className="w-4 h-4" />
                <TextRoll>Call Concierge</TextRoll>
              </MagneticButton>
            </MovingBorder>

            <MagneticButton
              href="/collections"
              className="space-x-2 text-xs font-sans uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 text-[#FAF5EE] font-medium px-6 py-4 rounded-full transition-all duration-300 justify-center"
            >
              <TextRoll>Explore Collection</TextRoll>
              <ArrowUpRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
};
