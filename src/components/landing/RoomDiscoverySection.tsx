'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Compass } from 'lucide-react';
import { AnimatedHeading, MagneticButton, SpotlightCard } from '@/components/ui/motion';

interface RoomData {
  id: string;
  name: string;
  roomTag: string;
  headline: string;
  subtitle: string;
  description: string;
  image: string;
  keyPieces: string[];
  linkHref: string;
  ctaText: string;
}

const ROOM_OPTIONS: RoomData[] = [
  {
    id: 'living',
    name: 'Living Room',
    roomTag: 'Scene 01 · Sunlight & Seating',
    headline: 'Warm, Welcoming Curves for Conversation',
    subtitle: 'Curved cream bouclé seating, sculptural tangerine coffee table, and soft lighting',
    description:
      'The living room is designed to bring family together. Soft curved contours replace rigid square seating, while our textured bouclé and solid oak armchairs create a calm, tactile haven flooded with natural daylight.',
    image: '/videos/scenes/posters/scene-1-living.webp',
    keyPieces: [
      'Arcos Curved Bouclé Sofa',
      'Tangerine Petal Lacquer Table',
      'Olive Velvet Lounge Chairs',
    ],
    linkHref: '/#living',
    ctaText: 'Explore Living Room Residence Scene',
  },
  {
    id: 'dining',
    name: 'Dining Room',
    roomTag: 'Scene 02 · Shared Tables',
    headline: 'Solid Timber Tables Built for Long Meals',
    subtitle: 'Round European walnut dining table with deep olive velvet chairs',
    description:
      'Shared meals are the soul of the home. Our round walnut pedestal table gives everyone generous elbow room without bumping into restrictive corner legs, perfect for lively dinners and lazy breakfasts alike.',
    image: '/videos/scenes/posters/scene-2-dining.webp',
    keyPieces: [
      'Sölve 150cm Round Walnut Table',
      'Solid Pedestal Weight-Base',
      'Ergonomic Olive Dining Chairs',
    ],
    linkHref: '/#dining',
    ctaText: 'Explore Dining Room Residence Scene',
  },
  {
    id: 'kitchen',
    name: 'Kitchen & Counter',
    roomTag: 'Scene 03 · Morning Rituals',
    headline: 'Functional Timber Simplicity for Morning Coffee',
    subtitle: 'Architectural counter stools, warm pendant lamps, and clean stone surfaces',
    description:
      'Morning coffee and quick snacks feel elevated with honest materials. Our solid oak counter stools feature curved saddle seats and built-in brass footrests for everyday family comfort.',
    image: '/videos/scenes/posters/scene-3-kitchen.webp',
    keyPieces: [
      'Nordic Oak Counter Stools',
      'Checkerboard Runner Floor',
      'Architectural Dome Pendant',
    ],
    linkHref: '/#kitchen',
    ctaText: 'Explore Kitchen Residence Scene',
  },
  {
    id: 'lounge',
    name: 'Family Lounge',
    roomTag: 'Scene 04 · Room to Play',
    headline: 'Space to Play, Relax, and Unwind Together',
    subtitle: 'Checkerboard floors, resilient bouclé, and playful burnt-orange accents',
    description:
      'Designed with real family life in mind. Heavy-duty woven upholstery, soft rounded edges that prevent bumps during active play, and generous open floor plans that give children and parents room to enjoy.',
    image: '/videos/scenes/posters/scene-4-lounge.webp',
    keyPieces: [
      'Kronos Low-Slung Armchair',
      'Kid-Safe Rounded Armrests',
      'High-Pile Wool Lounge Rug',
    ],
    linkHref: '/#lounge',
    ctaText: 'Explore Family Lounge Residence Scene',
  },
  {
    id: 'bedroom',
    name: 'Master Bedroom',
    roomTag: 'Scene 05 · Acoustic Calm',
    headline: 'A Quiet Sanctuary for Deep Restful Sleep',
    subtitle: 'Olive green velvet headboard, washed peach organic linens, and serene stillness',
    description:
      'The bedroom should be a sanctuary of acoustic calm. Our plush upholstered headboards naturally dampen room echoes, while the solid oak frame supports restorative rest with zero squeaks.',
    image: '/videos/scenes/posters/scene-5-bedroom.webp',
    keyPieces: [
      'Nordica Olive Velvet Bedframe',
      'Solid Oak Low Nightstands',
      'Washed Organic Peach Linens',
    ],
    linkHref: '/#bedroom',
    ctaText: 'Explore Bedroom Residence Scene',
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
        { opacity: 0.6, y: 6 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  };

  return (
    <section
      id="room-discovery"
      ref={sectionRef}
      className="relative z-20 bg-[#FAF5EC] py-24 sm:py-32 border-t border-checkerboard/12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="room-header flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-checkerboard/15 gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="font-sans text-xs tracking-wider uppercase text-tangerine font-semibold bg-white px-3.5 py-1.5 rounded-full border border-tangerine/20 inline-flex items-center space-x-1.5 shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-tangerine" />
              <span>Room Exploration · Architecture</span>
            </span>
            <AnimatedHeading
              text="Find Your Room's Unique Personality."
              highlightText="Unique Personality."
              highlightClassName="italic text-walnut font-normal"
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-checkerboard font-semibold tracking-tight leading-[1.15]"
            />
          </div>
          <p className="font-sans text-sm sm:text-base text-walnut leading-relaxed max-w-md font-normal">
            Select a room to preview its architectural mood, curated furniture palette, and signature handcrafted pieces.
          </p>
        </div>

        {/* Room Tab Selector Bar with Active Pill Indicator */}
        <div className="room-tabs-bar flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {ROOM_OPTIONS.map((room) => {
            const isSelected = room.id === selectedRoomId;
            return (
              <button
                key={room.id}
                data-room-id={room.id}
                onClick={() => handleSelectRoom(room.id)}
                className={`px-5 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-300 ${
                  isSelected
                    ? 'bg-tangerine text-white shadow-warm scale-102 ring-2 ring-tangerine/30'
                    : 'bg-white hover:bg-cream text-checkerboard/80 hover:text-checkerboard border border-checkerboard/15 hover:border-checkerboard/30 shadow-2xs'
                }`}
                aria-pressed={isSelected}
              >
                {room.name}
              </button>
            );
          })}
        </div>

        {/* Interactive Room Showcase Panel */}
        <SpotlightCard
          ref={showcaseRef}
          className="bg-white rounded-3xl border border-checkerboard/15 p-6 sm:p-10 lg:p-12 shadow-[0_16px_40px_rgba(41,37,31,0.06)] transition-all duration-300"
          contentClassName="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
          spotlightColor="rgba(244, 81, 11, 0.08)"
        >
          {/* Room Image with Smooth Crossfade */}
          <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-checkerboard/10 bg-cream-dark group">
            <Image
              key={currentRoom.id}
              src={currentRoom.image}
              alt={currentRoom.headline}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-104"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute top-4 left-4 bg-white/92 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold text-checkerboard border border-checkerboard/15 shadow-2xs">
              {currentRoom.roomTag}
            </div>
          </div>

          {/* Room Editorial & Key Pieces */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="font-sans text-xs uppercase tracking-wider text-tangerine font-semibold block">
                {currentRoom.name} Experience
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-checkerboard font-semibold leading-tight">
                {currentRoom.headline}
              </h3>
              <p className="font-sans text-xs text-walnut font-medium">
                {currentRoom.subtitle}
              </p>
            </div>

            <p className="font-sans text-sm text-checkerboard/85 leading-relaxed font-normal">
              {currentRoom.description}
            </p>

            {/* Key Signature Pieces */}
            <div className="space-y-3 pt-3 border-t border-checkerboard/10">
              <span className="font-sans text-xs uppercase tracking-wider text-checkerboard font-semibold block">
                Featured Furniture in this Space:
              </span>
              <ul className="space-y-2">
                {currentRoom.keyPieces.map((piece, pIdx) => (
                  <li key={pIdx} className="flex items-center space-x-2 text-xs font-sans text-walnut">
                    <span className="w-1.5 h-1.5 rounded-full bg-tangerine" />
                    <span className="font-medium text-checkerboard">{piece}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Links to Residence Scene */}
            <div className="pt-4 border-t border-checkerboard/10 flex flex-col sm:flex-row gap-3">
              <MagneticButton
                href={currentRoom.linkHref}
                className="group space-x-2 text-xs font-sans uppercase tracking-wider bg-tangerine hover:bg-coral text-white font-medium px-6 py-3.5 rounded-full shadow-warm transition-all duration-300 hover:shadow-lg"
              >
                <span>{currentRoom.ctaText}</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>

              <MagneticButton
                href="/collections"
                className="space-x-2 text-xs font-sans uppercase tracking-wider bg-white hover:bg-cream border border-checkerboard/20 text-checkerboard font-medium px-5 py-3.5 rounded-full shadow-2xs transition-all duration-300"
              >
                <span>View Collection</span>
              </MagneticButton>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
};
