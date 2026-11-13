'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Compass, Sparkles, Check } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/motion';
import { scrollToSection } from '@/utils/navigation';

interface RoomData {
  id: string;
  roomNumber: string;
  name: string;
  roomTag: string;
  headline: string;
  subtitle: string;
  description: string;
  image: string;
  architecturalDetails: { label: string; value: string }[];
  keyPieces: string[];
  linkHref: string;
  ctaText: string;
}

const ROOM_OPTIONS: RoomData[] = [
  {
    id: 'living',
    roomNumber: '01',
    name: 'Living Room',
    roomTag: 'Scene 01 · Sunlight & Seating',
    headline: 'Warm, Welcoming Curves for Conversation',
    subtitle: 'Atmosphere: Sun-drenched morning light & tactile bouclé',
    description:
      'The living room is designed to bring family together. Soft curved contours replace rigid square seating, while our textured bouclé sofa and solid oak armchairs create a calm, tactile haven flooded with natural daylight.',
    image: '/videos/scenes/posters/scene-1-living.webp',
    architecturalDetails: [
      { label: 'Spatial Light', value: 'South-facing floor-to-ceiling windows' },
      { label: 'Flooring', value: 'Wide-plank white oak timber' },
      { label: 'Focal Seating', value: 'Arcos Curved 3-Seater Sofa' },
    ],
    keyPieces: [
      'Arcos Curved Bouclé Sofa',
      'Tangerine Accent Table',
      'Kronos Lounge Chair in Cream',
    ],
    linkHref: '/#living',
    ctaText: 'Enter Scene 01: Living Room',
  },
  {
    id: 'dining',
    roomNumber: '02',
    name: 'Dining Room',
    roomTag: 'Scene 02 · Shared Tables',
    headline: 'Solid Timber Tables Built for Long Meals',
    subtitle: 'Atmosphere: Intimate evening gathering & rich walnut grain',
    description:
      'Shared meals are the soul of the home. Our round walnut pedestal table gives everyone generous elbow room without bumping into restrictive corner legs, perfect for lively dinners and lazy weekend breakfasts alike.',
    image: '/videos/scenes/posters/scene-2-dining.webp',
    architecturalDetails: [
      { label: 'Spatial Light', value: 'Low ambient ceiling glow & pendant illumination' },
      { label: 'Flooring', value: 'Honed travertine perimeter borders' },
      { label: 'Focal Table', value: 'Sölve 150cm Round Walnut Table' },
    ],
    keyPieces: [
      'Sölve 150cm Walnut Table',
      'Olive Velvet Dining Chairs',
      'Cast Brass Weight-Base',
    ],
    linkHref: '/#dining',
    ctaText: 'Enter Scene 02: Dining Room',
  },
  {
    id: 'kitchen',
    roomNumber: '03',
    name: 'Kitchen & Counter',
    roomTag: 'Scene 03 · Morning Rituals',
    headline: 'Functional Timber Simplicity for Morning Coffee',
    subtitle: 'Atmosphere: Crisp morning light & honed stone counters',
    description:
      'Morning coffee and quick snacks feel elevated with honest materials. Our solid oak counter stools feature curved saddle seats and built-in brass footrests for everyday family comfort.',
    image: '/videos/scenes/posters/scene-3-kitchen.webp',
    architecturalDetails: [
      { label: 'Spatial Light', value: 'Raking morning sunlight on timber surfaces' },
      { label: 'Flooring', value: 'Black-and-cream checkerboard runner' },
      { label: 'Focal Counter', value: 'Nordic Oak Saddle Counter Stools' },
    ],
    keyPieces: [
      'Nordic Solid Oak Stools',
      'Checkerboard Runner Floor',
      'Solaris Tangerine Dome Pendant',
    ],
    linkHref: '/#kitchen',
    ctaText: 'Enter Scene 03: Kitchen & Counter',
  },
  {
    id: 'lounge',
    roomNumber: '04',
    name: 'Family Lounge',
    roomTag: 'Scene 04 · Room to Play',
    headline: 'Space to Play, Relax, and Unwind Together',
    subtitle: 'Atmosphere: Active family play & low-slung seating',
    description:
      'Designed with real family life in mind. Heavy-duty woven upholstery, soft rounded edges that prevent bumps during active play, and generous open floor plans that give children and parents room to enjoy.',
    image: '/videos/scenes/posters/scene-4-lounge.webp',
    architecturalDetails: [
      { label: 'Spatial Light', value: 'Open daylight across wide play floor' },
      { label: 'Flooring', value: 'Classic black-and-cream checkerboard tiles' },
      { label: 'Focal Living', value: 'Low-slung modular seating & ride-on course' },
    ],
    keyPieces: [
      'Kronos Armchair in Olive',
      'Grand Prix Ride-On Sports Car',
      'High-Pile Wool Lounge Rug',
    ],
    linkHref: '/#lounge',
    ctaText: 'Enter Scene 04: Family Lounge',
  },
  {
    id: 'bedroom',
    roomNumber: '05',
    name: 'Master Bedroom',
    roomTag: 'Scene 05 · Acoustic Calm',
    headline: 'A Quiet Space for Deep Restful Sleep',
    subtitle: 'Atmosphere: Muted dusk stillness & channel-tufted velvet',
    description:
      'The bedroom should be a peaceful, quiet space. Our upholstered headboards soften room sounds, while the solid oak frame supports restful sleep without squeaks.',
    image: '/videos/scenes/posters/scene-5-bedroom.webp',
    architecturalDetails: [
      { label: 'Spatial Light', value: 'Diffused dusk illumination & sheer linen drapes' },
      { label: 'Flooring', value: 'Warm natural oak with organic wool area rug' },
      { label: 'Focal Bed', value: 'Nordica King Bed in Olive Green Velvet' },
    ],
    keyPieces: [
      'Nordica Olive Velvet Bedframe',
      'Solid Oak Floating Nightstands',
      'Organic Washed Peach Linens',
    ],
    linkHref: '/#bedroom',
    ctaText: 'Enter Scene 05: Master Bedroom',
  },
];

