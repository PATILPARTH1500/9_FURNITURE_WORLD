import React from 'react';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/config/brand';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-charcoal-950 text-sand-200 border-t border-white/10 pt-20 pb-12 relative overflow-hidden">
      {/* Background architectural watermark */}
      <div className="absolute right-0 bottom-0 pointer-events-none select-none opacity-[0.02] text-[18vw] font-serif leading-none tracking-tight font-light">
        ARCHETYP
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/5">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <h3 className="font-serif text-3xl tracking-[0.2em] text-ivory uppercase">
              {BRAND_CONFIG.name}
            </h3>
            <p className="text-sand-400 text-sm leading-relaxed max-w-md font-light">
              {BRAND_CONFIG.subtext}
            </p>
            <div className="pt-2">
              <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-accent border-b border-accent/40 pb-0.5">
                {BRAND_CONFIG.announcement}
              </span>
            </div>
          </div>

          {/* Showrooms Column */}
          <div className="md:col-span-3 space-y-4 text-xs tracking-wider">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-ivory font-mono">
              Showrooms & Ateliers
            </h4>
            <div className="space-y-4 text-sand-400">
              <div>
                <p className="text-sand-200 uppercase font-medium">Copenhagen Atelier</p>
                <p className="text-sand-400 font-light">{BRAND_CONFIG.contact.address}</p>
              </div>
              <div>
                <p className="text-sand-200 uppercase font-medium">Tokyo Gallery</p>
                <p className="text-sand-400 font-light">{BRAND_CONFIG.contact.showroom}</p>
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-2 space-y-4 text-xs tracking-wider">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-ivory font-mono">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sand-400">
              {BRAND_CONFIG.navigation.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/collections"
                  className="hover:text-white transition-colors duration-200 flex items-center space-x-1 text-accent"
                >
                  <span>All Works</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Inquiries */}
          <div className="md:col-span-2 space-y-4 text-xs tracking-wider">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-ivory font-mono">
              Concierge
            </h4>
            <div className="space-y-2 text-sand-400">
              <p className="hover:text-white transition-colors cursor-pointer">
                {BRAND_CONFIG.contact.email}
              </p>
              <p>{BRAND_CONFIG.contact.phone}</p>
              <p className="text-[10px] text-sand-500 pt-2">
                Monday — Saturday: 09:00 - 18:00 CET
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-sand-500 tracking-widest font-mono">
          <p>© {new Date().getFullYear()} {BRAND_CONFIG.name}. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 uppercase">
            <span className="hover:text-sand-300 cursor-pointer">Material Provenance</span>
            <span className="hover:text-sand-300 cursor-pointer">Architectural Trade</span>
            <span className="hover:text-sand-300 cursor-pointer">Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

