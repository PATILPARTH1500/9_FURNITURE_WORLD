'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ShoppingBag,
  ArrowUpRight,
  ArrowDown,
  Check,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { CINEMATIC_TOUR_SCENES } from '@/config/cinematicTour';
import { PRODUCTS_CATALOG } from '@/data/catalog';
import { formatPrice } from '@/config/brand';
import { useSceneStore } from '@/store/useSceneStore';
import { useCartStore } from '@/store/useCartStore';
import dynamic from 'next/dynamic';
import { MagneticButton } from '@/components/ui/motion';

const ProductQuickDrawer = dynamic(
  () => import('@/components/discovery/ProductQuickDrawer').then((mod) => mod.ProductQuickDrawer),
  { ssr: false }
);

export const CinematicResidenceTour: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const totalScenes = CINEMATIC_TOUR_SCENES.length;
  const totalScenesPad = totalScenes.toString().padStart(2, '0');

  const videoRefs = useRef<(HTMLVideoElement | null)[]>(new Array(totalScenes).fill(null));
  const videoWrapperRefs = useRef<(HTMLDivElement | null)[]>(new Array(totalScenes).fill(null));
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

  // Mutable progress references decoupled from React render cycle
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const activeSceneIndexRef = useRef(0);

  // Discrete state for narrative text & product overlay
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [readyClips, setReadyClips] = useState<boolean[]>(new Array(totalScenes).fill(false));
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteractedAudio, setHasInteractedAudio] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [isMobileProductExpanded, setIsMobileProductExpanded] = useState(false);

  useEffect(() => {
    setIsMobileProductExpanded(false);
  }, [activeSceneIndex]);

  const { setActiveProduct, setActiveRoomIndex } = useSceneStore();
  const { addItem, setIsOpen: setCartOpen } = useCartStore();

  // Web Audio Context for warm ambient room tone
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const activeScene = CINEMATIC_TOUR_SCENES[activeSceneIndex] || CINEMATIC_TOUR_SCENES[0];
  const featuredProduct =
    PRODUCTS_CATALOG.find((p) => p.id === activeScene.featuredProductId) || PRODUCTS_CATALOG[0];

  const isFinalOutroScene = activeSceneIndex === totalScenes - 1;

  // Ambient audio initializer
  const initAmbientAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const masterGain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(65.41, ctx.currentTime); // C2 warm drone
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(98.0, ctx.currentTime); // G2 fifth harmonic

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, ctx.currentTime);

      masterGain.gain.setValueAtTime(0, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      gainNodeRef.current = masterGain;
    } catch {
      // AudioContext unavailable
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (!hasInteractedAudio) {
      initAmbientAudio();
      setHasInteractedAudio(true);
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setIsMuted((prev) => {
      const next = !prev;
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(next ? 0 : 0.05, audioCtxRef.current.currentTime, 0.4);
      }
      return next;
    });
  }, [hasInteractedAudio, initAmbientAudio]);

  // Non-blocking seek tracker per scene to prevent decoder queue stalls with watchdog timeout
  const seekTrackersRef = useRef<{ isSeeking: boolean; pendingTime: number | null; lastTargetTime: number; seekStartTime: number }[]>(
    Array.from({ length: totalScenes }, () => ({ isSeeking: false, pendingTime: null, lastTargetTime: -1, seekStartTime: 0 }))
  );
  const lastTimeRef = useRef<number>(typeof performance !== 'undefined' ? performance.now() : 0);
  const lastWidthRef = useRef<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Main GSAP ScrollTrigger & Continuous Frame Synchronization Engine
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const numScenes = CINEMATIC_TOUR_SCENES.length;
    if (numScenes === 0) return;

    // Prevent ScrollTrigger from refreshing when mobile address bars expand/collapse vertically
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Transition overlap window (16% of room scroll distance)
    const TRANS_WINDOW = 0.16;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Adaptive device profile: coarse touch devices follow the finger with higher responsivity
    const isTouchDevice =
      window.innerWidth <= 768 ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 768px)').matches;

    // ScrollTrigger pinning with 1:1 scroll progress mapping
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      pin: viewportRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      anticipatePin: 1,
      fastScrollEnd: true,
      onUpdate: (self) => {
        targetProgressRef.current = Math.max(0, Math.min(0.9999, self.progress));
      },
    });

    // Prime all videos in paused state and reset trackers
    videoRefs.current.forEach((video, i) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
      seekTrackersRef.current[i] = { isSeeking: false, pendingTime: null, lastTargetTime: -1, seekStartTime: 0 };
    });

    // Expose runtime debugging hook for automated test suites
    if (typeof window !== 'undefined') {
      (window as unknown as { __cinematicTour: unknown }).__cinematicTour = {
        targetProgressRef,
        currentProgressRef,
        activeSceneIndexRef,
        seekTrackersRef,
        videoRefs,
        ScrollTrigger,
      };
    }

    let rafId: number;
    let lastSceneIdx = -1;
    lastTimeRef.current = performance.now();

    // 60-120 FPS frame-rate independent continuous render loop
    const renderLoop = (timeNow: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (timeNow - lastTimeRef.current) / 1000));
      lastTimeRef.current = timeNow;

      const target = targetProgressRef.current;
      let curr = currentProgressRef.current;

      // Exponential physically-grounded smoothing:
      // Desktop retains exact 13.5 physical inertia; mobile/touch uses responsive 28.0
      const delta = target - curr;
      const lambda = prefersReducedMotion ? 28.0 : isTouchDevice ? 28.0 : 13.5;
      curr += delta * (1 - Math.exp(-lambda * dt));

      const snapThreshold = isTouchDevice ? 0.0004 : 0.00008;
      if (Math.abs(delta) < snapThreshold) {
        curr = target;
      }
      currentProgressRef.current = curr;

      // Continuous progression across [0, numScenes]
      const s = curr * numScenes;

      // Update Hairline Progress Bar
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${(curr * 100).toFixed(2)}%`;
      }

      // Discrete room index determination
      const discreteIdx = Math.max(0, Math.min(numScenes - 1, Math.floor(s)));
      if (discreteIdx !== lastSceneIdx) {
        lastSceneIdx = discreteIdx;
        if (progressTextRef.current) {
          progressTextRef.current.textContent = `${CINEMATIC_TOUR_SCENES[discreteIdx]?.roomNumber || '01'} / ${totalScenesPad}`;
        }
        activeSceneIndexRef.current = discreteIdx;
        setActiveSceneIndex(discreteIdx);
        setActiveRoomIndex(discreteIdx);

        // Intelligent decoder lifecycle: manage buffer for adjacent scenes
        for (let j = 0; j < numScenes; j++) {
          const isNear = Math.abs(j - discreteIdx) <= 1;
          const vid = videoRefs.current[j];
          if (vid) {
            if (isNear) {
              if (vid.preload !== 'auto') vid.preload = 'auto';
              // Mobile decoders require explicit load() if metadata hasn't started fetching
              if (vid.readyState === 0) {
                vid.load();
              }
            } else {
              if (!vid.paused) vid.pause();
            }
          }
        }
      }

      // Continuous Multi-Track Scrubbing & Zero-Leak Crossfade
      for (let k = 0; k < numScenes; k++) {
        const wrapper = videoWrapperRefs.current[k];
        const video = videoRefs.current[k];
        const tracker = seekTrackersRef.current[k];
        const sceneDuration = CINEMATIC_TOUR_SCENES[k].duration;
        const actualDuration = video && video.duration && !isNaN(video.duration) ? video.duration : sceneDuration;

        // Lifecycle boundaries for scene k
        const sIn = k === 0 ? 0 : k - TRANS_WINDOW;
        const sFullStart = k;
        const sFullEnd = k === numScenes - 1 ? numScenes : k + 1 - TRANS_WINDOW;
        const sOut = k === numScenes - 1 ? numScenes : k + 1;

        let opacity = 0;
        let zIndex = 2;

        if (s >= sIn && s <= sOut) {
          // 1. Precise Video Scrubbing with Non-Blocking Hardware Decoder Queues & Watchdog
          const span = sOut - sIn;
          const normProgress = Math.max(0, Math.min(1, (s - sIn) / span));
          const targetTime = normProgress * Math.max(0, actualDuration - 0.04);

          if (video) {
            if (video.readyState === 0) {
              video.load();
            } else if (video.readyState >= 1) {
              // Auto-recovery watchdog: if previous seek stalled (> 180ms), clear isSeeking
              if (tracker.isSeeking && tracker.seekStartTime && timeNow - tracker.seekStartTime > 180) {
                tracker.isSeeking = false;
                tracker.seekStartTime = 0;
              }

              if (Math.abs(video.currentTime - targetTime) > 0.015) {
                if (!tracker.isSeeking) {
                  tracker.isSeeking = true;
                  tracker.seekStartTime = timeNow;
                  tracker.lastTargetTime = targetTime;
                  try {
                    video.currentTime = targetTime;
                  } catch {}
                } else {
                  // Video decoder is busy: record newest target (latest-target-wins)
                  tracker.pendingTime = targetTime;
                }
              }
            }
          }

          // 2. Zero-Leak Crossfade: Outgoing scene stays 100% opaque underneath while incoming dissolves on top
          if (k > 0 && s < sFullStart) {
            // Incoming room dissolving on top: smooth Hermite curve
            const u = Math.max(0, Math.min(1, (s - sIn) / TRANS_WINDOW));
            opacity = u * u * (3 - 2 * u);
            zIndex = 10;
          } else if (s >= sFullStart && s <= sFullEnd) {
            // Fully active room
            opacity = 1;
            zIndex = 8;
          } else if (k < numScenes - 1 && s > sFullEnd) {
            // Outgoing room: stays 100% solid underneath incoming room to eliminate background leak
            opacity = 1;
            zIndex = 5;
          } else {
            opacity = 1;
            zIndex = 8;
          }

          // 3. Subtle continuous camera movement & zoom-in for unbroken spatial flow
          if (wrapper) {
            const roomLocal = Math.max(0, Math.min(1, s - k));
            const scale = prefersReducedMotion ? 1.0 : 1.0 + roomLocal * 0.024;
            wrapper.style.transform = `scale(${scale.toFixed(4)}) translate3d(0, 0, 0)`;
          }
        }

        // Apply compositing styles directly to DOM
        if (wrapper) {
          wrapper.style.opacity = opacity.toFixed(3);
          wrapper.style.visibility = opacity > 0.005 ? 'visible' : 'hidden';
          wrapper.style.zIndex = zIndex.toString();
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    const handleResize = () => {
      const currentWidth = window.innerWidth;
      // Ignore vertical-only height fluctuations from mobile browser address bar collapse/expand
      // Only refresh when viewport width actually changes (device rotation or desktop window resize)
      if (Math.abs(currentWidth - lastWidthRef.current) > 12) {
        lastWidthRef.current = currentWidth;
        ScrollTrigger.refresh();
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Direct anchor navigation for room links (#living, #dining, #kitchen, #lounge, #bedroom, #craft)
    const roomHashMap: Record<string, number> = {
      '#living': 0,
      '#dining': 1,
      '#kitchen': 2,
      '#lounge': 3,
      '#bedroom': 4,
      '#craft': 5,
    };
    const handleRoomHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash in roomHashMap && containerRef.current) {
        const roomIdx = roomHashMap[hash];
        const containerTop = containerRef.current.offsetTop;
        const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
        const targetScroll = containerTop + (roomIdx / (totalScenes - 1)) * totalHeight;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', handleRoomHash);
    if (window.location.hash) {
      setTimeout(handleRoomHash, 400);
    }

    const videosToCleanup = videoRefs.current;

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('hashchange', handleRoomHash);
      st.kill();
      videosToCleanup.forEach((v) => {
        if (v && !v.paused) v.pause();
      });
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [totalScenes, totalScenesPad, setActiveRoomIndex]);

  // Quick Order Action
  const handleQuickAdd = (product: (typeof PRODUCTS_CATALOG)[0]) => {
    const variant = product.variants[0] || {
      id: `var-${product.id}`,
      name: 'Standard Edition',
      price: product.price,
    };

    addItem({
      productId: product.id,
      variantId: variant.id,
      productName: product.name,
      variantName: variant.name,
      woodFinish: product.materials.woodOptions[0]?.name || 'Solid Oak',
      fabricFinish: product.materials.upholsteryOptions[0]?.name || '',
      unitPrice: product.price,
      quantity: 1,
      image: product.images.hero,
    });

    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
      setCartOpen(true);
    }, 800);
  };

  return (
    <>
      <div
        ref={containerRef}
        id="tour"
        className="relative w-full bg-cream touch-pan-y"
        style={{ height: `${totalScenes * 105}vh` }}
      >
        {/* Pinned Viewport with dynamic mobile height */}
        <div ref={viewportRef} className="relative h-[100dvh] sm:h-screen w-full overflow-hidden select-none bg-cream touch-pan-y">
          {/* 1. LAYER: Video Scrubbing Stack */}
          <div className="absolute inset-0 w-full h-full bg-cream">
            {CINEMATIC_TOUR_SCENES.map((scene, idx) => {
              return (
                <div
                  key={scene.id}
                  ref={(el) => {
                    videoWrapperRefs.current[idx] = el;
                  }}
                  className="absolute inset-0 w-full h-full will-change-[transform,opacity] transform-gpu"
                  style={{
                    opacity: idx === 0 ? 1 : 0,
                    zIndex: idx === 0 ? 8 : 2,
                    visibility: idx === 0 ? 'visible' : 'hidden',
                  }}
                >
                  {/* LIVE DECODED HTML5 VIDEO ELEMENT */}
                  <video
                    ref={(el) => {
                      videoRefs.current[idx] = el;
                    }}
                    src={scene.videoSrc}
                    poster={scene.posterSrc}
                    muted
                    loop={false}
                    playsInline
                    preload={
                      idx === 0
                        ? 'auto'
                        : Math.abs(idx - activeSceneIndex) <= 1
                        ? 'metadata'
                        : 'none'
                    }
                    disablePictureInPicture
                    disableRemotePlayback
                    onError={() => {
                      // Fallback: mark clip unready so poster stays active
                      setReadyClips((prev) => {
                        const next = [...prev];
                        next[idx] = false;
                        return next;
                      });
                    }}
                    onSeeking={() => {
                      const tracker = seekTrackersRef.current[idx];
                      tracker.isSeeking = true;
                      if (!tracker.seekStartTime) {
                        tracker.seekStartTime = performance.now();
                      }
                    }}
                    onSeeked={() => {
                      const tracker = seekTrackersRef.current[idx];
                      tracker.isSeeking = false;
                      tracker.seekStartTime = 0;
                      if (tracker.pendingTime !== null) {
                        const nextTime = tracker.pendingTime;
                        tracker.pendingTime = null;
                        const vid = videoRefs.current[idx];
                        if (vid && vid.readyState >= 1 && Math.abs(vid.currentTime - nextTime) > 0.015) {
                          tracker.isSeeking = true;
                          tracker.seekStartTime = performance.now();
                          tracker.lastTargetTime = nextTime;
                          try {
                            vid.currentTime = nextTime;
                          } catch {}
                        }
                      }
                    }}
                    onLoadedData={() => {
                      setReadyClips((prev) => {
                        const next = [...prev];
                        next[idx] = true;
                        return next;
                      });
                    }}
                    onCanPlay={() => {
                      setReadyClips((prev) => {
                        const next = [...prev];
                        next[idx] = true;
                        return next;
                      });
                    }}
                    className="absolute inset-0 w-full h-full object-cover transform-gpu z-10 pointer-events-none"
                  />

                  {/* High-Resolution Poster Placeholder - Always active as a solid backdrop underneath at z-0 */}
                  <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                    <Image
                      src={scene.posterSrc}
                      alt={scene.roomTitle}
                      fill
                      priority={idx === 0}
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>

                  {/* Subtle Warm Lighting Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-checkerboard/70 via-transparent to-checkerboard/30 pointer-events-none z-20" />
                </div>
              );
            })}
          </div>

          {/* 2. LAYER: Editorial Scene Indicator / Subtle Progress Cue (Replaces floating orb) */}
          {!isFinalOutroScene && (
            <div className="absolute top-20 sm:top-24 right-4 sm:right-8 md:right-12 z-30 pointer-events-none">
              <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-tangerine animate-pulse" />
                <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-medium">
                  Scene {activeScene.roomNumber} · {activeScene.roomTitle}
                </span>
              </div>
            </div>
          )}

          {/* 3. LAYER: Room Narrative OR Brand Presentation */}
          {isFinalOutroScene ? (
            /* BRAND PRESENTATION: Single Sharp Centered Wordmark */
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center pointer-events-auto bg-cream">
              <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto space-y-4 sm:space-y-6">
                <span className="inline-block text-[10px] sm:text-xs font-sans tracking-[0.25em] uppercase text-tangerine font-semibold bg-white/90 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full border border-tangerine/20 shadow-xs">
                  Welcome to the Village
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-checkerboard font-normal tracking-tight leading-[1.1] sm:leading-[1.15]">
                  FURNITURE VILLAGE
                </h1>
                <p className="font-sans text-xs sm:text-base md:text-lg text-walnut font-normal max-w-md sm:max-w-lg mx-auto leading-relaxed">
                  Colourful living, beautifully made. Explore retro-modern furniture and happy home essentials.
                </p>
                <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto">
                  <MagneticButton
                    href="#collection"
                    className="w-full sm:w-auto space-x-2 text-[11px] sm:text-xs font-sans uppercase tracking-wider bg-tangerine hover:bg-coral text-white font-medium px-6 py-3.5 sm:px-8 sm:py-4 rounded-full shadow-warm transition-all duration-300"
                  >
                    <span>Explore Furniture</span>
                    <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </MagneticButton>
                  <MagneticButton
                    href="/collections"
                    className="w-full sm:w-auto space-x-2 text-[11px] sm:text-xs font-sans uppercase tracking-wider bg-white hover:bg-cream border border-checkerboard/20 text-checkerboard font-medium px-6 py-3.5 sm:px-8 sm:py-4 rounded-full shadow-retro transition-all duration-300"
                  >
                    <span>Shop Collection</span>
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-tangerine" />
                  </MagneticButton>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Room Narrative (Bottom-Left) — Crisp Editorial Typography */
            <div className="absolute bottom-28 sm:bottom-32 md:bottom-16 left-3 sm:left-6 md:left-12 z-30 max-w-[calc(100%-1.5rem)] sm:max-w-xl pointer-events-none transition-all duration-500">
              <div className="space-y-2 sm:space-y-2.5 p-4 sm:p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 max-w-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#E7C89F] font-semibold">
                    {activeScene.roomNumber} / {totalScenesPad} · {activeScene.roomSubtitle}
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl md:text-5xl lg:text-[3.25rem] text-[#FAF8F5] font-light tracking-tight leading-[1.1] cinematic-room-title">
                  {activeScene.roomTitle}
                </h2>

                {/* Hide long room description on small screens (<md) so footage is not obscured, shown on desktop */}
                <p className="hidden md:block font-sans text-xs sm:text-sm text-[#E2DACF] font-normal max-w-md leading-relaxed">
                  {activeScene.description}
                </p>
              </div>
            </div>
          )}

          {/* 5. LAYER: Featured Product Card (Bottom-Right on Desktop, Compact Collapsible Strip on Mobile) */}
          {!isFinalOutroScene && (
            <div className="absolute bottom-7 sm:bottom-9 md:bottom-16 left-3 right-3 sm:left-6 sm:right-6 md:left-auto md:right-12 z-30 md:w-80 pointer-events-auto transition-all duration-300">
              {/* DESKTOP VIEW (md: and above) — Preserves 100% of the original desktop presentation */}
              <div className="hidden md:block bg-cream/95 backdrop-blur-md border border-checkerboard/15 p-4 rounded-xl shadow-retro transition-all duration-300 hover:border-tangerine/40">
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-checkerboard/10">
                  <span className="font-sans text-[11px] uppercase tracking-wider text-walnut font-medium">
                    Featured Piece
                  </span>
                  <span className="font-sans text-sm text-tangerine font-semibold">
                    {formatPrice(featuredProduct.price)}
                  </span>
                </div>

                <div className="flex space-x-3 mb-3">
                  <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-cream-dark border border-checkerboard/10">
                    <Image
                      src={featuredProduct.images.hero}
                      alt={featuredProduct.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="font-serif text-base text-checkerboard truncate font-medium">
                      {featuredProduct.name}
                    </h3>
                    <p className="font-sans text-xs text-walnut line-clamp-1">
                      {featuredProduct.subtitle}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveProduct(featuredProduct.id)}
                    className="inline-flex items-center justify-center space-x-1 text-xs font-sans font-medium py-2 px-3 border border-checkerboard/20 text-checkerboard hover:bg-checkerboard/5 rounded-lg transition-colors active:scale-97"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-walnut" />
                  </button>

                  <button
                    onClick={() => handleQuickAdd(featuredProduct)}
                    disabled={addedProductId === featuredProduct.id}
                    className="inline-flex items-center justify-center space-x-1 text-xs font-sans font-medium py-2 px-3 bg-tangerine hover:bg-coral text-white rounded-lg shadow-sm transition-colors active:scale-97"
                  >
                    {addedProductId === featuredProduct.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* MOBILE VIEW (< md) — Compact, translucent, collapsible bottom strip */}
              <div className="md:hidden bg-[#FAF6F0]/92 backdrop-blur-md border border-checkerboard/15 shadow-[0_8px_24px_rgba(41,37,31,0.12)] rounded-2xl transition-all duration-300">
                {isMobileProductExpanded ? (
                  /* Expanded Mobile State */
                  <div className="p-3.5 sm:p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-checkerboard/10">
                      <span className="font-sans text-[10px] uppercase tracking-wider text-walnut font-medium">
                        Featured Piece
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="font-sans text-xs font-semibold text-tangerine">
                          {formatPrice(featuredProduct.price)}
                        </span>
                        <button
                          onClick={() => setIsMobileProductExpanded(false)}
                          className="p-1 text-walnut/70 hover:text-checkerboard hover:bg-black/5 rounded-md transition-colors"
                          aria-label="Collapse product details"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 mb-3">
                      <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-cream-dark border border-checkerboard/10">
                        <Image
                          src={featuredProduct.images.hero}
                          alt={featuredProduct.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <h3 className="font-serif text-sm text-checkerboard truncate font-medium">
                          {featuredProduct.name}
                        </h3>
                        <p className="font-sans text-[11px] text-walnut line-clamp-1">
                          {featuredProduct.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setActiveProduct(featuredProduct.id)}
                        className="inline-flex items-center justify-center space-x-1 text-xs font-sans font-medium py-2 px-3 border border-checkerboard/20 bg-white/70 text-checkerboard hover:bg-white rounded-lg transition-colors active:scale-97"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-walnut" />
                      </button>

                      <button
                        onClick={() => handleQuickAdd(featuredProduct)}
                        disabled={addedProductId === featuredProduct.id}
                        className="inline-flex items-center justify-center space-x-1 text-xs font-sans font-medium py-2 px-3 bg-tangerine hover:bg-coral text-white rounded-lg shadow-sm transition-colors active:scale-97"
                      >
                        {addedProductId === featuredProduct.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Minimized Mobile State (Default): Single row ~64-70px */
                  <div className="flex items-center justify-between p-2 sm:p-2.5 gap-2">
                    {/* Thumbnail */}
                    <div className="relative w-11 h-11 shrink-0 rounded-xl overflow-hidden bg-cream-dark border border-checkerboard/10">
                      <Image
                        src={featuredProduct.images.hero}
                        alt={featuredProduct.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>

                    {/* Title & Price */}
                    <div className="min-w-0 flex-1 pl-0.5">
                      <h3 className="font-serif text-xs sm:text-[13px] text-checkerboard truncate font-semibold leading-tight">
                        {featuredProduct.name}
                      </h3>
                      <p className="font-sans text-[11px] sm:text-xs text-tangerine font-semibold mt-0.5">
                        {formatPrice(featuredProduct.price)}
                      </p>
                    </div>

                    {/* Compact Side-by-Side Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setActiveProduct(featuredProduct.id)}
                        className="inline-flex items-center space-x-1 text-[11px] font-sans font-medium py-1.5 px-2.5 bg-white/80 hover:bg-white border border-checkerboard/15 text-checkerboard rounded-lg transition-colors active:scale-97"
                        aria-label={`View ${featuredProduct.name} details`}
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-3 h-3 text-walnut" />
                      </button>

                      <button
                        onClick={() => handleQuickAdd(featuredProduct)}
                        disabled={addedProductId === featuredProduct.id}
                        className="inline-flex items-center space-x-1 text-[11px] font-sans font-medium py-1.5 px-2.5 bg-tangerine hover:bg-coral text-white rounded-lg shadow-2xs transition-colors active:scale-97"
                        aria-label={`Add ${featuredProduct.name} to bag`}
                      >
                        {addedProductId === featuredProduct.id ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setIsMobileProductExpanded(true)}
                        className="p-1.5 text-walnut/70 hover:text-checkerboard hover:bg-black/5 rounded-lg transition-colors"
                        aria-label="Expand product info"
                        title="Expand"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. LAYER: Bottom Hairline Progress Indicator */}
          <div className="absolute bottom-1.5 sm:bottom-4 left-0 right-0 z-30 px-3 sm:px-6 md:px-12 pointer-events-none">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-white/90 drop-shadow-sm font-medium">
              <span className="font-sans text-[10px] sm:text-[11px] tracking-wider uppercase">
                <span className="hidden sm:inline">Scroll to explore the home</span>
                <span className="inline sm:hidden">Scroll to explore</span>
              </span>

              <div className="w-24 sm:w-56 h-[2px] sm:h-[3px] bg-white/30 rounded-full relative overflow-hidden backdrop-blur-xs">
                <div
                  ref={progressBarRef}
                  className="absolute left-0 top-0 bottom-0 bg-tangerine rounded-full transition-all duration-75 ease-out"
                  style={{ width: '0%' }}
                />
              </div>

              <span ref={progressTextRef} className="font-sans text-[10px] sm:text-[11px] tracking-wider uppercase">
                01 / {totalScenesPad}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shoppable Product Quick Drawer */}
      <ProductQuickDrawer />
    </>
  );
};
