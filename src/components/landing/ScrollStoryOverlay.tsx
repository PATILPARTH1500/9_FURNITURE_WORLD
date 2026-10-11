'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSceneStore } from '@/store/useSceneStore';
import { useCartStore } from '@/store/useCartStore';
import { WOOD_MATERIALS, UPHOLSTERY_MATERIALS, FLAGSHIP_PRODUCT } from '@/data/catalog';
import { ArrowDown, Check, Layers, Sliders, Home, Play } from 'lucide-react';
import Link from 'next/link';
import { BrandFilmModal } from '@/components/media/BrandFilmModal';

export const ScrollStoryOverlay: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const engineeringRef = useRef<HTMLDivElement>(null);
  const materialsRef = useRef<HTMLDivElement>(null);
  const interiorRef = useRef<HTMLDivElement>(null);

  const {
    activeScene,
    selectedWoodId,
    selectedFabricId,
    setActiveScene,
    setScrollProgress,
    setExplodedProgress,
    setSelectedWood,
    setSelectedFabric,
  } = useSceneStore();

  const { addItem } = useCartStore();
  const [isFilmModalOpen, setIsFilmModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Overall scroll progress tracker
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });

      // 2. Scene 0: Hero
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        onEnter: () => setActiveScene(0),
        onEnterBack: () => setActiveScene(0),
      });

      // 3. Scene 1: Engineering / Exploded view
      ScrollTrigger.create({
        trigger: engineeringRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => setActiveScene(1),
        onEnterBack: () => setActiveScene(1),
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress < 0.28) {
            setExplodedProgress(progress / 0.28);
          } else if (progress < 0.72) {
            setExplodedProgress(1.0);
          } else {
            setExplodedProgress((1 - progress) / 0.28);
          }
        },
        onLeave: () => setExplodedProgress(0),
        onLeaveBack: () => setExplodedProgress(0),
      });

      // 4. Scene 2: Materials
      ScrollTrigger.create({
        trigger: materialsRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => {
          setActiveScene(2);
          setExplodedProgress(0);
        },
        onEnterBack: () => {
          setActiveScene(2);
          setExplodedProgress(0);
        },
      });

      // 5. Scene 3: Interior Reveal
      ScrollTrigger.create({
        trigger: interiorRef.current,
        start: 'top 70%',
        end: 'bottom 20%',
        onEnter: () => setActiveScene(3),
        onEnterBack: () => setActiveScene(3),
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [setActiveScene, setScrollProgress, setExplodedProgress]);

  const handleQuickAdd = () => {
    const currentVariant = FLAGSHIP_PRODUCT.variants[0];
    const woodObj = WOOD_MATERIALS.find((w) => w.id === selectedWoodId) || WOOD_MATERIALS[0];
    const fabricObj = UPHOLSTERY_MATERIALS.find((f) => f.id === selectedFabricId) || UPHOLSTERY_MATERIALS[0];

    addItem({
      productId: FLAGSHIP_PRODUCT.id,
      variantId: currentVariant.id,
      productName: FLAGSHIP_PRODUCT.name,
      variantName: `${woodObj.name} / ${fabricObj.name}`,
      woodFinish: woodObj.name,
      fabricFinish: fabricObj.name,
      unitPrice: FLAGSHIP_PRODUCT.price,
      quantity: 1,
      image: FLAGSHIP_PRODUCT.images.hero,
    });
  };

  return (
    <div ref={containerRef} className="relative z-10 w-full pointer-events-none">
      {/* HUD Section Counter (Top Right) */}
      <div className="fixed top-24 right-6 md:right-12 z-20 hidden sm:flex items-center space-x-3 pointer-events-auto">
        <div className="bg-charcoal-900/85 backdrop-blur-md border border-white/10 px-3.5 py-1.5 flex items-center space-x-3 text-[11px] font-mono tracking-widest text-sand-300 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-white">
            {`0${activeScene + 1} · ${['OVERVIEW', 'ANATOMY', 'MATERIALITY', 'SPATIAL', 'CURATION'][activeScene]}`}
          </span>
        </div>
      </div>

      {/* =========================================================================
          SCENE 1: CINEMATIC HERO
         ========================================================================= */}
      <section
        ref={heroRef}
        id="story"
        className="min-h-screen flex flex-col justify-between pt-28 sm:pt-32 pb-12 sm:pb-16 px-6 md:px-16 max-w-7xl mx-auto"
      >
        {/* Top Kicker & Headline (Framed on the left) */}
        <div className="space-y-3 pointer-events-auto max-w-lg">
          <div className="inline-flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase text-accent font-mono">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
            <span>Monograph No. 01 — {FLAGSHIP_PRODUCT.year}</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-ivory font-light leading-[1.05]">
            The Kronos <br />
            <span className="italic font-normal">Lounge Chair</span>
          </h1>
          <p className="text-xs md:text-sm text-sand-300 font-light tracking-wide max-w-md pt-2 leading-relaxed">
            {FLAGSHIP_PRODUCT.description}
          </p>
        </div>

        {/* Hero Bottom Bar & CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pointer-events-auto pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleQuickAdd}
              className="bg-ivory hover:bg-white text-charcoal-950 px-7 py-4 uppercase tracking-[0.25em] text-xs font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <span>Acquire Monograph</span>
              <span className="font-mono text-charcoal-700 font-normal">· $3,450</span>
            </button>
            <Link
              href={`/products/${FLAGSHIP_PRODUCT.slug}`}
              className="border border-white/20 hover:border-white/50 text-sand-200 hover:text-white px-5 py-4 uppercase tracking-[0.25em] text-xs transition-colors text-center"
            >
              Interactive Dossier
            </Link>
            <button
              onClick={() => setIsFilmModalOpen(true)}
              className="border border-accent/40 bg-accent/10 hover:bg-accent/20 text-accent px-5 py-4 uppercase tracking-[0.25em] text-xs transition-all duration-200 flex items-center justify-center space-x-2 group"
            >
              <Play className="w-3.5 h-3.5 fill-current transition-transform group-hover:scale-110" />
              <span>Watch Film</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 text-sand-400 text-xs tracking-widest font-mono">
            <span className="text-[10px] uppercase">Scroll to deconstruct</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-accent" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 2: ENGINEERING / EXPLODED VIEW
         ========================================================================= */}
      <section
        ref={engineeringRef}
        id="engineering"
        className="min-h-[140vh] flex flex-col justify-center px-6 md:px-16 max-w-7xl mx-auto py-24 scroll-mt-24"
      >
        <div className="pointer-events-auto max-w-md space-y-4 bg-charcoal-950/80 backdrop-blur-md p-8 border border-white/10 shadow-2xl">
          <div className="inline-flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase text-accent font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>02 · Structural Architecture</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-ivory tracking-wide leading-tight">
            Separated in space. <br />
            <span className="italic">Tenon-joined permanence.</span>
          </h2>

          <p className="text-xs md:text-sm text-sand-300 font-light leading-relaxed">
            Every component is machined to sub-millimeter tolerances. As you scroll, the solid
            timber armature, ergonomic thoracic incline, and channeled natural latex core separate
            to reveal internal Kyoto mortise-and-tenon craftsmanship.
          </p>

          <div className="pt-2 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-accent font-mono">
              ✦ Click floating gold markers in 3D scene to inspect joinery specifications
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 3: MATERIALS & FINISHES
         ========================================================================= */}
      <section
        ref={materialsRef}
        id="materials"
        className="min-h-screen flex flex-col justify-center px-6 md:px-16 max-w-7xl mx-auto py-24 scroll-mt-24"
      >
        <div className="pointer-events-auto max-w-md ml-auto space-y-6 bg-charcoal-950/85 backdrop-blur-md p-8 border border-white/10 shadow-2xl">
          <div className="inline-flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase text-accent font-mono">
            <Sliders className="w-3.5 h-3.5" />
            <span>03 · Tactile Materiality</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-ivory tracking-wide leading-tight">
            PBR Texture Response
          </h2>

          <p className="text-xs text-sand-300 font-light leading-relaxed">
            Real physically based rendering reacting to ambient studio light. Select materials below
            to dynamically alter the 3D surface roughness, metalness, and tone in real-time.
          </p>

          {/* Timber Swatches */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[10px] tracking-widest uppercase text-sand-400 font-mono block">
              Solid Timber Finish
            </span>
            <div className="grid grid-cols-3 gap-2">
              {WOOD_MATERIALS.map((wood) => {
                const isSelected = selectedWoodId === wood.id;
                return (
                  <button
                    key={wood.id}
                    onClick={() => setSelectedWood(wood.id)}
                    className={`p-2.5 text-left border transition-all ${
                      isSelected
                        ? 'border-accent bg-charcoal-800'
                        : 'border-white/10 hover:border-white/30 bg-charcoal-900/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className="w-3 h-3 rounded-full border border-black/40"
                        style={{ backgroundColor: wood.colorHex }}
                      />
                      {isSelected && <Check className="w-3 h-3 text-accent ml-auto" />}
                    </div>
                    <p className="text-[10px] text-ivory leading-tight truncate">{wood.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upholstery Swatches */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[10px] tracking-widest uppercase text-sand-400 font-mono block">
              Upholstery Textile
            </span>
            <div className="grid grid-cols-3 gap-2">
              {UPHOLSTERY_MATERIALS.map((fab) => {
                const isSelected = selectedFabricId === fab.id;
                return (
                  <button
                    key={fab.id}
                    onClick={() => setSelectedFabric(fab.id)}
                    className={`p-2.5 text-left border transition-all ${
                      isSelected
                        ? 'border-accent bg-charcoal-800'
                        : 'border-white/10 hover:border-white/30 bg-charcoal-900/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className="w-3 h-3 rounded-full border border-black/40"
                        style={{ backgroundColor: fab.colorHex }}
                      />
                      {isSelected && <Check className="w-3 h-3 text-accent ml-auto" />}
                    </div>
                    <p className="text-[10px] text-ivory leading-tight truncate">{fab.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 4: INTERIOR REVEAL & SCALE
         ========================================================================= */}
      <section
        ref={interiorRef}
        id="spaces"
        className="min-h-screen flex flex-col justify-end px-6 md:px-16 max-w-7xl mx-auto pb-24 scroll-mt-24"
      >
        <div className="pointer-events-auto max-w-md space-y-4 bg-charcoal-950/80 backdrop-blur-md p-8 border border-white/10 shadow-2xl">
          <div className="inline-flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase text-accent font-mono">
            <Home className="w-3.5 h-3.5" />
            <span>04 · In Situ Equilibrium</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-ivory tracking-wide leading-tight">
            Resting in Architectural Stillness
          </h2>

          <p className="text-xs md:text-sm text-sand-300 font-light leading-relaxed">
            The camera draws back to reveal the chair resting upon a honed monolithic travertine
            plinth. Natural diagonal sunlight streams across the architectural volume, illustrating
            how quiet proportions ground contemporary living spaces.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center font-mono">
            <div>
              <p className="text-[10px] text-sand-500 uppercase">Width</p>
              <p className="text-sm text-ivory font-semibold">84 cm</p>
            </div>
            <div>
              <p className="text-[10px] text-sand-500 uppercase">Depth</p>
              <p className="text-sm text-ivory font-semibold">89 cm</p>
            </div>
            <div>
              <p className="text-[10px] text-sand-500 uppercase">Height</p>
              <p className="text-sm text-ivory font-semibold">76 cm</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Brand Film Modal */}
      <BrandFilmModal isOpen={isFilmModalOpen} onClose={() => setIsFilmModalOpen(false)} />
    </div>
  );
};
