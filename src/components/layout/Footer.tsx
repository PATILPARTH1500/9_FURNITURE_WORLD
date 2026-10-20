import React from 'react';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/config/brand';
import { ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#15120F] text-[#FAF8F5] border-t border-white/10 pt-20 pb-12 relative overflow-hidden">
      {/* Background brand watermark */}
      <div
        className="absolute right-0 bottom-0 pointer-events-none select-none opacity-[0.03] text-[12vw] font-serif leading-none tracking-tight font-bold text-white"
        aria-hidden="true"
      >
        FURNITURE VILLAGE
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-5">
            <h3 className="font-serif text-3xl sm:text-4xl tracking-tight text-[#FAF8F5] font-semibold">
              {BRAND_CONFIG.name}
            </h3>
            <p className="text-[#C8BCAC] text-sm sm:text-base leading-relaxed max-w-md font-normal">
              {BRAND_CONFIG.subtext}
            </p>
            <div className="pt-2">
              <span className="inline-block text-xs uppercase tracking-wider text-tangerine-light font-semibold bg-white/10 px-3.5 py-1.5 rounded-full border border-tangerine/30 shadow-2xs">
                {BRAND_CONFIG.announcement}
              </span>
            </div>
          </div>

          {/* Showrooms Column */}
          <div className="md:col-span-3 space-y-4 text-xs">
            <h4 className="text-xs uppercase tracking-wider text-[#FAF8F5] font-semibold">
              Experience Stores
            </h4>
            <div className="space-y-4 text-[#C8BCAC]">
              <div>
                <p className="text-[#FAF8F5] font-semibold">Bengaluru Flagship</p>
                <p className="font-normal mt-0.5">{BRAND_CONFIG.contact.address}</p>
              </div>
              <div>
                <p className="text-[#FAF8F5] font-semibold">Customer Experience</p>
                <p className="font-normal mt-0.5">Walk-in consultations, solid wood samples, and tactile fabric swatches available.</p>
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-2 space-y-4 text-xs">
            <h4 className="text-xs uppercase tracking-wider text-[#FAF8F5] font-semibold">
              Explore
            </h4>
            <ul className="space-y-2.5 text-[#C8BCAC]">
              {BRAND_CONFIG.navigation.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-tangerine-light transition-colors text-[#C8BCAC] inline-block py-0.5 font-medium relative group"
                  >
                    <span>{item.label}</span>
                    <span
                      className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-tangerine rounded-full transition-all duration-300 ease-out group-hover:w-full"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/collections"
                  className="hover:text-coral transition-colors text-tangerine-light font-medium inline-flex items-center space-x-1 py-0.5 relative group"
                >
                  <span className="relative">
                    All Furniture
                    <span
                      className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-tangerine rounded-full transition-all duration-300 ease-out group-hover:w-full"
                      aria-hidden="true"
                    />
                  </span>
                  <ArrowUpRight
                    className="w-3.5 h-3.5 text-tangerine-light transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-2 space-y-4 text-xs">
            <h4 className="text-xs uppercase tracking-wider text-[#FAF8F5] font-semibold">
              Help & Support
            </h4>
            <div className="space-y-2.5 text-[#C8BCAC]">
              <a
                href={`mailto:${BRAND_CONFIG.contact.email}`}
                className="hover:text-tangerine-light transition-colors flex items-center space-x-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-tangerine" />
                <span>{BRAND_CONFIG.contact.email}</span>
              </a>
              <p className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-tangerine" />
                <span>{BRAND_CONFIG.contact.phone}</span>
              </p>
              <p className="text-[11px] text-[#A69A8A] pt-1">
                Mon — Sat: 9:30 AM – 6:30 PM IST
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#A69A8A] gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p>© {new Date().getFullYear()} {BRAND_CONFIG.name}. All rights reserved.</p>
            <p className="text-[11px] text-[#8C8072]">
              {BRAND_CONFIG.contact.legalEntity} · GSTIN: {BRAND_CONFIG.contact.gstin}
            </p>
          </div>
          <div className="flex space-x-6">
            <span className="hover:text-tangerine-light cursor-pointer transition-colors">Quality Guarantee</span>
            <span className="hover:text-tangerine-light cursor-pointer transition-colors">Care Guide</span>
            <span className="hover:text-tangerine-light cursor-pointer transition-colors">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
