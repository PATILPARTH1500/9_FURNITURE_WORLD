'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ScrollStoryOverlay } from '@/components/landing/ScrollStoryOverlay';
import { CuratedCollectionSection } from '@/components/landing/CuratedCollectionSection';

// Dynamically import SceneCanvas with SSR disabled to guarantee clean WebGL hydration
const SceneCanvas = dynamic(
  () => import('@/components/3d/SceneCanvas').then((mod) => mod.SceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-charcoal-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <span className="w-8 h-8 border border-white/20 border-t-accent rounded-full animate-spin" />
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-sand-400">
            Calibrating Atelier 3D Space
          </span>
        </div>
      </div>
    ),
  }
);

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-charcoal-950 text-foreground">
      {/* Persistent 3D Canvas Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
        <SceneCanvas />
      </div>

      {/* GSAP Scroll-Driven 3D Story Overlay */}
      <ScrollStoryOverlay />

      {/* Permanent Collection & Discovery Section */}
      <CuratedCollectionSection />
    </main>
  );
}

