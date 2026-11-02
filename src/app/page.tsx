'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from '@/components/common/dynamic';
import { CinematicResidenceTour } from '@/components/cinema/CinematicResidenceTour';

const CuratedCollectionSection = dynamic(
  () => import('@/components/landing/CuratedCollectionSection').then((mod) => mod.CuratedCollectionSection),
  { ssr: true }
);
const ArtOfLivingSection = dynamic(
  () => import('@/components/landing/ArtOfLivingSection').then((mod) => mod.ArtOfLivingSection),
  { ssr: true }
);
const MaterialsCraftSection = dynamic(
  () => import('@/components/landing/MaterialsCraftSection').then((mod) => mod.MaterialsCraftSection),
  { ssr: true }
);
const CustomerReviewsCarousel = dynamic(
  () => import('@/components/landing/CustomerReviewsCarousel').then((mod) => mod.CustomerReviewsCarousel),
  { ssr: true }
);
const RoomDiscoverySection = dynamic(
  () => import('@/components/landing/RoomDiscoverySection').then((mod) => mod.RoomDiscoverySection),
  { ssr: true }
);
const EditorialSpreadSection = dynamic(
  () => import('@/components/landing/EditorialSpreadSection').then((mod) => mod.EditorialSpreadSection),
  { ssr: true }
);
const GazetteNewsletterSection = dynamic(
  () => import('@/components/landing/GazetteNewsletterSection').then((mod) => mod.GazetteNewsletterSection),
  { ssr: true }
);

export default function HomePage() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Refresh ScrollTrigger on direct anchor navigation
    const handleHash = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('hashchange', handleHash);

    return () => {
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-[#FAF8F5] text-checkerboard overflow-x-hidden w-full">
      {/* SECTION 01: Cinematic Scroll-Driven 5-Scene Residence Tour (Opening Experience) */}
      <CinematicResidenceTour />

      {/* SECTION 02 & 03: Featured Collections (Lookbook) & Curated Furniture (Showroom Floor) */}
      <CuratedCollectionSection />

      {/* SECTION 04: Brand Philosophy — The Art of Living (Manifesto & Commitments) */}
      <ArtOfLivingSection />

      {/* SECTION 05: Materials & Craftsmanship (Tactile Details & Swatch Inspector) */}
      <MaterialsCraftSection />

      {/* Interactive Room Discovery — Reconnect with Residence Scenes */}
      <RoomDiscoverySection />

      {/* Real Homes & Verified Reviews Carousel */}
      <CustomerReviewsCarousel />

      {/* SECTION 06: Editorial Feature & Flagship Atelier (Consultation & Service Hallmarks) */}
      <EditorialSpreadSection />

      {/* SECTION 07: The Gazette (Seasonal Newsletter & Private Dispatch) */}
      <GazetteNewsletterSection />
    </main>
  );
}
