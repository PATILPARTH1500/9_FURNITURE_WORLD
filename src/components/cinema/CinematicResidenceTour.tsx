'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from '@/components/common/Image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CINEMATIC_TOUR_SCENES } from '@/config/cinematicTour';
import { useSceneStore } from '@/store/useSceneStore';
import { CanvasFramePlayer } from '@/components/cinema/CanvasFramePlayer';
import { ResidenceTourIntroLoader } from '@/components/cinema/ResidenceTourIntroLoader';

import { SceneLoadItem } from '@/components/cinema/ResidenceTourIntroLoader';

export const CinematicResidenceTour: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const totalScenes = CINEMATIC_TOUR_SCENES.length;
  const totalScenesPad = totalScenes.toString().padStart(2, '0');

  const videoRefs = useRef<(HTMLVideoElement | null)[]>(new Array(totalScenes).fill(null));
  const videoWrapperRefs = useRef<(HTMLDivElement | null)[]>(new Array(totalScenes).fill(null));
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

  // Mutable progress references decoupled from React render cycle (Page 9 of Guide)
  const isMountedRef = useRef(true);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const activeSceneIndexRef = useRef(0);

  // Progressive preloading tracker to avoid redundant load() calls
  const primedScenesRef = useRef<boolean[]>(new Array(totalScenes).fill(false));

  // Per-scene cached DOM styles to prevent redundant style thrashing and compositing invalidations
  const lastStylesRef = useRef<{
    opacity: string;
    visibility: string;
    zIndex: string;
    transform: string;
  }[]>(
    Array.from({ length: totalScenes }, () => ({
      opacity: '',
      visibility: '',
      zIndex: '',
      transform: '',
    }))
  );

  // Discrete state for narrative text & scene sync
  const [readyClips, setReadyClips] = useState<boolean[]>(new Array(totalScenes).fill(false));
  const [activeSceneIdx, setActiveSceneIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteractedAudio, setHasInteractedAudio] = useState(false);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>(() =>
    typeof window !== 'undefined' && window.innerWidth <= 768 ? 'mobile' : 'desktop'
  );

  // 5-Video Controlled Preload Queue State
  const [sceneStates, setSceneStates] = useState<SceneLoadItem[]>(() =>
    CINEMATIC_TOUR_SCENES.map((scene, idx) => ({
      id: scene.id,
      title: scene.roomTitle,
      roomNumber: scene.roomNumber,
      status: idx === 0 ? 'loading' : 'idle',
      progress: 0,
    }))
  );
  const sceneStatesRef = useRef(sceneStates);
  sceneStatesRef.current = sceneStates;
  const [activeLoadingIdx, setActiveLoadingIdx] = useState(0);
  const [hasSkippedAnimation, setHasSkippedAnimation] = useState(false);
  const [isIntroDismissed, setIsIntroDismissed] = useState(false);

  // Scene readiness & queue advancement guards
  const sceneReadyRef = useRef<boolean[]>(new Array(totalScenes).fill(false));
  const currentQueueIdxRef = useRef<number>(0);
  const allScenesReadyRef = useRef<boolean>(false);

  // Viewport visibility state (Page 12 of Guide: stop rendering when off-screen)
  const [isInTourViewport, setIsInTourViewport] = useState(false);
  const isInTourViewportRef = useRef(false);

  // Optional Canvas Frame Playback Mode (Page 7 of Guide: Prototype on Scene 01)
  const [useCanvasScene0, setUseCanvasScene0] = useState(false);
  const [canvasScene0Progress, setCanvasScene0Progress] = useState(0);

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

  const toggleAudio = useCallback(() => {
    if (!hasInteractedAudio) {
      initAmbientAudio();
      setHasInteractedAudio(true);
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    setIsMuted((prev) => {
      const next = !prev;
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(next ? 0 : 0.05, audioCtxRef.current.currentTime, 0.4);
      }
      return next;
    });
  }, [hasInteractedAudio, initAmbientAudio]);

  // Jump smoothly to a specific room (Strictly enabled after all 5 scenes are ready)
  const jumpToScene = useCallback(
    (idx: number) => {
      if (!allScenesReadyRef.current) return;
      if (!containerRef.current) return;
      const containerTop = containerRef.current.offsetTop;
      const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
      const targetScroll = containerTop + ((idx + 0.02) / totalScenes) * totalHeight;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    },
    [totalScenes]
  );

  // Non-blocking seek tracker per scene with frame quantization & seek pipeline serialization
  const seekTrackersRef = useRef<{
    isSeeking: boolean;
    pendingTime: number | null;
    lastTargetTime: number;
    seekStartTime: number;
    rvfcRegistered: boolean;
  }[]>(
    Array.from({ length: totalScenes }, () => ({
      isSeeking: false,
      pendingTime: null,
      lastTargetTime: -1,
      seekStartTime: 0,
      rvfcRegistered: false,
    }))
  );

  const lastTimeRef = useRef<number>(typeof performance !== 'undefined' ? performance.now() : 0);
  const lastWidthRef = useRef<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Setup requestVideoFrameCallback (rVFC) for compositor frame presentation monitoring & seek dispatch
  const setupRVFC = useCallback((video: HTMLVideoElement, sceneIdx: number) => {
    const tracker = seekTrackersRef.current[sceneIdx];
    if (tracker.rvfcRegistered) return;

    type RVFCVideo = HTMLVideoElement & {
      requestVideoFrameCallback?: (callback: (now: number, metadata: unknown) => void) => number;
    };
    const rvfcVid = video as RVFCVideo;

    if (typeof rvfcVid.requestVideoFrameCallback === 'function') {
      tracker.rvfcRegistered = true;
      const onFrame = (now: number) => {
        if (!isMountedRef.current) return;
        tracker.isSeeking = false;
        tracker.seekStartTime = 0;

        if (tracker.pendingTime !== null) {
          const nextTime = tracker.pendingTime;
          tracker.pendingTime = null;
          if (video.readyState >= 1 && Math.abs(video.currentTime - nextTime) >= 0.038) {
            tracker.isSeeking = true;
            tracker.seekStartTime = now;
            tracker.lastTargetTime = nextTime;
            try {
              video.currentTime = nextTime;
            } catch {}
          }
        }

        if (typeof rvfcVid.requestVideoFrameCallback === 'function') {
          rvfcVid.requestVideoFrameCallback(onFrame);
        }
      };
      rvfcVid.requestVideoFrameCallback(onFrame);
    }
  }, []);

  // -------------------------------------------------------------
  // 5-VIDEO CONTROLLED PRELOAD QUEUE PIPELINE
  // -------------------------------------------------------------
  const handleSceneError = useCallback(
    (idx: number, message?: string) => {
      if (idx < 0 || idx >= totalScenes) return;
      const scene = CINEMATIC_TOUR_SCENES[idx];
      setSceneStates((prev) => {
        const next = [...prev];
        if (next[idx]) {
          next[idx] = {
            ...next[idx],
            status: 'error',
            error: message || `Failed to load ${scene.roomTitle}`,
          };
        }
        return next;
      });
    },
    [totalScenes]
  );

  const loadScene = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= totalScenes) return;
      const vid = videoRefs.current[idx];
      if (!vid) return;

      primedScenesRef.current[idx] = true;
      vid.preload = 'auto';

      if (vid.readyState >= 2) {
        handleSceneReady(idx);
      } else {
        try {
          vid.load();
        } catch (e) {
          handleSceneError(idx, e instanceof Error ? e.message : 'Load failed');
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [totalScenes, handleSceneError]
  );

  const handleSceneReady = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= totalScenes) return;
      if (sceneReadyRef.current[idx]) return;

      const vid = videoRefs.current[idx];
      if (vid) {
        setupRVFC(vid, idx);
        try {
          vid.pause();
          vid.currentTime = 0;
        } catch {}
      }

      sceneReadyRef.current[idx] = true;

      setReadyClips((prev) => {
        const next = [...prev];
        next[idx] = true;
        return next;
      });

      setSceneStates((prev) => {
        const next = [...prev];
        if (next[idx]) {
          next[idx] = {
            ...next[idx],
            status: 'ready',
            progress: 100,
            error: undefined,
          };
        }
        return next;
      });

      // Advance preload queue to next scene
      const nextIdx = idx + 1;
      if (nextIdx < totalScenes) {
        currentQueueIdxRef.current = nextIdx;
        setActiveLoadingIdx(nextIdx);
        setSceneStates((prev) => {
          const next = [...prev];
          if (next[nextIdx] && next[nextIdx].status !== 'ready') {
            next[nextIdx] = { ...next[nextIdx], status: 'loading', progress: 10 };
          }
          return next;
        });

        const nextVid = videoRefs.current[nextIdx];
        if (nextVid) {
          primedScenesRef.current[nextIdx] = true;
          nextVid.preload = 'auto';
          if (nextVid.readyState >= 2) {
            setTimeout(() => handleSceneReady(nextIdx), 15);
          } else {
            try {
              nextVid.load();
            } catch (err) {
              handleSceneError(nextIdx, err instanceof Error ? err.message : 'Next load failed');
            }
          }
        }
      }
    },
    [totalScenes, setupRVFC, handleSceneError]
  );

  const handleSceneProgress = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= totalScenes) return;
      if (sceneReadyRef.current[idx]) return;

      const vid = videoRefs.current[idx];
      if (!vid) return;

      if (vid.readyState >= 2) {
        handleSceneReady(idx);
        return;
      }

      let p = 15;
      if (vid.readyState >= 1) p = Math.max(p, 40);

      if (vid.buffered && vid.buffered.length > 0) {
        try {
          const end = vid.buffered.end(0);
          const duration = vid.duration || CINEMATIC_TOUR_SCENES[idx]?.duration || 10;
          const targetDur = Math.min(duration, 3.5);
          p = Math.max(p, Math.round(Math.min(1, end / targetDur) * 100));
        } catch {}
      }

      setSceneStates((prev) => {
        const next = [...prev];
        if (next[idx] && next[idx].status !== 'ready') {
          next[idx] = { ...next[idx], progress: Math.min(99, p) };
        }
        return next;
      });
    },
    [totalScenes, handleSceneReady]
  );

  const retryScene = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= totalScenes) return;
      sceneReadyRef.current[idx] = false;

      setSceneStates((prev) => {
        const next = [...prev];
        if (next[idx]) {
          next[idx] = { ...next[idx], status: 'loading', progress: 10, error: undefined };
        }
        return next;
      });

      currentQueueIdxRef.current = idx;
      setActiveLoadingIdx(idx);

      const vid = videoRefs.current[idx];
      if (vid) {
        primedScenesRef.current[idx] = true;
        vid.preload = 'auto';
        try {
          vid.load();
        } catch (err) {
          handleSceneError(idx, err instanceof Error ? err.message : 'Retry failed');
        }
      }
    },
    [totalScenes, handleSceneError]
  );

  // Skip Intro Action: Bypasses decorative intro animation, strictly retains 5-video readiness requirement
  const handleSkipAnimation = useCallback(() => {
    setHasSkippedAnimation(true);
    if (allScenesReadyRef.current) {
      setIsIntroDismissed(true);
    }
  }, []);

  // Compute 5-Scene Combined Readiness & Progress
  const allScenesReady = sceneStates.every((s) => s.status === 'ready');
  allScenesReadyRef.current = allScenesReady;

  const combinedProgress = allScenesReady
    ? 100
    : Math.min(
        99,
        Math.max(0, Math.round(sceneStates.reduce((acc, s) => acc + s.progress, 0) / totalScenes))
      );

  // Prime controlled preload queue on initial mount
  useEffect(() => {
    loadScene(0);
  }, [loadScene]);

  // Dismiss loader ONLY AFTER all five scene videos are verified ready
  useEffect(() => {
    if (allScenesReady && !isIntroDismissed) {
      if (hasSkippedAnimation) {
        setIsIntroDismissed(true);
      } else {
        const timer = setTimeout(() => {
          setIsIntroDismissed(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [allScenesReady, isIntroDismissed, hasSkippedAnimation]);

  // Main GSAP ScrollTrigger & Continuous Frame Synchronization Engine
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const numScenes = CINEMATIC_TOUR_SCENES.length;
    if (numScenes === 0) return;

    // Check for canvas prototype query param or global toggle (Page 7 evaluation)
    if (
      window.location.search.includes('mode=canvas') ||
      (window as unknown as { __cinematicTourMode?: string }).__cinematicTourMode === 'canvas'
    ) {
      setUseCanvasScene0(true);
    }

    // Prevent ScrollTrigger from refreshing when mobile address bars expand/collapse vertically
    ScrollTrigger.config({ ignoreMobileResize: true });

    // Transition overlap window (16% of room scroll distance)
    const TRANS_WINDOW = 0.16;

    // Check reduced motion preference (Page 14 of Guide)
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
      onEnter: () => {
        setIsInTourViewport(true);
        isInTourViewportRef.current = true;
      },
      onEnterBack: () => {
        setIsInTourViewport(true);
        isInTourViewportRef.current = true;
      },
      onLeave: () => {
        setIsInTourViewport(false);
        isInTourViewportRef.current = false;
      },
      onLeaveBack: () => {
        setIsInTourViewport(false);
        isInTourViewportRef.current = false;
      },
      onUpdate: (self) => {
        targetProgressRef.current = Math.max(0, Math.min(0.9999, self.progress));
        if (allScenesReadyRef.current && self.progress > 0.04) {
          setIsInTourViewport(true);
          isInTourViewportRef.current = true;
          // Auto-dismiss loading intro as soon as user begins scrolling through tour
          setIsIntroDismissed(true);
        }
      },
    });

    // Prime ONLY Scene 00 in paused state
    if (videoRefs.current[0]) {
      videoRefs.current[0].pause();
      try {
        videoRefs.current[0].currentTime = 0;
      } catch {}
      if (videoRefs.current[0].readyState >= 1) {
        setupRVFC(videoRefs.current[0], 0);
      }
    }
    seekTrackersRef.current[0] = {
      isSeeking: false,
      pendingTime: null,
      lastTargetTime: 0,
      seekStartTime: 0,
      rvfcRegistered: false,
    };

    // Expose runtime debugging & benchmark hook for automated test suites
    if (typeof window !== 'undefined') {
      (window as unknown as { __cinematicTour: unknown }).__cinematicTour = {
        targetProgressRef,
        currentProgressRef,
        activeSceneIndexRef,
        seekTrackersRef,
        videoRefs,
        ScrollTrigger,
        setUseCanvasScene0,
        setIsIntroDismissed,
        getSceneStates: () => sceneStatesRef.current,
        allScenesReady: () => allScenesReadyRef.current,
        combinedProgress: () =>
          allScenesReadyRef.current
            ? 100
            : Math.min(
                99,
                Math.max(
                  0,
                  Math.round(
                    sceneStatesRef.current.reduce((acc, s) => acc + s.progress, 0) / totalScenes
                  )
                )
              ),
        retryScene,
        handleSceneError,
        handleSceneReady,
      };
    }

    let rafId: number;
    let lastSceneIdx = -1;
    lastTimeRef.current = performance.now();

    // 60-120 FPS continuous render loop (Page 9 of Guide)
    const renderLoop = (timeNow: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (timeNow - lastTimeRef.current) / 1000));
      lastTimeRef.current = timeNow;

      const target = targetProgressRef.current;
      let curr = currentProgressRef.current;
      const delta = target - curr;
      const snapThreshold = isTouchDevice ? 0.0004 : 0.00008;

      // Page 12 of Guide: When tour is completely off-screen and settled, skip expensive decode work
      if (!isInTourViewportRef.current && Math.abs(delta) < snapThreshold) {
        rafId = requestAnimationFrame(renderLoop);
        return;
      }

      // Exponential physically-grounded smoothing:
      // Desktop uses tuned 18.5 for responsive, low-lag tracking; mobile/touch uses 28.0
      const lambda = prefersReducedMotion ? 28.0 : isTouchDevice ? 28.0 : 18.5;
      curr += delta * (1 - Math.exp(-lambda * dt));

      if (Math.abs(delta) < snapThreshold) {
        curr = target;
      }
      currentProgressRef.current = curr;

      // Continuous progression across [0, numScenes]
      const s = curr * numScenes;

      // Update Hairline Progress Bar via GPU transform (Zero Layout Reflow)
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${curr.toFixed(4)})`;
      }

      // Discrete room index determination
      const discreteIdx = Math.max(0, Math.min(numScenes - 1, Math.floor(s)));
      if (discreteIdx !== lastSceneIdx) {
        lastSceneIdx = discreteIdx;
        setActiveSceneIdx(discreteIdx);
        if (progressTextRef.current) {
          progressTextRef.current.textContent = `${CINEMATIC_TOUR_SCENES[discreteIdx]?.roomNumber || '01'} / ${totalScenesPad}`;
        }
        activeSceneIndexRef.current = discreteIdx;
        // Update global scene store directly without triggering React re-renders of the tour component
        useSceneStore.getState().setActiveRoomIndex(discreteIdx);

        // Intelligent decoder lifecycle (Page 13 of Guide):
        // Limit active hardware decoders on mobile to 1-2 concurrent streams max!
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
              // On mobile, aggressively unload distant decoders to free GPU VRAM
              if (isTouchDevice && Math.abs(j - discreteIdx) >= 2) {
                vid.preload = 'none';
              }
            }
          }
        }
      }

      // Intelligent Progressive Next-Scene Preloading:
      // When user passes 50% through current scene, prime the immediate next scene
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
        const sceneDuration = CINEMATIC_TOUR_SCENES[k].duration || 10.0;

        // Lifecycle boundaries for scene k
        const sIn = k === 0 ? 0 : k - TRANS_WINDOW;
        const sFullStart = k;
        const sFullEnd = k === numScenes - 1 ? numScenes : k + 1 - TRANS_WINDOW;
        const sOut = k === numScenes - 1 ? numScenes : k + 1;

        let opacity = 0;
        let zIndex = 2;

        if (s >= sIn && s <= sOut) {
          const span = sOut - sIn;
          const normProgress = Math.max(0, Math.min(1, (s - sIn) / span));

          // If Scene 0 is using Canvas Frame Playback, update its progress
          if (k === 0 && useCanvasScene0) {
            setCanvasScene0Progress(normProgress);
          }

          // 1. Precise Video Scrubbing with Discrete Frame Quantization
          const continuousTime = normProgress * Math.max(0, sceneDuration - 0.04);
          // Quantize to 24fps source grid (1 frame = 0.04167s)
          const sourceFrameIdx = Math.round(continuousTime * 24);
          const targetTime = sourceFrameIdx / 24;

          if (video && (!useCanvasScene0 || k > 0)) {
            if (video.readyState === 0) {
              video.load();
            } else if (video.readyState >= 1) {
              // Fast in-memory hardware gate: Never assign currentTime while hardware decoder is seeking!
              if (!tracker.isSeeking && targetTime !== tracker.lastTargetTime && Math.abs(video.currentTime - targetTime) >= 0.038) {
                tracker.isSeeking = true;
                tracker.lastTargetTime = targetTime;
                try {
                  video.currentTime = targetTime;
                } catch {}
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
            const scaleStr = `scale(${scale.toFixed(4)}) translate3d(0, 0, 0)`;
            if (lastStylesRef.current[k].transform !== scaleStr) {
              wrapper.style.transform = scaleStr;
              lastStylesRef.current[k].transform = scaleStr;
            }
          }
        }

        // Apply compositing styles directly to DOM only when changed
        if (wrapper) {
          const lastStyle = lastStylesRef.current[k];
          const opStr = opacity.toFixed(3);
          if (lastStyle.opacity !== opStr) {
            wrapper.style.opacity = opStr;
            lastStyle.opacity = opStr;
          }
          const visStr = opacity > 0.005 ? 'visible' : 'hidden';
          if (lastStyle.visibility !== visStr) {
            wrapper.style.visibility = visStr;
            lastStyle.visibility = visStr;
          }
          const zStr = zIndex.toString();
          if (lastStyle.zIndex !== zStr) {
            wrapper.style.zIndex = zStr;
            lastStyle.zIndex = zStr;
          }
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
        setIsIntroDismissed(true);
      }
    };
    window.addEventListener('hashchange', handleRoomHash);
    if (window.location.hash) {
      setTimeout(handleRoomHash, 400);
    }

    const videosToCleanup = videoRefs.current;

    return () => {
      isMountedRef.current = false;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalScenes, totalScenesPad, setupRVFC, useCanvasScene0]);

  const currentScene = CINEMATIC_TOUR_SCENES[activeSceneIdx] || CINEMATIC_TOUR_SCENES[0];

  return (
    <>
      <div
        ref={containerRef}
        id="residence-tour"
        className="relative w-full bg-[#1A1816] touch-pan-y"
        style={{ height: `${totalScenes * 105}vh` }}
      >
        <span id="tour" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
        <span id="explore" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

        {/* Pinned Viewport with dynamic mobile height */}
        <div
          ref={viewportRef}
          className="relative h-[100dvh] sm:h-screen w-full overflow-hidden select-none bg-[#1A1816] touch-pan-y"
        >
          {/* 1. LAYER: Video Scrubbing Stack */}
          <div className="absolute inset-0 w-full h-full bg-[#1A1816]">
            {CINEMATIC_TOUR_SCENES.map((scene, idx) => {
              const videoSrc = viewportMode === 'mobile' ? scene.videoSrcMobile : scene.videoSrcDesktop;
              const isFirstScene = idx === 0;

              return (
                <div
                  key={scene.id}
                  ref={(el) => {
                    videoWrapperRefs.current[idx] = el;
                  }}
                  className="absolute inset-0 w-full h-full will-change-[transform,opacity] transform-gpu"
                  style={{
                    opacity: isFirstScene ? 1 : 0,
                    zIndex: isFirstScene ? 8 : 2,
                    visibility: isFirstScene ? 'visible' : 'hidden',
                  }}
                >
                  {/* OPTIONAL CANVAS FRAME PLAYBACK (Scene 01 Prototype - Page 7 of Guide) */}
                  {isFirstScene && useCanvasScene0 ? (
                    <CanvasFramePlayer
                      framesCount={60}
                      basePath="/videos/scenes/frames/scene-1/frame_"
                      progress={canvasScene0Progress}
                      isActive={isInTourViewport}
                      onReady={() => {
                        setReadyClips((prev) => {
                          const next = [...prev];
                          next[0] = true;
                          return next;
                        });
                        handleSceneReady(0);
                      }}
                      className="z-10 pointer-events-none"
                    />
                  ) : (
                    /* HARDWARE ACCELERATED HTML5 VIDEO ELEMENT (Page 12 of Guide: Poster-First) */
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
                      onError={() => {
                        // Resilient Fallback: keep poster completely active
                        setReadyClips((prev) => {
                          const next = [...prev];
                          next[idx] = false;
                          return next;
                        });
                        handleSceneError(idx);
                      }}
                      onSeeking={() => {
                        const tracker = seekTrackersRef.current[idx];
                        tracker.isSeeking = true;
                      }}
                      onSeeked={() => {
                        const tracker = seekTrackersRef.current[idx];
                        tracker.isSeeking = false;
                      }}
                      onLoadedMetadata={() => handleSceneProgress(idx)}
                      onLoadedData={() => handleSceneReady(idx)}
                      onCanPlay={() => handleSceneReady(idx)}
                      onProgress={() => handleSceneProgress(idx)}
                      className={`absolute inset-0 w-full h-full object-cover transform-gpu z-10 pointer-events-none transition-opacity duration-300 ${
                        readyClips[idx] ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  )}

                  {/* POSTER-FIRST BASELINE: Always active underneath at z-0 with zero black frames */}
                  <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
                    <Image
                      src={scene.posterSrc}
                      alt={scene.roomTitle}
                      fill
                      priority={isFirstScene}
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>

                  {/* Subtle Warm Lighting Vignette (Unobstructed Room Interior) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-20" />
                </div>
              );
            })}
          </div>

          {/* 2. LAYER: "Preparing Your Residence" Sophisticated Loading Introduction (Waits for all 5 scenes) */}
          <ResidenceTourIntroLoader
            combinedProgress={combinedProgress}
            activeSceneIndex={activeLoadingIdx}
            sceneStates={sceneStates}
            allScenesReady={allScenesReady}
            hasSkippedAnimation={hasSkippedAnimation}
            isDismissed={isIntroDismissed}
            onSkipAnimation={handleSkipAnimation}
            onRetryScene={retryScene}
          />

          {/* 3. LAYER: Top-Left Minimal Architectural Room Indicator */}
          <div className="absolute top-24 left-4 sm:top-24 sm:left-10 md:top-28 md:left-12 z-30 pointer-events-none transition-opacity duration-500 max-w-[210px] sm:max-w-md">
            <div className="inline-flex flex-col px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-2xl bg-black/45 backdrop-blur-md border border-white/15 shadow-xl w-full">
              <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B] animate-pulse shrink-0" />
                <span className="font-mono text-[9px] sm:text-xs tracking-[0.2em] uppercase text-white/80 drop-shadow-sm truncate">
                  Room {currentScene?.roomNumber || '01'} · 05
                </span>
              </div>
              <h2 data-testid="room-title" className="font-serif italic text-base sm:text-2xl md:text-3xl text-white tracking-tight drop-shadow-md truncate sm:whitespace-normal">
                {currentScene?.roomTitle}
              </h2>
              <p data-testid="room-subtitle" className="font-sans text-xs sm:text-sm text-white/75 mt-0.5 drop-shadow-sm hidden sm:block font-light">
                {currentScene?.roomSubtitle}
              </p>
            </div>
          </div>

          {/* 4. LAYER: Top-Right Ambient Room Tone Audio Controller */}
          <div className="absolute top-24 right-4 sm:top-24 sm:right-10 md:top-28 md:right-12 z-30 flex items-center gap-3">
            <button
              type="button"
              onClick={toggleAudio}
              className="group inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-black/45 hover:bg-black/70 border border-white/20 hover:border-[#C84D1B]/70 text-white/90 hover:text-white backdrop-blur-md shadow-xl transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C84D1B]"
              aria-label={isMuted ? 'Unmute ambient residence sound' : 'Mute ambient residence sound'}
            >
              {isMuted ? (
                <svg
                  className="w-4 h-4 text-white/60 group-hover:text-white transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                  />
                </svg>
              ) : (
                <div className="flex items-center gap-0.5 h-3.5" aria-hidden="true">
                  <span className="w-0.5 h-2 bg-[#C84D1B] animate-[pulse_1s_ease-in-out_infinite]" />
                  <span className="w-0.5 h-3.5 bg-[#C84D1B] animate-[pulse_1s_ease-in-out_0.2s_infinite]" />
                  <span className="w-0.5 h-2.5 bg-[#C84D1B] animate-[pulse_1s_ease-in-out_0.4s_infinite]" />
                </div>
              )}
              <span className="font-mono text-[11px] sm:text-xs tracking-wider uppercase hidden sm:inline">
                {isMuted ? 'Sound Off' : 'Ambient Tone'}
              </span>
            </button>
          </div>

          {/* 5. LAYER: Bottom Scrubber with 5 Interactive Chapter Navigation Marks */}
          <div className="absolute bottom-3 sm:bottom-6 left-0 right-0 z-30 px-4 sm:px-8 md:px-12 pointer-events-none">
            <div className="max-w-6xl mx-auto flex flex-col gap-2">
              {/* 5 Chapter Navigation Segments */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-3 pointer-events-auto">
                {CINEMATIC_TOUR_SCENES.map((scene, idx) => {
                  const isActive = activeSceneIdx === idx;
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => jumpToScene(idx)}
                      className={`group flex flex-col py-1 text-left transition-all cursor-pointer min-h-[44px] justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C84D1B] rounded ${
                        isActive ? 'text-white' : 'text-white/45 hover:text-white/80'
                      }`}
                      aria-label={`Jump to room ${scene.roomNumber}: ${scene.roomTitle}`}
                    >
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono mb-1.5">
                        <span className={`font-semibold ${isActive ? 'text-[#C84D1B]' : ''}`}>
                          {scene.roomNumber}
                        </span>
                        <span className="hidden sm:inline truncate text-[10px] font-sans ml-1">
                          {scene.roomTitle.replace('The ', '')}
                        </span>
                      </div>
                      {/* Chapter Segment Track */}
                      <div className="w-full h-[2px] bg-white/20 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isActive ? 'bg-[#C84D1B] w-full' : idx < activeSceneIdx ? 'bg-white/60 w-full' : 'w-0'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Hairline Continuous Scrubber & Coordinates */}
              <div className="flex items-center justify-between text-white/70 text-[10px] sm:text-[11px] font-mono tracking-wider pt-0.5">
                <span className="flex items-center gap-1.5">
                  <span className="hidden sm:inline">SCROLL TO EXPLORE ARCHITECTURE</span>
                  <span className="inline sm:hidden">SCROLL TO EXPLORE</span>
                </span>

                <div className="w-28 sm:w-64 h-[2px] bg-white/25 rounded-full relative overflow-hidden backdrop-blur-xs">
                  <div
                    ref={progressBarRef}
                    className="absolute inset-0 bg-[#C84D1B] rounded-full origin-left will-change-transform"
                    style={{ transform: 'scaleX(0)' }}
                  />
                </div>

                <span ref={progressTextRef} className="font-mono">
                  01 / {totalScenesPad}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

