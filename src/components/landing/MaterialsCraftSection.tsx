'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, ShieldCheck, Check } from 'lucide-react';

interface MaterialStory {
  id: string;
  category: string;
  name: string;
  materialType: string;
  image: string;
  description: string;
  attributes: string[];
}

const MATERIALS_STORIES: MaterialStory[] = [
  {
    id: 'oak-walnut',
    category: 'Timber Selection',
    name: 'Solid European Oak & Smoked Walnut',
    materialType: 'Natural Hardwood',
    image: '/images/film/macro-joinery.jpg',
    description:
      'We work only with kiln-dried solid hardwood, never synthetic wood foils or hollow particleboard. Natural medullary rays and rich grain patterns give every table and chair a unique, living character that deepens over generations.',
    attributes: [
      'Kiln-dried European timber',
      'Matte natural plant wax-oil finish',
      'Zero synthetic veneers or paper wraps',
    ],
  },
  {
    id: 'boucle',
    category: 'Textile Weave',
    name: 'Heavyweight Looped Cream Bouclé',
    materialType: 'Tactile Upholstery',
    image: '/images/film/macro-boucle.jpg',
    description:
      'Crafted from high-density looped yarns that create a plush, nubby texture that feels warm and cozy. Engineered with natural soil resistance and high rub counts to stay beautiful through daily family living.',
    attributes: [
      'High Martindale abrasion resistance',
      'Deep multi-tonal cream texture',
      'Breathable, family-friendly weave',
    ],
  },
  {
    id: 'joinery',
    category: 'Craftsmanship',
    name: 'Precision Mortise-and-Tenon Joints',
    materialType: 'Structural Joinery',
    image: '/images/film/exploded-view.jpg',
    description:
      'Every leg, rail, and stretcher is fitted with interlocking timber joints and reinforced by concealed steel anchoring pins. This traditional joinery prevents creaks, wobbles, and structural loosening over time.',
    attributes: [
      'Traditional wood-to-wood interlocking',
      'Concealed heavy-duty steel anchors',
      '10-year structural frame guarantee',
    ],
  },
  {
    id: 'leather-velvet',
    category: 'Luxe Finishes',
    name: 'Top-Grain Leather & Cotton Velvet',
    materialType: 'Supple Finishes',
    image: '/images/film/cognac-leather.jpg',
    description:
      'Our supple cognac leathers and olive velvets are selected for their soft hand-feel and durability. Double-stitched seams along every edge ensure shapes remain tailored and refined through decades of lounging.',
    attributes: [
      'Supple top-grain aniline dye',
      'Double-stitched reinforced perimeter seams',
      'Naturally ages with a beautiful patina',
    ],
  },
];

