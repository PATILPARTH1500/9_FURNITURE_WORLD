'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useSceneStore } from '@/store/useSceneStore';

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const { activeScene, scrollProgress, isReducedMotion } = useSceneStore();

  const currentPos = useRef(new THREE.Vector3(1.75, 1.25, 3.2));
  const currentTarget = useRef(new THREE.Vector3(-0.45, 0.35, 0));
  const targetPos = useRef(new THREE.Vector3(1.75, 1.25, 3.2));
  const targetLookAt = useRef(new THREE.Vector3(-0.45, 0.35, 0));

  const mouse = useRef({ x: 0, y: 0 });
  const isMobileRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth < 768;
    };
    checkMobile();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.25;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 0.18;
    };

    window.addEventListener('resize', checkMobile);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame((_, delta) => {
    const lerpSpeed = Math.min(1, delta * 3.8);
    const isMobile = isMobileRef.current;

    if (isMobile) {
      // Responsive Mobile Framing (centered, lower elevation, wider distance)
      if (activeScene === 0) {
        const heroPush = Math.min(1, scrollProgress * 1.5);
        targetPos.current.set(1.9 - heroPush * 0.2, 1.35 - heroPush * 0.1, 4.2 - heroPush * 0.4);
        targetLookAt.current.set(0, -0.05, 0);
      } else if (activeScene === 1) {
        targetPos.current.set(1.6, 1.45, 3.5);
        targetLookAt.current.set(0, 0.15, 0);
      } else if (activeScene === 2) {
        targetPos.current.set(1.4, 1.0, 2.7);
        targetLookAt.current.set(0, 0.2, 0);
      } else if (activeScene === 3) {
        targetPos.current.set(3.2, 2.0, 5.0);
        targetLookAt.current.set(0, 0.05, 0);
      } else {
        targetPos.current.set(2.4, 1.6, 4.2);
        targetLookAt.current.set(0, 0.1, 0);
      }
    } else {
      // Desktop Framing: Positions chair in right 60% of viewport, leaving left side for editorial copy
      if (activeScene === 0) {
        const heroPush = Math.min(1, scrollProgress * 1.6);
        targetPos.current.set(
          1.75 - heroPush * 0.22,
          1.25 - heroPush * 0.1,
          3.2 - heroPush * 0.42
        );
        targetLookAt.current.set(-0.45, 0.35, 0);
      } else if (activeScene === 1) {
        targetPos.current.set(1.55, 1.35, 2.7);
        targetLookAt.current.set(-0.38, 0.42, 0);
      } else if (activeScene === 2) {
        targetPos.current.set(1.65, 0.85, 2.0);
        targetLookAt.current.set(0.55, 0.35, 0);
      } else if (activeScene === 3) {
        targetPos.current.set(2.7, 1.85, 4.3);
        targetLookAt.current.set(-0.42, 0.35, 0);
      } else {
        targetPos.current.set(2.5, 1.5, 3.8);
        targetLookAt.current.set(-0.1, 0.35, 0);
      }
    }

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
