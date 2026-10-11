'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSceneStore } from '@/store/useSceneStore';
import { useCartStore } from '@/store/useCartStore';
import { FLAGSHIP_PRODUCT, PRODUCTS_CATALOG } from '@/data/catalog';
import { ArrowDown, Play, Compass, ArrowUpRight, Check, Eye } from 'lucide-react';
import Link from 'next/link';
import { BrandFilmModal } from '@/components/media/BrandFilmModal';
import { ProductQuickDrawer } from '@/components/discovery/ProductQuickDrawer';

const RESIDENCE_ROOMS = [
  { id: 'foyer', name: 'Entrance Foyer', subtitle: 'Stone Portal & Gallery Bench' },
  { id: 'salon', name: 'Main Living Salon', subtitle: 'Bouclé Sectional & Travertine Hearth' },
  { id: 'fireside', name: 'Fireside Seating', subtitle: 'Kronos Lounge Chair & Garden Glazing' },
  { id: 'dining', name: 'Dining Sanctuary', subtitle: '280cm Smoked Walnut Monolith Table' },
  { id: 'sanctuary', name: 'Master Sanctuary', subtitle: 'Low Rift-Oak Platform Bed & Linens' },
  { id: 'vista', name: 'Architectural Vista', subtitle: 'Continuous Residence Overview' },
];

