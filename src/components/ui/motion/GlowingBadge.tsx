'use client';

import React from 'react';

interface GlowingBadgeProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  glowColor?: string; // e.g. "from-tangerine/40 via-mustard/30 to-coral/40"
}

export const GlowingBadge: React.FC<GlowingBadgeProps> = ({
  children,
  className = '',
  innerClassName = 'bg-white/95 px-3.5 py-1.5 shadow-2xs backdrop-blur-xs',
  glowColor = 'from-tangerine/40 via-mustard/30 to-coral/40',
}) => {
  return (
    <div className={`relative inline-flex items-center group p-[1px] rounded-full overflow-hidden ${className}`}>
      {/* Animated Subtle Ambient Gradient Border */}
      <span
        className={`absolute inset-0 bg-gradient-to-r ${glowColor} opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-[spin_6s_linear_infinite] pointer-events-none -z-10`}
        aria-hidden="true"
      />
      {/* Inner Badge Pill */}
      <div className={`relative z-10 w-full h-full rounded-full flex items-center space-x-1.5 ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
};
