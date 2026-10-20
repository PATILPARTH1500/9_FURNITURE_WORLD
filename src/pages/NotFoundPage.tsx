import React from 'react';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center bg-cream text-checkerboard">
      <span className="font-serif text-7xl md:text-9xl font-semibold text-tangerine">404</span>
      <h1 className="font-serif text-3xl md:text-5xl font-semibold mt-4 mb-3">Page Not Found</h1>
      <p className="font-sans text-sm md:text-base text-walnut max-w-md mb-8">
        The handcrafted furniture piece or collection you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-8 py-3.5 rounded-full bg-tangerine hover:bg-coral text-white font-sans text-xs uppercase tracking-wider font-semibold shadow-warm transition-all"
      >
        Return to Home
      </Link>
    </main>
  );
}
