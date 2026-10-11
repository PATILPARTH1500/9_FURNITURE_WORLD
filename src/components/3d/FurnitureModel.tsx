'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSceneStore } from '@/store/useSceneStore';
import { WOOD_MATERIALS, UPHOLSTERY_MATERIALS, FLAGSHIP_PRODUCT } from '@/data/catalog';

interface FurnitureModelProps {
  interactive?: boolean;
}

export const FurnitureModel: React.FC<FurnitureModelProps> = ({ interactive = true }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Mesh part refs for exploded transformations
  const cushionRef = useRef<THREE.Group>(null);
  const backrestRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const seatFrameRef = useRef<THREE.Group>(null);
  const legsRef = useRef<THREE.Group>(null);
  const joineryRef = useRef<THREE.Group>(null);

  const {
    scrollProgress,
    activeScene,
    explodedProgress,
    selectedWoodId,
    selectedFabricId,
    activeAnnotationId,
    setActiveAnnotation,
    isReducedMotion,
  } = useSceneStore();

  // Find active materials
  const currentWood = useMemo(
    () => WOOD_MATERIALS.find((m) => m.id === selectedWoodId) || WOOD_MATERIALS[0],
    [selectedWoodId]
  );

  const currentFabric = useMemo(
    () => UPHOLSTERY_MATERIALS.find((m) => m.id === selectedFabricId) || UPHOLSTERY_MATERIALS[0],
    [selectedFabricId]
  );

  // Reusable PBR Materials with smooth color/roughness transitions
  const woodMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(currentWood.colorHex),
      roughness: currentWood.roughness,
      metalness: currentWood.metalness,
      envMapIntensity: 0.8,
    });
  }, [currentWood]);

  const upholsteryMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(currentFabric.colorHex),
      roughness: currentFabric.roughness,
      metalness: currentFabric.metalness,
      envMapIntensity: 0.5,
    });
  }, [currentFabric]);

  const brassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D19A66'),
      roughness: 0.28,
      metalness: 0.88,
      envMapIntensity: 1.2,
    });
  }, []);

  const steelHardwareMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#3A3A3A'),
      roughness: 0.4,
      metalness: 0.8,
    });
  }, []);

  // Update material colors smoothly on frame
  useFrame((_, delta) => {
    const lerpSpeed = Math.min(1, delta * 6);
    woodMaterial.color.lerp(new THREE.Color(currentWood.colorHex), lerpSpeed);
    woodMaterial.roughness = THREE.MathUtils.lerp(woodMaterial.roughness, currentWood.roughness, lerpSpeed);

    upholsteryMaterial.color.lerp(new THREE.Color(currentFabric.colorHex), lerpSpeed);
    upholsteryMaterial.roughness = THREE.MathUtils.lerp(upholsteryMaterial.roughness, currentFabric.roughness, lerpSpeed);

    // Controlled idle rotation in hero scene (Scene 0)
    if (groupRef.current) {
      if (activeScene === 0 && !isReducedMotion) {
        groupRef.current.rotation.y = Math.sin(Date.now() * 0.0006) * 0.12;
      } else if (activeScene === 3) {
        // Subtle interior perspective angle
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -0.25, lerpSpeed);
      } else {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, lerpSpeed);
      }
    }

    // Exploded View Transformations
    // Factor based on explodedProgress (0 = assembled, 1 = exploded)
    const factor = isReducedMotion ? 0 : explodedProgress;

    // 1. Cushion floats upward and slightly forward
    if (cushionRef.current) {
      cushionRef.current.position.y = THREE.MathUtils.lerp(
        cushionRef.current.position.y,
        0.35 + factor * 0.48,
        lerpSpeed
      );
      cushionRef.current.position.z = THREE.MathUtils.lerp(
        cushionRef.current.position.z,
        0.05 + factor * 0.15,
        lerpSpeed
      );
    }

    // 2. Backrest tilts and floats backward and upward
    if (backrestRef.current) {
      backrestRef.current.position.y = THREE.MathUtils.lerp(
        backrestRef.current.position.y,
        0.68 + factor * 0.42,
        lerpSpeed
      );
      backrestRef.current.position.z = THREE.MathUtils.lerp(
        backrestRef.current.position.z,
        -0.28 - factor * 0.35,
        lerpSpeed
      );
      backrestRef.current.rotation.x = THREE.MathUtils.lerp(
        backrestRef.current.rotation.x,
        -0.25 - factor * 0.15,
        lerpSpeed
      );
    }

    // 3. Left Armrest moves left (-X)
    if (leftArmRef.current) {
      leftArmRef.current.position.x = THREE.MathUtils.lerp(
        leftArmRef.current.position.x,
        -0.48 - factor * 0.38,
        lerpSpeed
      );
    }

    // 4. Right Armrest moves right (+X)
    if (rightArmRef.current) {
      rightArmRef.current.position.x = THREE.MathUtils.lerp(
        rightArmRef.current.position.x,
        0.48 + factor * 0.38,
        lerpSpeed
      );
    }

    // 5. Seat Sub-Frame moves downward slightly
    if (seatFrameRef.current) {
      seatFrameRef.current.position.y = THREE.MathUtils.lerp(
        seatFrameRef.current.position.y,
        0.22 - factor * 0.18,
        lerpSpeed
      );
    }

    // 6. Legs drop down (-Y)
    if (legsRef.current) {
      legsRef.current.position.y = THREE.MathUtils.lerp(
        legsRef.current.position.y,
        0.0 - factor * 0.35,
        lerpSpeed
      );
    }

    // 7. Brass Joinery pins push outward to reveal mechanical fasteners
    if (joineryRef.current) {
      joineryRef.current.scale.setScalar(
        THREE.MathUtils.lerp(joineryRef.current.scale.x, 1 + factor * 0.3, lerpSpeed)
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} dispose={null}>
      {/* =========================================================================
          PART 1: SEAT CUSHION (Upholstered)
         ========================================================================= */}
      <group ref={cushionRef} position={[0, 0.35, 0.05]}>
        {/* Main Seat Cushion */}
        <mesh castShadow receiveShadow material={upholsteryMaterial}>
          <boxGeometry args={[0.78, 0.14, 0.68, 6, 4, 6]} />
        </mesh>
        {/* Cushion Chamfer / Welt Beading */}
        <mesh position={[0, 0.06, 0]} material={upholsteryMaterial}>
          <boxGeometry args={[0.8, 0.02, 0.7]} />
        </mesh>

        {/* 3D Annotation: Cushion */}
        {interactive && explodedProgress > 0.35 && (
          <Html
            position={[0, 0.15, 0.25]}
            center
            distanceFactor={5.5}
            className="pointer-events-auto select-none"
          >
            <div
              onClick={() => setActiveAnnotation(activeAnnotationId === 'ann-cushion' ? null : 'ann-cushion')}
              className="cursor-pointer group flex items-center space-x-2"
            >
              <div className="relative flex items-center justify-center">
                <span className="w-5 h-5 rounded-full bg-accent/20 animate-ping absolute" />
                <span className="w-3 h-3 rounded-full bg-accent border border-charcoal-950 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform" />
              </div>
              <div className="bg-charcoal-900/90 backdrop-blur-md border border-white/15 px-3 py-1.5 shadow-xl transition-all duration-300">
                <p className="font-mono text-[9px] uppercase tracking-widest text-accent">01 // CORE</p>
                <p className="font-serif text-xs text-ivory tracking-wide whitespace-nowrap">Down & Latex Core</p>
                {activeAnnotationId === 'ann-cushion' && (
                  <p className="text-[10px] text-sand-300 font-light max-w-[200px] mt-1 pt-1 border-t border-white/10">
                    Dual-density natural latex wrapped in channeled Hungarian down ticking.
                  </p>
                )}
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* =========================================================================
          PART 2: BACKREST CUSHION (Upholstered, Cantilever Angle)
         ========================================================================= */}
      <group ref={backrestRef} position={[0, 0.68, -0.28]} rotation={[-0.25, 0, 0]}>
        <mesh castShadow receiveShadow material={upholsteryMaterial}>
          <boxGeometry args={[0.76, 0.52, 0.12, 6, 6, 4]} />
        </mesh>
        {/* Rear spine support bar */}
        <mesh position={[0, -0.05, -0.08]} castShadow material={woodMaterial}>
          <boxGeometry args={[0.72, 0.04, 0.03]} />
        </mesh>

        {/* 3D Annotation: Backrest */}
        {interactive && explodedProgress > 0.35 && (
          <Html
            position={[0, 0.3, 0.1]}
            center
            distanceFactor={5.5}
            className="pointer-events-auto select-none"
          >
            <div
              onClick={() => setActiveAnnotation(activeAnnotationId === 'ann-backrest' ? null : 'ann-backrest')}
              className="cursor-pointer group flex items-center space-x-2"
            >
              <div className="relative flex items-center justify-center">
                <span className="w-5 h-5 rounded-full bg-accent/20 animate-ping absolute" />
                <span className="w-3 h-3 rounded-full bg-accent border border-charcoal-950 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform" />
              </div>
              <div className="bg-charcoal-900/90 backdrop-blur-md border border-white/15 px-3 py-1.5 shadow-xl transition-all duration-300">
                <p className="font-mono text-[9px] uppercase tracking-widest text-accent">02 // INCLINE</p>
                <p className="font-serif text-xs text-ivory tracking-wide whitespace-nowrap">112° Thoracic Cradle</p>
                {activeAnnotationId === 'ann-backrest' && (
                  <p className="text-[10px] text-sand-300 font-light max-w-[200px] mt-1 pt-1 border-t border-white/10">
                    Engineered spinal decompression incline ensuring natural ergonomics.
                  </p>
                )}
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* =========================================================================
          PART 3: SCULPTED TIMBER ARMRESTS (Left & Right)
         ========================================================================= */}
      {/* Left Armrest */}
      <group ref={leftArmRef} position={[-0.48, 0.44, -0.02]}>
        <mesh castShadow receiveShadow material={woodMaterial}>
          {/* Sculpted continuous horizontal armrest */}
          <boxGeometry args={[0.08, 0.05, 0.76]} />
        </mesh>
        {/* Vertical rear upright */}
        <mesh position={[0, 0.14, -0.32]} castShadow material={woodMaterial}>
          <boxGeometry args={[0.07, 0.36, 0.06]} />
        </mesh>
      </group>

      {/* Right Armrest */}
      <group ref={rightArmRef} position={[0.48, 0.44, -0.02]}>
        <mesh castShadow receiveShadow material={woodMaterial}>
          <boxGeometry args={[0.08, 0.05, 0.76]} />
        </mesh>
        {/* Vertical rear upright */}
        <mesh position={[0, 0.14, -0.32]} castShadow material={woodMaterial}>
          <boxGeometry args={[0.07, 0.36, 0.06]} />
        </mesh>

        {/* 3D Annotation: Frame Monolith */}
        {interactive && explodedProgress > 0.35 && (
          <Html
            position={[0.2, 0.1, 0.1]}
            center
            distanceFactor={5.5}
            className="pointer-events-auto select-none"
          >
            <div
              onClick={() => setActiveAnnotation(activeAnnotationId === 'ann-frame' ? null : 'ann-frame')}
              className="cursor-pointer group flex items-center space-x-2"
            >
              <div className="relative flex items-center justify-center">
                <span className="w-5 h-5 rounded-full bg-accent/20 animate-ping absolute" />
                <span className="w-3 h-3 rounded-full bg-accent border border-charcoal-950 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform" />
              </div>
              <div className="bg-charcoal-900/90 backdrop-blur-md border border-white/15 px-3 py-1.5 shadow-xl transition-all duration-300">
                <p className="font-mono text-[9px] uppercase tracking-widest text-accent">03 // TIMBER</p>
                <p className="font-serif text-xs text-ivory tracking-wide whitespace-nowrap">Solid Timber Armature</p>
                {activeAnnotationId === 'ann-frame' && (
                  <p className="text-[10px] text-sand-300 font-light max-w-[200px] mt-1 pt-1 border-t border-white/10">
                    5-axis CNC-carved single-slab timber hand-finished with organic oil.
                  </p>
                )}
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* =========================================================================
          PART 4: SEAT SUBFRAME & CROSS STRETCHERS
         ========================================================================= */}
      <group ref={seatFrameRef} position={[0, 0.22, 0]}>
        {/* Front horizontal stretcher */}
        <mesh position={[0, 0, 0.32]} castShadow receiveShadow material={woodMaterial}>
          <boxGeometry args={[0.9, 0.05, 0.05]} />
        </mesh>
        {/* Rear horizontal stretcher */}
        <mesh position={[0, -0.04, -0.3]} castShadow receiveShadow material={woodMaterial}>
          <boxGeometry args={[0.9, 0.05, 0.05]} />
        </mesh>
        {/* Structural seat web slats */}
        {[-0.25, 0, 0.25].map((x, i) => (
          <mesh key={i} position={[x, -0.01, 0]} material={steelHardwareMaterial}>
            <boxGeometry args={[0.04, 0.015, 0.6]} />
          </mesh>
        ))}
      </group>

      {/* =========================================================================
          PART 5: STRUCTURAL TAPERED LEGS & BRASS FERRULES
         ========================================================================= */}
      <group ref={legsRef} position={[0, 0, 0]}>
        {/* Front Left Leg */}
        <group position={[-0.44, 0.1, 0.32]} rotation={[0.06, 0, -0.08]}>
          <mesh castShadow receiveShadow material={woodMaterial}>
            <cylinderGeometry args={[0.026, 0.018, 0.42, 16]} />
          </mesh>
          {/* Brass Foot ferrule */}
          <mesh position={[0, -0.19, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.019, 0.019, 0.05, 16]} />
          </mesh>
        </group>

        {/* Front Right Leg */}
        <group position={[0.44, 0.1, 0.32]} rotation={[0.06, 0, 0.08]}>
          <mesh castShadow receiveShadow material={woodMaterial}>
            <cylinderGeometry args={[0.026, 0.018, 0.42, 16]} />
          </mesh>
          <mesh position={[0, -0.19, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.019, 0.019, 0.05, 16]} />
          </mesh>
        </group>

        {/* Rear Left Leg (Raked angle) */}
        <group position={[-0.44, 0.08, -0.32]} rotation={[-0.14, 0, -0.06]}>
          <mesh castShadow receiveShadow material={woodMaterial}>
            <cylinderGeometry args={[0.028, 0.02, 0.38, 16]} />
          </mesh>
          <mesh position={[0, -0.17, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.021, 0.021, 0.05, 16]} />
          </mesh>
        </group>

        {/* Rear Right Leg (Raked angle) */}
        <group position={[0.44, 0.08, -0.32]} rotation={[-0.14, 0, 0.06]}>
          <mesh castShadow receiveShadow material={woodMaterial}>
            <cylinderGeometry args={[0.028, 0.02, 0.38, 16]} />
          </mesh>
          <mesh position={[0, -0.17, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.021, 0.021, 0.05, 16]} />
          </mesh>
        </group>

        {/* 3D Annotation: Tapered Stance */}
        {interactive && explodedProgress > 0.35 && (
          <Html
            position={[-0.45, -0.15, 0.35]}
            center
            distanceFactor={5.5}
            className="pointer-events-auto select-none"
          >
            <div
              onClick={() => setActiveAnnotation(activeAnnotationId === 'ann-legs' ? null : 'ann-legs')}
              className="cursor-pointer group flex items-center space-x-2"
            >
              <div className="relative flex items-center justify-center">
                <span className="w-5 h-5 rounded-full bg-accent/20 animate-ping absolute" />
                <span className="w-3 h-3 rounded-full bg-accent border border-charcoal-950 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform" />
              </div>
              <div className="bg-charcoal-900/90 backdrop-blur-md border border-white/15 px-3 py-1.5 shadow-xl transition-all duration-300">
                <p className="font-mono text-[9px] uppercase tracking-widest text-accent">04 // STANCE</p>
                <p className="font-serif text-xs text-ivory tracking-wide whitespace-nowrap">Tapered Gravity Vectors</p>
                {activeAnnotationId === 'ann-legs' && (
                  <p className="text-[10px] text-sand-300 font-light max-w-[200px] mt-1 pt-1 border-t border-white/10">
                    Precision raked angle with solid milled brass architectural ferrules.
                  </p>
                )}
              </div>
            </div>
          </Html>
        )}
      </group>

      {/* =========================================================================
          PART 6: INTERNAL BRASS JOINERY PINS & MECHANICAL HARDWARE
         ========================================================================= */}
      <group ref={joineryRef}>
        {/* Left front joinery pin */}
        <mesh position={[-0.44, 0.38, 0.3]} rotation={[0, 0, Math.PI / 2]} material={brassMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.08, 16]} />
        </mesh>
        {/* Right front joinery pin */}
        <mesh position={[0.44, 0.38, 0.3]} rotation={[0, 0, Math.PI / 2]} material={brassMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.08, 16]} />
        </mesh>
        {/* Left rear joinery pin */}
        <mesh position={[-0.44, 0.36, -0.3]} rotation={[0, 0, Math.PI / 2]} material={brassMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.08, 16]} />
        </mesh>
        {/* Right rear joinery pin */}
        <mesh position={[0.44, 0.36, -0.3]} rotation={[0, 0, Math.PI / 2]} material={brassMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.08, 16]} />
        </mesh>

        {/* 3D Annotation: Kyoto Joinery */}
        {interactive && explodedProgress > 0.35 && (
          <Html
            position={[0.46, 0.38, -0.3]}
            center
            distanceFactor={5.5}
            className="pointer-events-auto select-none"
          >
            <div
              onClick={() => setActiveAnnotation(activeAnnotationId === 'ann-joinery' ? null : 'ann-joinery')}
              className="cursor-pointer group flex items-center space-x-2"
            >
              <div className="relative flex items-center justify-center">
                <span className="w-5 h-5 rounded-full bg-accent/20 animate-ping absolute" />
                <span className="w-3 h-3 rounded-full bg-accent border border-charcoal-950 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform" />
              </div>
              <div className="bg-charcoal-900/90 backdrop-blur-md border border-white/15 px-3 py-1.5 shadow-xl transition-all duration-300">
                <p className="font-mono text-[9px] uppercase tracking-widest text-accent">05 // JOINERY</p>
                <p className="font-serif text-xs text-ivory tracking-wide whitespace-nowrap">Concealed Brass Fasteners</p>
                {activeAnnotationId === 'ann-joinery' && (
                  <p className="text-[10px] text-sand-300 font-light max-w-[200px] mt-1 pt-1 border-t border-white/10">
                    Interlocking mortise-and-tenon reinforced with knurled brass hardware.
                  </p>
                )}
              </div>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};

