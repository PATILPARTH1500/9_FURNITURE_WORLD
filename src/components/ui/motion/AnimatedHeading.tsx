'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface AnimatedHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  highlightText?: string;
  highlightClassName?: string;
  delay?: number; // base delay in seconds
  stagger?: number; // stagger per word
  once?: boolean;
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  text,
  as: Component = 'h2',
  className = '',
  highlightText,
  highlightClassName = 'italic text-walnut font-normal',
  delay = 0,
  stagger = 0.035,
  once = true,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once, margin: '0px 0px 100px 0px' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const words = text.split(' ');
  // Always render visible if not yet mounted (SSR) or once in view
  const shouldAnimate = mounted && isInView;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: { y: 14, opacity: 0.15 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const MotionComponent = motion[Component as 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'] || motion.h2;

  return (
    <MotionComponent
      ref={containerRef as any}
      variants={containerVariants}
      initial="hidden"
      animate={shouldAnimate ? 'visible' : 'hidden'}
      className={`relative ${className}`}
      aria-label={text}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline">
        {words.map((word, index) => {
          const isHighlight = highlightText && highlightText.includes(word);
          return (
            <span
              key={`${word}-${index}`}
              className="inline-block pb-1 -mb-1 mr-[0.24em] last:mr-0 align-baseline"
            >
              <motion.span
                variants={wordVariants}
                className={`inline-block transform-gpu will-change-transform motion-reduce:transform-none motion-reduce:opacity-100 ${
                  isHighlight ? highlightClassName : ''
                }`}
              >
                {word}
              </motion.span>
            </span>
          );
        })}
      </span>
    </MotionComponent>
  );
};
