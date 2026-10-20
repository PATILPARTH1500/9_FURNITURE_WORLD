'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  spotlightColor?: string; // e.g. "rgba(244, 81, 11, 0.08)"
  spotlightRadius?: number; // default 350
  borderGlow?: boolean; // subtle border highlight
}

export const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  (
    {
      children,
      className = '',
      contentClassName = '',
      spotlightColor = 'rgba(244, 81, 11, 0.07)',
      spotlightRadius = 350,
      borderGlow = true,
      ...props
    },
    ref
  ) => {
    const mouseX = useMotionValue(-1000);
    const mouseY = useMotionValue(-1000);
    const isHovered = useMotionValue(0);
    const [canHover, setCanHover] = useState(false);

    useEffect(() => {
      const isFinePointer = window.matchMedia('(pointer: fine)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setCanHover(isFinePointer && !prefersReducedMotion);
    }, []);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!canHover) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };

    const handlePointerEnter = () => {
      if (!canHover) return;
      isHovered.set(1);
    };

    const handlePointerLeave = () => {
      isHovered.set(0);
      mouseX.set(-1000);
      mouseY.set(-1000);
    };

    const background = useMotionTemplate`radial-gradient(${spotlightRadius}px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 80%)`;
    const borderBackground = useMotionTemplate`radial-gradient(${spotlightRadius * 0.75}px circle at ${mouseX}px ${mouseY}px, ${spotlightColor.replace(/[\d.]+\)$/, '0.35)')}, transparent 80%)`;

    return (
      <div
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className={`relative overflow-hidden ${className}`}
        {...props}
      >
        {/* 1. Subtle Radial Glow Background */}
        {canHover && (
          <motion.div
            style={{ background, opacity: isHovered }}
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
            aria-hidden="true"
          />
        )}

        {/* 2. Interactive Spotlight Border Shimmer */}
        {canHover && borderGlow && (
          <motion.div
            style={{ background: borderBackground, opacity: isHovered }}
            className="pointer-events-none absolute -inset-[1px] z-10 rounded-[inherit] transition-opacity duration-300 mask-border"
            aria-hidden="true"
          />
        )}

        {/* 3. Card Content */}
        <div className={`relative z-10 h-full w-full ${contentClassName}`}>{children}</div>
      </div>
    );
  }
);

SpotlightCard.displayName = 'SpotlightCard';
