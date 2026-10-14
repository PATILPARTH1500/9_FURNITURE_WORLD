'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, Compass } from 'lucide-react';

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
    image: '/videos/scenes/posters/scene-1-living.jpg',
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
    image: '/videos/scenes/posters/scene-2-dining.jpg',
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
    image: '/videos/scenes/posters/scene-3-kitchen.jpg',
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
    image: '/videos/scenes/posters/scene-4-lounge.jpg',
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
    image: '/videos/scenes/posters/scene-5-bedroom.jpg',
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

  const currentRoom =
    ROOM_OPTIONS.find((r) => r.id === selectedRoomId) || ROOM_OPTIONS[0];

  return (
    <section id="room-discovery" className="relative z-20 bg-cream py-24 sm:py-32 border-t border-checkerboard/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-8 border-b border-checkerboard/15 gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="font-sans text-xs tracking-wider uppercase text-tangerine font-semibold bg-white/80 px-3.5 py-1.5 rounded-full border border-tangerine/20 inline-flex items-center space-x-1.5 shadow-2xs">
              <Compass className="w-3.5 h-3.5 text-tangerine" />
              <span>Room Exploration</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-checkerboard font-semibold tracking-tight leading-[1.15]">
              Find Your Room&apos;s <br />
              <span className="italic text-walnut font-normal">Unique Personality.</span>
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-walnut leading-relaxed max-w-md font-normal">
            Select a room to preview its architectural mood, curated furniture palette, and signature handcrafted pieces.
          </p>
        </div>

        {/* Room Tab Selector Bar */}
        <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {ROOM_OPTIONS.map((room) => {
            const isSelected = room.id === selectedRoomId;
            return (
              <button
                key={room.id}
                data-room-id={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`px-5 py-3 rounded-full text-xs font-sans uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-300 ${
                  isSelected
                    ? 'bg-tangerine text-white shadow-warm scale-102 ring-2 ring-tangerine/30'
                    : 'bg-white text-checkerboard/80 hover:text-checkerboard border border-checkerboard/15 hover:border-checkerboard/30 shadow-2xs'
                }`}
                aria-pressed={isSelected}
              >
                {room.name}
              </button>
            );
          })}
        </div>

        {/* Interactive Room Showcase Panel */}
        <div className="bg-white rounded-3xl border border-checkerboard/15 p-6 sm:p-10 lg:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Room Image with Smooth Crossfade */}
          <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden border border-checkerboard/10 bg-cream-dark">
            <Image
              key={currentRoom.id}
              src={currentRoom.image}
              alt={currentRoom.headline}
              fill
              className="object-cover transition-opacity duration-700 animate-in fade-in"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
            <div className="absolute top-4 left-4 bg-cream/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold text-checkerboard border border-checkerboard/15 shadow-2xs">
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

            {/* CTA Link to Scene */}
            <div className="pt-4 border-t border-checkerboard/10 flex flex-col sm:flex-row gap-3">
              <Link
                href={currentRoom.linkHref}
                className="inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-tangerine hover:bg-coral text-white font-medium px-6 py-3.5 rounded-full shadow-warm transition-all duration-300"
              >
                <span>{currentRoom.ctaText}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <Link
                href="/collections"
                className="inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-white hover:bg-cream border border-checkerboard/20 text-checkerboard font-medium px-5 py-3.5 rounded-full shadow-2xs transition-all duration-300"
              >
                <span>View Collection</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
