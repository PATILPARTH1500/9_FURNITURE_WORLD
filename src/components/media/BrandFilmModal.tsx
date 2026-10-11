'use client';

import React, { useRef, useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, RotateCcw } from 'lucide-react';

interface BrandFilmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHAPTERS = [
  { time: 0.0, label: '01 · Plinth Introduction' },
  { time: 1.2, label: '02 · Sculpted Armrest' },
  { time: 3.0, label: '03 · Bouclé Loom' },
  { time: 4.5, label: '04 · Deconstruction' },
  { time: 7.0, label: '05 · Cognac Leather' },
  { time: 8.8, label: '06 · Spatial Residence' },
];

export const BrandFilmModal: React.FC<BrandFilmModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: mute and play
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play();
        }
      });
      setIsPlaying(true);
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
    const nextMute = !videoRef.current.muted;
    videoRef.current.muted = nextMute;
    setIsMuted(nextMute);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);

    // Identify active chapter
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      if (curr >= CHAPTERS[i].time - 0.2) {
        setActiveChapter(i);
        break;
      }
    }
  };

  const seekToChapter = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `0${mins}:${secs < 10 ? '0' : ''}${secs}.${ms}`;
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/95 backdrop-blur-2xl p-4 md:p-8 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-charcoal-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-charcoal-950/80">
          <div className="flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-sand-200">
              Monograph No. 01 — Architectural Brand Film
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-sand-400 hover:text-white transition-colors"
            aria-label="Close brand film modal"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Video Canvas Container */}
        <div className="relative aspect-video w-full bg-black overflow-hidden group">
          <video
            ref={videoRef}
            src="/videos/brand-film.mp4"
            className="w-full h-full object-contain"
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => {
              if (videoRef.current) setDuration(videoRef.current.duration);
            }}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
          />

          {/* Center Play Overlay on Pause */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-opacity"
              aria-label="Resume brand film"
            >
              <div className="w-16 h-16 rounded-full border border-white/20 bg-charcoal-900/80 flex items-center justify-center text-ivory hover:scale-105 transition-transform">
                <Play className="w-6 h-6 fill-current translate-x-0.5" />
              </div>
            </button>
          )}

          {/* Bottom Floating Scrubber HUD */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-charcoal-950 via-charcoal-950/80 to-transparent flex flex-col space-y-2 opacity-95 group-hover:opacity-100 transition-opacity">
            {/* Timeline Bar */}
            <div
              className="w-full h-1 bg-white/20 hover:h-2 transition-all cursor-pointer relative"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                if (videoRef.current) videoRef.current.currentTime = pos * duration;
              }}
            >
              <div
                className="h-full bg-accent relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Transport Buttons */}
            <div className="flex items-center justify-between text-xs font-mono text-sand-300 pt-1">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlay}
                  className="hover:text-white transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={() => seekToChapter(0)}
                  className="hover:text-white transition-colors"
                  aria-label="Replay film"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={toggleMute}
                  className="hover:text-white transition-colors flex items-center space-x-1.5"
                  aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-sand-500" /> : <Volume2 className="w-4 h-4 text-accent" />}
                  <span className="text-[10px] uppercase tracking-wider">{isMuted ? 'Muted' : 'Audio On'}</span>
                </button>

                <span className="text-[11px] text-sand-400">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="hidden sm:flex items-center space-x-2 text-[10px] uppercase tracking-widest text-accent">
                <span>{CHAPTERS[activeChapter]?.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Navigation Ribbon */}
        <div className="bg-charcoal-950 px-6 py-3 border-t border-white/5 flex items-center justify-between overflow-x-auto gap-3 text-[10px] font-mono uppercase tracking-wider">
          {CHAPTERS.map((ch, idx) => (
            <button
              key={ch.label}
              onClick={() => seekToChapter(ch.time)}
              className={`px-2.5 py-1 transition-colors whitespace-nowrap border ${
                activeChapter === idx
                  ? 'border-accent bg-accent/15 text-accent'
                  : 'border-white/5 text-sand-400 hover:text-white hover:border-white/20'
              }`}
            >
              {ch.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
