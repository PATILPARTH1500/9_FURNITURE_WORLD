'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useSceneStore } from '@/store/useSceneStore';
import { FurnitureModel } from './FurnitureModel';
import { PRODUCTS_CATALOG } from '@/data/catalog';

// Helper to generate rounded rectangle shapes
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

interface HotspotProps {
  productId: string;
  label: string;
  position: [number, number, number];
  roomIndex: number;
}

const ProductHotspot: React.FC<HotspotProps> = ({ productId, label, position, roomIndex }) => {
  const { setActiveProduct, activeRoomIndex } = useSceneStore();
  const product = PRODUCTS_CATALOG.find((p) => p.id === productId);
  if (!product || activeRoomIndex !== roomIndex) return null;

  return (
    <group position={position}>
      <Html center position={[0, 0, 0]} zIndexRange={[10, 0]}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveProduct(productId);
          }}
          className="group relative flex items-center space-x-1.5 bg-charcoal-950/85 hover:bg-charcoal-900 border border-white/20 hover:border-accent px-2.5 py-1 backdrop-blur-md shadow-xl transition-all duration-200 pointer-events-auto cursor-pointer"
          aria-label={`Inspect ${label}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-sand-200 group-hover:text-white whitespace-nowrap">
            {label} · ${product.price.toLocaleString()}
          </span>
        </button>
      </Html>
    </group>
  );
};

export const FurnitureCollectionModels: React.FC = () => {
  // Shared PBR materials across residence furniture
  const materials = useMemo(() => {
    const oak = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D6BEA0'),
      roughness: 0.62,
      metalness: 0.05,
    });

    const walnut = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#463326'),
      roughness: 0.52,
      metalness: 0.08,
    });

    const bouclé = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#F3EFE7'),
      roughness: 0.94,
      metalness: 0.0,
    });

    const linen = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D8D0C3'),
      roughness: 0.88,
      metalness: 0.0,
    });

    const travertine = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#DED6C7'),
      roughness: 0.82,
      metalness: 0.02,
    });

    const bronze = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#38322B'),
      roughness: 0.35,
      metalness: 0.88,
    });

    const glassFrosted = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFF5E5'),
      roughness: 0.25,
      transmission: 0.75,
      thickness: 0.2,
      transparent: true,
      opacity: 0.9,
    });

    return { oak, walnut, bouclé, linen, travertine, bronze, glassFrosted };
  }, []);

  return (
    <group name="ResidenceFurnitureCollection">
      {/* =========================================================================
          1. ENTRANCE FOYER: ARCOS SCULPTURAL BENCH (prod-003) & LUMINAIRE
         ========================================================================= */}
      <group position={[0, 0, 12.0]} rotation={[0, -Math.PI / 8, 0]}>
        {/* Travertine Curved Bench Base */}
        <mesh position={[0, 0.22, 0]} castShadow receiveShadow material={materials.travertine}>
          <boxGeometry args={[1.8, 0.44, 0.48]} />
        </mesh>
        {/* Ash Wood Plinth Inlay */}
        <mesh position={[0, 0.45, 0]} castShadow material={materials.walnut}>
          <boxGeometry args={[1.76, 0.04, 0.44]} />
        </mesh>
        <ProductHotspot productId="prod-003" label="01 · Arcos Bench" position={[0, 0.75, 0]} roomIndex={0} />
      </group>

      {/* Foyer Minimal Tensegrity Luminaire (prod-005) */}
      <group position={[-2.8, 0, 10.5]}>
        {/* Bronze Upright Rod */}
        <mesh position={[0, 0.82, 0]} material={materials.bronze}>
          <cylinderGeometry args={[0.015, 0.015, 1.65]} />
        </mesh>
        {/* Heavy Travertine Disc Base */}
        <mesh position={[0, 0.03, 0]} castShadow material={materials.travertine}>
          <cylinderGeometry args={[0.22, 0.24, 0.06, 24]} />
        </mesh>
        {/* Frosted Opal Glass Sphere */}
        <mesh position={[0, 1.55, 0]} material={materials.glassFrosted}>
          <sphereGeometry args={[0.15, 24, 24]} />
        </mesh>
        <pointLight position={[0, 1.55, 0]} intensity={0.6} color="#FFE6C7" distance={3.5} />
      </group>

      {/* =========================================================================
          2. LIVING SALON: KANSO SECTIONAL SOFA & LOW COFFEE TABLE
         ========================================================================= */}
      <group position={[-0.2, 0, 4.6]}>
        {/* Main Sectional Base (Ivory Bouclé Seat) */}
        <mesh position={[0, 0.24, 0]} castShadow receiveShadow material={materials.bouclé}>
          <boxGeometry args={[3.2, 0.42, 1.1]} />
        </mesh>
        {/* Sectional Backrest */}
        <mesh position={[0, 0.58, -0.42]} castShadow receiveShadow material={materials.bouclé}>
          <boxGeometry args={[3.2, 0.42, 0.26]} />
        </mesh>
        {/* Sectional Chaise Return (L-Shape on left) */}
        <mesh position={[-1.15, 0.24, 0.95]} castShadow receiveShadow material={materials.bouclé}>
          <boxGeometry args={[0.9, 0.42, 0.8]} />
        </mesh>
        {/* Low Oak Plinth Platform */}
        <mesh position={[0, 0.02, 0]} material={materials.oak}>
          <boxGeometry args={[3.25, 0.04, 1.15]} />
        </mesh>
        {/* Accent Bolster Cushions */}
        <mesh position={[0.7, 0.52, -0.22]} rotation={[0, 0, Math.PI / 2]} material={materials.linen}>
          <cylinderGeometry args={[0.1, 0.1, 0.55, 16]} />
        </mesh>
        <ProductHotspot productId="prod-001" label="02 · Kanso Sectional" position={[0, 0.95, 0]} roomIndex={1} />
      </group>

      {/* Low Architectural Travertine Coffee Table */}
      <group position={[0.2, 0, 2.9]}>
        <mesh position={[0, 0.16, 0]} castShadow receiveShadow material={materials.travertine}>
          <boxGeometry args={[1.5, 0.32, 0.85]} />
        </mesh>
        {/* Minimal Ceramic Object */}
        <mesh position={[0.3, 0.36, 0.1]} material={materials.travertine}>
          <cylinderGeometry args={[0.06, 0.08, 0.14, 16]} />
        </mesh>
      </group>

      {/* Kyoto Occasional Turned Oak Pedestal (prod-006) */}
      <group position={[2.1, 0, 4.4]}>
        <mesh position={[0, 0.23, 0]} castShadow material={materials.oak}>
          <cylinderGeometry args={[0.24, 0.22, 0.46, 24]} />
        </mesh>
        <ProductHotspot productId="prod-006" label="03 · Kyoto Pedestal" position={[0, 0.65, 0]} roomIndex={1} />
      </group>

      {/* =========================================================================
          3. FIRESIDE FOCAL: KRONOS LOUNGE CHAIR (prod-001)
         ========================================================================= */}
      <group position={[-3.2, 0, 2.8]} rotation={[0, Math.PI / 4, 0]}>
        {/* Flagship Procedural / Precision Sculpted Kronos Lounge Chair */}
        <FurnitureModel interactive={true} />
        <ProductHotspot productId="prod-001" label="04 · Kronos Chair" position={[0, 1.15, 0]} roomIndex={2} />
      </group>

      {/* =========================================================================
          4. DINING WING: SÖLVE MONOLITH TABLE (prod-002) & SILVA CHAIRS
         ========================================================================= */}
      <group position={[9.5, 0, 1.5]}>
        {/* 280cm Smoked European Walnut Table Top */}
        <mesh position={[0, 0.72, 0]} castShadow receiveShadow material={materials.walnut}>
          <boxGeometry args={[2.8, 0.05, 1.05]} />
        </mesh>
        {/* Dual Fluted Timber Pedestal Bases */}
        <mesh position={[-0.8, 0.34, 0]} castShadow material={materials.walnut}>
          <cylinderGeometry args={[0.28, 0.32, 0.68, 24]} />
        </mesh>
        <mesh position={[0.8, 0.34, 0]} castShadow material={materials.walnut}>
          <cylinderGeometry args={[0.28, 0.32, 0.68, 24]} />
        </mesh>

        {/* Flanking Silva Dining Chairs */}
        {[-0.8, 0, 0.8].map((xOffset) => (
          <React.Fragment key={`chairs-${xOffset}`}>
            {/* North Side Chairs */}
            <group position={[xOffset, 0, 0.72]} rotation={[0, Math.PI, 0]}>
              <mesh position={[0, 0.44, 0]} castShadow material={materials.oak}>
                <boxGeometry args={[0.48, 0.04, 0.46]} />
              </mesh>
              <mesh position={[0, 0.68, 0.2]} castShadow material={materials.oak}>
                <boxGeometry args={[0.48, 0.44, 0.04]} />
              </mesh>
              <mesh position={[-0.2, 0.21, -0.18]} material={materials.oak}>
                <cylinderGeometry args={[0.02, 0.016, 0.42]} />
              </mesh>
              <mesh position={[0.2, 0.21, -0.18]} material={materials.oak}>
                <cylinderGeometry args={[0.02, 0.016, 0.42]} />
              </mesh>
            </group>

            {/* South Side Chairs */}
            <group position={[xOffset, 0, -0.72]}>
              <mesh position={[0, 0.44, 0]} castShadow material={materials.oak}>
                <boxGeometry args={[0.48, 0.04, 0.46]} />
              </mesh>
              <mesh position={[0, 0.68, 0.2]} castShadow material={materials.oak}>
                <boxGeometry args={[0.48, 0.44, 0.04]} />
              </mesh>
              <mesh position={[-0.2, 0.21, -0.18]} material={materials.oak}>
                <cylinderGeometry args={[0.02, 0.016, 0.42]} />
              </mesh>
              <mesh position={[0.2, 0.21, -0.18]} material={materials.oak}>
                <cylinderGeometry args={[0.02, 0.016, 0.42]} />
              </mesh>
            </group>
          </React.Fragment>
        ))}

        <ProductHotspot productId="prod-002" label="05 · Sölve Table" position={[0, 1.05, 0]} roomIndex={3} />
      </group>

      {/* =========================================================================
          5. BEDROOM SANCTUARY: ORIENTE PLATFORM BED & NORDICA DAYBED
         ========================================================================= */}
      <group position={[-9.5, 0, -9.5]}>
        {/* Low Rift-Oak Bed Platform Frame */}
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow material={materials.oak}>
          <boxGeometry args={[2.2, 0.24, 2.3]} />
        </mesh>
        {/* Upholstered Linen Headboard Wall Panel */}
        <mesh position={[0, 0.65, -1.1]} castShadow receiveShadow material={materials.linen}>
          <boxGeometry args={[2.6, 0.9, 0.14]} />
        </mesh>
        {/* Mattress Cushion */}
        <mesh position={[0, 0.32, 0.05]} castShadow material={materials.bouclé}>
          <boxGeometry args={[1.85, 0.26, 2.05]} />
        </mesh>
        {/* Folded Tailored Linen Duvet */}
        <mesh position={[0, 0.38, 0.35]} castShadow material={materials.linen}>
          <boxGeometry args={[1.9, 0.16, 1.35]} />
        </mesh>
        {/* Pillows */}
        <mesh position={[-0.5, 0.46, -0.7]} rotation={[0.2, 0, 0]} material={materials.linen}>
          <boxGeometry args={[0.65, 0.12, 0.45]} />
        </mesh>
        <mesh position={[0.5, 0.46, -0.7]} rotation={[0.2, 0, 0]} material={materials.linen}>
          <boxGeometry args={[0.65, 0.12, 0.45]} />
        </mesh>

        {/* Flanking Cantilevered Nightstands */}
        <mesh position={[-1.35, 0.22, -0.8]} castShadow material={materials.oak}>
          <boxGeometry args={[0.45, 0.12, 0.45]} />
        </mesh>
        <mesh position={[1.35, 0.22, -0.8]} castShadow material={materials.oak}>
          <boxGeometry args={[0.45, 0.12, 0.45]} />
        </mesh>

        <ProductHotspot productId="prod-004" label="06 · Oriente Bed" position={[0, 1.05, 0]} roomIndex={4} />
      </group>

      {/* Nordica Minimalist Daybed (prod-004) near Bedroom Window */}
      <group position={[-11.5, 0, -6.5]} rotation={[0, Math.PI / 2, 0]}>
        {/* Slatted Natural Oak Platform */}
        <mesh position={[0, 0.16, 0]} castShadow material={materials.oak}>
          <boxGeometry args={[2.05, 0.14, 0.88]} />
        </mesh>
        {/* Mattress Cushion */}
        <mesh position={[0, 0.32, 0]} castShadow material={materials.bouclé}>
          <boxGeometry args={[1.98, 0.18, 0.82]} />
        </mesh>
        {/* Saddle Leather Bolster Cushion */}
        <mesh position={[-0.8, 0.46, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.walnut}>
          <cylinderGeometry args={[0.11, 0.11, 0.78, 20]} />
        </mesh>
        <ProductHotspot productId="prod-004" label="07 · Nordica Daybed" position={[0, 0.75, 0]} roomIndex={4} />
      </group>
    </group>
  );
};
