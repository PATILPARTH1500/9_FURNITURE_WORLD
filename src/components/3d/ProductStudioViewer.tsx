'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { FurnitureModel } from './FurnitureModel';
import { useSceneStore } from '@/store/useSceneStore';
import { WOOD_MATERIALS, UPHOLSTERY_MATERIALS } from '@/data/catalog';
import { RotateCcw, Layers, Check } from 'lucide-react';

interface ProductStudioViewerProps {
  hasCustom3DModel?: boolean;
}

export const ProductStudioViewer: React.FC<ProductStudioViewerProps> = () => {
  const [exploded, setExploded] = useState(false);
  const {
    selectedWoodId,
    selectedFabricId,
    setSelectedWood,
    setSelectedFabric,
    setExplodedProgress,
  } = useSceneStore();

  const handleToggleExploded = () => {
    const nextState = !exploded;
    setExploded(nextState);
    setExplodedProgress(nextState ? 1.0 : 0.0);
  };

  return (
    <div className="relative w-full h-[550px] lg:h-[700px] bg-white border border-checkerboard/10 rounded-2xl shadow-sm overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [2.2, 1.2, 2.8], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.9} color="#FFF8F0" />
          <directionalLight
            position={[4, 5, 4]}
            intensity={1.8}
            color="#FFF2E0"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-3, 2, -3]} intensity={0.6} color="#E8EEF5" />
          <pointLight position={[0, 3, -2]} intensity={0.6} color="#F4510B" />

          <ContactShadows
            position={[0, -0.305, 0]}
            opacity={0.35}
            scale={5}
            blur={1.8}
            far={2}
            color="#29251F"
          />

          <FurnitureModel interactive={true} />

          <OrbitControls
            enablePan={false}
            minDistance={1.8}
            maxDistance={4.8}
            maxPolarAngle={Math.PI / 2 + 0.05}
            autoRotate={!exploded}
            autoRotateSpeed={0.8}
          />
        </Suspense>
      </Canvas>

      {/* Floating Controls Overlay (Top) */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-checkerboard/90 backdrop-blur-md text-white border border-white/10 px-4 py-2 rounded-lg pointer-events-auto shadow-md">
          <span className="text-[11px] uppercase font-mono tracking-wider text-cream">
            Interactive 3D Studio · Drag to Spin
          </span>
        </div>

        <button
          onClick={handleToggleExploded}
          className={`pointer-events-auto flex items-center space-x-2 text-xs uppercase tracking-wider px-4 py-2 rounded-lg border transition-all shadow-md ${
            exploded
              ? 'bg-tangerine text-white border-tangerine font-semibold'
              : 'bg-white/95 backdrop-blur-md text-checkerboard border-checkerboard/15 hover:border-checkerboard/30'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{exploded ? 'Assemble View' : 'Exploded View'}</span>
        </button>
      </div>

      {/* Floating Finish Selector (Bottom) */}
      <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pointer-events-none z-10">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-checkerboard/10 shadow-lg flex items-center space-x-4">
          {/* Wood Finishes */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-checkerboard/60">Wood:</span>
            <div className="flex space-x-1.5">
              {WOOD_MATERIALS.map((wood) => (
                <button
                  key={wood.id}
                  onClick={() => setSelectedWood(wood.id)}
                  title={wood.name}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    selectedWoodId === wood.id
                      ? 'border-tangerine scale-110 shadow-md ring-2 ring-tangerine/30'
                      : 'border-black/10 hover:scale-105'
                  }`}
                  style={{ backgroundColor: wood.colorHex }}
                >
                  {selectedWoodId === wood.id && <Check className="w-3 h-3 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          <span className="text-checkerboard/20">|</span>

          {/* Fabric Finishes */}
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-checkerboard/60">Fabric:</span>
            <div className="flex space-x-1.5">
              {UPHOLSTERY_MATERIALS.map((fab) => (
                <button
                  key={fab.id}
                  onClick={() => setSelectedFabric(fab.id)}
                  title={fab.name}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    selectedFabricId === fab.id
                      ? 'border-tangerine scale-110 shadow-md ring-2 ring-tangerine/30'
                      : 'border-black/10 hover:scale-105'
                  }`}
                  style={{ backgroundColor: fab.colorHex }}
                >
                  {selectedFabricId === fab.id && <Check className="w-3 h-3 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-auto hidden md:block text-[10px] font-mono text-checkerboard/70 uppercase tracking-wider bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-lg border border-checkerboard/10 shadow-md">
          Scroll: Zoom · Drag: Rotate
        </div>
      </div>
    </div>
  );
};

