'use client';

import React, { useEffect, useRef } from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, BookOpen, Compass } from 'lucide-react';

interface EditorialStory {
  id: string;
  theme: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  image: string;
  linkHref: string;
  linkText: string;
  featured?: boolean;
}

const FEATURED_STORY: EditorialStory = {
  id: 'architecture-of-comfort',
  theme: 'Contemporary Living & Architecture · Essay 01',
  title: 'The Architecture of Comfort: Designing Spaces for Everyday Calm',
  subtitle: 'On open spatial rhythm, raking natural light, and why modern homes require softer geometry.',
  excerpt:
    'True comfort is architectural before it is decorative. In an era of rigid angles and sterile showroom minimalism, we explore how generous natural daylight, low-slung seating heights, and tactile organic textures transform domestic residences into sanctuaries of quiet composure and generational ease.',
  image: '/images/collections/collection-sanctuary-seating.webp',
  linkHref: '/#our-story',
  linkText: 'Read Architectural Essay',
  featured: true,
};

const SUPPORTING_STORIES: EditorialStory[] = [
  {
    id: '112-degree-angle',
    theme: 'Furniture Design & Craftsmanship · Story 02',
    title: 'The 112° Angle: Ergonomics, Form, and Living Character',
    excerpt:
      'Why our seating rejects rigid right angles in favor of a relaxed 112° recline that supports natural human posture without the stiff formality of conventional showroom furniture.',
    image: '/images/products/kronos-lounge-chair.webp',
    linkHref: '/collections',
    linkText: 'Explore Seating Craft',
  },
  {
    id: 'living-timber-patina',
    theme: 'Materiality & Finishes · Story 03',
    title: 'Living Timber & Organic Wax: Kiln-Dried Oak to Aniline Patina',
    excerpt:
      'An intimate look at why natural medullary rays, zero-VOC carnauba hardwaxes, and vegetable-dyed full-grain leathers develop deeper character over decades rather than wearing out.',
    image: '/images/materials/hardwood-detail.webp',
    linkHref: '/#materials-craft',
    linkText: 'Inspect Material Standards',
  },
  {
    id: 'checkerboard-rhythm',
    theme: 'Interior Inspiration & Room Styling · Story 04',
    title: 'The Checkerboard Floor: Pairing Graphic Rhythm with Warm Earth Tones',
    excerpt:
      'How bold architectural black-and-cream checkered tiling creates a confident graphic stage for warm walnut dining tables, deep olive velvets, and playful family living.',
    image: '/images/collections/collection-monolith-dining.webp',
    linkHref: '/#room-finder',
    linkText: 'View Room Inspiration',
  },
];

export const EditorialSpreadSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.journal-header',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
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
        '.journal-featured-card',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.journal-featured-card',
            start: 'top 85%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      gsap.fromTo(
        '.journal-story-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.journal-stories-grid',
            start: 'top 88%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="journal"
      ref={sectionRef}
      data-theme="dark"
      className="relative z-20 bg-[#161412] text-[#FBF9F5] py-20 sm:py-28 lg:py-36 border-t border-white/10 overflow-hidden"
    >
      <span id="editorial-spread" className="absolute -top-24 pointer-events-none" aria-hidden="true" />
      <span id="editorial" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="journal-header flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-8 border-b border-white/10 gap-6 sm:gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-sans text-[11px] tracking-widest uppercase text-[#E07A5F] font-semibold bg-[#E07A5F]/15 px-3.5 py-1.5 rounded-full border border-[#E07A5F]/30 inline-flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F]" />
                <span>Section 08 · The Journal · Editorial Stories</span>
              </span>
              <span className="font-sans text-[11px] uppercase tracking-widest text-[#A8A29E] bg-white/5 px-3 py-1 rounded-full border border-white/10 font-medium inline-flex items-center space-x-1">
                <BookOpen className="w-3 h-3 text-[#E07A5F]" />
                <span>Architecture &amp; Living Perspectives</span>
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FBF9F5] font-normal tracking-tight leading-[1.08]">
              Notes on Living, <br />
              <span className="italic font-light text-[#A8A29E]">Architecture &amp; Craft.</span>
            </h2>
          </div>

          <p className="font-sans text-sm sm:text-base text-[#A8A29E] leading-relaxed max-w-md font-normal">
            Articles, material guides, and design perspectives from Furniture World exploring how comfortable furniture, natural materials, and light shape contemporary Indian homes.
          </p>
        </div>

        {/* Lead Featured Cover Story */}
        <div className="journal-featured-card mb-12 sm:mb-16">
          <div className="group bg-white/[0.03] hover:bg-white/[0.05] rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.4)] transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
            {/* Lead Image */}
            <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-black/40">
              <Image
                src={FEATURED_STORY.image}
                alt={FEATURED_STORY.title}
                fill
                className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out filter brightness-[0.92]"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <div className="absolute top-4 left-4 bg-[#161412]/85 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-white/15 text-[11px] font-sans font-medium text-[#FBF9F5] uppercase tracking-wider">
                Featured Cover Story
              </div>
            </div>

            {/* Lead Editorial Copy */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 space-y-4 sm:space-y-6">
              <span className="text-[11px] font-sans uppercase tracking-widest text-[#E07A5F] font-semibold block">
                {FEATURED_STORY.theme}
              </span>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FBF9F5] font-normal leading-tight group-hover:text-[#E07A5F] transition-colors">
                {FEATURED_STORY.title}
              </h3>

              <p className="font-sans text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
                {FEATURED_STORY.excerpt}
              </p>

              <div className="pt-2">
                <Link
                  href={FEATURED_STORY.linkHref}
                  className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-wider bg-white/10 hover:bg-[#C84D1B] border border-white/20 hover:border-transparent text-white font-semibold px-6 py-3.5 rounded-full shadow-2xs transition-all duration-300"
                >
                  <span>{FEATURED_STORY.linkText}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Supporting Editorial Stories (Triptych) */}
        <div className="journal-stories-grid grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {SUPPORTING_STORIES.map((story) => (
            <article
              key={story.id}
              className="journal-story-card group bg-white/[0.03] hover:bg-white/[0.05] rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-500 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out filter brightness-[0.92]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-sans uppercase tracking-widest text-[#E07A5F] font-semibold block">
                    {story.theme}
                  </span>
                  <h4 className="font-serif text-xl sm:text-2xl text-[#FBF9F5] font-normal leading-snug group-hover:text-[#E07A5F] transition-colors">
                    {story.title}
                  </h4>
                  <p className="font-sans text-xs text-[#A8A29E] leading-relaxed pt-1">
                    {story.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Link
                    href={story.linkHref}
                    className="inline-flex items-center space-x-1.5 text-xs font-sans uppercase tracking-wider text-[#FBF9F5] group-hover:text-[#E07A5F] font-semibold transition-colors min-h-[44px]"
                  >
                    <span>{story.linkText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Publication Banner */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#A8A29E]">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-[#E07A5F]" />
            <span>Furniture World Journal · Design Guides &amp; Living Stories</span>
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center space-x-1.5 uppercase tracking-wider text-[#FBF9F5] hover:text-[#E07A5F] font-semibold transition-colors min-h-[44px]"
          >
            <span>Explore All Collections</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
