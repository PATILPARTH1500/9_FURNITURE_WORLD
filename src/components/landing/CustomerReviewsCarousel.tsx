'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Pause, Play, Quote, Sparkles } from 'lucide-react';

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
    roomPhoto: '/videos/scenes/posters/scene-1-living.jpg',
    roomName: 'Living Room',
  },
  {
    id: 'rev-02',
    author: 'Ananya Deshmukh',
    location: 'Bandra West, Mumbai',
    itemPurchased: 'Sölve Round Walnut Dining Table',
    quote:
      'We host Sunday family lunches every week. The solid walnut top feels silky smooth and warm to the touch, and having six adults seated around the round pedestal allows everyone to chat effortlessly.',
    roomPhoto: '/videos/scenes/posters/scene-2-dining.jpg',
    roomName: 'Dining Room',
  },
  {
    id: 'rev-03',
    author: 'Rohan & Meera Sen',
    location: 'Jubilee Hills, Hyderabad',
    itemPurchased: 'Nordica Olive Velvet Bed & Nightstands',
    quote:
      'The olive velvet is rich without being loud. The two-person delivery team brought everything up to our 4th-floor apartment, assembled the solid timber frame in 35 minutes, and cleared away all the packaging.',
    roomPhoto: '/videos/scenes/posters/scene-5-bedroom.jpg',
    roomName: 'Master Bedroom',
  },
  {
    id: 'rev-04',
    author: 'Kavita Krishnan',
    location: 'Koramangala, Bengaluru',
    itemPurchased: 'Kronos Lounge Chair in Natural Oak',
    quote:
      'Visited the Indiranagar flagship showroom to test the cushion density in person. The gentle 112-degree recline and hand-smoothed oak armrests make it the most relaxing chair in our home.',
    roomPhoto: '/images/film/hero-plinth.jpg',
    roomName: 'Reading Corner',
  },
  {
    id: 'rev-05',
    author: 'Aditya & Tanya Verma',
    location: 'Vasant Vihar, New Delhi',
    itemPurchased: 'Checkerboard Lounge & Tangerine Table',
    quote:
      'The orange accent table brings just the right touch of playful 70s modern warmth to our lounge. The craftsmanship of the timber joinery and lacquered finish exceeded all our expectations.',
    roomPhoto: '/videos/scenes/posters/scene-4-lounge.jpg',
    roomName: 'Family Lounge',
  },
];

export const CustomerReviewsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalReviews = CUSTOMER_REVIEWS.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalReviews);
  }, [totalReviews]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
  }, [totalReviews]);

  // Autoplay with pause-on-hover & reduced motion check
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches || isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  };

  // Touch swiping handlers
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
      className="relative z-20 bg-cream py-24 sm:py-32 border-t border-checkerboard/10 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Customer stories and reviews carousel"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header with Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-checkerboard/15 gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="font-sans text-xs tracking-wider uppercase text-tangerine font-semibold bg-white/80 px-3.5 py-1.5 rounded-full border border-tangerine/20 inline-flex items-center space-x-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-tangerine" />
              <span>Real Homes · Customer Experiences</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-checkerboard font-semibold tracking-tight leading-[1.15]">
              Loved in Real Homes <br />
              <span className="italic text-walnut font-normal">Across India</span>
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <p className="hidden lg:block text-xs font-sans text-walnut/70">
              Community feedback from flagship showroom visitors and home deliveries.
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2.5 rounded-full border border-checkerboard/15 bg-white text-checkerboard hover:text-tangerine hover:border-tangerine transition-colors shadow-2xs"
                aria-label={isPaused ? 'Resume review carousel' : 'Pause review carousel'}
                title={isPaused ? 'Resume review carousel' : 'Pause review carousel'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={prevSlide}
                className="p-2.5 rounded-full border border-checkerboard/15 bg-white text-checkerboard hover:text-tangerine hover:border-tangerine transition-colors shadow-2xs"
                aria-label="Previous customer story"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextSlide}
                className="p-2.5 rounded-full border border-checkerboard/15 bg-white text-checkerboard hover:text-tangerine hover:border-tangerine transition-colors shadow-2xs"
                aria-label="Next customer story"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
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
                <div className="bg-white rounded-3xl border border-checkerboard/15 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column: Room Photograph */}
                  <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border border-checkerboard/10 bg-cream">
                    <Image
                      src={review.roomPhoto}
                      alt={`${review.author}'s ${review.itemPurchased}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-full text-[11px] font-sans font-semibold text-checkerboard border border-checkerboard/10 shadow-2xs">
                      {review.roomName}
                    </div>
                  </div>

                  {/* Right Column: Review Text & Attribution */}
                  <div className="lg:col-span-7 space-y-6">
                    <Quote className="w-10 h-10 text-tangerine/30 -mb-2" />
                    <blockquote
                      data-testid="customer-review-quote"
                      className="font-serif text-xl sm:text-2xl text-checkerboard leading-snug font-medium"
                    >
                      “{review.quote}”
                    </blockquote>

                    <div className="pt-4 border-t border-checkerboard/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="font-serif text-lg text-checkerboard font-semibold">
                          {review.author}
                        </p>
                        <p className="font-sans text-xs text-walnut">
                          {review.location}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <span className="inline-block text-[11px] font-sans font-medium text-tangerine bg-tangerine/10 px-3 py-1 rounded-full border border-tangerine/20">
                          {review.itemPurchased}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicators & Transparent Disclaimer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-sans text-walnut/70">
            * Curated customer impressions & styling stories from Furniture Village preview patrons.
          </p>

          <div className="flex items-center space-x-2">
            {CUSTOMER_REVIEWS.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  dotIdx === currentIndex ? 'w-8 bg-tangerine' : 'w-2 bg-checkerboard/20 hover:bg-checkerboard/40'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
