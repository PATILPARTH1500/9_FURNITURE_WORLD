'use client';

import React, { useRef, useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw } from 'lucide-react';
import { resolveVideoUrl } from '@/config/cinematicTour';

interface BrandFilmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandFilmModal: React.FC<BrandFilmModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10);
  const [progress, setProgress] = useState(0);

  const videoSrc = resolveVideoUrl('/videos/scenes/scene-7-outro.mp4');
  const posterSrc = '/videos/scenes/posters/scene-7-outro.webp';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if (e.key === ' ' && isOpen) {
        e.preventDefault();
        togglePlay();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay policy fallback: mute and play
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          }
        });
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 10;
    setCurrentTime(curr);
    setDuration(dur);
    setProgress((curr / dur) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const target = pos * duration;
    videoRef.current.currentTime = target;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Furniture Village Brand Film"
      className="fixed inset-0 z-50 flex items-center justify-center bg-checkerboard/85 backdrop-blur-md transition-opacity duration-300"
    >
      {/* Click outside backdrop to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Cinema Player Card */}
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-5xl mx-4 sm:mx-8 bg-black rounded-3xl overflow-hidden border border-cream/20 shadow-2xl flex flex-col"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent z-20">
          <div className="flex items-center space-x-3">
            <span className="font-sans text-[11px] tracking-wider uppercase text-tangerine font-semibold bg-white/10 px-3 py-1 rounded-full border border-tangerine/30">
              Brand Film
            </span>
            <span className="font-serif text-lg text-white font-medium">
              FURNITURE VILLAGE · Continuous Residence Journey
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            aria-label="Close film"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Stage */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterSrc}
            playsInline
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Central Play/Pause Flash Overlay */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute p-6 rounded-full bg-tangerine/90 text-white shadow-warm hover:scale-105 transition-transform"
              aria-label="Play video"
            >
              <Play className="w-8 h-8 fill-current ml-0.5" />
            </button>
          )}
        </div>

        {/* Bottom Cinema Transport Bar */}
        <div className="p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-20 space-y-3">
          {/* Progress Timeline Scrubber */}
          <div
            onClick={handleSeek}
            className="w-full h-2 bg-white/20 hover:h-2.5 rounded-full cursor-pointer relative transition-all overflow-hidden"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-tangerine transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-white/90 text-xs font-sans">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={handleReplay}
                className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label="Replay film from start"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-white/60" /> : <Volume2 className="w-4 h-4 text-tangerine" />}
              </button>

              <span className="font-mono text-[11px] text-white/70">
                {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="hidden sm:inline text-white/60 text-[11px]">
                Space to play/pause · Esc to close
              </span>
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                aria-label="Toggle fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
