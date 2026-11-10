'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from '@/components/common/Image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { AnimatedHeading, MagneticButton, SpotlightCard } from '@/components/ui/motion';

interface ReviewItem {
  id: string;
  author: string;
  location: string;
  itemPurchased: string;
  quote: string;
  roomPhoto: string;
  roomName: string;
}

const CUSTOMER_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-01',
    author: 'Priya & Vikram Malhotra',
    location: 'Indiranagar, Bengaluru',
    itemPurchased: 'Arcos Curved Bouclé Sofa',
    quote:
      'The curved shape completely opened up our living space. Our two children love reading on it, and the textured cream bouclé fabric is so soft and cleans up with ease. Truly transforms the atmosphere of the room.',
    roomPhoto: '/videos/scenes/posters/scene-1-living.webp',
    roomName: 'Living Room',
  },
  {
    id: 'rev-02',
    author: 'Ananya Deshmukh',
    location: 'Bandra West, Mumbai',
    itemPurchased: 'Sölve Round Walnut Dining Table',
    quote:
      'We host Sunday family lunches every week. The solid walnut top feels silky smooth and warm to the touch, and having six adults seated around the round pedestal allows everyone to chat effortlessly.',
    roomPhoto: '/videos/scenes/posters/scene-2-dining.webp',
    roomName: 'Dining Room',
  },
  {
    id: 'rev-03',
    author: 'Rohan & Meera Sen',
    location: 'Jubilee Hills, Hyderabad',
    itemPurchased: 'Nordica Olive Velvet Bed & Nightstands',
    quote:
      'The olive velvet is rich without being loud. The two-person delivery team brought everything up to our 4th-floor apartment, assembled the solid timber frame in 35 minutes, and cleared away all the packaging.',
    roomPhoto: '/videos/scenes/posters/scene-5-bedroom.webp',
    roomName: 'Master Bedroom',
  },
  {
    id: 'rev-04',
    author: 'Kavita Krishnan',
    location: 'Koramangala, Bengaluru',
    itemPurchased: 'Kronos Lounge Chair in Natural Oak',
    quote:
      'Visited the Indiranagar flagship showroom to test the cushion density in person. The gentle 112-degree recline and hand-smoothed oak armrests make it the most relaxing chair in our home.',
    roomPhoto: '/images/film/hero-plinth.webp',
    roomName: 'Reading Corner',
  },
  {
    id: 'rev-05',
    author: 'Aditya & Tanya Verma',
    location: 'Vasant Vihar, New Delhi',
    itemPurchased: 'Checkerboard Lounge & Tangerine Table',
    quote:
      'The orange accent table brings just the right touch of playful 70s modern warmth to our lounge. The craftsmanship of the timber joinery and lacquered finish exceeded all our expectations.',
    roomPhoto: '/videos/scenes/posters/scene-4-lounge.webp',
    roomName: 'Family Lounge',
  },
];

