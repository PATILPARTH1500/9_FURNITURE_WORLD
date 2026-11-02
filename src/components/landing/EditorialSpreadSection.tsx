'use client';

import React, { useEffect, useRef } from 'react';
import Image from '@/components/common/Image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, ArrowUpRight, Sparkles, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';
import { MagneticButton, TextRoll, MovingBorder } from '@/components/ui/motion';

export const EditorialSpreadSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.editorial-quote-container',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      gsap.fromTo(
        '.editorial-service-pill',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.editorial-services-grid',
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
      id="editorial-spread"
      ref={sectionRef}
      className="relative z-20 bg-[#15120F] text-[#FAF8F5] py-28 sm:py-36 border-t border-white/10 overflow-hidden"
    >
      {/* Background Architectural Villa Photography with Warm Film Grading */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/film/interior-villa.webp"
          alt="Furniture World Atelier Villa Interior"
          fill
          className="object-cover opacity-25 filter brightness-75 contrast-125 scale-105"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15120F] via-[#15120F]/85 to-[#15120F]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(244,81,11,0.06),transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Editorial Feature Quote Banner */}
        <div className="editorial-quote-container max-w-4xl mx-auto text-center space-y-8 mb-20">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-sans uppercase tracking-[0.2em] text-[#FAF8F5] shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-tangerine" />
            <span>Furniture World Atelier · Indiranagar Flagship</span>
          </div>

          <blockquote className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FAF8F5] font-light leading-[1.15] tracking-tight">
            &ldquo;A home should be a collection of things you love, crafted to outlast the trends of the moment.&rdquo;
          </blockquote>

          <p className="font-sans text-sm sm:text-base text-[#C8BCAC] max-w-2xl mx-auto leading-relaxed">
            Experience our timber finishes, tailored upholstery, and ergonomic contours in person at our Bangalore experience showroom.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <MovingBorder
              as="div"
              borderRadius="9999px"
              duration={3.5}
              containerClassName="w-full sm:w-auto"
              borderClassName="bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_280deg,#F4510B_320deg,#F59E0B_360deg)]"
              className="bg-transparent"
            >
              <MagneticButton
                onClick={() => { window.location.href = `tel:${BRAND_CONFIG.contact.phone}`; }}
                className="space-x-2 text-xs font-sans uppercase tracking-wider bg-tangerine hover:bg-coral text-white font-medium px-8 py-4 rounded-full shadow-warm transition-all duration-300 hover:shadow-lg w-full sm:w-auto justify-center"
              >
                <Phone className="w-4 h-4" />
                <TextRoll>Book Design Consultation</TextRoll>
              </MagneticButton>
            </MovingBorder>

            <MagneticButton
              href="/collections"
              className="space-x-2 text-xs font-sans uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 text-[#FAF8F5] font-medium px-7 py-4 rounded-full transition-all duration-300 justify-center"
            >
              <TextRoll>Visit Showroom Floor</TextRoll>
              <ArrowUpRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>

        {/* 4 Architectural Hallmarks & Service Commitments */}
        <div className="editorial-services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-white/10">
          <div className="editorial-service-pill p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-tangerine/15 text-tangerine flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg text-white font-medium">White-Glove Delivery</h4>
            <p className="text-xs font-sans text-[#C8BCAC] leading-relaxed">
              Two-person team handles carry-in, floor placement, and unboxing in your room of choice.
            </p>
          </div>

          <div className="editorial-service-pill p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-olive/20 text-[#A6C064] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg text-white font-medium">10-Year Warranty</h4>
            <p className="text-xs font-sans text-[#C8BCAC] leading-relaxed">
              Solid European timber frames and steel-anchored mortise & tenon joinery built to endure.
            </p>
          </div>

          <div className="editorial-service-pill p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-mustard/20 text-mustard flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg text-white font-medium">Complimentary Assembly</h4>
            <p className="text-xs font-sans text-[#C8BCAC] leading-relaxed">
              Level mounting, leg fittings, and complete debris removal included at zero extra charge.
            </p>
          </div>

          <div className="editorial-service-pill p-6 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-tangerine/15 text-tangerine flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="font-serif text-lg text-white font-medium">Flagship Experience</h4>
            <p className="text-xs font-sans text-[#C8BCAC] leading-relaxed">
              100-Ft Road, Indiranagar. Open Mon–Sat for private viewing appointments and material swatches.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