export const ScrollStoryOverlay: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const foyerRef = useRef<HTMLDivElement>(null);
  const salonRef = useRef<HTMLDivElement>(null);
  const firesideRef = useRef<HTMLDivElement>(null);
  const diningRef = useRef<HTMLDivElement>(null);
  const sanctuaryRef = useRef<HTMLDivElement>(null);
  const vistaRef = useRef<HTMLDivElement>(null);

  const {
    activeRoomIndex,
    setActiveRoomIndex,
    setScrollProgress,
    setActiveProduct,
  } = useSceneStore();

  const { addItem } = useCartStore();
  const [isFilmModalOpen, setIsFilmModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Overall continuous scroll progress tracker
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });

      // 2. Room 0: Foyer
      ScrollTrigger.create({
        trigger: foyerRef.current,
        start: 'top top',
        end: 'bottom top',
        onEnter: () => setActiveRoomIndex(0),
        onEnterBack: () => setActiveRoomIndex(0),
      });

      // 3. Room 1: Living Salon
      ScrollTrigger.create({
        trigger: salonRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => setActiveRoomIndex(1),
        onEnterBack: () => setActiveRoomIndex(1),
      });

      // 4. Room 2: Fireside Kronos Lounge
      ScrollTrigger.create({
        trigger: firesideRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => setActiveRoomIndex(2),
        onEnterBack: () => setActiveRoomIndex(2),
      });

      // 5. Room 3: Dining Wing
      ScrollTrigger.create({
        trigger: diningRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => setActiveRoomIndex(3),
        onEnterBack: () => setActiveRoomIndex(3),
      });

      // 6. Room 4: Bedroom Sanctuary
      ScrollTrigger.create({
        trigger: sanctuaryRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => setActiveRoomIndex(4),
        onEnterBack: () => setActiveRoomIndex(4),
      });

      // 7. Room 5: Architectural Vista
      ScrollTrigger.create({
        trigger: vistaRef.current,
        start: 'top 70%',
        end: 'bottom bottom',
        onEnter: () => setActiveRoomIndex(5),
        onEnterBack: () => setActiveRoomIndex(5),
      });

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [setActiveRoomIndex, setScrollProgress]);

  const scrollToRoom = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickAddKronos = () => {
    const currentVariant = FLAGSHIP_PRODUCT.variants[0];
    addItem({
      productId: FLAGSHIP_PRODUCT.id,
      variantId: currentVariant.id,
      productName: FLAGSHIP_PRODUCT.name,
      variantName: currentVariant.name,
      woodFinish: 'Natural White Oak',
      fabricFinish: 'Nordic Bouclé Ivory',
      unitPrice: FLAGSHIP_PRODUCT.price,
      quantity: 1,
      image: FLAGSHIP_PRODUCT.images.hero,
    });
  };

  return (
    <div ref={containerRef} className="relative z-10 w-full pointer-events-none">
      {/* =========================================================================
          HUD RESIDENCE ROOM NAVIGATION (Top Right Floating Bar)
         ========================================================================= */}
      <div className="fixed top-24 right-6 md:right-12 z-30 hidden lg:flex flex-col items-end space-y-2 pointer-events-auto">
        <div className="bg-charcoal-900/90 backdrop-blur-md border border-white/10 px-4 py-2 flex items-center space-x-3 text-[11px] font-mono tracking-widest text-sand-300 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-white uppercase">
            {`0${activeRoomIndex + 1} · ${RESIDENCE_ROOMS[activeRoomIndex]?.name || 'RESIDENCE'}`}
          </span>
        </div>

        {/* Room Waypoint Anchors */}
        <div className="bg-charcoal-950/80 backdrop-blur-md border border-white/5 p-1.5 flex flex-col space-y-1 text-[10px] font-mono">
          {RESIDENCE_ROOMS.map((room, idx) => (
            <button
              key={room.id}
              onClick={() => scrollToRoom(room.id)}
              className={`px-3 py-1 text-left transition-all flex items-center space-x-2 ${
                activeRoomIndex === idx
                  ? 'bg-accent/15 text-accent font-semibold border-l-2 border-accent'
                  : 'text-sand-400 hover:text-white'
              }`}
            >
              <span>0{idx + 1}</span>
              <span className="uppercase tracking-wider">{room.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          ROOM 01: ENTRANCE FOYER
         ========================================================================= */}
      <section
        ref={foyerRef}
        id="foyer"
        className="min-h-screen flex flex-col justify-between pt-28 sm:pt-32 pb-12 sm:pb-16 px-6 md:px-16 max-w-7xl mx-auto scroll-mt-24"
      >
        {/* Top Kicker & Editorial Title */}
        <div className="space-y-3 pointer-events-auto max-w-lg">
          <div className="inline-flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase text-accent font-mono">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
            <span>Architectural Tour — Residence No. 01</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-ivory font-light leading-[1.05]">
            The Continuous <br />
            <span className="italic font-normal">Luxury Residence</span>
          </h1>
          <p className="text-xs md:text-sm text-sand-300 font-light tracking-wide max-w-md pt-2 leading-relaxed">
            Travel through a single architect-designed home. As you scroll, the camera glides
            naturally through connected rooms, revealing furniture and craftsmanship within one continuous
            environment of travertine, natural oak, and warm sunlight.
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pointer-events-auto pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setActiveProduct('prod-003')}
              className="bg-ivory hover:bg-white text-charcoal-950 px-7 py-4 uppercase tracking-[0.25em] text-xs font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <span>Inspect Foyer Bench</span>
              <span className="font-mono text-charcoal-700 font-normal">· $4,200</span>
            </button>
            <button
              onClick={() => setIsFilmModalOpen(true)}
              className="border border-accent/40 bg-accent/10 hover:bg-accent/20 text-accent px-5 py-4 uppercase tracking-[0.25em] text-xs transition-all duration-200 flex items-center justify-center space-x-2 group"
            >
              <Play className="w-3.5 h-3.5 fill-current transition-transform group-hover:scale-110" />
              <span>Watch Film (0:10)</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 text-sand-400 text-xs tracking-widest font-mono">
            <span className="text-[10px] uppercase">Scroll to enter salon</span>
            <ArrowDown className="w-4 h-4 animate-bounce text-accent" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          ROOM 02: MAIN LIVING SALON
         ========================================================================= */}
      <section
        ref={salonRef}
        id="salon"
        className="min-h-[120vh] flex flex-col justify-center px-6 md:px-16 max-w-7xl mx-auto py-24 scroll-mt-24"
      >
        <div className="pointer-events-auto max-w-md space-y-4 bg-charcoal-950/85 backdrop-blur-md p-8 border border-white/10 shadow-2xl">
          <div className="inline-flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase text-accent font-mono">
            <Compass className="w-3.5 h-3.5" />
            <span>02 · The Living Pavilion</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-ivory tracking-wide leading-tight">
            Expansive volume. <br />
            <span className="italic">Grounded stillness.</span>
          </h2>

          <p className="text-xs md:text-sm text-sand-300 font-light leading-relaxed">
            Moving through the stone portal reveals the grand living pavilion. A low-profile modular
            sectional sofa upholstered in textured Nordic bouclé anchors the floor, floating beside
            a raw honed travertine coffee table and the turned solid oak Kyoto pedestal.
          </p>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => setActiveProduct('prod-001')}
              className="text-[10px] uppercase tracking-widest text-accent hover:text-white font-mono flex items-center space-x-1"
            >
              <span>✦ Quick Dossier: Kanso Sectional ($8,400)</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ROOM 03: FIRESIDE FOCAL (KRONOS LOUNGE CHAIR)
         ========================================================================= */}
      <section
        ref={firesideRef}
        id="fireside"
        className="min-h-[120vh] flex flex-col justify-center items-end px-6 md:px-16 max-w-7xl mx-auto py-24 scroll-mt-24"
      >
        <div className="pointer-events-auto max-w-md space-y-4 bg-charcoal-950/85 backdrop-blur-md p-8 border border-white/10 shadow-2xl text-left">
          <div className="inline-flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase text-accent font-mono">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
            <span>03 · Fireside Contemplation</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-ivory tracking-wide leading-tight">
            The Kronos <br />
            <span className="italic">Lounge Chair</span>
          </h2>

          <p className="text-xs md:text-sm text-sand-300 font-light leading-relaxed">
            Positioned beside the cantilevered travertine hearth and garden sliding glass, the
            Kronos armchair balances Japanese mortise-and-tenon armature with relaxed 112° thoracic incline.
          </p>

          <div className="pt-2 border-t border-white/10 flex items-center space-x-4">
            <button
              onClick={handleQuickAddKronos}
              className="bg-ivory hover:bg-white text-charcoal-950 px-4 py-2 text-[10px] uppercase font-mono tracking-widest font-semibold"
            >
              Acquire ($3,450)
            </button>
            <Link
              href={`/products/${FLAGSHIP_PRODUCT.slug}`}
              className="text-[10px] uppercase font-mono tracking-widest text-accent hover:text-white"
            >
              Inspect 3D Dossier →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ROOM 04: DINING WING (SÖLVE MONOLITH TABLE)
         ========================================================================= */}
      <section
        ref={diningRef}
        id="dining"
        className="min-h-[120vh] flex flex-col justify-center px-6 md:px-16 max-w-7xl mx-auto py-24 scroll-mt-24"
      >
        <div className="pointer-events-auto max-w-md space-y-4 bg-charcoal-950/85 backdrop-blur-md p-8 border border-white/10 shadow-2xl">
          <div className="inline-flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase text-accent font-mono">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
            <span>04 · The Dining Sanctuary</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-ivory tracking-wide leading-tight">
            Sölve Monolith. <br />
            <span className="italic">Ceremonial timber.</span>
          </h2>

          <p className="text-xs md:text-sm text-sand-300 font-light leading-relaxed">
            Gliding into the dining pavilion reveals the 280cm smoked walnut monolith, supported
            by fluted twin pedestals and flanked by sculpted Silva dining chairs beneath a linear bronze luminaire.
          </p>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => setActiveProduct('prod-002')}
              className="text-[10px] uppercase tracking-widest text-accent hover:text-white font-mono"
            >
              ✦ Inspect Sölve Dining Table ($6,800)
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ROOM 05: MASTER BEDROOM SANCTUARY
         ========================================================================= */}
      <section
        ref={sanctuaryRef}
        id="sanctuary"
        className="min-h-[120vh] flex flex-col justify-center items-end px-6 md:px-16 max-w-7xl mx-auto py-24 scroll-mt-24"
      >
        <div className="pointer-events-auto max-w-md space-y-4 bg-charcoal-950/85 backdrop-blur-md p-8 border border-white/10 shadow-2xl text-left">
          <div className="inline-flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase text-accent font-mono">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
            <span>05 · The Sleeping Sanctuary</span>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-ivory tracking-wide leading-tight">
            Oriente Platform. <br />
            <span className="italic">Acoustic quiet.</span>
          </h2>

          <p className="text-xs md:text-sm text-sand-300 font-light leading-relaxed">
            Along the gallery corridor lies the private bedroom wing, lined in rift-cut white oak
            wall cladding. The low-profile Oriente bed with Belgian linen bedding rests opposite
            the corner window and Nordica daybed.
          </p>

          <div className="pt-2 border-t border-white/10 flex items-center space-x-4">
            <button
              onClick={() => setActiveProduct('prod-004')}
              className="text-[10px] uppercase tracking-widest text-accent hover:text-white font-mono"
            >
              ✦ Inspect Oriente Suite ($5,600)
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ROOM 06: ARCHITECTURAL VISTA & COLLECTION OVERVIEW
         ========================================================================= */}
      <section
        ref={vistaRef}
        id="vista"
        className="min-h-screen flex flex-col justify-end px-6 md:px-16 max-w-7xl mx-auto py-32 scroll-mt-24"
      >
        <div className="pointer-events-auto max-w-xl space-y-4 bg-charcoal-950/90 backdrop-blur-md p-8 border border-white/10 shadow-2xl">
          <div className="inline-flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase text-accent font-mono">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
            <span>06 · Architectural Conclusion</span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl text-ivory tracking-tight">
            A cohesive language for living.
          </h2>

          <p className="text-xs md:text-sm text-sand-300 font-light leading-relaxed">
            Every edition within Atelier Archetyp is designed to exist in harmony across interconnected
            architectural spaces. Explore the full permanent collection below or order custom finishes.
          </p>

          <div className="pt-4 border-t border-white/10 flex items-center space-x-6">
            <Link
              href="/collections"
              className="bg-ivory hover:bg-white text-charcoal-950 px-6 py-3.5 uppercase tracking-[0.25em] text-xs font-semibold"
            >
              Explore Permanent Collection →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE OVERLAYS: CINEMA MODAL & PRODUCT QUICK DRAWER
         ========================================================================= */}
      <BrandFilmModal isOpen={isFilmModalOpen} onClose={() => setIsFilmModalOpen(false)} />
      <ProductQuickDrawer />
    </div>
  );
};
