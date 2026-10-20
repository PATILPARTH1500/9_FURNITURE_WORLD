'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedHighlightProps {
  children: React.ReactNode;
  variant?: 'underline' | 'marker';
  color?: string; // Tailwind class, e.g. "bg-tangerine" or "bg-[#F4510B]"
  delay?: number;
  duration?: number;
  className?: string;
}

export const AnimatedHighlight: React.FC<AnimatedHighlightProps> = ({
  children,
  variant = 'underline',
  color = 'bg-tangerine',
  delay = 0.2,
  duration = 0.6,
  className = '',
}) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  if (reducedMotion) {
    return (
      <span className={`relative inline-block ${className}`}>
        {children}
        {variant === 'underline' && (
          <span className={`absolute bottom-0 left-0 w-full h-[2px] ${color} rounded-full`} />
        )}
      </span>
    );
  }

  if (variant === 'marker') {
    return (
      <span className={`relative inline-block px-1 ${className}`}>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{
            duration,
            delay,
            ease: [0.25, 1, 0.5, 1],
          }}
          className={`absolute inset-0 origin-left -z-10 rounded-sm opacity-25 ${color}`}
        />
        {children}
      </span>
    );
  }

  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{
          duration,
          delay,
          ease: [0.25, 1, 0.5, 1],
        }}
        className={`absolute bottom-0 left-0 w-full h-[2px] sm:h-[2.5px] origin-left rounded-full ${color}`}
      />
    </span>
  );
};

