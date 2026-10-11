'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { ContactShadows } from '@react-three/drei';

export const ResidenceScene: React.FC = () => {
  // ===========================================================================
  // PHYSICALLY BASED ARCHITECTURAL MATERIALS
  // ===========================================================================
  const materials = useMemo(() => {
    // 1. Honed Navona Travertine / Limestone
    const travertine = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#DED6C7'),
      roughness: 0.82,
      metalness: 0.02,
      bumpScale: 0.002,
    });

    // 2. Warm Architectural Plaster / Stucco (Walls & Ceilings)
    const plaster = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#EBE5DA'),
      roughness: 0.92,
      metalness: 0.0,
    });

    // 3. Darkened Architectural Ash / Kyoto Timber Partitions
    const darkWood = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2C2520'),
      roughness: 0.58,
      metalness: 0.08,
    });

    // 4. Natural Scandinavian Oak Flooring & Details
    const oakWood = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#CBB394'),
      roughness: 0.65,
      metalness: 0.04,
    });

    // 5. Architectural Glass (Floor-to-ceiling windows)
    const glass = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E8F1F5'),
      roughness: 0.08,
      transmission: 0.88,
      thickness: 0.5,
      transparent: true,
      opacity: 0.35,
      reflectivity: 0.85,
    });

    // 6. Brushed Architectural Bronze / Dark Steel (Mullions & Frames)
    const bronze = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#38322B'),
      roughness: 0.35,
      metalness: 0.88,
    });

    // 7. Fireplace Interior (Soot-blackened refractory stone)
    const firebox = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1A1817'),
      roughness: 0.95,
      metalness: 0.1,
    });

    // 8. Woven Wool & Linen Area Rug
    const rug = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#DFD7C8'),
      roughness: 0.98,
      metalness: 0.0,
    });

    // 9. Fireplace Birch Logs
    const logWood = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#786252'),
      roughness: 0.85,
      metalness: 0.0,
    });

    return {
      travertine,
      plaster,
      darkWood,
      oakWood,
      glass,
      bronze,
      firebox,
      rug,
      logWood,
    };
  }, []);

  return (
    <group name="ContinuousLuxuryResidence">
      {/* =========================================================================
          1. CONTINUOUS ARCHITECTURAL FLOORING
         ========================================================================= */}
      {/* Main Floor Slab (Travertine Limestone throughout Foyer, Salon, Dining) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 2]}
        receiveShadow
        material={materials.travertine}
      >
        <planeGeometry args={[36, 36]} />
      </mesh>

      {/* Bedroom Wing Floor (Warm Rift-Cut Natural Oak) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-9.5, 0.005, -8.5]}
        receiveShadow
        material={materials.oakWood}
      >
        <planeGeometry args={[11, 11]} />
      </mesh>

      {/* Living Room Hand-Woven Wool Rug */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0.2, 0.015, 3.2]}
        receiveShadow
        material={materials.rug}
      >
        <planeGeometry args={[6.2, 5.0]} />
      </mesh>

      {/* Dining Room Minimal Woven Rug */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[9.5, 0.015, 1.5]}
        receiveShadow
        material={materials.rug}
      >
        <planeGeometry args={[4.8, 3.2]} />
      </mesh>

      {/* Bedroom Plush Bedside Rug */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-8.5, 0.015, -7.8]}
        receiveShadow
        material={materials.rug}
      >
        <planeGeometry args={[4.2, 3.6]} />
      </mesh>

      {/* =========================================================================
          2. CEILING STRUCTURES (Warm Plaster Reveals with Stepped Coves)
         ========================================================================= */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 3.8, 2]}
        material={materials.plaster}
      >
        <planeGeometry args={[36, 36]} />
      </mesh>

      {/* =========================================================================
          3. ROOM 1: ENTRANCE FOYER (Z: 9 to 15, X: -4 to 4)
         ========================================================================= */}
      <group name="Foyer">
        {/* Rear Foyer Wall with Recessed Niche */}
        <mesh position={[0, 1.9, 15.5]} receiveShadow material={materials.plaster}>
          <boxGeometry args={[8.0, 3.8, 0.4]} />
        </mesh>

        {/* West Foyer Wall */}
        <mesh position={[-4.0, 1.9, 12.0]} receiveShadow material={materials.travertine}>
          <boxGeometry args={[0.4, 3.8, 7.0]} />
        </mesh>

        {/* East Foyer Wall with Fluted Architectural Limestone Columns */}
        <mesh position={[4.0, 1.9, 12.0]} receiveShadow material={materials.travertine}>
          <boxGeometry args={[0.4, 3.8, 7.0]} />
        </mesh>

        {/* Architectural Entrance Portal Archway (Transition Foyer -> Salon) */}
        {/* Left Portal Jamb */}
        <mesh position={[-2.8, 1.9, 8.5]} receiveShadow material={materials.travertine}>
          <boxGeometry args={[2.0, 3.8, 0.5]} />
        </mesh>
        {/* Right Portal Jamb */}
        <mesh position={[2.8, 1.9, 8.5]} receiveShadow material={materials.travertine}>
          <boxGeometry args={[2.0, 3.8, 0.5]} />
        </mesh>
        {/* Top Portal Lintel */}
        <mesh position={[0, 3.4, 8.5]} receiveShadow material={materials.travertine}>
          <boxGeometry args={[3.8, 0.8, 0.5]} />
        </mesh>
      </group>

      {/* =========================================================================
          4. ROOM 2: MAIN LIVING SALON (Z: -1 to 8, X: -6 to 6)
         ========================================================================= */}
      <group name="LivingSalon">
        {/* West Wall: Massive Travertine Fireplace Feature */}
        {/* South Segment of West Wall */}
        <mesh position={[-5.8, 1.9, 5.8]} receiveShadow material={materials.travertine}>
          <boxGeometry args={[0.4, 3.8, 5.0]} />
        </mesh>

        {/* North Segment of West Wall */}
        <mesh position={[-5.8, 1.9, 0.5]} receiveShadow material={materials.travertine}>
          <boxGeometry args={[0.4, 3.8, 3.0]} />
        </mesh>

        {/* Recessed Travertine Fireplace Chimney Breast */}
        <mesh position={[-5.5, 2.2, 2.8]} castShadow receiveShadow material={materials.travertine}>
          <boxGeometry args={[0.8, 3.2, 3.2]} />
        </mesh>

        {/* Cantilevered Travertine Fireplace Hearth Shelf */}
        <mesh position={[-5.1, 0.35, 2.8]} castShadow receiveShadow material={materials.travertine}>
          <boxGeometry args={[1.5, 0.25, 3.6]} />
        </mesh>

        {/* Blackened Steel Firebox Cavity */}
        <mesh position={[-5.25, 0.85, 2.8]} material={materials.firebox}>
          <boxGeometry args={[0.5, 0.75, 1.6]} />
        </mesh>

        {/* Stacked Birch Fireplace Logs */}
        <mesh position={[-5.15, 0.58, 2.8]} castShadow material={materials.logWood}>
          <cylinderGeometry args={[0.07, 0.07, 0.8, 12]} />
        </mesh>
        <mesh position={[-5.15, 0.68, 2.85]} rotation={[0, 0.2, 0]} castShadow material={materials.logWood}>
          <cylinderGeometry args={[0.065, 0.065, 0.75, 12]} />
        </mesh>

        {/* East Glazing: Floor-to-Ceiling Minimal Sliding Doors to Garden */}
        {/* Glass Panes */}
        <mesh position={[5.8, 1.9, 3.5]} material={materials.glass}>
          <boxGeometry args={[0.08, 3.6, 9.0]} />
        </mesh>
        {/* Bronze Door Mullions */}
        <mesh position={[5.8, 1.9, -0.9]} material={materials.bronze}>
          <boxGeometry args={[0.12, 3.8, 0.12]} />
        </mesh>
        <mesh position={[5.8, 1.9, 3.5]} material={materials.bronze}>
          <boxGeometry args={[0.12, 3.8, 0.12]} />
        </mesh>
        <mesh position={[5.8, 1.9, 7.9]} material={materials.bronze}>
          <boxGeometry args={[0.12, 3.8, 0.12]} />
        </mesh>
      </group>

      {/* =========================================================================
          5. ROOM 3: DINING WING (X: 5 to 14, Z: -6 to 2)
         ========================================================================= */}
      <group name="DiningWing">
        {/* East Wall Glazing overlooking Courtyard */}
        <mesh position={[13.8, 1.9, -2.0]} material={materials.glass}>
          <boxGeometry args={[0.08, 3.6, 7.5]} />
        </mesh>
        <mesh position={[13.8, 1.9, -2.0]} material={materials.bronze}>
          <boxGeometry args={[0.12, 3.8, 0.12]} />
        </mesh>

        {/* North Wall: Warm Stucco Plaster */}
        <mesh position={[9.5, 1.9, -5.8]} receiveShadow material={materials.plaster}>
          <boxGeometry args={[8.5, 3.8, 0.4]} />
        </mesh>

        {/* Partition between Salon and Dining with Architectural Portal */}
        <mesh position={[5.8, 1.9, -3.5]} receiveShadow material={materials.travertine}>
          <boxGeometry args={[0.4, 3.8, 4.4]} />
        </mesh>

        {/* Suspended Minimalist Linear Dining Luminaire */}
        <group position={[9.5, 2.6, 1.5]}>
          {/* Bronze Horizontal Beam */}
          <mesh material={materials.bronze}>
            <boxGeometry args={[2.4, 0.04, 0.04]} />
          </mesh>
          {/* Dual Drop Cables */}
          <mesh position={[-0.9, 0.55, 0]} material={materials.bronze}>
            <cylinderGeometry args={[0.003, 0.003, 1.1]} />
          </mesh>
          <mesh position={[0.9, 0.55, 0]} material={materials.bronze}>
            <cylinderGeometry args={[0.003, 0.003, 1.1]} />
          </mesh>
          {/* Warm Diffuser Underside */}
          <mesh position={[0, -0.025, 0]}>
            <boxGeometry args={[2.3, 0.015, 0.03]} />
            <meshBasicMaterial color="#FFF5E5" />
          </mesh>
        </group>
      </group>

      {/* =========================================================================
          6. GALLERY CORRIDOR & BEDROOM SANCTUARY (X: -14 to -5, Z: -14 to -2)
         ========================================================================= */}
      <group name="BedroomSanctuary">
        {/* Corridor Partition */}
        <mesh position={[-2.8, 1.9, -2.2]} receiveShadow material={materials.plaster}>
          <boxGeometry args={[5.6, 3.8, 0.4]} />
        </mesh>
        <mesh position={[-5.8, 1.9, -4.0]} receiveShadow material={materials.plaster}>
          <boxGeometry args={[0.4, 3.8, 3.5]} />
        </mesh>

        {/* Bedroom Rear Wall: Rift-Cut White Oak Architectural Paneling */}
        <mesh position={[-9.5, 1.9, -13.8]} receiveShadow material={materials.oakWood}>
          <boxGeometry args={[8.0, 3.8, 0.4]} />
        </mesh>

        {/* Bedroom West Wall with Deep Corner Window */}
        <mesh position={[-13.8, 1.9, -10.5]} material={materials.glass}>
          <boxGeometry args={[0.08, 3.6, 6.5]} />
        </mesh>
        <mesh position={[-13.8, 1.9, -5.5]} receiveShadow material={materials.plaster}>
          <boxGeometry args={[0.4, 3.8, 3.5]} />
        </mesh>
      </group>

      {/* =========================================================================
          7. SUNLIT OUTDOOR COURTYARD & REFLECTING BASIN (Beyond East Glass)
         ========================================================================= */}
      <group name="Courtyard">
        {/* Outdoor Terrace Travertine Pavers */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10.5, -0.04, 8.0]} material={materials.travertine}>
          <planeGeometry args={[14, 14]} />
        </mesh>

        {/* Reflecting Pool Basin */}
        <mesh position={[10.0, -0.15, 8.5]}>
          <boxGeometry args={[5.5, 0.25, 4.0]} />
          <meshStandardMaterial color="#303A40" roughness={0.4} />
        </mesh>
        {/* Water Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10.0, -0.03, 8.5]}>
          <planeGeometry args={[5.3, 3.8]} />
          <meshStandardMaterial
            color="#4A6572"
            roughness={0.05}
            metalness={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
      </group>

      {/* =========================================================================
          8. ARCHITECTURAL LIGHTING & SUNSHINE
         ========================================================================= */}
      {/* Soft warm ambient sky base */}
      <ambientLight intensity={0.75} color="#FFFBF5" />

      {/* Primary Key Sunlight streaming through East Patio Doors */}
      <directionalLight
        position={[12, 10, 8]}
        intensity={2.2}
        color="#FFF4E6"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={32}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0001}
      />

      {/* Secondary Soft Fill Light from skylights */}
      <directionalLight position={[-8, 8, -5]} intensity={0.5} color="#D8E2EC" />

      {/* Warm Ambient Hearth Glow */}
      <pointLight position={[-5.1, 0.7, 2.8]} intensity={0.8} color="#E8A86B" distance={4.5} />

      {/* Contact Shadows across living & dining areas */}
      <ContactShadows
        position={[0, 0.001, 2]}
        opacity={0.65}
        scale={28}
        blur={2}
        far={3}
        color="#0A0908"
      />
    </group>
  );
};
