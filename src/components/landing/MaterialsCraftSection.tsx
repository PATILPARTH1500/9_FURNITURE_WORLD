'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from '@/components/common/Image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, ShieldCheck, Check, ArrowUpRight, Cpu } from 'lucide-react';
import { AnimatedHeading, SpotlightCard, MagneticButton, TextRoll } from '@/components/ui/motion';

interface MaterialStory {
  id: string;
  category: string;
  name: string;
  materialType: string;
  specCode: string;
  image: string;
  description: string;
  attributes: string[];
  technicalData: { label: string; value: string }[];
}

const MATERIALS_STORIES: MaterialStory[] = [
  {
    id: 'oak-walnut',
    category: 'Timber Selection',
    name: 'Solid European Oak & Smoked Walnut',
    materialType: 'Natural Hardwood',
    specCode: '[ FSC®-C119822 CERTIFIED ]',
    image: '/images/film/macro-joinery.webp',
    description:
      'We work only with kiln-dried solid hardwood, never synthetic wood foils or hollow particleboard. Natural medullary rays and rich grain patterns give every table and chair a unique, living character that deepens over generations.',
    attributes: [
      'Kiln-dried European timber (moisture ≤ 8.5%)',
      'Matte natural plant wax-oil botanical finish',
      'Zero synthetic veneers or plastic wraps',
    ],
    technicalData: [
      { label: 'Density', value: '720 kg/m³' },
      { label: 'Finish', value: 'Organic Carnauba Hardwax' },
      { label: 'Origin', value: 'Sustainably Forested Bavaria' },
    ],
  },
  {
    id: 'boucle',
    category: 'Textile Weave',
    name: 'Heavyweight Looped Cream Bouclé',
    materialType: 'Tactile Upholstery',
    specCode: '[ MARTINDALE: >50,000 CYCLES ]',
    image: '/images/film/macro-boucle.webp',
    description:
      'Crafted from high-density looped yarns that create a plush, nubby texture that feels warm and cozy. Engineered with natural soil resistance and high rub counts to stay beautiful through daily family living.',
    attributes: [
      'High Martindale abrasion resistance (>50,000)',
      'Deep multi-tonal cream looped texture',
      'Breathable, family-friendly soil-resistant weave',
    ],
    technicalData: [
      { label: 'Weight', value: '620 g/m²' },
      { label: 'Pilling', value: 'Grade 4-5 (ISO 12945)' },
      { label: 'Flammability', value: 'EN 1021-1 & 2' },
    ],
  },
  {
    id: 'joinery',
    category: 'Craftsmanship',
    name: 'Precision Mortise-and-Tenon Joints',
    materialType: 'Structural Joinery',
    specCode: '[ TOLERANCE: ±0.5MM JOINERY ]',
    image: '/images/film/exploded-view.webp',
    description:
      'Every leg, rail, and stretcher is fitted with interlocking timber joints and reinforced by concealed steel anchoring pins. This traditional joinery prevents creaks, wobbles, and structural loosening over time.',
    attributes: [
      'Traditional wood-to-wood interlocking tenons',
      'Concealed heavy-duty internal steel anchors',
      '10-year structural frame guarantee',
    ],
    technicalData: [
      { label: 'Tolerance', value: '±0.5 mm CNC & Hand-Shaved' },
      { label: 'Tensile Load', value: '1,450 kgf Joint Resistance' },
      { label: 'Adhesive', value: 'Type 1 Waterproof Polyurethane' },
    ],
  },
  {
    id: 'leather-velvet',
    category: 'Luxe Finishes',
    name: 'Top-Grain Leather & Cotton Velvet',
    materialType: 'Supple Finishes',
    specCode: '[ ANILINE DYE · ZERO FOILS ]',
    image: '/images/film/cognac-leather.webp',
    description:
      'Our supple cognac leathers and olive velvets are selected for their soft hand-feel and durability. Double-stitched seams along every edge ensure shapes remain tailored and refined through decades of lounging.',
    attributes: [
      'Supple top-grain aniline dye patina finish',
      'Double-stitched reinforced perimeter seams',
      'Naturally ages with rich character over time',
    ],
    technicalData: [
      { label: 'Thickness', value: '1.3 - 1.5 mm' },
      { label: 'Tannage', value: 'Vegetable-Enhanced Aniline' },
      { label: 'Lightfastness', value: 'Grade 5 (ISO 105-B02)' },
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
      className="relative z-20 bg-[#F3EFE6] py-24 sm:py-32 border-t border-checkerboard/15 overflow-hidden bg-architectural-grid-dense"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header with Notion Blueprint Tag */}
        <div className="materials-header flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-checkerboard/15 gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-sans text-xs tracking-wider uppercase text-[#5E3C26] font-semibold bg-white px-3.5 py-1.5 rounded-full border border-[#5E3C26]/20 inline-flex items-center space-x-1.5 shadow-2xs">
                <Layers className="w-3.5 h-3.5 text-tangerine" />
                <span>Tactile Craftsmanship · Real Materials</span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-walnut/80 bg-white/70 px-2.5 py-1 rounded-md border border-checkerboard/10">
                [ ATELIER WORKBENCH · MATERIAL CODEX ]
              </span>
            </div>
            <AnimatedHeading
              text="Materials That Tell a Story In Every Room."
              highlightText="In Every Room."
              highlightClassName="italic text-walnut font-normal"
              className="font-serif text-3xl sm:text-4xl md:text-5xl text-checkerboard font-semibold tracking-tight leading-[1.12]"
            />
          </div>
          <p className="font-sans text-sm sm:text-base text-walnut leading-relaxed max-w-md font-normal">
            Take a closer look at the timber grain, tactile fabric loops, and interlocking joints that make our furniture rewarding to touch and built to last.
          </p>
        </div>

        {/* 4 Clickable Material Cards Grid with Notion Spec Badges */}
        <div className="materials-cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {MATERIALS_STORIES.map((mat) => {
            const isSelected = mat.id === activeMaterial;
            return (
              <button
                key={mat.id}
                onClick={() => handleSelectMaterial(mat.id)}
                className={`material-card group text-left rounded-3xl p-5 border transition-all duration-400 flex flex-col justify-between space-y-4 cursor-pointer ${
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
                  <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[9px] font-mono font-medium uppercase tracking-wider">
                    {mat.specCode}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-tangerine font-semibold block">
                    {mat.materialType}
                  </span>
                  <h3 className="font-serif text-lg text-checkerboard font-semibold leading-snug group-hover:text-tangerine transition-colors">
                    {mat.name}
                  </h3>
                </div>

                <div className="pt-2 border-t border-checkerboard/10 flex items-center justify-between text-xs font-sans">
                  <span className={`font-mono text-[11px] uppercase tracking-wider ${isSelected ? 'text-tangerine font-semibold' : 'text-walnut/70'}`}>
                    {isSelected ? '[ VIEWING ]' : '[ INSPECT ]'}
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

        {/* Selected Material Spotlight Inspector Panel */}
        <SpotlightCard
          ref={detailPanelRef}
          className="bg-white rounded-3xl border border-checkerboard/15 p-8 sm:p-12 shadow-sm"
          contentClassName="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
          spotlightColor="rgba(244, 81, 11, 0.08)"
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
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold text-checkerboard border border-checkerboard/15 shadow-2xs flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-tangerine" />
              <span>MACRO INSPECTION · 10X RESOLUTION</span>
            </div>
          </div>

          {/* Editorial Specs & Technical Data Bento */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs uppercase tracking-wider text-tangerine font-semibold">
                  {selectedMaterial.specCode}
                </span>
                <span className="text-walnut/40">·</span>
                <span className="font-mono text-xs uppercase tracking-wider text-walnut">
                  {selectedMaterial.materialType}
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-checkerboard font-semibold leading-tight">
                {selectedMaterial.name}
              </h3>
            </div>

            <p className="font-sans text-sm sm:text-base text-checkerboard/85 leading-relaxed font-normal">
              {selectedMaterial.description}
            </p>

            {/* Notion Technical Spec Mini Grid */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-cream/60 border border-checkerboard/10 font-mono text-[11px]">
              {selectedMaterial.technicalData.map((tech, idx) => (
                <div key={idx} className="space-y-0.5">
                  <span className="text-walnut/70 uppercase block text-[9px]">{tech.label}</span>
                  <span className="font-semibold text-checkerboard block">{tech.value}</span>
                </div>
              ))}
            </div>

            {/* Quality Checklist */}
            <div className="space-y-2.5 pt-2 border-t border-checkerboard/10">
              <span className="font-mono text-[10px] uppercase tracking-wider text-walnut font-semibold block">
                [ CONFIRMED ATELIER SPECIFICATIONS ]
              </span>
              <ul className="space-y-2">
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

            <div className="pt-1 flex items-center space-x-2 text-xs font-sans text-walnut/80">
              <ShieldCheck className="w-4 h-4 text-olive shrink-0" />
              <span>Tested for everyday family resistance and generational structural longevity.</span>
            </div>

            <div className="pt-2 flex items-center">
              <MagneticButton
                href="/collections"
                className="space-x-2 text-xs font-sans uppercase tracking-wider bg-checkerboard hover:bg-tangerine text-white font-medium px-6 py-3.5 rounded-full shadow-2xs hover:shadow-warm transition-all duration-300 inline-flex items-center"
              >
                <TextRoll>Explore Handcrafted Pieces</TextRoll>
                <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
};
