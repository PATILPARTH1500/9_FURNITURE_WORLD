'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface InteractiveLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
  underlineColor?: string; // e.g. "bg-tangerine"
  arrowClassName?: string;
  onClick?: () => void;
  external?: boolean;
}

export const InteractiveLink: React.FC<InteractiveLinkProps> = ({
  href,
  children,
  className = '',
  showArrow = true,
  underlineColor = 'bg-tangerine',
  arrowClassName = 'text-tangerine',
  onClick,
  external = false,
}) => {
  const content = (
    <span className={`group inline-flex items-center space-x-1 relative py-0.5 font-medium transition-colors ${className}`}>
      <span className="relative">
        {children}
        <span
          className={`absolute bottom-0 left-0 w-0 h-[1.5px] ${underlineColor} rounded-full transition-all duration-300 ease-out group-hover:w-full`}
          aria-hidden="true"
        />
      </span>
      {showArrow && (
        <ArrowUpRight
          className={`w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${arrowClassName}`}
          aria-hidden="true"
        />
      )}
    </span>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className="inline-block focus:outline-hidden focus-visible:ring-1 focus-visible:ring-tangerine rounded-sm"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-block focus:outline-hidden focus-visible:ring-1 focus-visible:ring-tangerine rounded-sm"
    >
      {content}
    </Link>
  );
};

