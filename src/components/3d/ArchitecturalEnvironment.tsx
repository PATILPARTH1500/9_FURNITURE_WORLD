'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { useSceneStore } from '@/store/useSceneStore';

export const ArchitecturalEnvironment: React.FC = () => {
  const roomGroupRef = useRef<THREE.Group>(null);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);
  const { activeScene, scrollProgress } = useSceneStore();

  useFrame((_, delta) => {
    const lerpSpeed = Math.min(1, delta * 4);

    // In Scene 3 & 4 (Interior reveal), the architectural environment becomes prominent
    if (roomGroupRef.current) {
      // Smoothly transition room visibility/scale
      const targetOpacity = activeScene >= 3 ? 1 : Math.max(0, (scrollProgress - 0.5) * 2);
      roomGroupRef.current.position.y = THREE.MathUtils.lerp(
        roomGroupRef.current.position.y,
        activeScene >= 3 ? 0 : -0.5,
        lerpSpeed
      );
    }

    if (sunLightRef.current) {
      const targetIntensity = activeScene >= 3 ? 2.4 : 1.4;
      sunLightRef.current.intensity = THREE.MathUtils.lerp(
        sunLightRef.current.intensity,
        targetIntensity,
        lerpSpeed
      );
    }
  });

  return (
    <group>
      {/* =========================================================================
          KEY & AMBIENT LIGHTING
         ========================================================================= */}
      {/* Warm ambient studio base */}
      <ambientLight intensity={0.7} color="#FFF8F0" />

      {/* Main directional key sun light */}
      <directionalLight
        ref={sunLightRef}
        position={[4.5, 6.5, 4.0]}
        intensity={1.5}
        color="#FFEED9"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0001}
      />

      {/* Soft cool fill light from opposite angle */}
      <directionalLight position={[-4, 3, -2]} intensity={0.5} color="#DDE4EC" />

      {/* Subtle warm rim light to accentuate silhouette */}
      <pointLight position={[0, 3, -3.5]} intensity={0.8} color="#D19A66" />

      {/* =========================================================================
          GROUND & REALISTIC CONTACT SHADOWS
         ========================================================================= */}
      {/* Soft ambient contact shadows directly beneath the chair */}
      <ContactShadows
        position={[0, -0.305, 0]}
        opacity={0.65}
        scale={6}
        blur={2}
        far={2.5}
        color="#080706"
      />

      {/* Floor surface */}
      <mesh position={[0, -0.31, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#121110" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* =========================================================================
          SCENE 4: ARCHITECTURAL GALLERY ROOM & STONE PEDESTAL
         ========================================================================= */}
      <group ref={roomGroupRef} position={[0, 0, 0]}>
        {/* Low Minimalist Honed Travertine Plinth / Pedestal */}
        <mesh position={[0, -0.35, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.4, 1.45, 0.08, 48]} />
          <meshStandardMaterial
            color="#22201D"
            roughness={0.7}
            metalness={0.05}
          />
        </mesh>

        {/* Outer concentric bronze architectural ring on floor */}
        <mesh position={[0, -0.308, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.515, 64]} />
          <meshBasicMaterial color="#D19A66" opacity={0.25} transparent />
        </mesh>

        {/* Distant Minimal Architectural Wall */}
        <group position={[0, 2.5, -4.5]}>
          <mesh receiveShadow>
            <planeGeometry args={[18, 8]} />
            <meshStandardMaterial color="#141312" roughness={0.92} metalness={0.02} />
          </mesh>

          {/* Architectural Vertical Slit Accent */}
          <mesh position={[-2.8, 0, 0.02]}>
            <planeGeometry args={[0.08, 6]} />
            <meshBasicMaterial color="#FAF8F5" opacity={0.08} transparent />
          </mesh>
        </group>
      </group>
    </group>
  );
};