export const CustomerReviewsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalReviews = CUSTOMER_REVIEWS.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
  }, [totalReviews]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  }, [totalReviews]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reviews-header',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );

      gsap.fromTo(
        '.reviews-viewport',
        { opacity: 0, y: 20, scale: 0.99 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 88%',
            once: true,
            fastScrollEnd: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    setTouchStart(null);
  };

  return (
    <section
      id="customer-reviews"
      ref={sectionRef}
      className="relative z-20 bg-[#FBF9F5] py-24 sm:py-32 border-t border-stone-200/80 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Customer stories and reviews carousel"
      aria-roledescription="carousel"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header with Controls */}
        <div className="reviews-header flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-stone-200/80 gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="font-sans text-[11px] tracking-widest uppercase text-[#C84D1B] font-semibold bg-[#C84D1B]/10 px-3.5 py-1.5 rounded-full border border-[#C84D1B]/20 inline-flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
              <span>Real Homes · Customer Experiences</span>
            </span>
            <AnimatedHeading
              text="Loved in Real Homes Across India."
              highlightText="Across India."
              highlightClassName="italic text-[#57534E] font-normal"
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1A1816] font-light tracking-tight leading-[1.12]"
            />
          </div>

          <div className="flex items-center space-x-4">
            <p className="hidden lg:block text-xs font-sans text-[#78716C]">
              Impressions from flagship showroom visitors and direct residence deliveries.
            </p>

            <div className="flex items-center space-x-2">
              <MagneticButton
                onClick={prevSlide}
                magneticStrength={0.3}
                maxDistance={8}
                className="p-3 rounded-full border border-stone-200/80 bg-white hover:bg-[#1A1816] text-[#1A1816] hover:text-white transition-all shadow-2xs focus:outline-hidden"
                ariaLabel="Previous customer story"
              >
                <ChevronLeft className="w-4 h-4" />
              </MagneticButton>

              <MagneticButton
                onClick={nextSlide}
                magneticStrength={0.3}
                maxDistance={8}
                className="p-3 rounded-full border border-stone-200/80 bg-white hover:bg-[#1A1816] text-[#1A1816] hover:text-white transition-all shadow-2xs focus:outline-hidden"
                ariaLabel="Next customer story"
              >
                <ChevronRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div
          ref={containerRef}
          className="reviews-viewport relative overflow-hidden cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-live="polite"
        >
          <div
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {CUSTOMER_REVIEWS.map((review, idx) => (
              <div
                key={review.id}
                className="w-full shrink-0 px-2 sm:px-4"
                aria-hidden={idx !== currentIndex}
              >
                <SpotlightCard
                  className="group bg-white rounded-2xl border border-stone-200/80 p-8 sm:p-12 shadow-[0_8px_30px_rgba(26,24,22,0.05)] hover:shadow-[0_16px_40px_rgba(26,24,22,0.08)] transition-all duration-500"
                  contentClassName="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                  spotlightColor="rgba(200, 77, 27, 0.04)"
                >
                  {/* Left Column: Room Photograph */}
                  <div className="lg:col-span-5 relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-200/80 bg-[#F2EFE9]">
                    <Image
                      src={review.roomPhoto}
                      alt={`${review.author}'s ${review.itemPurchased}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-104"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                  </div>

                  {/* Right Column: Review Text & Attribution */}
                  <div className="lg:col-span-7 space-y-6">
                    <Quote className="w-10 h-10 text-[#C84D1B]/25 -mb-2" />
                    <blockquote
                      data-testid="customer-review-quote"
                      className="font-serif text-xl sm:text-2xl lg:text-[1.65rem] text-[#1A1816] leading-snug font-light"
                    >
                      &ldquo;{review.quote}&rdquo;
                    </blockquote>

                    <div className="pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-serif text-lg text-[#1A1816] font-medium">
                          {review.author}
                        </p>
                        <p className="font-sans text-xs text-[#78716C] mt-0.5">
                          {review.location}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <span className="inline-block text-[11px] font-sans font-medium text-[#C84D1B] bg-[#C84D1B]/10 px-3 py-1 rounded-full border border-[#C84D1B]/20">
                          {review.itemPurchased}
                        </span>
                      </div>
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicators */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-sans text-[#78716C]">
            * Curated patron reflections & living stories from Furniture Village residence installations.
          </p>

          <div className="flex items-center space-x-1">
            {CUSTOMER_REVIEWS.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                className="min-h-[28px] min-w-[28px] flex items-center justify-center p-1 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C84D1B] rounded-full"
                aria-label={`Go to slide ${dotIdx + 1}`}
              >
                <span
                  className={`h-2 rounded-full transition-all duration-300 pointer-events-none block ${
                    dotIdx === currentIndex ? 'w-8 bg-[#1A1816]' : 'w-2 bg-stone-300 hover:bg-stone-400'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
