'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface CanvasFramePlayerProps {
  framesCount: number;
  basePath: string; // e.g. '/videos/scenes/frames/scene-1/frame_'
  progress: number; // 0 to 1
  isActive: boolean;
  onReady?: () => void;
  className?: string;
}

/**
 * Canvas-based frame-accurate image sequence player.
 * Implements Page 7 of the Interactive 3D Website Guide:
 * "Decode every frame once, then draw the right one to a canvas as you scroll. Scrubbing video.currentTime stutters."
 *
 * Employs a bounded progressive LRU cache to prevent memory explosion:
 * Uncompressed 1080p frame = 8.3 MB in GPU VRAM.
 * Bounded cache limit = 20 frames (~160 MB max VRAM footprint).
 */
export const CanvasFramePlayer: React.FC<CanvasFramePlayerProps> = ({
  framesCount,
  basePath,
  progress,
  isActive,
  onReady,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFirstFramePainted, setIsFirstFramePainted] = useState(false);

  // Bounded frame cache (Map preserves insertion order for LRU eviction)
  const frameCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const pendingLoadsRef = useRef<Set<number>>(new Set());
  const maxCacheSize = 20;

  const currentFrameIdx = Math.max(
    1,
    Math.min(framesCount, Math.round(progress * (framesCount - 1)) + 1)
  );

  const getFrameUrl = useCallback(
    (index: number) => {
      const pad = index.toString().padStart(3, '0');
      return `${basePath}${pad}.webp`;
    },
    [basePath]
  );

  // Progressive prefetcher for adjacent frames
  const prefetchFrame = useCallback(
    (idx: number) => {
      if (idx < 1 || idx > framesCount) return;
      if (frameCacheRef.current.has(idx) || pendingLoadsRef.current.has(idx)) return;

      pendingLoadsRef.current.add(idx);
      const img = new Image();
      img.decoding = 'async';
      img.src = getFrameUrl(idx);
      img.onload = () => {
        pendingLoadsRef.current.delete(idx);
        // Manage LRU cache bound
        if (frameCacheRef.current.size >= maxCacheSize) {
          const oldestKey = frameCacheRef.current.keys().next().value;
          if (oldestKey !== undefined) {
            frameCacheRef.current.delete(oldestKey);
          }
        }
        frameCacheRef.current.set(idx, img);
      };
      img.onerror = () => {
        pendingLoadsRef.current.delete(idx);
      };
    },
    [framesCount, getFrameUrl]
  );

  // Initial load: prime frame 1 immediately
  useEffect(() => {
    const frame1 = new Image();
    frame1.decoding = 'async';
    frame1.src = getFrameUrl(1);
    frame1.onload = () => {
      frameCacheRef.current.set(1, frame1);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = frame1.naturalWidth || 1920;
          canvas.height = frame1.naturalHeight || 1080;
          ctx.drawImage(frame1, 0, 0, canvas.width, canvas.height);
          setIsFirstFramePainted(true);
          onReady?.();
        }
      }
    };

    // Preload immediate initial window (frames 2..6)
    for (let f = 2; f <= Math.min(6, framesCount); f++) {
      prefetchFrame(f);
    }
  }, [framesCount, getFrameUrl, onReady, prefetchFrame]);

  // Frame presentation loop on progress change
  useEffect(() => {
    if (!isActive) return;

    const targetFrame = currentFrameIdx;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cachedImg = frameCacheRef.current.get(targetFrame);
    if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
      if (canvas.width !== cachedImg.naturalWidth || canvas.height !== cachedImg.naturalHeight) {
        canvas.width = cachedImg.naturalWidth;
        canvas.height = cachedImg.naturalHeight;
      }
      ctx.drawImage(cachedImg, 0, 0, canvas.width, canvas.height);
      if (!isFirstFramePainted) {
        setIsFirstFramePainted(true);
        onReady?.();
      }
    } else {
      // Trigger immediate fetch
      prefetchFrame(targetFrame);
    }

    // Prefetch look-ahead window (+/- 3 frames around target)
    for (let offset = -3; offset <= 3; offset++) {
      prefetchFrame(targetFrame + offset);
    }
  }, [currentFrameIdx, isActive, isFirstFramePainted, onReady, prefetchFrame]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
        isFirstFramePainted ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    />
  );
};

