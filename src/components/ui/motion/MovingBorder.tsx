'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface MovingBorderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
}

export const MovingBorder: React.FC<MovingBorderProps> = ({
  borderRadius = '9999px',
  children,
  as: Component = 'button',
  containerClassName = '',
  borderClassName = '',
  duration = 3.5,
  className = '',
  ...otherProps
}) => {
  return (
    <Component
      className={`relative p-[1.5px] overflow-hidden group bg-transparent inline-flex items-center justify-center cursor-pointer select-none focus:outline-hidden focus-visible:ring-2 focus-visible:ring-tangerine ${containerClassName}`}
      style={{
        borderRadius,
      }}
      {...otherProps}
    >
      {/* Gliding Glowing Beam Container */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none -z-10"
        style={{ borderRadius }}
      >
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear',
          }}
          className={`absolute -inset-[100%] w-[300%] h-[300%] m-auto ${
            borderClassName ||
            'bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_280deg,#F4510B_320deg,#F59E0B_360deg)]'
          } motion-reduce:animate-none motion-reduce:rotate-0`}
        />
      </div>

      {/* Inner Content Layer */}
      <div
        className={`relative z-10 w-full h-full flex items-center justify-center transition-colors duration-300 ${className}`}
        style={{
          borderRadius: `calc(${borderRadius} - 1.5px)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
};