export const MaterialsCraftSection: React.FC = () => {
  const [activeMaterial, setActiveMaterial] = useState<string>(MATERIALS_STORIES[0].id);
  const sectionRef = useRef<HTMLElement>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);

  const selectedMaterial =
    MATERIALS_STORIES.find((m) => m.id === activeMaterial) || MATERIALS_STORIES[0];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.materials-header',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 92%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      gsap.fromTo(
        '.material-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.materials-cards-grid',
            start: 'top 90%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate detail panel transition on tab change
  const handleSelectMaterial = (id: string) => {
    if (id === activeMaterial) return;
    setActiveMaterial(id);
    if (detailPanelRef.current) {
      gsap.fromTo(
        detailPanelRef.current,
        { opacity: 0.5, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  };

  return (
    <section
      id="materials-craft"
      ref={sectionRef}
      className="relative z-20 bg-[#F3EFE6] py-24 sm:py-32 border-t border-checkerboard/15 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="materials-header flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-checkerboard/15 gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="font-sans text-xs tracking-wider uppercase text-[#5E3C26] font-semibold bg-white px-3.5 py-1.5 rounded-full border border-[#5E3C26]/20 inline-flex items-center space-x-1.5 shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-rust" />
              <span>Tactile Craftsmanship · Real Materials</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-checkerboard font-semibold tracking-tight leading-[1.15]">
              Materials That Tell a Story <br />
              <span className="italic text-walnut font-normal">In Every Room.</span>
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-walnut leading-relaxed max-w-md font-normal">
            Take a closer look at the timber grain, tactile fabric loops, and interlocking joints that make our furniture rewarding to touch and built to last.
          </p>
        </div>

        {/* 4 Clickable Material Cards Grid */}
        <div className="materials-cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {MATERIALS_STORIES.map((mat) => {
            const isSelected = mat.id === activeMaterial;
            return (
              <button
                key={mat.id}
                onClick={() => handleSelectMaterial(mat.id)}
                className={`material-card group text-left rounded-3xl p-5 border transition-all duration-400 flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-white border-tangerine shadow-warm ring-2 ring-tangerine/30 -translate-y-1.5'
                    : 'bg-white/70 hover:bg-white border-checkerboard/12 hover:border-[#805438]/40 shadow-xs hover:-translate-y-1'
                }`}
                aria-pressed={isSelected}
              >
                <div className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden border border-checkerboard/10 bg-cream">
                  <Image
                    src={mat.image}
                    alt={mat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-106"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[10px] font-sans font-medium uppercase tracking-wider">
                    {mat.category}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-sans uppercase tracking-wider text-rust font-semibold block">
                    {mat.materialType}
                  </span>
                  <h3 className="font-serif text-lg text-checkerboard font-semibold leading-snug group-hover:text-tangerine transition-colors">
                    {mat.name}
                  </h3>
                </div>

                <div className="pt-2 border-t border-checkerboard/10 flex items-center justify-between text-xs font-sans">
                  <span className={isSelected ? 'text-tangerine font-semibold' : 'text-walnut/70'}>
                    {isSelected ? 'Currently Viewing' : 'Click to Inspect'}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-tangerine text-white scale-110'
                        : 'bg-checkerboard/10 text-checkerboard/40 group-hover:bg-tangerine/10 group-hover:text-tangerine'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Material Spotlight Panel */}
        <div
          ref={detailPanelRef}
          className="bg-white rounded-3xl border border-checkerboard/15 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          {/* Close-up Macro Photo with Zoom Hint */}
          <div className="lg:col-span-6 relative aspect-[16/10] rounded-2xl overflow-hidden border border-checkerboard/10 bg-cream-dark">
            <Image
              src={selectedMaterial.image}
              alt={selectedMaterial.name}
              fill
              className="object-cover transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold text-[#5E3C26] border border-checkerboard/15 shadow-2xs">
              Natural Texture · Macro Inspection
            </div>
          </div>

          {/* Editorial Specs & Features */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="font-sans text-xs uppercase tracking-wider text-rust font-semibold block">
                {selectedMaterial.category} · {selectedMaterial.materialType}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-checkerboard font-semibold leading-tight">
                {selectedMaterial.name}
              </h3>
            </div>

            <p className="font-sans text-sm sm:text-base text-checkerboard/85 leading-relaxed font-normal">
              {selectedMaterial.description}
            </p>

            {/* Quality Checklist */}
            <div className="space-y-3 pt-3 border-t border-checkerboard/10">
              <span className="font-sans text-xs uppercase tracking-wider text-checkerboard font-semibold block">
                Confirmed Specifications:
              </span>
              <ul className="space-y-2.5">
                {selectedMaterial.attributes.map((attr, aIdx) => (
                  <li key={aIdx} className="flex items-center space-x-3 text-xs sm:text-sm font-sans text-walnut">
                    <span className="w-5 h-5 rounded-full bg-olive/15 text-olive flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="font-medium text-checkerboard">{attr}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 flex items-center space-x-2 text-xs font-sans text-walnut/80">
              <ShieldCheck className="w-4 h-4 text-olive" />
              <span>Tested for everyday family resistance and generational structural longevity.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
