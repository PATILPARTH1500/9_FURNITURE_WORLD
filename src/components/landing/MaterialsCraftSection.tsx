'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, Check, ArrowUpRight } from 'lucide-react';

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
    name: 'Solid European White Oak & Smoked Walnut',
    materialType: 'Natural Hardwood',
    specCode: 'FSC® Certified Timber',
    image: '/images/film/macro-joinery.webp',
    description:
      'We work only with kiln-dried solid hardwood, never synthetic wood foils or hollow particleboard. Natural medullary rays and rich grain patterns give every table and chair a unique, living character that deepens over generations.',
    attributes: [
      'Kiln-dried European timber (equilibrium moisture ≤ 8.5%)',
      'Matte natural plant wax-oil botanical hardwax',
      'Zero synthetic veneers, plastic wraps, or formaldehyde adhesives',
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
    specCode: 'Martindale >50,000',
    image: '/images/film/macro-boucle.webp',
    description:
      'Crafted from high-density looped yarns that create a plush, nubby texture that feels warm and cozy. Engineered with natural soil resistance and high rub counts to stay beautiful through daily family living.',
    attributes: [
      'High Martindale abrasion resistance (>50,000 double rubs)',
      'Deep multi-tonal cream looped texture with natural wool blend',
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
    specCode: 'Interlocking Tenon',
    image: '/images/film/exploded-view.webp',
    description:
      'Every leg, rail, and stretcher is fitted with interlocking timber joints and reinforced by concealed steel anchoring pins. This traditional joinery prevents creaks, wobbles, and structural loosening over time.',
    attributes: [
      'Traditional wood-to-wood interlocking mortise-and-tenons',
      'Concealed heavy-duty internal steel anchors at critical stress points',
      '10-year structural frame warranty on all seating and tables',
    ],
    technicalData: [
      { label: 'Tolerance', value: '±0.5 mm Hand-Calibrated' },
      { label: 'Tensile Load', value: '1,450 kgf Joint Resistance' },
      { label: 'Adhesive', value: 'Waterproof Polyurethane Type 1' },
    ],
  },
  {
    id: 'leather-velvet',
    category: 'Luxe Finishes',
    name: 'Top-Grain Leather & Cotton Velvet',
    materialType: 'Supple Finishes',
    specCode: 'Aniline Patina Finish',
    image: '/images/film/cognac-leather.webp',
    description:
      'Our supple cognac leathers and olive velvets are selected for their soft hand-feel and durability. Double-stitched seams along every edge ensure shapes remain tailored and refined through decades of lounging.',
    attributes: [
      'Supple top-grain aniline dye patina finish that deepens with use',
      'Double-stitched reinforced perimeter seams with heavy bonded thread',
      'Naturally breathable surface with rich natural grain variations',
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
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 88%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      gsap.fromTo(
        '.material-card',
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.08,
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
        { opacity: 0.7, y: 6 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  };

  return (
    <section
      id="materials"
      ref={sectionRef}
      className="relative z-20 bg-[#FBF9F5] text-[#1A1816] py-24 sm:py-32 border-t border-[#1A1816]/10 overflow-hidden"
    >
      <span id="materials-craft" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="materials-header flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#1A1816]/10 gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-[#C84D1B] font-semibold">
                Materiality & Texture
              </span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-[#1A1816] font-normal tracking-tight leading-[1.08]">
              Materials That Tell a Story <br />
              <span className="italic font-light text-[#57534E]">In Every Room.</span>
            </h2>
          </div>
          <p className="font-sans text-sm sm:text-base text-[#57534E] leading-relaxed max-w-md font-normal">
            Take a closer look at the medullary timber rays, tactile bouclé loops, and precision interlocking joints that make our furniture rewarding to touch and built to last.
          </p>
        </div>

        {/* 4 Clickable Material Cards */}
        <div className="materials-cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {MATERIALS_STORIES.map((mat) => {
            const isSelected = mat.id === activeMaterial;
            return (
              <button
                key={mat.id}
                onClick={() => handleSelectMaterial(mat.id)}
                className={`material-card group text-left rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#C84D1B] shadow-[0_12px_32px_rgba(200,77,27,0.12)] ring-1 ring-[#C84D1B]/30 -translate-y-1'
                    : 'bg-white/80 hover:bg-white border-[#1A1816]/10 hover:border-[#1A1816]/30 shadow-xs hover:-translate-y-0.5'
                }`}
                aria-pressed={isSelected}
              >
                <div className="relative aspect-[16/11] w-full rounded-2xl overflow-hidden border border-[#1A1816]/8 bg-[#F2EFE9]">
                  <Image
                    src={mat.image}
                    alt={mat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-sans uppercase tracking-[0.16em] text-[#C84D1B] font-semibold block">
                    {mat.materialType}
                  </span>
                  <h3 className="font-serif text-lg text-[#1A1816] font-medium leading-snug group-hover:text-[#C84D1B] transition-colors">
                    {mat.name}
                  </h3>
                </div>

                <div className="pt-2 border-t border-[#1A1816]/8 flex items-center justify-between text-xs font-sans">
                  <span className={`text-xs uppercase tracking-wider ${isSelected ? 'text-[#C84D1B] font-semibold' : 'text-[#666059]'}`}>
                    {isSelected ? 'Selected' : 'Inspect Detail'}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#C84D1B] text-white scale-105'
                        : 'bg-[#1A1816]/5 text-[#1A1816]/40 group-hover:bg-[#C84D1B]/10 group-hover:text-[#C84D1B]'
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
        <div
          ref={detailPanelRef}
          className="bg-white rounded-3xl border border-[#1A1816]/10 p-8 sm:p-12 shadow-[0_12px_40px_rgba(26,24,22,0.05)] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
        >
          {/* Close-up Macro Photo */}
          <div className="lg:col-span-6 relative aspect-[16/10] rounded-2xl overflow-hidden border border-[#1A1816]/10 bg-[#F2EFE9]">
            <Image
              src={selectedMaterial.image}
              alt={selectedMaterial.name}
              fill
              className="object-cover transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Editorial Specs & Technical Data */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#C84D1B] font-semibold block">
                {selectedMaterial.specCode} · {selectedMaterial.materialType}
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1816] font-normal leading-tight">
                {selectedMaterial.name}
              </h3>
            </div>

            <p className="font-sans text-sm sm:text-base text-[#57534E] leading-relaxed font-normal">
              {selectedMaterial.description}
            </p>

            {/* Technical Spec Mini Bento */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FBF9F5] border border-[#1A1816]/8 text-xs font-sans">
              {selectedMaterial.technicalData.map((tech, idx) => (
                <div key={idx} className="space-y-0.5">
                  <span className="text-[#666059] uppercase block text-[10px] tracking-wider font-medium">{tech.label}</span>
                  <span className="font-semibold text-[#1A1816] block text-xs">{tech.value}</span>
                </div>
              ))}
            </div>

            {/* Quality Checklist */}
            <div className="space-y-2.5 pt-2 border-t border-[#1A1816]/10">
              <span className="font-sans text-xs uppercase tracking-wider text-[#666059] font-semibold block">
                Atelier Craft Standards
              </span>
              <ul className="space-y-2">
                {selectedMaterial.attributes.map((attr, aIdx) => (
                  <li key={aIdx} className="flex items-center space-x-3 text-xs sm:text-sm font-sans text-[#57534E]">
                    <span className="w-5 h-5 rounded-full bg-[#4C583E]/15 text-[#4C583E] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                    <span className="font-medium text-[#1A1816]">{attr}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-1 flex items-center space-x-2 text-xs font-sans text-[#57534E]">
              <ShieldCheck className="w-4 h-4 text-[#4C583E] shrink-0" />
              <span>Tested for daily family living resistance and generational structural longevity.</span>
            </div>

            <div className="pt-2">
              <Link
                href="/collections"
                className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-wider bg-[#1A1816] hover:bg-[#C84D1B] text-white font-semibold px-7 py-3.5 rounded-full shadow-2xs transition-all duration-300"
              >
                <span>Explore Works in this Material</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
