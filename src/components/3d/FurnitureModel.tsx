'use client';

import React, { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useSceneStore } from '@/store/useSceneStore';
import { WOOD_MATERIALS, UPHOLSTERY_MATERIALS } from '@/data/catalog';

interface FurnitureModelProps {
  interactive?: boolean;
}

// Helper to generate rounded rectangle shape with smooth corners
function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
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
    activeScene,
    explodedProgress,
    selectedWoodId,
    selectedFabricId,
    activeAnnotationId,
    setActiveAnnotation,
    isReducedMotion,
  } = useSceneStore();

  const [hoveredAnnotation, setHoveredAnnotation] = useState<string | null>(null);

  // Active materials
  const currentWood = useMemo(
    () => WOOD_MATERIALS.find((m) => m.id === selectedWoodId) || WOOD_MATERIALS[0],
    [selectedWoodId]
  );

  const currentFabric = useMemo(
    () => UPHOLSTERY_MATERIALS.find((m) => m.id === selectedFabricId) || UPHOLSTERY_MATERIALS[0],
    [selectedFabricId]
  );

  // High-Fidelity Beveled Cushion & Backrest Geometries
  const seatCushionGeo = useMemo(() => {
    const shape = createRoundedRectShape(0.72, 0.62, 0.08);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.10,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.032,
      bevelThickness: 0.032,
    });
    geo.center();
    return geo;
  }, []);

  const backrestCushionGeo = useMemo(() => {
    const shape = createRoundedRectShape(0.70, 0.46, 0.07);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.08,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.028,
      bevelThickness: 0.028,
    });
    geo.center();
    return geo;
  }, []);

  const armrestPaddleGeo = useMemo(() => {
    const shape = createRoundedRectShape(0.08, 0.74, 0.03);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.038,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012,
    });
    geo.center();
    return geo;
  }, []);

  // Reusable PBR Materials
  const woodMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(currentWood.colorHex),
      roughness: currentWood.roughness,
      metalness: currentWood.metalness,
      envMapIntensity: 0.85,
    });
  }, [currentWood]);

  const upholsteryMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(currentFabric.colorHex),
      roughness: currentFabric.roughness,
      metalness: currentFabric.metalness,
      envMapIntensity: 0.4,
    });
  }, [currentFabric]);

  const weltPipingMaterial = useMemo(() => {
    const c = new THREE.Color(currentFabric.colorHex).multiplyScalar(0.9);
    return new THREE.MeshStandardMaterial({
      color: c,
      roughness: Math.min(1, currentFabric.roughness + 0.05),
      metalness: currentFabric.metalness,
    });
  }, [currentFabric]);

  const brassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D69F65'),
      roughness: 0.22,
      metalness: 0.92,
      envMapIntensity: 1.5,
    });
  }, []);

  const darkSteelMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#2A2927'),
      roughness: 0.45,
      metalness: 0.85,
    });
  }, []);

  // Frame Loop
  useFrame((_, delta) => {
    const lerpSpeed = Math.min(1, delta * 5.5);

    // Smooth material transitions
    woodMaterial.color.lerp(new THREE.Color(currentWood.colorHex), lerpSpeed);
    woodMaterial.roughness = THREE.MathUtils.lerp(woodMaterial.roughness, currentWood.roughness, lerpSpeed);

    upholsteryMaterial.color.lerp(new THREE.Color(currentFabric.colorHex), lerpSpeed);
    upholsteryMaterial.roughness = THREE.MathUtils.lerp(upholsteryMaterial.roughness, currentFabric.roughness, lerpSpeed);

    const targetWeltColor = new THREE.Color(currentFabric.colorHex).multiplyScalar(0.9);
    weltPipingMaterial.color.lerp(targetWeltColor, lerpSpeed);

    // Idle rotation
    if (groupRef.current) {
      if (activeScene === 0 && !isReducedMotion) {
        groupRef.current.rotation.y = Math.sin(Date.now() * 0.0006) * 0.06;
      } else if (activeScene === 3) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, -0.15, lerpSpeed);
      } else {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, lerpSpeed);
      }
    }

    // Exploded View Transformations
    const factor = isReducedMotion ? 0 : explodedProgress;

    // 1. Cushion floats upward and forward
    if (cushionRef.current) {
      cushionRef.current.position.y = THREE.MathUtils.lerp(
        cushionRef.current.position.y,
        0.33 + factor * 0.52,
        lerpSpeed
      );
      cushionRef.current.position.z = THREE.MathUtils.lerp(
        cushionRef.current.position.z,
        0.04 + factor * 0.18,
        lerpSpeed
      );
    }

    // 2. Backrest tilts and floats rearward & upward
    if (backrestRef.current) {
      backrestRef.current.position.y = THREE.MathUtils.lerp(
        backrestRef.current.position.y,
        0.66 + factor * 0.44,
        lerpSpeed
      );
      backrestRef.current.position.z = THREE.MathUtils.lerp(
        backrestRef.current.position.z,
        -0.25 - factor * 0.38,
        lerpSpeed
      );
      backrestRef.current.rotation.x = THREE.MathUtils.lerp(
        backrestRef.current.rotation.x,
        -0.22 - factor * 0.12,
        lerpSpeed
      );
    }

    // 3. Left Armrest moves left (-X)
    if (leftArmRef.current) {
      leftArmRef.current.position.x = THREE.MathUtils.lerp(
        leftArmRef.current.position.x,
        -0.46 - factor * 0.42,
        lerpSpeed
      );
    }

    // 4. Right Armrest moves right (+X)
    if (rightArmRef.current) {
      rightArmRef.current.position.x = THREE.MathUtils.lerp(
        rightArmRef.current.position.x,
        0.46 + factor * 0.42,
        lerpSpeed
      );
    }

    // 5. Seat Sub-Frame drops slightly
    if (seatFrameRef.current) {
      seatFrameRef.current.position.y = THREE.MathUtils.lerp(
        seatFrameRef.current.position.y,
        0.2 - factor * 0.16,
        lerpSpeed
      );
    }

    // 6. Splayed Legs drop downward
    if (legsRef.current) {
      legsRef.current.position.y = THREE.MathUtils.lerp(
        legsRef.current.position.y,
        0.0 - factor * 0.36,
        lerpSpeed
      );
    }

    // 7. Brass Joinery pins translate outward along assembly axes
    if (joineryRef.current) {
      joineryRef.current.scale.setScalar(
        THREE.MathUtils.lerp(joineryRef.current.scale.x, 1 + factor * 0.28, lerpSpeed)
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.32, 0]} dispose={null}>
      {/* =========================================================================
          PART 1: CONTOURED LUXURY SEAT CUSHION (Extruded Rounded Chamfer)
         ========================================================================= */}
      <group ref={cushionRef} position={[0, 0.33, 0.04]}>
        {/* Main Contoured Cushion (Rotated horizontally) */}
        <mesh
          castShadow
          receiveShadow
          geometry={seatCushionGeo}
          material={upholsteryMaterial}
          rotation={[-Math.PI / 2, 0, 0]}
        />

        {/* Perimeter Welt Piping Cord */}
        <mesh position={[0, 0.05, 0]} material={weltPipingMaterial}>
          <boxGeometry args={[0.77, 0.01, 0.65]} />
        </mesh>

        {/* 3D Annotation: Cushion */}
        {interactive && explodedProgress > 0.3 && (
          <Html position={[0, 0.1, 0.26]} center className="pointer-events-auto select-none">
            <div
              onMouseEnter={() => setHoveredAnnotation('ann-cushion')}
              onMouseLeave={() => setHoveredAnnotation(null)}
              onClick={() => setActiveAnnotation(activeAnnotationId === 'ann-cushion' ? null : 'ann-cushion')}
              className="cursor-pointer flex flex-col items-center group"
            >
              <div className="flex items-center space-x-1.5 bg-charcoal-950/90 border border-white/20 px-2 py-0.5 shadow-lg group-hover:border-accent transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-ivory text-[9px] font-mono tracking-widest whitespace-nowrap">
                  01 · CORE
                </span>
              </div>
              {(hoveredAnnotation === 'ann-cushion' || activeAnnotationId === 'ann-cushion') && (
                <div className="mt-1 bg-charcoal-900/98 border border-accent/50 p-2.5 max-w-[200px] text-left shadow-2xl z-30">
                  <p className="font-serif text-xs text-ivory">Dual-Density Core</p>
                  <p className="text-[9px] text-sand-300 font-light mt-0.5 leading-relaxed">
                    Cold-cured organic latex wrapped in channeled Hungarian goose down.
                  </p>
                </div>
              )}
            </div>
          </Html>
        )}
      </group>

      {/* =========================================================================
          PART 2: CONTOURED BACKREST CRADLE & TIMBER STRUTS
         ========================================================================= */}
      <group ref={backrestRef} position={[0, 0.66, -0.25]} rotation={[-0.22, 0, 0]}>
        {/* Main Contoured Backrest Cushion */}
        <mesh
          castShadow
          receiveShadow
          geometry={backrestCushionGeo}
          material={upholsteryMaterial}
        />

        {/* Perimeter Welt Piping Cord */}
        <mesh position={[0, 0, 0.045]} material={weltPipingMaterial}>
          <boxGeometry args={[0.73, 0.47, 0.008]} />
        </mesh>

        {/* Solid Timber Rear Spine & Cross Stretcher Cradle */}
        <group position={[0, -0.04, -0.06]}>
          <mesh castShadow receiveShadow material={woodMaterial}>
            <boxGeometry args={[0.76, 0.04, 0.035]} />
          </mesh>
          {[-0.22, 0.22].map((x, idx) => (
            <mesh key={idx} position={[x, 0.1, 0]} castShadow material={woodMaterial}>
              <boxGeometry args={[0.035, 0.26, 0.03]} />
            </mesh>
          ))}
          {[-0.22, 0.22].map((x, idx) => (
            <mesh key={`b-${idx}`} position={[x, -0.01, -0.02]} rotation={[Math.PI / 2, 0, 0]} material={brassMaterial}>
              <cylinderGeometry args={[0.009, 0.009, 0.015, 16]} />
            </mesh>
          ))}
        </group>

        {/* 3D Annotation: Backrest */}
        {interactive && explodedProgress > 0.3 && (
          <Html position={[0, 0.18, 0.08]} center className="pointer-events-auto select-none">
            <div
              onMouseEnter={() => setHoveredAnnotation('ann-backrest')}
              onMouseLeave={() => setHoveredAnnotation(null)}
              onClick={() => setActiveAnnotation(activeAnnotationId === 'ann-backrest' ? null : 'ann-backrest')}
              className="cursor-pointer flex flex-col items-center group"
            >
              <div className="flex items-center space-x-1.5 bg-charcoal-950/90 border border-white/20 px-2 py-0.5 shadow-lg group-hover:border-accent transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-ivory text-[9px] font-mono tracking-widest whitespace-nowrap">
                  02 · INCLINE
                </span>
              </div>
              {(hoveredAnnotation === 'ann-backrest' || activeAnnotationId === 'ann-backrest') && (
                <div className="mt-1 bg-charcoal-900/98 border border-accent/50 p-2.5 max-w-[200px] text-left shadow-2xl z-30">
                  <p className="font-serif text-xs text-ivory">112° Thoracic Cradle</p>
                  <p className="text-[9px] text-sand-300 font-light mt-0.5 leading-relaxed">
                    Ergonomic cantilever angle designed for natural spinal decompression.
                  </p>
                </div>
              )}
            </div>
          </Html>
        )}
      </group>

      {/* =========================================================================
          PART 3: SCULPTED TIMBER ARMRESTS (Extruded Contoured Paddles)
         ========================================================================= */}
      {/* Left Sculpted Armrest */}
      <group ref={leftArmRef} position={[-0.46, 0.42, 0]}>
        <mesh
          position={[0, 0, 0]}
          castShadow
          receiveShadow
          geometry={armrestPaddleGeo}
          material={woodMaterial}
          rotation={[Math.PI / 2, 0, 0]}
        />
        {/* Slanted Rear Stanchion */}
        <mesh position={[0, 0.11, -0.3]} rotation={[0.15, 0, 0]} castShadow material={woodMaterial}>
          <boxGeometry args={[0.065, 0.32, 0.05]} />
        </mesh>
        {/* Lower Structural Apron Rail */}
        <mesh position={[0, -0.22, 0]} castShadow material={woodMaterial}>
          <boxGeometry args={[0.05, 0.05, 0.68]} />
        </mesh>
      </group>

      {/* Right Sculpted Armrest */}
      <group ref={rightArmRef} position={[0.46, 0.42, 0]}>
        <mesh
          position={[0, 0, 0]}
          castShadow
          receiveShadow
          geometry={armrestPaddleGeo}
          material={woodMaterial}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <mesh position={[0, 0.11, -0.3]} rotation={[0.15, 0, 0]} castShadow material={woodMaterial}>
          <boxGeometry args={[0.065, 0.32, 0.05]} />
        </mesh>
        <mesh position={[0, -0.22, 0]} castShadow material={woodMaterial}>
          <boxGeometry args={[0.05, 0.05, 0.68]} />
        </mesh>

        {/* 3D Annotation: Timber */}
        {interactive && explodedProgress > 0.3 && (
          <Html position={[0.12, 0.06, 0.08]} center className="pointer-events-auto select-none">
            <div
              onMouseEnter={() => setHoveredAnnotation('ann-frame')}
              onMouseLeave={() => setHoveredAnnotation(null)}
              onClick={() => setActiveAnnotation(activeAnnotationId === 'ann-frame' ? null : 'ann-frame')}
              className="cursor-pointer flex flex-col items-center group"
            >
              <div className="flex items-center space-x-1.5 bg-charcoal-950/90 border border-white/20 px-2 py-0.5 shadow-lg group-hover:border-accent transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-ivory text-[9px] font-mono tracking-widest whitespace-nowrap">
                  03 · TIMBER
                </span>
              </div>
              {(hoveredAnnotation === 'ann-frame' || activeAnnotationId === 'ann-frame') && (
                <div className="mt-1 bg-charcoal-900/98 border border-accent/50 p-2.5 max-w-[200px] text-left shadow-2xl z-30">
                  <p className="font-serif text-xs text-ivory">Solid Timber Armature</p>
                  <p className="text-[9px] text-sand-300 font-light mt-0.5 leading-relaxed">
                    5-axis CNC sculpted single-slab timber hand-finished with organic oils.
                  </p>
                </div>
              )}
            </div>
          </Html>
        )}
      </group>

      {/* =========================================================================
          PART 4: SEAT SUBFRAME & CROSS STRETCHERS
         ========================================================================= */}
      <group ref={seatFrameRef} position={[0, 0.2, 0]}>
        <mesh position={[0, 0, 0.3]} castShadow receiveShadow material={woodMaterial}>
          <boxGeometry args={[0.88, 0.05, 0.045]} />
        </mesh>
        <mesh position={[0, -0.03, -0.28]} castShadow receiveShadow material={woodMaterial}>
          <boxGeometry args={[0.88, 0.05, 0.045]} />
        </mesh>
        {[-0.26, -0.13, 0, 0.13, 0.26].map((x, i) => (
          <mesh key={i} position={[x, -0.005, 0.01]} material={darkSteelMaterial}>
            <boxGeometry args={[0.038, 0.012, 0.58]} />
          </mesh>
        ))}
      </group>

      {/* =========================================================================
          PART 5: SPLAYED & TAPERED LEGS WITH SOLID BRASS FERRULES
         ========================================================================= */}
      <group ref={legsRef} position={[0, 0, 0]}>
        {/* Front Left Tapered Leg */}
        <group position={[-0.42, 0.08, 0.28]} rotation={[0.07, 0, -0.09]}>
          <mesh castShadow receiveShadow material={woodMaterial}>
            <cylinderGeometry args={[0.024, 0.016, 0.38, 24]} />
          </mesh>
          <mesh position={[0, -0.17, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.017, 0.017, 0.04, 24]} />
          </mesh>
          <mesh position={[0, -0.192, 0]} material={darkSteelMaterial}>
            <cylinderGeometry args={[0.015, 0.015, 0.006, 16]} />
          </mesh>
        </group>

        {/* Front Right Tapered Leg */}
        <group position={[0.42, 0.08, 0.28]} rotation={[0.07, 0, 0.09]}>
          <mesh castShadow receiveShadow material={woodMaterial}>
            <cylinderGeometry args={[0.024, 0.016, 0.38, 24]} />
          </mesh>
          <mesh position={[0, -0.17, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.017, 0.017, 0.04, 24]} />
          </mesh>
          <mesh position={[0, -0.192, 0]} material={darkSteelMaterial}>
            <cylinderGeometry args={[0.015, 0.015, 0.006, 16]} />
          </mesh>
        </group>

        {/* Rear Left Raked Leg */}
        <group position={[-0.42, 0.06, -0.28]} rotation={[-0.18, 0, -0.07]}>
          <mesh castShadow receiveShadow material={woodMaterial}>
            <cylinderGeometry args={[0.026, 0.018, 0.36, 24]} />
          </mesh>
          <mesh position={[0, -0.16, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.019, 0.019, 0.04, 24]} />
          </mesh>
          <mesh position={[0, -0.182, 0]} material={darkSteelMaterial}>
            <cylinderGeometry args={[0.016, 0.016, 0.006, 16]} />
          </mesh>
        </group>

        {/* Rear Right Raked Leg */}
        <group position={[0.42, 0.06, -0.28]} rotation={[-0.18, 0, 0.07]}>
          <mesh castShadow receiveShadow material={woodMaterial}>
            <cylinderGeometry args={[0.026, 0.018, 0.36, 24]} />
          </mesh>
          <mesh position={[0, -0.16, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.019, 0.019, 0.04, 24]} />
          </mesh>
          <mesh position={[0, -0.182, 0]} material={darkSteelMaterial}>
            <cylinderGeometry args={[0.016, 0.016, 0.006, 16]} />
          </mesh>
        </group>

        {/* Side Cross Stretchers */}
        <mesh position={[-0.42, -0.03, 0]} rotation={[0.12, 0, 0]} material={woodMaterial}>
          <boxGeometry args={[0.025, 0.025, 0.54]} />
        </mesh>
        <mesh position={[0.42, -0.03, 0]} rotation={[0.12, 0, 0]} material={woodMaterial}>
          <boxGeometry args={[0.025, 0.025, 0.54]} />
        </mesh>

        {/* 3D Annotation: Stance */}
        {interactive && explodedProgress > 0.3 && (
          <Html position={[-0.42, -0.14, 0.28]} center className="pointer-events-auto select-none">
            <div
              onMouseEnter={() => setHoveredAnnotation('ann-legs')}
              onMouseLeave={() => setHoveredAnnotation(null)}
              onClick={() => setActiveAnnotation(activeAnnotationId === 'ann-legs' ? null : 'ann-legs')}
              className="cursor-pointer flex flex-col items-center group"
            >
              <div className="flex items-center space-x-1.5 bg-charcoal-950/90 border border-white/20 px-2 py-0.5 shadow-lg group-hover:border-accent transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-ivory text-[9px] font-mono tracking-widest whitespace-nowrap">
                  04 · STANCE
                </span>
              </div>
              {(hoveredAnnotation === 'ann-legs' || activeAnnotationId === 'ann-legs') && (
                <div className="mt-1 bg-charcoal-900/98 border border-accent/50 p-2.5 max-w-[200px] text-left shadow-2xl z-30">
                  <p className="font-serif text-xs text-ivory">Raked Architectural Stance</p>
                  <p className="text-[9px] text-sand-300 font-light mt-0.5 leading-relaxed">
                    18° gravity vector alignment with solid milled brass foot ferrules.
                  </p>
                </div>
              )}
            </div>
          </Html>
        )}
      </group>

      {/* =========================================================================
          PART 6: SOLID MILLED BRASS JOINERY FASTENERS
         ========================================================================= */}
      <group ref={joineryRef}>
        <group position={[-0.44, 0.36, 0.26]} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={brassMaterial}>
            <cylinderGeometry args={[0.012, 0.012, 0.09, 24]} />
          </mesh>
          <mesh position={[0, 0.046, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.015, 0.015, 0.006, 24]} />
          </mesh>
        </group>

        <group position={[0.44, 0.36, 0.26]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh material={brassMaterial}>
            <cylinderGeometry args={[0.012, 0.012, 0.09, 24]} />
          </mesh>
          <mesh position={[0, 0.046, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.015, 0.015, 0.006, 24]} />
          </mesh>
        </group>

        <group position={[-0.44, 0.34, -0.26]} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={brassMaterial}>
            <cylinderGeometry args={[0.012, 0.012, 0.09, 24]} />
          </mesh>
          <mesh position={[0, 0.046, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.015, 0.015, 0.006, 24]} />
          </mesh>
        </group>

        <group position={[0.44, 0.34, -0.26]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh material={brassMaterial}>
            <cylinderGeometry args={[0.012, 0.012, 0.09, 24]} />
          </mesh>
          <mesh position={[0, 0.046, 0]} material={brassMaterial}>
            <cylinderGeometry args={[0.015, 0.015, 0.006, 24]} />
          </mesh>
        </group>

        {/* 3D Annotation: Kyoto Joinery */}
        {interactive && explodedProgress > 0.3 && (
          <Html position={[0.46, 0.35, -0.26]} center className="pointer-events-auto select-none">
            <div
              onMouseEnter={() => setHoveredAnnotation('ann-joinery')}
              onMouseLeave={() => setHoveredAnnotation(null)}
              onClick={() => setActiveAnnotation(activeAnnotationId === 'ann-joinery' ? null : 'ann-joinery')}
              className="cursor-pointer flex flex-col items-center group"
            >
              <div className="flex items-center space-x-1.5 bg-charcoal-950/90 border border-white/20 px-2 py-0.5 shadow-lg group-hover:border-accent transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-ivory text-[9px] font-mono tracking-widest whitespace-nowrap">
                  05 · JOINERY
                </span>
              </div>
              {(hoveredAnnotation === 'ann-joinery' || activeAnnotationId === 'ann-joinery') && (
                <div className="mt-1 bg-charcoal-900/98 border border-accent/50 p-2.5 max-w-[200px] text-left shadow-2xl z-30">
                  <p className="font-serif text-xs text-ivory">Milled Brass Fasteners</p>
                  <p className="text-[9px] text-sand-300 font-light mt-0.5 leading-relaxed">
                    Interlocking mortise-and-tenons locked with knurled solid brass hardware.
                  </p>
                </div>
              )}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};

