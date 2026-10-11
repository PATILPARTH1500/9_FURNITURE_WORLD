'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useSceneStore } from '@/store/useSceneStore';

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const { activeScene, scrollProgress, isReducedMotion } = useSceneStore();

  const currentPos = useRef(new THREE.Vector3(2.4, 1.3, 3.4));
  const currentTarget = useRef(new THREE.Vector3(0, 0.35, 0));
  const targetPos = useRef(new THREE.Vector3(2.4, 1.3, 3.4));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.35, 0));

  // Pointer parallax for subtle desktop engagement
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.35;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((_, delta) => {
    const lerpSpeed = Math.min(1, delta * 3.5);

    // Determine target camera coordinates based on activeScene & scrollProgress
    // We compute continuous camera paths across sections
    if (activeScene === 0) {
      // Hero: Push in subtly with scrollProgress within scene 0
      const heroPush = scrollProgress * 1.5;
      targetPos.current.set(
        2.4 - heroPush * 0.3,
        1.25 - heroPush * 0.15,
        3.4 - heroPush * 0.5
      );
      targetLookAt.current.set(0, 0.35, 0);
    } else if (activeScene === 1) {
      // Exploded engineering: Angled dynamic perspective
      targetPos.current.set(1.9, 1.3, 2.3);
      targetLookAt.current.set(0, 0.45, 0);
    } else if (activeScene === 2) {
      // Materials macro detail: Close-up on wood joint and cushion
      targetPos.current.set(1.4, 0.8, 1.6);
      targetLookAt.current.set(0.12, 0.38, 0.05);
    } else if (activeScene === 3) {
      // Interior reveal: Architectural pull back
      targetPos.current.set(3.6, 2.0, 4.4);
      targetLookAt.current.set(0, 0.35, 0);
    } else {
      // Scene 4 / Collections: Stable vantage
      targetPos.current.set(3.0, 1.7, 4.2);
      targetLookAt.current.set(0, 0.35, 0);
    }

    // Apply subtle parallax on position if reduced motion is disabled
    const parallaxX = isReducedMotion ? 0 : mouse.current.x;
    const parallaxY = isReducedMotion ? 0 : -mouse.current.y;

    currentPos.current.lerp(
      new THREE.Vector3(
        targetPos.current.x + parallaxX,
        targetPos.current.y + parallaxY,
        targetPos.current.z
      ),
      lerpSpeed
    );

    currentTarget.current.lerp(targetLookAt.current, lerpSpeed);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
};

