'use client';

import React from 'react';

export interface TextRollProps {
  children: string;
  className?: string;
  stagger?: number; // Stagger delay per character in seconds (default 0.014)
  duration?: number; // Duration of roll in seconds (default 0.32)
  useParentGroup?: boolean; // If true, triggers on parent's group-hover (default true)
}

/**
 * TextRoll Component (inspired by Skiper UI 58)
 *
 * Duplicates each character vertically inside an overflow-hidden slot.
 * On hover (or parent group-hover), the top character slides up while the bottom
 * duplicate rolls into place with an editorial spring-eased curve.
 *
 * - Zero layout shift (strictly transform-based inside a fixed line-height box).
 * - Full accessibility: screen readers read plain text once via sr-only; visual spans aria-hidden.
 * - Deterministic SSR & client render matching: 0 hydration mismatch.
 * - Automatic reduced-motion bypass via motion-reduce Tailwind utilities.
 */
export const TextRoll: React.FC<TextRollProps> = ({
  children,
  className = '',
  stagger = 0.014,
  duration = 0.32,
  useParentGroup = true,
}) => {
  const chars = children.split('');

  // Pure CSS trigger classes that work identically during SSR and client hydration
  const rollTriggerClass = useParentGroup
    ? 'group-hover:-translate-y-full group-focus-visible:-translate-y-full'
    : 'hover:-translate-y-full focus-visible:-translate-y-full';

  return (
    <span
      className={`inline-flex items-center relative leading-none select-none ${className}`}
    >
      {/* 1. Accessible text for screen readers */}
      <span className="sr-only">{children}</span>

      {/* 2. Visual rolling characters */}
      <span aria-hidden="true" className="inline-flex items-center">
        {chars.map((char, index) => {
          if (char === ' ') {
            return (
              <span key={`space-${index}`} className="inline-block w-[0.28em]">
                &nbsp;
              </span>
            );
          }

          const delaySeconds = index * stagger;

          return (
            <span
              key={`char-${index}`}
              className="relative inline-flex flex-col h-[1.18em] overflow-hidden align-baseline"
            >
              {/* Primary character */}
              <span
                style={{
                  transitionDuration: `${duration}s`,
                  transitionDelay: `${delaySeconds}s`,
                }}
                className={`inline-block transform-gpu transition-transform ease-[cubic-bezier(0.2,1,0.3,1)] motion-reduce:transform-none motion-reduce:transition-none ${rollTriggerClass}`}
              >
                {char}
              </span>

              {/* Rolling duplicate character positioned directly below */}
              <span
                style={{
                  transitionDuration: `${duration}s`,
                  transitionDelay: `${delaySeconds}s`,
                }}
                className={`absolute top-full left-0 inline-block transform-gpu transition-transform ease-[cubic-bezier(0.2,1,0.3,1)] motion-reduce:transform-none motion-reduce:transition-none ${rollTriggerClass}`}
              >
                {char}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
};

