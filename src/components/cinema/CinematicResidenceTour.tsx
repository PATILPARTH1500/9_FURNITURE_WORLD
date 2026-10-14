'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Volume2,
  VolumeX,
  ShoppingBag,
  ArrowUpRight,
  ArrowDown,
  Box,
  Check,
} from 'lucide-react';
import { CINEMATIC_TOUR_SCENES } from '@/config/cinematicTour';
import { PRODUCTS_CATALOG } from '@/data/catalog';
import { useSceneStore } from '@/store/useSceneStore';
import { useCartStore } from '@/store/useCartStore';
import { ProductQuickDrawer } from '@/components/discovery/ProductQuickDrawer';

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

  // Main GSAP ScrollTrigger & Continuous Frame Synchronization Engine
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const numScenes = CINEMATIC_TOUR_SCENES.length;
    if (numScenes === 0) return;

    // Transition overlap window (14% of room scroll distance)
    const TRANS_WINDOW = 0.14;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ScrollTrigger pinning with 1:1 scroll progress mapping
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      pin: viewportRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        targetProgressRef.current = Math.max(0, Math.min(0.9999, self.progress));
      },
    });

    // Prime all videos in paused state
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    let rafId: number;
    let lastSceneIdx = -1;

    // 60 FPS physically-grounded continuous render loop
    const renderLoop = () => {
      const target = targetProgressRef.current;
      let curr = currentProgressRef.current;

      // Physically plausible damping: immediate tactile response without floatiness
      const delta = target - curr;
      const dampingFactor = prefersReducedMotion ? 0.9 : 0.42;
      curr += delta * dampingFactor;

      if (Math.abs(delta) < 0.00015) {
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

        // Preload upcoming scene ahead of time
        if (discreteIdx + 1 < numScenes) {
          const nextVid = videoRefs.current[discreteIdx + 1];
          if (nextVid && nextVid.preload !== 'auto') {
            nextVid.preload = 'auto';
          }
        }
      }

      // Continuous Multi-Track Scrubbing & Equal-Power Crossfade
      for (let k = 0; k < numScenes; k++) {
        const wrapper = videoWrapperRefs.current[k];
        const video = videoRefs.current[k];
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
          // 1. Calculate Continuous Timestamp (NO FREEZES OR STALLS)
          const span = sOut - sIn;
          const normProgress = Math.max(0, Math.min(1, (s - sIn) / span));
          const targetTime = normProgress * Math.max(0, actualDuration - 0.04);

          if (video && video.readyState >= 1) {
            if (!video.seeking || Math.abs(video.currentTime - targetTime) > 0.06) {
              if (Math.abs(video.currentTime - targetTime) > 0.015) {
                video.currentTime = targetTime;
              }
            }
          }

          // 2. Equal-Power Dissolve Opacity
          if (k > 0 && s < sFullStart) {
            // Smooth sinusoidal fade-in: sin(u * PI/2)
            const u = (s - sIn) / TRANS_WINDOW;
            opacity = Math.sin(u * Math.PI * 0.5);
            zIndex = 8;
          } else if (s >= sFullStart && s <= sFullEnd) {
            // Fully active room
            opacity = 1;
            zIndex = 10;
          } else if (k < numScenes - 1 && s > sFullEnd) {
            // Smooth cosine fade-out: cos(u * PI/2)
            const u = (s - sFullEnd) / TRANS_WINDOW;
            opacity = Math.cos(u * Math.PI * 0.5);
            zIndex = 6;
          } else {
            opacity = 1;
            zIndex = 10;
          }
        }

        // Apply style directly via DOM for 60 FPS compositing performance
        if (wrapper) {
          wrapper.style.opacity = opacity.toFixed(3);
          wrapper.style.visibility = opacity > 0.005 ? 'visible' : 'hidden';
          wrapper.style.zIndex = zIndex.toString();
        }
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(rafId);
      st.kill();
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
        className="relative w-full bg-cream"
        style={{ height: `${totalScenes * 105}vh` }}
      >
        {/* Pinned 100vh Viewport */}
        <div ref={viewportRef} className="sticky top-0 h-screen w-full overflow-hidden select-none bg-cream">
          {/* 1. LAYER: Video Scrubbing Stack */}
          <div className="absolute inset-0 w-full h-full bg-cream">
            {CINEMATIC_TOUR_SCENES.map((scene, idx) => {
              return (
                <div
                  key={scene.id}
                  ref={(el) => {
                    videoWrapperRefs.current[idx] = el;
                  }}
                  className="absolute inset-0 w-full h-full will-change-[opacity]"
                  style={{
                    opacity: idx === 0 ? 1 : 0,
                    zIndex: idx === 0 ? 10 : 2,
                    visibility: idx === 0 ? 'visible' : 'hidden',
                  }}
                >
                  {/* LIVE DECODED HTML5 VIDEO ELEMENT */}
                  <video
                    ref={(el) => {
                      videoRefs.current[idx] = el;
                    }}
                    src={scene.videoSrc}
                    muted
                    loop={false}
                    playsInline
                    preload={idx <= 1 ? 'auto' : 'metadata'}
                    disablePictureInPicture
                    disableRemotePlayback
                    onLoadedData={() => {
                      setReadyClips((prev) => {
                        const next = [...prev];
                        next[idx] = true;
                        return next;
                      });
                    }}
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.98] contrast-[1.02] transform-gpu z-10"
                  />

                  {/* High-Resolution Poster Placeholder */}
                  <div
                    className={`absolute inset-0 w-full h-full z-0 transition-opacity duration-700 ${
                      readyClips[idx] ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                  >
                    <Image
                      src={scene.posterSrc}
                      alt={scene.roomTitle}
                      fill
                      priority={idx === 0}
                      className="object-cover filter brightness-[0.98] contrast-[1.02]"
                      sizes="100vw"
                    />
                  </div>

                  {/* Subtle Warm Lighting Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-checkerboard/70 via-transparent to-checkerboard/30 pointer-events-none z-20" />
                </div>
              );
            })}
          </div>

          {/* 2. LAYER: Interactive Product Hotspot (Hidden on Final Outro) */}
          {!isFinalOutroScene && activeScene.hotspot && (
            <div
              className="absolute z-30 transition-all duration-700 pointer-events-auto"
              style={{
                left: `${activeScene.hotspot.xPercent}%`,
                top: `${activeScene.hotspot.yPercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <button
                onClick={() => setActiveProduct(featuredProduct.id)}
                className="group relative flex items-center space-x-2 focus:outline-hidden"
                aria-label={`Explore ${activeScene.hotspot.label}`}
              >
                <div className="relative flex items-center justify-center">
                  <span className="w-6 h-6 rounded-full border-2 border-tangerine bg-cream/90 shadow-md flex items-center justify-center transition-all duration-300 group-hover:scale-125">
                    <span className="w-2 h-2 rounded-full bg-tangerine group-hover:bg-coral transition-colors" />
                  </span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300 pointer-events-none hidden sm:flex items-center space-x-1.5 px-3 py-1 bg-cream/95 text-checkerboard shadow-retro border border-tangerine/30 rounded-full">
                  <span className="text-[11px] font-sans font-medium">
                    {activeScene.hotspot.label}
                  </span>
                  <ArrowUpRight className="w-3 h-3 text-tangerine" />
                </div>
              </button>
            </div>
          )}

          {/* 3. LAYER: Ambient Sound Toggle (Top-Right) */}
          <div className="absolute top-24 right-6 md:right-12 z-30 pointer-events-none">
            <button
              onClick={toggleAudio}
              className="p-3 rounded-full bg-cream/90 backdrop-blur-md border border-checkerboard/15 text-checkerboard hover:text-tangerine hover:border-tangerine/50 shadow-retro transition-all pointer-events-auto"
              aria-label={isMuted ? 'Turn on subtle ambient sound' : 'Mute sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-tangerine" />}
            </button>
          </div>

          {/* 4. LAYER: Room Narrative OR Brand Outro */}
          {isFinalOutroScene ? (
            /* BRAND OUTRO: Centered Wordmark Presentation */
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center pointer-events-auto bg-cream/40 backdrop-blur-[2px]">
              <div className="max-w-xl mx-auto space-y-6">
                <span className="inline-block text-xs font-sans tracking-[0.25em] uppercase text-tangerine font-semibold bg-white/80 px-4 py-1.5 rounded-full border border-tangerine/20 shadow-xs">
                  Welcome to the Village
                </span>
                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-checkerboard font-normal tracking-tight drop-shadow-sm">
                  FURNITURE VILLAGE
                </h1>
                <p className="font-sans text-base sm:text-lg text-walnut font-normal max-w-md mx-auto leading-relaxed">
                  Colourful living, beautifully made. Explore retro-modern furniture and happy home essentials.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="#collection"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-tangerine hover:bg-coral text-white font-medium px-8 py-4 rounded-full shadow-warm transition-all duration-300"
                  >
                    <span>Explore Furniture</span>
                    <ArrowDown className="w-4 h-4" />
                  </a>
                  <Link
                    href="/collections"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-sans uppercase tracking-wider bg-white hover:bg-cream border border-checkerboard/20 text-checkerboard font-medium px-8 py-4 rounded-full shadow-retro transition-all duration-300"
                  >
                    <span>Shop the Collection</span>
                    <ArrowUpRight className="w-4 h-4 text-tangerine" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Standard Room Narrative (Bottom-Left) */
            <div className="absolute bottom-52 sm:bottom-14 md:bottom-16 left-6 md:left-12 z-30 max-w-[calc(100%-3rem)] sm:max-w-xl pointer-events-none transition-all duration-500">
              <div className="space-y-2 sm:space-y-3 bg-checkerboard/40 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none p-4 sm:p-0 rounded-xl sm:rounded-none">
                <div className="flex items-center space-x-2">
                  <span className="font-sans text-[11px] tracking-wider uppercase text-mustard font-semibold bg-checkerboard/60 px-2.5 py-1 rounded-sm">
                    {activeScene.roomNumber} / {totalScenesPad} · {activeScene.roomSubtitle}
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-[1.08] drop-shadow-md">
                  {activeScene.roomTitle}
                </h2>

                <p className="font-sans text-xs sm:text-sm text-cream-light font-light max-w-md leading-relaxed drop-shadow-md line-clamp-2 sm:line-clamp-none">
                  {activeScene.description}
                </p>
              </div>
            </div>
          )}

          {/* 5. LAYER: Floating Product Card (Bottom-Right, Hidden on Outro) */}
          {!isFinalOutroScene && (
            <div className="absolute bottom-10 sm:bottom-14 md:bottom-16 right-6 md:right-12 z-30 w-[calc(100%-3rem)] sm:w-80 pointer-events-auto">
              <div className="bg-cream/95 backdrop-blur-md border border-checkerboard/15 p-4 rounded-xl shadow-retro transition-all duration-300 hover:border-tangerine/40">
                <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-checkerboard/10">
                  <span className="font-sans text-[11px] uppercase tracking-wider text-walnut font-medium">
                    Featured Piece
                  </span>
                  <span className="font-sans text-sm text-tangerine font-semibold">
                    ${featuredProduct.price.toLocaleString()}
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
                    <h3 className="font-serif text-base text-checkerboard truncate font-medium">{featuredProduct.name}</h3>
                    <p className="font-sans text-xs text-walnut line-clamp-1">{featuredProduct.subtitle}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveProduct(featuredProduct.id)}
                    className="inline-flex items-center justify-center space-x-1 text-xs font-sans font-medium py-2 px-3 border border-checkerboard/20 text-checkerboard hover:bg-checkerboard/5 rounded-lg transition-colors"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-walnut" />
                  </button>

                  <button
                    onClick={() => handleQuickAdd(featuredProduct)}
                    disabled={addedProductId === featuredProduct.id}
                    className="inline-flex items-center justify-center space-x-1 text-xs font-sans font-medium py-2 px-3 bg-tangerine hover:bg-coral text-white rounded-lg shadow-sm transition-colors"
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

                {/* 3D Studio Prompt for Flagship Product */}
                {featuredProduct.id === 'prod-001' && (
                  <div className="mt-2.5 pt-2 border-t border-checkerboard/10 flex items-center justify-between">
                    <Link
                      href="/products/kronos-lounge-chair"
                      className="inline-flex items-center space-x-1.5 text-[11px] font-sans font-medium text-tangerine hover:text-coral transition-colors"
                    >
                      <Box className="w-3 h-3" />
                      <span>Inspect in 3D Studio</span>
                    </Link>
                    <ArrowUpRight className="w-3 h-3 text-tangerine" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. LAYER: Bottom Hairline Progress Indicator */}
          <div className="absolute bottom-4 left-0 right-0 z-30 px-6 md:px-12 pointer-events-none">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <span className="font-sans text-[11px] tracking-wider uppercase text-white/90 drop-shadow-sm font-medium">
                Scroll to explore the home
              </span>

              <div className="w-36 sm:w-56 h-[3px] bg-white/30 rounded-full relative overflow-hidden backdrop-blur-xs">
                <div
                  ref={progressBarRef}
                  className="absolute left-0 top-0 bottom-0 bg-tangerine rounded-full transition-all duration-75 ease-out"
                  style={{ width: '0%' }}
                />
              </div>

              <span ref={progressTextRef} className="font-sans text-[11px] tracking-wider uppercase text-white/90 drop-shadow-sm font-medium">
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
