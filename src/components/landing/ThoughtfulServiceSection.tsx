'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Wrench, MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { BRAND_CONFIG } from '@/config/brand';

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
  return (
    <section className="relative z-20 bg-cream-dark py-24 sm:py-32 border-t border-checkerboard/15">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-checkerboard/15 gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="font-sans text-xs tracking-wider uppercase text-olive font-semibold bg-white/80 px-3.5 py-1.5 rounded-full border border-olive/20 inline-flex items-center space-x-1.5 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-olive" />
              <span>Customer Care & Confidence</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-checkerboard font-semibold tracking-tight leading-[1.15]">
              Thoughtful Service, <br />
              <span className="italic text-walnut font-normal">From Workshop to Your Room.</span>
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-walnut leading-relaxed max-w-md font-normal">
            Buying furniture should be reassuring. Here are the confirmed promises and customer care services included with every Furniture Village order.
          </p>
        </div>

        {/* 4 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {CONFIRMED_SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="bg-white rounded-3xl border border-checkerboard/10 p-7 flex flex-col justify-between space-y-5 shadow-xs hover:shadow-warm transition-all duration-300 hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center text-tangerine border border-checkerboard/10">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-checkerboard font-semibold leading-snug">
                      {srv.title}
                    </h3>
                    <p className="text-xs font-sans text-tangerine font-medium mt-0.5">
                      {srv.subtitle}
                    </p>
                  </div>
                  <p className="font-sans text-xs text-walnut leading-relaxed font-normal">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-checkerboard/5 text-[11px] font-sans font-semibold text-olive uppercase tracking-wider">
                  Guaranteed Included
                </div>
              </div>
            );
          })}
        </div>

        {/* Showroom & Consultation Banner */}
        <div className="bg-white rounded-3xl border border-checkerboard/15 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="font-sans text-xs uppercase tracking-wider text-tangerine font-semibold block">
              Flagship Experience Store · Indiranagar
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-checkerboard font-semibold">
              Need Help Sizing Your Room or Choosing Fabrics?
            </h3>
            <p className="font-sans text-sm text-walnut leading-relaxed max-w-2xl font-normal">
              Our interior specialists are on hand to check dimensions, review room floorplans, and recommend the best timber and upholstery combinations for your lifestyle.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-sans text-walnut">
              <a
                href={`tel:${BRAND_CONFIG.contact.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center space-x-2 font-medium text-checkerboard hover:text-tangerine transition-colors"
              >
                <Phone className="w-4 h-4 text-tangerine" />
                <span>{BRAND_CONFIG.contact.phone}</span>
              </a>

              <a
                href={`mailto:${BRAND_CONFIG.contact.email}`}
                className="inline-flex items-center space-x-2 font-medium text-checkerboard hover:text-tangerine transition-colors"
              >
                <Mail className="w-4 h-4 text-tangerine" />
                <span>{BRAND_CONFIG.contact.email}</span>
              </a>

              <div className="inline-flex items-center space-x-2 text-walnut/80">
                <Clock className="w-4 h-4 text-tangerine" />
                <span>{BRAND_CONFIG.contact.hours}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <Link
              href="/collections"
              className="inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-tangerine hover:bg-coral text-white font-medium px-6 py-4 rounded-full shadow-warm transition-all duration-300 text-center"
            >
              <span>Explore All Furniture</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <a
              href={`mailto:${BRAND_CONFIG.contact.email}?subject=Room%20Consultation%20Inquiry`}
              className="inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-white hover:bg-cream border border-checkerboard/20 text-checkerboard font-medium px-6 py-4 rounded-full shadow-2xs transition-all duration-300 text-center"
            >
              <span>Book Design Consultation</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