export const RoomDiscoverySection: React.FC = () => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>('living');
  const sectionRef = useRef<HTMLElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  const currentRoom =
    ROOM_OPTIONS.find((r) => r.id === selectedRoomId) || ROOM_OPTIONS[0];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.room-header',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 92%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      gsap.fromTo(
        '.room-tabs-bar',
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
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
        showcaseRef.current,
        { opacity: 0, y: 24, scale: 0.99 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: showcaseRef.current,
            start: 'top 90%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSelectRoom = (roomId: string) => {
    if (roomId === selectedRoomId) return;
    setSelectedRoomId(roomId);
    if (showcaseRef.current) {
      gsap.fromTo(
        showcaseRef.current,
        { opacity: 0.65, y: 6 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  };

  const handleNavigateToScene = (e: React.MouseEvent, roomId: string) => {
    e.preventDefault();
    window.location.hash = `#${roomId}`;
    scrollToSection(roomId);
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  };

  return (
    <section
      id="room-finder"
      ref={sectionRef}
      className="relative z-20 bg-[#FBF9F5] text-[#1A1816] py-20 sm:py-28 lg:py-32 border-t border-stone-200/80 overflow-hidden"
    >
      <span id="room-discovery" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <span id="rooms" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="room-header flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-8 border-b border-stone-200/80 gap-6 sm:gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-sans text-[11px] tracking-widest uppercase text-[#C84D1B] font-semibold bg-[#C84D1B]/10 px-3.5 py-1.5 rounded-full border border-[#C84D1B]/20 inline-flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
                <span>Section 07 · Room Finder · Space Discovery</span>
              </span>
              <span className="font-sans text-[11px] uppercase tracking-widest text-[#57534E] bg-white px-3 py-1 rounded-full border border-stone-200 font-medium inline-flex items-center space-x-1">
                <Compass className="w-3 h-3 text-[#C84D1B]" />
                <span>5 Living Atmospheres</span>
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1A1816] font-normal tracking-tight leading-[1.08]">
              Discover Your Space, <br />
              <span className="italic font-light text-[#57534E]">Curated by Room &amp; Mood.</span>
            </h2>
          </div>

          <div className="space-y-3 max-w-md">
            <p className="font-sans text-sm sm:text-base text-[#57534E] leading-relaxed font-normal">
              Each room has its own style, lighting, and personality. Explore the rooms below to see furniture details, or enter any room to experience the full virtual tour.
            </p>
            <div className="flex items-center space-x-2 text-xs font-sans text-[#78716C]">
              <Sparkles className="w-3.5 h-3.5 text-[#C84D1B]" />
              <span>Select any room below to view signature pieces and enter the tour</span>
            </div>
          </div>
        </div>

        {/* 5-Room Numbered Switcher Bar */}
        <div
          role="tablist"
          aria-label="Room Destinations"
          className="room-tabs-bar grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-10 sm:mb-12"
        >
          {ROOM_OPTIONS.map((room) => {
            const isSelected = room.id === selectedRoomId;
            return (
              <button
                key={room.id}
                role="tab"
                id={`room-tab-${room.id}`}
                aria-selected={isSelected}
                aria-controls={`room-panel-${room.id}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => handleSelectRoom(room.id)}
                className={`group relative text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-1 sm:space-y-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C84D1B] focus-visible:ring-offset-2 ${
                  isSelected
                    ? 'bg-white border-[#C84D1B] shadow-[0_8px_24px_rgba(200,77,27,0.12)] ring-1 ring-[#C84D1B]/30 -translate-y-0.5'
                    : 'bg-white/80 hover:bg-white border-stone-200/80 hover:border-stone-300 shadow-2xs hover:-translate-y-0.5'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-mono text-xs font-semibold ${
                      isSelected ? 'text-[#C84D1B]' : 'text-[#78716C]'
                    }`}
                  >
                    {room.roomNumber}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#C84D1B] text-white scale-105'
                        : 'bg-stone-100 text-stone-400 group-hover:text-[#C84D1B]'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                  </div>
                </div>

                <div>
                  <h3
                    className={`font-serif text-sm sm:text-base font-medium leading-snug transition-colors ${
                      isSelected ? 'text-[#1A1816]' : 'text-[#57534E] group-hover:text-[#1A1816]'
                    }`}
                  >
                    {room.name}
                  </h3>
                  <span className="text-[10px] sm:text-[11px] font-sans text-[#78716C] block truncate">
                    {room.roomTag.split('·')[1]?.trim() || room.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Room Showcase Panel */}
        <SpotlightCard
          ref={showcaseRef}
          role="tabpanel"
          id={`room-panel-${currentRoom.id}`}
          aria-labelledby={`room-tab-${currentRoom.id}`}
          className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-6 sm:p-10 lg:p-12 shadow-[0_12px_40px_rgba(26,24,22,0.06)] transition-all duration-300"
          contentClassName="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
          spotlightColor="rgba(200, 77, 27, 0.05)"
        >
          {/* Room Image with Interactive Scene Tour Badge */}
          <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden border border-stone-200/80 bg-[#F2EFE9] group shadow-inner">
            <Image
              key={currentRoom.id}
              src={currentRoom.image}
              alt={currentRoom.headline}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />

            {/* Scene Overlay Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className="bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-stone-200 text-xs font-sans font-semibold text-[#1A1816] tracking-wider uppercase">
                {currentRoom.roomTag}
              </span>
            </div>

            <button
              onClick={(e) => handleNavigateToScene(e, currentRoom.id)}
              className="absolute bottom-4 right-4 bg-[#1A1816]/90 hover:bg-[#C84D1B] text-white backdrop-blur-xs px-4 py-2 rounded-full text-xs font-sans uppercase tracking-wider font-semibold inline-flex items-center space-x-1.5 transition-all shadow-md group-hover:scale-105 cursor-pointer"
            >
              <span>Explore Scene {currentRoom.roomNumber}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Room Editorial, Architectural Details & Key Furniture */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="font-sans text-xs uppercase tracking-widest text-[#C84D1B] font-semibold block">
                Scene {currentRoom.roomNumber} · {currentRoom.name}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1A1816] font-normal leading-tight">
                {currentRoom.headline}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-[#78716C] font-normal">
                {currentRoom.subtitle}
              </p>
            </div>

            <p className="font-sans text-sm text-[#57534E] leading-relaxed font-normal">
              {currentRoom.description}
            </p>

            {/* Architectural Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FBF9F5] border border-stone-200/80 text-xs font-sans">
              {currentRoom.architecturalDetails.map((detail, dIdx) => (
                <div key={dIdx} className="space-y-0.5">
                  <span className="text-[#78716C] uppercase block text-[10px] tracking-wider font-medium">
                    {detail.label}
                  </span>
                  <span className="font-semibold text-[#1A1816] block text-xs truncate">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Key Signature Pieces */}
            <div className="space-y-2.5 pt-3 border-t border-stone-200/80">
              <span className="font-sans text-xs uppercase tracking-wider text-[#1A1816] font-semibold block">
                Featured Furniture in Scene {currentRoom.roomNumber}:
              </span>
              <ul className="space-y-1.5">
                {currentRoom.keyPieces.map((piece, pIdx) => (
                  <li key={pIdx} className="flex items-center space-x-2 text-xs sm:text-sm font-sans text-[#57534E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
                    <span className="font-medium text-[#1A1816]">{piece}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="pt-3 border-t border-stone-200/80 flex flex-col sm:flex-row gap-3">
              <button
                onClick={(e) => handleNavigateToScene(e, currentRoom.id)}
                className="group space-x-2 text-xs font-sans uppercase tracking-wider bg-[#1A1816] hover:bg-[#C84D1B] text-white font-semibold px-6 py-3.5 rounded-full shadow-2xs hover:shadow-xs transition-all duration-300 inline-flex items-center justify-center cursor-pointer"
              >
                <span>{currentRoom.ctaText}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <Link
                href="/collections"
                className="space-x-2 text-xs font-sans uppercase tracking-wider bg-white hover:bg-stone-50 border border-stone-200 text-[#1A1816] font-semibold px-5 py-3.5 rounded-full shadow-2xs transition-all duration-300 inline-flex items-center justify-center text-center"
              >
                <span>View Collection</span>
              </Link>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
};
