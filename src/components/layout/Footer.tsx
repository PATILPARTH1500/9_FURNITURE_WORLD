import React from 'react';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/config/brand';
import { ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cream-dark text-checkerboard border-t border-checkerboard/15 pt-20 pb-12 relative overflow-hidden">
      {/* Background brand watermark */}
      <div className="absolute right-0 bottom-0 pointer-events-none select-none opacity-[0.03] text-[12vw] font-serif leading-none tracking-tight font-bold text-checkerboard">
        FURNITURE VILLAGE
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-checkerboard/10">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-5">
            <h3 className="font-serif text-3xl sm:text-4xl tracking-tight text-checkerboard font-semibold">
              {BRAND_CONFIG.name}
            </h3>
            <p className="text-walnut text-sm sm:text-base leading-relaxed max-w-md font-normal">
              {BRAND_CONFIG.subtext}
            </p>
            <div className="pt-2">
              <span className="inline-block text-xs uppercase tracking-wider text-tangerine font-semibold bg-white/70 px-3.5 py-1.5 rounded-full border border-tangerine/20 shadow-2xs">
                {BRAND_CONFIG.announcement}
              </span>
            </div>
          </div>

          {/* Showrooms Column */}
          <div className="md:col-span-3 space-y-4 text-xs">
            <h4 className="text-xs uppercase tracking-wider text-checkerboard font-semibold">
              Experience Stores
            </h4>
            <div className="space-y-4 text-walnut">
              <div>
                <p className="text-checkerboard font-semibold">Bengaluru Flagship</p>
                <p className="font-normal">{BRAND_CONFIG.contact.address}</p>
              </div>
              <div>
                <p className="text-checkerboard font-semibold">Customer Experience</p>
                <p className="font-normal">Walk-in consultations, wood samples, and fabric swatches available.</p>
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-2 space-y-4 text-xs">
            <h4 className="text-xs uppercase tracking-wider text-checkerboard font-semibold">
              Explore
            </h4>
            <ul className="space-y-2.5 text-walnut">
              {BRAND_CONFIG.navigation.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-tangerine transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/collections"
                  className="hover:text-tangerine transition-colors duration-200 inline-flex items-center space-x-1 text-tangerine font-medium"
                >
                  <span>All Furniture</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-2 space-y-4 text-xs">
            <h4 className="text-xs uppercase tracking-wider text-checkerboard font-semibold">
              Help & Support
            </h4>
            <div className="space-y-2.5 text-walnut">
              <a
                href={`mailto:${BRAND_CONFIG.contact.email}`}
                className="hover:text-tangerine transition-colors flex items-center space-x-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-tangerine" />
                <span>{BRAND_CONFIG.contact.email}</span>
              </a>
              <p className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-tangerine" />
                <span>{BRAND_CONFIG.contact.phone}</span>
              </p>
              <p className="text-[11px] text-walnut/80 pt-1">
                Mon — Sat: 9:30 AM – 6:30 PM IST
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-walnut">
          <p>© {new Date().getFullYear()} {BRAND_CONFIG.name}. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-tangerine cursor-pointer transition-colors">Quality Guarantee</span>
            <span className="hover:text-tangerine cursor-pointer transition-colors">Care Guide</span>
            <span className="hover:text-tangerine cursor-pointer transition-colors">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
