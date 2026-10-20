'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

export interface DirectionAwareHoverProps {
  imageUrl: string;
  imageAlt?: string;
  children: React.ReactNode;
  childrenClassName?: string;
  imageClassName?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export const DirectionAwareHover: React.FC<DirectionAwareHoverProps> = ({
  imageUrl,
  imageAlt = 'Furniture Showcase',
  children,
  childrenClassName = '',
  imageClassName = '',
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const dir = getDirection(event, ref.current);
    switch (dir) {
      case 0:
        setDirection('top');
        break;
      case 1:
        setDirection('right');
        break;
      case 2:
        setDirection('bottom');
        break;
      case 3:
        setDirection('left');
        break;
      default:
        setDirection('bottom');
        break;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;
    const dir = getDirection(event, ref.current);
    switch (dir) {
      case 0:
        setDirection('top');
        break;
      case 1:
        setDirection('right');
        break;
      case 2:
        setDirection('bottom');
        break;
      case 3:
        setDirection('left');
        break;
      default:
        setDirection('bottom');
        break;
    }
    setIsHovered(false);
  };

  const getDirection = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    obj: HTMLElement
  ) => {
    const { width: w, height: h, left, top } = obj.getBoundingClientRect();
    const x = ev.clientX - left - (w / 2) * (w > h ? h / w : 1);
    const y = ev.clientY - top - (h / 2) * (h > w ? w / h : 1);
    const d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
    return d;
  };

  const variants = {
    initial: {
      x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
      y: direction === 'top' ? '-100%' : direction === 'bottom' ? '100%' : 0,
      opacity: 0,
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
      y: direction === 'top' ? '-100%' : direction === 'bottom' ? '100%' : 0,
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden group/direction rounded-3xl ${className}`}
    >
      <div className="relative w-full h-full overflow-hidden">
        <motion.div
          animate={{
            scale: isHovered ? 1.06 : 1,
          }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative w-full h-full"
        >
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes={sizes}
            priority={priority}
            className={`object-cover ${imageClassName}`}
          />
        </motion.div>

        {/* Ambient Darkened Gradient for visual clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

        {/* Direction-Aware Sliding Overlay Layer */}
        <AnimatePresence mode="wait">
          {isHovered && (
            <motion.div
              key="overlay"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={variants}
              className={`absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none motion-reduce:transform-none ${childrenClassName}`}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Static Mobile/Touch Fallback (< md) so touch users always see essential content */}
        <div className="md:hidden absolute inset-0 z-10 flex flex-col justify-end p-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

