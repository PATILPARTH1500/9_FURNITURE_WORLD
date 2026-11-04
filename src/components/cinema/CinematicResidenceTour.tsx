'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from '@/components/common/Image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';
import { CINEMATIC_TOUR_SCENES } from '@/config/cinematicTour';
import { useSceneStore } from '@/store/useSceneStore';

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

  // Progressive preloading tracker to avoid redundant load() calls
  const primedScenesRef = useRef<boolean[]>(new Array(totalScenes).fill(false));

  // Discrete state for narrative text & scene sync
  const [_activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [_readyClips, setReadyClips] = useState<boolean[]>(new Array(totalScenes).fill(false));
  const [_isMuted, setIsMuted] = useState(true);
  const [hasInteractedAudio, setHasInteractedAudio] = useState(false);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>(() =>
    typeof window !== 'undefined' && window.innerWidth <= 768 ? 'mobile' : 'desktop'
  );

  // Scene 01 Readiness & Branded Preparation Overlay
  const [isScene0Ready, setIsScene0Ready] = useState(false);
  const [scene0BufferedPct, setScene0BufferedPct] = useState(0);
  const [isInTourViewport, setIsInTourViewport] = useState(false);

  // Graceful fallback watchdog: never hold the preparation loader indefinitely
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      setIsScene0Ready(true);
    }, 3500);

    return () => clearTimeout(fallbackTimer);
  }, []);

  const { setActiveRoomIndex } = useSceneStore();

  // Web Audio Context for warm ambient room tone
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

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

  const _toggleAudio = useCallback(() => {
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

    // Mark Scene 0 as primed initially
    primedScenesRef.current[0] = true;

    // ScrollTrigger pinning with 1:1 scroll progress mapping
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      pin: viewportRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      anticipatePin: 1,
      fastScrollEnd: true,
      onEnter: () => setIsInTourViewport(true),
      onEnterBack: () => setIsInTourViewport(true),
      onLeave: () => setIsInTourViewport(false),
      onLeaveBack: () => setIsInTourViewport(false),
      onUpdate: (self) => {
        targetProgressRef.current = Math.max(0, Math.min(0.9999, self.progress));
        if (self.progress > 0.001) {
          setIsInTourViewport(true);
        }
      },
    });

    // Prime ONLY Scene 00 in paused state.
    // CRITICAL: Do NOT set currentTime = 0 on unprimed scenes (scenes 1..4),
    // which would trigger aggressive pre-fetching on all 5 MP4s at once!
    if (videoRefs.current[0]) {
      videoRefs.current[0].pause();
      try {
        videoRefs.current[0].currentTime = 0;
      } catch {}
    }
    seekTrackersRef.current[0] = { isSeeking: false, pendingTime: null, lastTargetTime: -1, seekStartTime: 0 };

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
          const isNear = (j === discreteIdx) || (j === discreteIdx - 1) || (j === discreteIdx + 1 && primedScenesRef.current[j]);
          const vid = videoRefs.current[j];
          if (vid) {
            if (isNear && primedScenesRef.current[j]) {
              if (vid.preload !== 'auto') vid.preload = 'auto';
              if (vid.readyState === 0) {
                vid.load();
              }
            } else {
              if (!vid.paused) vid.pause();
            }
          }
        }
      }

      // Intelligent Progressive Next-Scene Preloading:
      // When user passes 50% through current scene, begin fetching the immediate next scene
      const nextSceneIdx = discreteIdx + 1;
      if (nextSceneIdx < numScenes && !primedScenesRef.current[nextSceneIdx]) {
        const localProgress = s - discreteIdx;
        if (localProgress >= 0.5) {
          primedScenesRef.current[nextSceneIdx] = true;
          const nextVid = videoRefs.current[nextSceneIdx];
          if (nextVid) {
            nextVid.preload = 'auto';
            if (nextVid.readyState === 0) {
              nextVid.load();
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
      const newMode = currentWidth <= 768 ? 'mobile' : 'desktop';
      setViewportMode((prev) => (prev !== newMode ? newMode : prev));
      if (Math.abs(currentWidth - lastWidthRef.current) > 12) {
        lastWidthRef.current = currentWidth;
        ScrollTrigger.refresh();
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Direct anchor navigation for room links (#living, #dining, #kitchen, #lounge, #bedroom, #residence-tour)
    const roomHashMap: Record<string, number> = {
      '#residence-tour': 0,
      '#tour': 0,
      '#living': 0,
      '#dining': 1,
      '#kitchen': 2,
      '#lounge': 3,
      '#bedroom': 4,
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

  const showPreparationTransition = isInTourViewport && !isScene0Ready;

  return (
    <>
      <div
        ref={containerRef}
        id="residence-tour"
        className="relative w-full bg-cream touch-pan-y"
        style={{ height: `${totalScenes * 105}vh` }}
      >
        {/* Pinned Viewport with dynamic mobile height */}
        <div ref={viewportRef} className="relative h-[100dvh] sm:h-screen w-full overflow-hidden select-none bg-cream touch-pan-y">
          {/* 1. LAYER: Video Scrubbing Stack */}
          <div className="absolute inset-0 w-full h-full bg-cream">
            {CINEMATIC_TOUR_SCENES.map((scene, idx) => {
              const videoSrc = viewportMode === 'mobile' ? scene.videoSrcMobile : scene.videoSrcDesktop;

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
                    src={videoSrc}
                    poster={scene.posterSrc}
                    muted
                    loop={false}
                    playsInline
                    preload={idx === 0 ? 'auto' : 'none'}
                    disablePictureInPicture
                    disableRemotePlayback
                    onProgress={(e) => {
                      if (idx === 0) {
                        const v = e.currentTarget;
                        if (v.buffered.length > 0 && v.duration) {
                          const bufferedEnd = v.buffered.end(v.buffered.length - 1);
                          const pct = Math.min(100, Math.round((bufferedEnd / v.duration) * 100));
                          setScene0BufferedPct(pct);
                          if (bufferedEnd >= 1.5 || v.readyState >= 3) {
                            setIsScene0Ready(true);
                          }
                        }
                      }
                    }}
                    onError={() => {
                      // Fallback: mark clip ready so poster seamlessly takes over
                      if (idx === 0) setIsScene0Ready(true);
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
                      if (idx === 0) setIsScene0Ready(true);
                      setReadyClips((prev) => {
                        const next = [...prev];
                        next[idx] = true;
                        return next;
                      });
                    }}
                    onCanPlay={() => {
                      if (idx === 0) setIsScene0Ready(true);
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

          {/* BRANDED PREPARATION TRANSITION OVERLAY */}
          <div
            id="residence-prep-overlay"
            className={`absolute inset-0 z-40 bg-cream/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center transition-all duration-700 ease-out ${
              showPreparationTransition ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            aria-live="polite"
          >
            <div className="max-w-md w-full space-y-5 bg-white/80 p-8 sm:p-10 rounded-3xl border border-checkerboard/10 shadow-warm">
              <span className="font-sans text-xs uppercase tracking-wider text-tangerine font-semibold flex items-center justify-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-tangerine" />
                <span>Furniture Village · Living Tour</span>
              </span>

              <div className="space-y-1.5">
                <h3 className="font-serif text-2xl sm:text-3xl text-checkerboard font-semibold">
                  Preparing your residence...
                </h3>
                <p className="font-sans text-xs sm:text-sm text-walnut">
                  Scene 01 · The Living Room
                </p>
              </div>

              {/* Honest Progress Indicator (only if measurable progress) */}
              <div className="space-y-2 pt-2">
                <div className="w-full h-1.5 bg-cream-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tangerine rounded-full transition-all duration-300 ease-out"
                    style={{
                      width: scene0BufferedPct > 0 ? `${scene0BufferedPct}%` : '20%',
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs font-sans text-walnut/70">
                  <span>Natural Timber & Joinery</span>
                  <span>{scene0BufferedPct > 0 ? `${scene0BufferedPct}%` : 'Loading...'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hairline Progress Indicator */}
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
    </>
  );
};
