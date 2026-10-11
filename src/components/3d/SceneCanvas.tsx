'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { FurnitureModel } from './FurnitureModel';
import { ArchitecturalEnvironment } from './ArchitecturalEnvironment';
import { CameraController } from './CameraController';
import { useSceneStore } from '@/store/useSceneStore';
import Image from 'next/image';

interface SceneCanvasProps {
  className?: string;
}

export const SceneCanvas: React.FC<SceneCanvasProps> = ({ className = '' }) => {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const { setReducedMotion, setModelReady } = useSceneStore();

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglSupported(!!gl);
    } catch {
      setWebglSupported(false);
    }

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [setReducedMotion]);

  if (webglSupported === false) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-charcoal-950 text-sand-300 p-8 text-center">
        <div className="relative w-72 h-72 mb-6 border border-white/10">
          <Image
            src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80"
            alt="Kronos Lounge Chair"
            fill
            className="object-cover"
          />
        </div>
        <p className="font-serif text-lg text-ivory">Hardware Acceleration Unavailable</p>
        <p className="text-xs text-sand-400 max-w-sm mt-2">
          Your browser or device does not have WebGL enabled. Viewing static architectural representation.
        </p>
      </div>
    );
  }

  return (
    <div className={`canvas-container relative w-full h-full ${className}`}>
      <Canvas
        shadows
        camera={{ position: [2.4, 1.3, 3.4], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        onCreated={() => setModelReady(true)}
      >
        <Suspense fallback={null}>
          <CameraController />
          <ArchitecturalEnvironment />
          <FurnitureModel interactive={true} />
        </Suspense>
      </Canvas>
    </div>
  );
};

