'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraController } from './CameraController';
import { ResidenceScene } from './ResidenceScene';
import { FurnitureCollectionModels } from './FurnitureCollectionModels';
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
            src="/images/film/interior-villa.jpg"
            alt="Atelier Archetyp Continuous Residence"
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
        camera={{ position: [0.6, 1.45, 14.8], fov: 40 }}
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
          <ResidenceScene />
          <FurnitureCollectionModels />
        </Suspense>
      </Canvas>
    </div>
  );
};
