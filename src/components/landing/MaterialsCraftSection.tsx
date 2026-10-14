'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Layers, ShieldCheck, Check } from 'lucide-react';

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

  const selectedMaterial =
    MATERIALS_STORIES.find((m) => m.id === activeMaterial) || MATERIALS_STORIES[0];

  return (
    <section className="relative z-20 bg-cream-dark py-24 sm:py-32 border-t border-checkerboard/15 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-checkerboard/15 gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="font-sans text-xs tracking-wider uppercase text-rust font-semibold bg-white/80 px-3.5 py-1.5 rounded-full border border-rust/20 inline-flex items-center space-x-1.5 shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-rust" />
              <span>Tactile Craftsmanship</span>
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

        {/* 4 Materials Staggered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {MATERIALS_STORIES.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMaterial(item.id)}
              className={`group text-left p-4 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                activeMaterial === item.id
                  ? 'bg-white border-tangerine shadow-warm ring-1 ring-tangerine/30 -translate-y-1'
                  : 'bg-white/70 border-checkerboard/10 hover:border-checkerboard/25 hover:bg-white shadow-2xs'
              }`}
            >
              <div className="space-y-4 w-full">
                <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-cream">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold text-checkerboard border border-checkerboard/10">
                    {item.category}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-sans font-semibold text-tangerine uppercase tracking-wider block">
                    {item.materialType}
                  </span>
                  <h3 className="font-serif text-lg text-checkerboard font-semibold leading-snug group-hover:text-tangerine transition-colors">
                    {item.name}
                  </h3>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-checkerboard/5 flex items-center justify-between text-xs font-sans text-walnut w-full">
                <span className="text-[11px]">View Details</span>
                <span className={`w-2 h-2 rounded-full ${activeMaterial === item.id ? 'bg-tangerine' : 'bg-checkerboard/20'}`} />
              </div>
            </button>
          ))}
        </div>

        {/* Featured Material Detailed Showcase Card */}
        <div className="bg-white rounded-3xl border border-checkerboard/15 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative aspect-[16/10] rounded-2xl overflow-hidden border border-checkerboard/10 bg-cream-dark">
            <Image
              src={selectedMaterial.image}
              alt={selectedMaterial.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-sans font-semibold text-checkerboard border border-checkerboard/10 shadow-2xs">
              Macro Detail: {selectedMaterial.category}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="font-sans text-xs uppercase tracking-wider text-tangerine font-semibold">
                {selectedMaterial.materialType}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-checkerboard font-semibold mt-1">
                {selectedMaterial.name}
              </h3>
            </div>

            <p className="font-sans text-sm sm:text-base text-walnut leading-relaxed font-normal">
              {selectedMaterial.description}
            </p>

            <div className="space-y-3 pt-2">
              <p className="font-sans text-xs uppercase tracking-wider text-checkerboard font-semibold">
                Craftsmanship Highlights:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedMaterial.attributes.map((attr, aIdx) => (
                  <div key={aIdx} className="flex items-center space-x-2 text-xs font-sans text-walnut">
                    <span className="w-4 h-4 rounded-full bg-olive/15 text-olive flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span>{attr}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-checkerboard/10 flex items-center justify-between text-xs text-walnut">
              <span>Experience these materials in our Indiranagar showroom</span>
              <span className="font-semibold text-tangerine">Free Swatches by Request</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

