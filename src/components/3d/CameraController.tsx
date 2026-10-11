'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useSceneStore } from '@/store/useSceneStore';

interface CameraWaypoint {
  pos: [number, number, number];
  lookAt: [number, number, number];
  mobilePos: [number, number, number];
  mobileLookAt: [number, number, number];
}

const RESIDENCE_WAYPOINTS: CameraWaypoint[] = [
  // 0. Entrance Foyer
  {
    pos: [0.6, 1.45, 14.8],
    lookAt: [-0.3, 0.55, 11.5],
    mobilePos: [0.3, 1.5, 16.2],
    mobileLookAt: [-0.2, 0.55, 11.5],
  },
  // 1. Main Living Salon Entry
  {
    pos: [1.8, 1.6, 7.2],
    lookAt: [-0.6, 0.65, 3.8],
    mobilePos: [1.2, 1.7, 8.5],
    mobileLookAt: [-0.4, 0.65, 3.8],
  },
  // 2. Fireside Kronos Lounge Chair Focal
  {
    pos: [-2.0, 1.15, 3.8],
    lookAt: [-3.2, 0.65, 2.8],
    mobilePos: [-1.8, 1.25, 4.5],
    mobileLookAt: [-3.2, 0.65, 2.8],
  },
  // 3. Dining Wing Monolith
  {
    pos: [6.8, 1.5, 2.8],
    lookAt: [9.5, 0.75, 1.5],
    mobilePos: [6.2, 1.65, 3.8],
    mobileLookAt: [9.5, 0.75, 1.5],
  },
  // 4. Master Bedroom Sanctuary
  {
    pos: [-6.8, 1.45, -6.5],
    lookAt: [-9.5, 0.75, -9.5],
    mobilePos: [-6.2, 1.6, -5.2],
    mobileLookAt: [-9.5, 0.75, -9.5],
  },
  // 5. Architectural Vista Panorama
  {
    pos: [3.2, 3.8, 12.5],
    lookAt: [0.5, 0.8, 2.0],
    mobilePos: [2.0, 4.5, 14.5],
    mobileLookAt: [0.5, 0.8, 2.0],
  },
];

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const { activeRoomIndex, scrollProgress, isReducedMotion } = useSceneStore();

  const currentPos = useRef(new THREE.Vector3(0.6, 1.45, 14.8));
  const currentTarget = useRef(new THREE.Vector3(-0.3, 0.55, 11.5));
  const targetPos = useRef(new THREE.Vector3(0.6, 1.45, 14.8));
  const targetLookAt = useRef(new THREE.Vector3(-0.3, 0.55, 11.5));

  const mouse = useRef({ x: 0, y: 0 });
  const isMobileRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      isMobileRef.current = window.innerWidth < 768;
    };
    checkMobile();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.16;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 0.12;
    };

    window.addEventListener('resize', checkMobile);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame((_, delta) => {
    const isMobile = isMobileRef.current;
    const lerpSpeed = Math.min(1, delta * 3.6);

    // Compute continuous waypoint interpolation based on scrollProgress across 6 stages
    const totalWaypoints = RESIDENCE_WAYPOINTS.length;
    const progress = Math.max(0, Math.min(0.9999, scrollProgress));
    const segment = progress * (totalWaypoints - 1);
    const indexA = Math.floor(segment);
    const indexB = Math.min(totalWaypoints - 1, indexA + 1);
    const blend = segment - indexA;

    // Smooth hermite ease for segment transitions
    const easedBlend = blend * blend * (3 - 2 * blend);

    const wpA = RESIDENCE_WAYPOINTS[indexA];
    const wpB = RESIDENCE_WAYPOINTS[indexB];

    const posA = isMobile ? wpA.mobilePos : wpA.pos;
    const posB = isMobile ? wpB.mobilePos : wpB.pos;
    const lookA = isMobile ? wpA.mobileLookAt : wpA.lookAt;
    const lookB = isMobile ? wpB.mobileLookAt : wpB.lookAt;

    // Interpolate positions
    targetPos.current.set(
      THREE.MathUtils.lerp(posA[0], posB[0], easedBlend),
      THREE.MathUtils.lerp(posA[1], posB[1], easedBlend),
      THREE.MathUtils.lerp(posA[2], posB[2], easedBlend)
    );

    targetLookAt.current.set(
      THREE.MathUtils.lerp(lookA[0], lookB[0], easedBlend),
      THREE.MathUtils.lerp(lookA[1], lookB[1], easedBlend),
      THREE.MathUtils.lerp(lookA[2], lookB[2], easedBlend)
    );

    // Add subtle ambient mouse parallax
    if (!isReducedMotion) {
      targetPos.current.x += mouse.current.x;
      targetPos.current.y += mouse.current.y;
    }

    // Smoothly damp camera vectors
    currentPos.current.lerp(targetPos.current, lerpSpeed);
    currentTarget.current.lerp(targetLookAt.current, lerpSpeed);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
};
