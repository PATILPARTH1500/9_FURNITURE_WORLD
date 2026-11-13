import React from 'react';
import Link from '@/components/common/Link';
import { ArrowRight, Home, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  const showroomSpaces = [
    { name: 'Living Room', desc: 'Curved bouclé seating & lounge chairs', href: '/collections/sanctuary-seating' },
    { name: 'Dining Room', desc: 'Solid American walnut dining tables', href: '/collections/monolith-dining' },
    { name: 'Lighting', desc: 'Mouth-blown glass lighting fixtures', href: '/collections/ambient-horizons' },
    { name: 'Bedroom', desc: 'Velvet upholstered platform beds', href: '/collections' },
  ];

  return (
    <main className="min-h-[75vh] flex flex-col items-center justify-center px-6 py-12 sm:py-16 text-center bg-cream text-checkerboard relative overflow-hidden bg-architectural-grid">
      <div className="absolute inset-0 bg-fine-grain pointer-events-none" />

      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center justify-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-tangerine" />
          <span className="font-sans text-xs uppercase tracking-widest text-tangerine font-semibold">
            Page Not Found · 404
          </span>
        </div>

        <h1 className="font-serif text-6xl sm:text-8xl md:text-9xl font-semibold text-checkerboard tracking-tight">
          4<span className="text-tangerine">0</span>4
        </h1>

        <div className="space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl text-checkerboard font-semibold">
            Page Not Found
          </h2>
          <p className="font-sans text-sm md:text-base text-walnut max-w-lg mx-auto leading-relaxed font-normal">
            The page or furniture item you are looking for could not be found or has been moved.
          </p>
        </div>

        {/* Quick wayfinding destinations */}
        <div className="pt-4 pb-2">
          <span className="font-sans text-xs uppercase tracking-wider text-walnut font-semibold block mb-3">
            Explore Popular Categories
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {showroomSpaces.map((space) => (
              <Link
                key={space.name}
                href={space.href}
                className="group p-4 bg-white/90 backdrop-blur-xs rounded-xl border border-checkerboard/10 hover:border-tangerine/50 transition-all shadow-sm hover:shadow-warm flex items-center justify-between"
              >
                <div>
                  <h3 className="font-serif text-base text-checkerboard group-hover:text-tangerine transition-colors font-semibold">
                    {space.name}
                  </h3>
                  <p className="text-[11px] text-walnut mt-0.5">{space.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-walnut/50 group-hover:text-tangerine group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-tangerine hover:bg-coral text-white font-sans text-xs uppercase tracking-wider font-bold shadow-warm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Virtual Tour</span>
          </Link>
          <Link
            href="/collections"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-white hover:bg-cream-dark text-checkerboard border border-checkerboard/20 font-sans text-xs uppercase tracking-wider font-semibold transition-all"
          >
            <Sparkles className="w-4 h-4 text-tangerine" />
            <span>Explore All Furniture</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
