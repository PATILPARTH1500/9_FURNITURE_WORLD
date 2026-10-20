'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // degrees, default 4
  perspective?: number; // default 1000
}

export const TiltCard = React.forwardRef<HTMLDivElement, TiltCardProps>(
  ({ children, className = '', maxTilt = 4, perspective = 1000, ...props }, ref) => {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [canHover, setCanHover] = useState(false);

    // Normalized cursor coordinates (-0.5 to 0.5)
    const normX = useMotionValue(0);
    const normY = useMotionValue(0);

    // Spring smoothed coordinates
    const springConfig = { damping: 20, stiffness: 220, mass: 0.6 };
    const smoothX = useSpring(normX, springConfig);
    const smoothY = useSpring(normY, springConfig);

    // Map to 3D rotation angles: rotating around Y corresponds to X position, rotating around X corresponds to -Y position
    const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
    const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);

    useEffect(() => {
      const isFinePointer = window.matchMedia('(pointer: fine)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setCanHover(isFinePointer && !prefersReducedMotion);
    }, []);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!canHover || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      normX.set(x);
      normY.set(y);
    };

    const handlePointerLeave = () => {
      normX.set(0);
      normY.set(0);
    };

    const setRefs = (element: HTMLDivElement | null) => {
      cardRef.current = element;
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
      }
    };

    if (!canHover) {
      return (
        <div ref={setRefs} className={className} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div
        ref={setRefs}
        style={{ perspective: `${perspective}px` }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={`transform-gpu ${className}`}
        {...props}
      >
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
          }}
          className="w-full h-full will-change-transform"
        >
          {children}
        </motion.div>
      </div>
    );
  }
);

TiltCard.displayName = 'TiltCard';
