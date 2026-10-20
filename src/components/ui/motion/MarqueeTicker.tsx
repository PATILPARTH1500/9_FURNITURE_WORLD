'use client';

import React from 'react';

export interface MarqueeTickerProps {
  items: string[];
  separator?: string;
  speed?: number; // duration in seconds
  pauseOnHover?: boolean;
  className?: string;
  itemClassName?: string;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  items,
  separator = '✦',
  speed = 28,
  pauseOnHover = true,
  className = '',
  itemClassName = '',
}) => {
  return (
    <div
      className={`relative w-full overflow-hidden select-none whitespace-nowrap group/marquee ${className}`}
      role="region"
      aria-label="Editorial Brand Highlights"
    >
      <div
        className={`inline-flex items-center space-x-8 animate-marquee motion-reduce:animate-none ${
          pauseOnHover ? 'group-hover/marquee:[animation-play-state:paused]' : ''
        }`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {items.map((item, idx) => (
          <div key={`track-1-${idx}`} className="inline-flex items-center space-x-8 shrink-0">
            <span className={`text-xs uppercase tracking-[0.25em] font-medium ${itemClassName}`}>
              {item}
            </span>
            <span className="text-tangerine text-[10px] select-none" aria-hidden="true">
              {separator}
            </span>
          </div>
        ))}
      </div>

      {/* Duplicate Track for Seamless Looping */}
      <div
        aria-hidden="true"
        className={`inline-flex items-center space-x-8 animate-marquee motion-reduce:animate-none ${
          pauseOnHover ? 'group-hover/marquee:[animation-play-state:paused]' : ''
        }`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {items.map((item, idx) => (
          <div key={`track-2-${idx}`} className="inline-flex items-center space-x-8 shrink-0">
            <span className={`text-xs uppercase tracking-[0.25em] font-medium ${itemClassName}`}>
              {item}
            </span>
            <span className="text-tangerine text-[10px] select-none" aria-hidden="true">
              {separator}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

