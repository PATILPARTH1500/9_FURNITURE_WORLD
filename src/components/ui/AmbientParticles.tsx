'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  color: string;
}

interface AmbientParticlesProps {
  className?: string;
  count?: number;
  tint?: 'gold' | 'tangerine' | 'mixed';
  opacity?: number;
}

export const AmbientParticles: React.FC<AmbientParticlesProps> = ({
  className = '',
  count = 20,
  tint = 'mixed',
  opacity = 0.25,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect reduced motion preference and small mobile viewports
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    const colors =
      tint === 'gold'
        ? ['#F4B82E', '#E6C280', '#FAF8F5']
        : tint === 'tangerine'
        ? ['#F4510B', '#FF6F36', '#FAF8F5']
        : ['#F4B82E', '#F4510B', '#E6C280', '#FAF8F5'];

    // Initialize sparse particles
    const particles: Particle[] = Array.from({ length: count }, () => {
      const maxAlpha = 0.15 + Math.random() * 0.25;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 1.2 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -0.1 - Math.random() * 0.2, // Gentle upward drift
        alpha: Math.random() * maxAlpha,
        maxAlpha,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges smoothly
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * opacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [count, tint, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none z-10 ${className}`}
      aria-hidden="true"
    />
  );
};

