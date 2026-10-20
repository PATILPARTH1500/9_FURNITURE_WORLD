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
  stagger = 0.04,
  once = true,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once, margin: '0px 0px 80px 0px' });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [forcedVisible, setForcedVisible] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(media.matches);
    const listener = () => setPrefersReducedMotion(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  // Safety fallback: ensure text never remains invisible if scroll triggered abruptly
  useEffect(() => {
    const timer = setTimeout(() => {
      setForcedVisible(true);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  if (prefersReducedMotion) {
    return (
      <Component className={className}>
        {highlightText && text.includes(highlightText) ? (
          <>
            {text.split(highlightText)[0]}
            <span className={highlightClassName}>{highlightText}</span>
            {text.split(highlightText)[1]}
          </>
        ) : (
          text
        )}
      </Component>
    );
  }

  const words = text.split(' ');
  const shouldAnimate = isInView || forcedVisible;

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
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.42,
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
              className="inline-block overflow-hidden align-baseline mr-[0.26em] last:mr-0"
            >
              <motion.span
                variants={wordVariants}
                className={`inline-block transform-gpu ${
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
