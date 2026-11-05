'use client';

import React from 'react';

interface ResidenceTourIntroLoaderProps {
  progress: number; // 0 to 100 (real buffer/loading progress)
  isDismissed: boolean;
  onSkip: () => void;
  sceneTitle?: string;
  sceneNumber?: string;
}

/**
 * Sophisticated Loading Introduction ("Preparing Your Residence")
 * Presents an architectural floor plan linework sketch with genuine buffer tracking
 * and an immediate "SKIP INTRO ↗" bypass.
 */
export const ResidenceTourIntroLoader: React.FC<ResidenceTourIntroLoaderProps> = ({
  progress,
  isDismissed,
  onSkip,
  sceneTitle = 'The Living Room',
  sceneNumber = '01',
}) => {
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div
      role="region"
      aria-label="Residence Tour Preparation"
      aria-live="polite"
      className={`absolute inset-0 z-40 flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-6 px-6 sm:px-10 md:px-14 bg-[#141210]/95 backdrop-blur-xl transition-all duration-700 ease-out select-none ${
        isDismissed
          ? 'opacity-0 pointer-events-none scale-[1.02] invisible'
          : 'opacity-100 pointer-events-auto scale-100 visible'
      }`}
    >
      {/* 1. TOP HEADER: Architectural Brand Monogram & Skip Intro Action */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#C84D1B] animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[#E8E2D9]/75">
            Atelier Architectural Walkthrough · 2026
          </span>
        </div>

        {/* Prominent yet minimal "SKIP INTRO ↗" button */}
        <button
          type="button"
          onClick={onSkip}
          className="group inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/20 hover:border-[#C84D1B] bg-white/[0.04] hover:bg-[#C84D1B]/10 text-white/85 hover:text-[#FAF8F5] transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C84D1B]"
          aria-label="Skip introduction and enter residence tour immediately"
        >
          <span className="font-mono text-xs sm:text-sm tracking-wider uppercase">
            Skip Intro
          </span>
          <span
            className="text-sm font-sans transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#C84D1B]"
            aria-hidden="true"
          >
            ↗
          </span>
        </button>
      </div>

      {/* 2. CENTERPIECE: Editorial Headline & Architectural Blueprint Linework */}
      <div className="w-full max-w-4xl mx-auto my-auto flex flex-col items-center text-center px-4">
        {/* Subtle Room Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 mb-4 sm:mb-6">
          <span className="font-mono text-[10px] sm:text-xs text-[#C84D1B] font-semibold">
            {sceneNumber} / 05
          </span>
          <span className="text-white/30 text-xs">·</span>
          <span className="font-sans text-[11px] sm:text-xs tracking-wider uppercase text-white/80">
            {sceneTitle}
          </span>
        </div>

        {/* Editorial Headline */}
        <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#FAF8F5] tracking-tight mb-2 sm:mb-3">
          A space is taking shape.
        </h2>

        {/* Architectural Subtitle */}
        <p className="font-sans text-xs sm:text-sm text-[#C4B5A5] max-w-md mb-6 sm:mb-8 tracking-wide font-light">
          Preparing your cinematic residence experience. Decoded for fluid, frame-synchronized spatial exploration.
        </p>

        {/* Architectural SVG Floor Plan Linework */}
        <div className="relative w-full max-w-lg aspect-[16/9] mx-auto flex items-center justify-center p-3 rounded-xl border border-white/[0.08] bg-black/30 backdrop-blur-md overflow-hidden">
          {/* Subtle Blueprint Grid Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
              backgroundSize: '16px 16px',
            }}
          />

          <svg
            viewBox="0 0 540 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-white/80"
            aria-hidden="true"
          >
            {/* Outer Perimeter Walls (Double Stroke) */}
            <rect
              x="20"
              y="20"
              width="500"
              height="240"
              rx="4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeOpacity="0.45"
            />
            <rect
              x="26"
              y="26"
              width="488"
              height="228"
              rx="2"
              stroke="currentColor"
              strokeWidth="0.75"
              strokeOpacity="0.2"
            />

            {/* Room Partition Walls */}
            {/* Living Room Partition */}
            <path
              d="M 220 26 L 220 180 M 220 215 L 220 254"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
            {/* Door swing arc into Living Room */}
            <path
              d="M 220 180 A 35 35 0 0 1 255 215"
              stroke="#C84D1B"
              strokeWidth="1"
              strokeDasharray="3 3"
              strokeOpacity="0.6"
            />

            {/* Dining / Kitchen Boundary */}
            <path
              d="M 26 140 L 150 140 M 185 140 L 220 140"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />
            {/* Bedroom / Lounge Partition */}
            <path
              d="M 370 26 L 370 120 M 370 155 L 370 254"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />

            {/* SCENE 01: The Living Room Architectural Furniture Layout (Highlighted) */}
            <g className="text-[#FAF8F5]">
              {/* Curved Bouclé Sofa Silhouette with animated subtle glow */}
              <path
                d="M 255 70 C 270 45, 335 45, 345 70 C 352 90, 345 125, 335 130 C 315 135, 275 135, 260 125 Z"
                fill="none"
                stroke="#C84D1B"
                strokeWidth="1.5"
                strokeOpacity="0.85"
                className="animate-pulse"
              />
              <path
                d="M 265 75 C 275 60, 325 60, 335 75"
                stroke="#C84D1B"
                strokeWidth="0.8"
                strokeDasharray="2 2"
                strokeOpacity="0.7"
              />
              {/* Tangerine Accent Petal Table (Circle) */}
              <circle
                cx="300"
                cy="100"
                r="11"
                stroke="#C84D1B"
                strokeWidth="1.25"
                fill="rgba(200, 77, 27, 0.15)"
              />
              {/* Olive Velvet Armchair 1 */}
              <rect
                x="250"
                y="145"
                width="24"
                height="22"
                rx="4"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
              {/* Olive Velvet Armchair 2 */}
              <rect
                x="325"
                y="145"
                width="24"
                height="22"
                rx="4"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
            </g>

            {/* SCENE 02: Dining Room (Round Walnut Table & 4 Chairs) */}
            <g stroke="currentColor" strokeOpacity="0.3">
              <circle cx="120" cy="80" r="24" strokeWidth="1" />
              <circle cx="120" cy="46" r="4" strokeWidth="0.8" />
              <circle cx="120" cy="114" r="4" strokeWidth="0.8" />
              <circle cx="86" cy="80" r="4" strokeWidth="0.8" />
              <circle cx="154" cy="80" r="4" strokeWidth="0.8" />
            </g>

            {/* SCENE 03: Kitchen Island & Breakfast Corner */}
            <g stroke="currentColor" strokeOpacity="0.3">
              <rect x="45" y="170" width="130" height="45" rx="2" strokeWidth="1" />
              <line x1="45" y1="185" x2="175" y2="185" strokeWidth="0.75" strokeDasharray="3 3" />
              <circle cx="65" cy="225" r="4" strokeWidth="0.8" />
              <circle cx="110" cy="225" r="4" strokeWidth="0.8" />
              <circle cx="155" cy="225" r="4" strokeWidth="0.8" />
            </g>

            {/* SCENE 04: Family Play Lounge Checkerboard Matrix */}
            <g stroke="currentColor" strokeOpacity="0.25">
              <rect x="240" y="215" width="110" height="30" rx="1" strokeWidth="0.75" />
              <line x1="265" y1="215" x2="265" y2="245" strokeWidth="0.5" />
              <line x1="295" y1="215" x2="295" y2="245" strokeWidth="0.5" />
              <line x1="325" y1="215" x2="325" y2="245" strokeWidth="0.5" />
            </g>

            {/* SCENE 05: Master Bedroom Bed & Nightstands */}
            <g stroke="currentColor" strokeOpacity="0.3">
              <rect x="400" y="70" width="70" height="85" rx="3" strokeWidth="1" />
              <rect x="410" y="75" width="22" height="15" rx="1" strokeWidth="0.75" />
              <rect x="438" y="75" width="22" height="15" rx="1" strokeWidth="0.75" />
              <rect x="382" y="75" width="12" height="18" rx="1" strokeWidth="0.75" />
              <rect x="476" y="75" width="12" height="18" rx="1" strokeWidth="0.75" />
            </g>

            {/* Room Labels (Micro Monospace) */}
            <text
              x="272"
              y="178"
              fill="#FAF8F5"
              fillOpacity="0.9"
              fontSize="9"
              fontFamily="monospace"
              letterSpacing="1.5"
            >
              01 LIVING
            </text>
            <text
              x="92"
              y="84"
              fill="#FAF8F5"
              fillOpacity="0.35"
              fontSize="8"
              fontFamily="monospace"
              letterSpacing="1"
            >
              02 DINING
            </text>
            <text
              x="78"
              y="198"
              fill="#FAF8F5"
              fillOpacity="0.35"
              fontSize="8"
              fontFamily="monospace"
              letterSpacing="1"
            >
              03 KITCHEN
            </text>
            <text
              x="262"
              y="234"
              fill="#FAF8F5"
              fillOpacity="0.35"
              fontSize="8"
              fontFamily="monospace"
              letterSpacing="1"
            >
              04 LOUNGE
            </text>
            <text
              x="410"
              y="118"
              fill="#FAF8F5"
              fillOpacity="0.35"
              fontSize="8"
              fontFamily="monospace"
              letterSpacing="1"
            >
              05 BEDROOM
            </text>

            {/* Compass / Scale Hallmark */}
            <g transform="translate(480, 222)" stroke="currentColor" strokeOpacity="0.4">
              <circle cx="10" cy="10" r="8" strokeWidth="0.75" />
              <line x1="10" y1="4" x2="10" y2="16" strokeWidth="0.75" />
              <line x1="4" y1="10" x2="16" y2="10" strokeWidth="0.75" />
              <text x="7.5" y="1.5" fill="currentColor" fontSize="6" fontFamily="monospace">
                N
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* 3. BOTTOM FOOTER: Real Buffer Progress Indicator */}
      <div className="w-full max-w-xl mx-auto flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono tracking-wider">
          <span className="text-[#E8E2D9]/70 flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                clampedProgress >= 100 ? 'bg-emerald-400' : 'bg-[#C84D1B] animate-ping'
              }`}
            />
            {clampedProgress >= 100
              ? 'Residence Primed · Entering Tour'
              : `Buffering Scene Media (${clampedProgress}%)`}
          </span>
          <span className="text-[#C84D1B] font-semibold">{clampedProgress}%</span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C84D1B] to-[#E86D3B] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-[#E8E2D9]/50 pt-0.5">
          <span>Continuous 1080p Cinematic Scrub</span>
          <span>H.264 High Profile</span>
        </div>
      </div>
    </div>
  );
};
