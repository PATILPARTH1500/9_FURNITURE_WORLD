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

    if (roomGroupRef.current) {
      // In Scene 3 & 4 (Interior reveal), the architectural environment expands gracefully
      roomGroupRef.current.position.y = THREE.MathUtils.lerp(
        roomGroupRef.current.position.y,
        activeScene >= 3 ? 0 : -0.25,
        lerpSpeed
      );
    }

    if (sunLightRef.current) {
      // Increase warm golden sunlight intensity during interior reveal
      const targetIntensity = activeScene >= 3 ? 2.2 : 1.5;
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
          KEY, FILL & SILHOUETTE RIM LIGHTING
         ========================================================================= */}
      {/* Soft warm ambient base */}
      <ambientLight intensity={0.8} color="#FFFBF5" />

      {/* Main architectural key light (warm sunlight angle) */}
      <directionalLight
        ref={sunLightRef}
        position={[4.2, 5.8, 3.8]}
        intensity={1.5}
        color="#FFF4E6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.00015}
      />

      {/* Soft cool ambient fill from opposite quarter */}
      <directionalLight position={[-4, 3.5, -2.5]} intensity={0.4} color="#D8E2EC" />

      {/* Warm golden rim backlight defining wood contours & cushion piping */}
      <pointLight position={[0, 2.8, -3.2]} intensity={0.9} color="#D4A06A" />

      {/* Soft under-plinth bounce */}
      <pointLight position={[0, -0.1, 0]} intensity={0.3} color="#AE997B" />

      {/* =========================================================================
          REALISTIC CONTACT SHADOWS
         ========================================================================= */}
      <ContactShadows
        position={[0, -0.325, 0]}
        opacity={0.7}
        scale={6.5}
        blur={2.4}
        far={2.8}
        color="#080706"
      />

      {/* Seamless Studio Cyclorama Floor */}
      <mesh position={[0, -0.33, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[45, 45]} />
        <meshStandardMaterial color="#0E0D0C" roughness={0.92} metalness={0.04} />
      </mesh>

      {/* =========================================================================
          ARCHITECTURAL GALLERY ENVIRONMENT & TRAVERTINE PLINTH
         ========================================================================= */}
      <group ref={roomGroupRef} position={[0, 0, 0]}>
        {/* Minimalist Honed Travertine Pedestal Plinth */}
        <mesh position={[0, -0.36, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[1.45, 1.5, 0.065, 64]} />
          <meshStandardMaterial
            color="#1F1D1B"
            roughness={0.68}
            metalness={0.06}
          />
        </mesh>

        {/* Concentric Brushed Brass Inlay Ribbon */}
        <mesh position={[0, -0.326, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.52, 1.535, 64]} />
          <meshBasicMaterial color="#D19A66" opacity={0.3} transparent />
        </mesh>

        {/* Distant Architectural Gallery Curved Backdrop (Seamless Cyc) */}
        <mesh position={[0, 2.5, -5.5]} receiveShadow>
          <planeGeometry args={[26, 12]} />
          <meshStandardMaterial color="#0F0E0D" roughness={0.95} metalness={0.02} />
        </mesh>
      </group>
    </group>
  );
};
