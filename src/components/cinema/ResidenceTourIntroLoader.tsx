'use client';

import React from 'react';

export interface SceneLoadItem {
  id: string;
  title: string;
  roomNumber: string;
  status: 'idle' | 'loading' | 'ready' | 'error';
  progress: number; // 0 to 100
  error?: string;
}

interface ResidenceTourIntroLoaderProps {
  combinedProgress: number; // 0 to 100
  activeSceneIndex: number;
  sceneStates: SceneLoadItem[];
  allScenesReady: boolean;
  hasSkippedAnimation: boolean;
  isDismissed: boolean;
  onSkipAnimation: () => void;
  onRetryScene: (sceneIdx: number) => void;
}

/**
 * Sophisticated Loading Introduction ("Preparing Your Residence")
 * Waits for ALL 5 cinematic scene videos to load, decode their first frame,
 * and become verified ready before transitioning into the tour.
 */
export const ResidenceTourIntroLoader: React.FC<ResidenceTourIntroLoaderProps> = ({
  combinedProgress,
  activeSceneIndex,
  sceneStates,
  allScenesReady,
  hasSkippedAnimation,
  isDismissed,
  onSkipAnimation,
  onRetryScene,
}) => {
  const readyCount = sceneStates.filter((s) => s.status === 'ready').length;
  const activeScene = sceneStates[activeSceneIndex] || sceneStates[0];
  const failedSceneIdx = sceneStates.findIndex((s) => s.status === 'error');
  const failedScene = failedSceneIdx !== -1 ? sceneStates[failedSceneIdx] : null;

  // Clamped combined progress: strictly capped at 99% until all scenes are verified ready
  const displayProgress = allScenesReady
    ? 100
    : Math.min(99, Math.max(0, Math.round(combinedProgress)));

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
      {/* 1. TOP HEADER: Architectural Monogram & Skip Intro Action */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#C84D1B] animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[#E8E2D9]/75">
            Atelier Architectural Walkthrough · 2026
          </span>
        </div>

        {/* Skip Animation Action (Bypasses decorative animation, strictly retains 5-video readiness requirement) */}
        {!hasSkippedAnimation ? (
          <button
            type="button"
            onClick={onSkipAnimation}
            className="group inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-white/20 hover:border-[#C84D1B] bg-white/[0.04] hover:bg-[#C84D1B]/10 text-white/85 hover:text-[#FAF8F5] transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C84D1B]"
            aria-label="Skip introduction animation and wait for all five videos to prepare"
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
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] text-white/60 font-mono text-[11px] sm:text-xs tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
            <span>Animation Skipped · Preparing 5 Scenes</span>
          </div>
        )}
      </div>

      {/* 2. CENTERPIECE: Editorial View OR Fast-Forward 5-Scene Checklist View */}
      <div className="w-full max-w-4xl mx-auto my-auto flex flex-col items-center text-center px-4">
        {/* Error Alert (If any video stream failed) */}
        {failedScene && (
          <div
            role="alert"
            className="w-full max-w-lg mb-6 p-4 rounded-xl border border-red-500/40 bg-red-950/40 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-left animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-mono text-xs font-semibold text-red-200">
                  Scene {failedScene.roomNumber} Failed to Load
                </p>
                <p className="font-sans text-xs text-red-300/80">
                  {failedScene.title}: {failedScene.error || 'Network stream error.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onRetryScene(failedSceneIdx)}
              className="shrink-0 px-4 py-2 rounded-lg bg-red-600/30 hover:bg-red-600/50 border border-red-400/30 text-white font-mono text-xs tracking-wider uppercase transition-colors cursor-pointer min-h-[44px]"
            >
              Retry Scene {failedScene.roomNumber} ↻
            </button>
          </div>
        )}

        {/* Status Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 mb-4 sm:mb-5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              allScenesReady ? 'bg-emerald-400' : 'bg-[#C84D1B] animate-ping'
            }`}
          />
          <span className="font-mono text-[10px] sm:text-xs text-[#C84D1B] font-semibold">
            {readyCount} / 05 READY
          </span>
          <span className="text-white/30 text-xs">·</span>
          <span className="font-sans text-[11px] sm:text-xs tracking-wider uppercase text-white/80">
            {allScenesReady
              ? 'All Scenes Primed'
              : `Loading ${activeScene.roomNumber}: ${activeScene.title}`}
          </span>
        </div>

        {!hasSkippedAnimation ? (
          /* STANDARD ARCHITECTURAL INTRO VIEW */
          <>
            {/* Editorial Headline */}
            <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-[#FAF8F5] tracking-tight mb-2 sm:mb-3">
              A space is taking shape.
            </h2>

            {/* Subtitle */}
            <p className="font-sans text-xs sm:text-sm text-[#C4B5A5] max-w-md mb-6 sm:mb-8 tracking-wide font-light">
              Preparing your cinematic residence experience. Preloading all five architectural rooms
              into memory for seamless, frame-synchronized spatial exploration.
            </p>

            {/* Architectural SVG Floor Plan Linework with Reactive Room Statuses */}
            <div className="relative w-full max-w-lg aspect-[16/9] mx-auto flex items-center justify-center p-3 rounded-xl border border-white/[0.08] bg-black/30 backdrop-blur-md overflow-hidden">
              {/* Blueprint Grid Background */}
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
                {/* Outer Perimeter Walls */}
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

                {/* Partitions */}
                <path
                  d="M 220 26 L 220 180 M 220 215 L 220 254"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />
                <path
                  d="M 220 180 A 35 35 0 0 1 255 215"
                  stroke="#C84D1B"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  strokeOpacity="0.6"
                />
                <path
                  d="M 26 140 L 150 140 M 185 140 L 220 140"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />
                <path
                  d="M 370 26 L 370 120 M 370 155 L 370 254"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />

                {/* ROOM 01: The Living Room */}
                <g className={sceneStates[0]?.status === 'ready' ? 'text-emerald-400' : 'text-[#FAF8F5]'}>
                  <path
                    d="M 255 70 C 270 45, 335 45, 345 70 C 352 90, 345 125, 335 130 C 315 135, 275 135, 260 125 Z"
                    fill="none"
                    stroke={sceneStates[0]?.status === 'ready' ? '#10B981' : '#C84D1B'}
                    strokeWidth="1.5"
                    strokeOpacity={sceneStates[0]?.status === 'ready' ? '1' : '0.85'}
                    className={sceneStates[0]?.status === 'loading' ? 'animate-pulse' : ''}
                  />
                  <circle
                    cx="300"
                    cy="100"
                    r="11"
                    stroke={sceneStates[0]?.status === 'ready' ? '#10B981' : '#C84D1B'}
                    strokeWidth="1.25"
                    fill={sceneStates[0]?.status === 'ready' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(200, 77, 27, 0.15)'}
                  />
                </g>

                {/* ROOM 02: The Dining Room */}
                <g
                  stroke={sceneStates[1]?.status === 'ready' ? '#10B981' : 'currentColor'}
                  strokeOpacity={sceneStates[1]?.status === 'ready' ? '1' : sceneStates[1]?.status === 'loading' ? '0.8' : '0.3'}
                  className={sceneStates[1]?.status === 'loading' ? 'animate-pulse' : ''}
                >
                  <circle cx="120" cy="80" r="24" strokeWidth="1" />
                  <circle cx="120" cy="46" r="4" strokeWidth="0.8" />
                  <circle cx="120" cy="114" r="4" strokeWidth="0.8" />
                  <circle cx="86" cy="80" r="4" strokeWidth="0.8" />
                  <circle cx="154" cy="80" r="4" strokeWidth="0.8" />
                </g>

                {/* ROOM 03: Kitchen */}
                <g
                  stroke={sceneStates[2]?.status === 'ready' ? '#10B981' : 'currentColor'}
                  strokeOpacity={sceneStates[2]?.status === 'ready' ? '1' : sceneStates[2]?.status === 'loading' ? '0.8' : '0.3'}
                  className={sceneStates[2]?.status === 'loading' ? 'animate-pulse' : ''}
                >
                  <rect x="45" y="170" width="130" height="45" rx="2" strokeWidth="1" />
                  <line x1="45" y1="185" x2="175" y2="185" strokeWidth="0.75" strokeDasharray="3 3" />
                  <circle cx="65" cy="225" r="4" strokeWidth="0.8" />
                  <circle cx="110" cy="225" r="4" strokeWidth="0.8" />
                  <circle cx="155" cy="225" r="4" strokeWidth="0.8" />
                </g>

                {/* ROOM 04: Family Lounge */}
                <g
                  stroke={sceneStates[3]?.status === 'ready' ? '#10B981' : 'currentColor'}
                  strokeOpacity={sceneStates[3]?.status === 'ready' ? '1' : sceneStates[3]?.status === 'loading' ? '0.8' : '0.25'}
                  className={sceneStates[3]?.status === 'loading' ? 'animate-pulse' : ''}
                >
                  <rect x="240" y="215" width="110" height="30" rx="1" strokeWidth="0.75" />
                  <line x1="265" y1="215" x2="265" y2="245" strokeWidth="0.5" />
                  <line x1="295" y1="215" x2="295" y2="245" strokeWidth="0.5" />
                  <line x1="325" y1="215" x2="325" y2="245" strokeWidth="0.5" />
                </g>

                {/* ROOM 05: Bedroom */}
                <g
                  stroke={sceneStates[4]?.status === 'ready' ? '#10B981' : 'currentColor'}
                  strokeOpacity={sceneStates[4]?.status === 'ready' ? '1' : sceneStates[4]?.status === 'loading' ? '0.8' : '0.3'}
                  className={sceneStates[4]?.status === 'loading' ? 'animate-pulse' : ''}
                >
                  <rect x="400" y="70" width="70" height="85" rx="3" strokeWidth="1" />
                  <rect x="410" y="75" width="22" height="15" rx="1" strokeWidth="0.75" />
                  <rect x="438" y="75" width="22" height="15" rx="1" strokeWidth="0.75" />
                </g>

                {/* Room Labels & Status Markers */}
                <text
                  x="265"
                  y="178"
                  fill={sceneStates[0]?.status === 'ready' ? '#10B981' : '#FAF8F5'}
                  fillOpacity="0.9"
                  fontSize="9"
                  fontFamily="monospace"
                  letterSpacing="1.5"
                >
                  01 LIVING {sceneStates[0]?.status === 'ready' ? '✓' : ''}
                </text>
                <text
                  x="90"
                  y="84"
                  fill={sceneStates[1]?.status === 'ready' ? '#10B981' : '#FAF8F5'}
                  fillOpacity={sceneStates[1]?.status === 'ready' ? '0.9' : '0.4'}
                  fontSize="8"
                  fontFamily="monospace"
                  letterSpacing="1"
                >
                  02 DINING {sceneStates[1]?.status === 'ready' ? '✓' : ''}
                </text>
                <text
                  x="75"
                  y="198"
                  fill={sceneStates[2]?.status === 'ready' ? '#10B981' : '#FAF8F5'}
                  fillOpacity={sceneStates[2]?.status === 'ready' ? '0.9' : '0.4'}
                  fontSize="8"
                  fontFamily="monospace"
                  letterSpacing="1"
                >
                  03 KITCHEN {sceneStates[2]?.status === 'ready' ? '✓' : ''}
                </text>
                <text
                  x="260"
                  y="234"
                  fill={sceneStates[3]?.status === 'ready' ? '#10B981' : '#FAF8F5'}
                  fillOpacity={sceneStates[3]?.status === 'ready' ? '0.9' : '0.4'}
                  fontSize="8"
                  fontFamily="monospace"
                  letterSpacing="1"
                >
                  04 LOUNGE {sceneStates[3]?.status === 'ready' ? '✓' : ''}
                </text>
                <text
                  x="405"
                  y="118"
                  fill={sceneStates[4]?.status === 'ready' ? '#10B981' : '#FAF8F5'}
                  fillOpacity={sceneStates[4]?.status === 'ready' ? '0.9' : '0.4'}
                  fontSize="8"
                  fontFamily="monospace"
                  letterSpacing="1"
                >
                  05 BEDROOM {sceneStates[4]?.status === 'ready' ? '✓' : ''}
                </text>
              </svg>
            </div>
          </>
        ) : (
          /* FAST-FORWARD 5-SCENE CHECKLIST VIEW (WHEN SKIP INTRO IS CLICKED) */
          <div className="w-full max-w-xl mx-auto flex flex-col items-center">
            <h2 className="font-serif italic text-2xl sm:text-3xl text-[#FAF8F5] tracking-tight mb-1.5">
              Preparing Residence Walkthrough
            </h2>
            <p className="font-sans text-xs text-[#C4B5A5] mb-5 tracking-wide font-light">
              Intro animation bypassed. All five cinematic scenes must finish preloading and decode
              their initial frames before the tour unlocks.
            </p>

            {/* 5-Scene Status Checklist */}
            <div className="w-full grid grid-cols-1 gap-2 p-3 sm:p-4 rounded-xl border border-white/[0.08] bg-black/40 backdrop-blur-md">
              {sceneStates.map((scene, idx) => (
                <div
                  key={scene.id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[#C84D1B] font-semibold">{scene.roomNumber}</span>
                    <span className="text-white/85 font-sans truncate max-w-[200px] sm:max-w-none">
                      {scene.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {scene.status === 'ready' && (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                        <span>✓</span>
                        <span className="hidden sm:inline">Ready</span>
                      </span>
                    )}
                    {scene.status === 'loading' && (
                      <span className="inline-flex items-center gap-1.5 text-[#C84D1B]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B] animate-ping" />
                        <span>Buffering ({scene.progress}%)</span>
                      </span>
                    )}
                    {scene.status === 'idle' && (
                      <span className="text-white/35">Queued</span>
                    )}
                    {scene.status === 'error' && (
                      <button
                        type="button"
                        onClick={() => onRetryScene(idx)}
                        className="text-red-400 hover:text-red-300 underline font-semibold cursor-pointer"
                      >
                        Retry ↻
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM FOOTER: Combined 5-Video Progress Indicator */}
      <div className="w-full max-w-xl mx-auto flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono tracking-wider">
          <span className="text-[#E8E2D9]/75 flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                allScenesReady ? 'bg-emerald-400' : 'bg-[#C84D1B] animate-ping'
              }`}
            />
            {allScenesReady
              ? 'All 5 Scenes Primed · Entering Tour'
              : failedScene
              ? `Waiting for Retry on Scene ${failedScene.roomNumber}`
              : `Buffering Scene ${activeScene.roomNumber} / 05: ${activeScene.title}`}
          </span>
          <span className="text-[#C84D1B] font-semibold">{displayProgress}%</span>
        </div>

        {/* Combined Progress Track */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#C84D1B] to-[#E86D3B] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-[#E8E2D9]/50 pt-0.5">
          <span>5 Synchronized 1080p Streams</span>
          <span>{readyCount} of 05 Decoded</span>
        </div>
      </div>
    </div>
  );
};
