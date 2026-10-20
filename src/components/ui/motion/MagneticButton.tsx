'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  magneticStrength?: number; // 0 to 1, default 0.3
  maxDistance?: number; // max pixels travel, default 10px
  ariaLabel?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  target?: string;
  rel?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  href,
  onClick,
  className = '',
  magneticStrength = 0.3,
  maxDistance = 10,
  ariaLabel,
  disabled = false,
  type = 'button',
  target,
  rel,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);

  // Motion values for smooth magnetic translation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for buttery organic snap-back
  const springConfig = { damping: 18, stiffness: 260, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    // Only enable magnetic tracking on fine-pointer devices without reduced motion
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setCanHover(isFinePointer && !prefersReducedMotion);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!canHover || !ref.current || disabled) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * magneticStrength;
    const distanceY = (e.clientY - centerY) * magneticStrength;

    // Clamp within maxDistance
    const clampedX = Math.max(-maxDistance, Math.min(maxDistance, distanceX));
    const clampedY = Math.max(-maxDistance, Math.min(maxDistance, distanceY));

    x.set(clampedX);
    y.set(clampedY);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const content = (
    <motion.div
      ref={ref}
      style={{
        x: canHover ? springX : 0,
        y: canHover ? springY : 0,
      }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`inline-flex items-center justify-center select-none transform-gpu ${className}`}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        target={target}
        rel={rel}
        className="inline-block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-tangerine focus-visible:ring-offset-2 rounded-full"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="inline-block focus:outline-hidden focus-visible:ring-2 focus-visible:ring-tangerine focus-visible:ring-offset-2 rounded-full bg-transparent p-0 border-none cursor-pointer disabled:cursor-not-allowed"
    >
      {content}
    </button>
  );
};

