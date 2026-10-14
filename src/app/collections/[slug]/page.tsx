import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { COLLECTIONS_DATA, PRODUCTS_CATALOG } from '@/data/catalog';
import { formatPrice } from '@/config/brand';

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return COLLECTIONS_DATA.map((col) => ({
    slug: col.slug,
  }));
}

export default function CollectionDetailPage({ params }: CollectionPageProps) {
  const collection = COLLECTIONS_DATA.find((c) => c.slug === params.slug);

  if (!collection) {
    notFound();
  }

  // Filter products relevant to this collection
  const collectionProducts = PRODUCTS_CATALOG.filter((p) => {
    if (collection.slug === 'sanctuary-seating') return p.category === 'seating';
    if (collection.slug === 'monolith-dining') return p.category === 'tables';
    return true;
  });

  return (
    <main className="min-h-screen bg-cream text-checkerboard pt-28 pb-24">
      {/* Hero Header */}
      <div className="relative h-[50vh] min-h-[400px] w-full border-b border-checkerboard/15 overflow-hidden flex items-end">
        <Image
          src={collection.coverImage}
          alt={collection.title}
          fill
          className="object-cover brightness-[0.7]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-checkerboard/90 via-checkerboard/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-16 w-full space-y-4">
          <Link
            href="/collections"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-mustard hover:text-white font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Collections</span>
          </Link>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white font-semibold tracking-tight">
            {collection.title}
          </h1>
          <p className="text-sm md:text-base text-cream-light font-normal max-w-2xl leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Curator Statement */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 border-b border-checkerboard/10">
        <div className="max-w-2xl bg-white p-6 md:p-8 rounded-2xl border-l-4 border-tangerine shadow-retro">
          <p className="font-serif text-lg md:text-xl text-checkerboard italic font-medium leading-relaxed">
            {collection.curatorNote}
          </p>
          <span className="text-xs uppercase font-sans tracking-wider text-tangerine font-semibold block mt-3">
            Design Note · Furniture Village Studio
          </span>
        </div>
      </div>

      {/* Series Pieces Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-14">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl text-checkerboard font-semibold">Furniture in this Collection</h2>
            <p className="text-xs text-walnut mt-1">Comfortable, durable designs tested for everyday life</p>
          </div>
          <span className="font-sans text-xs text-tangerine font-semibold">
            {collectionProducts.length} Pieces
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectionProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex flex-col rounded-2xl border border-checkerboard/10 bg-white overflow-hidden hover:border-tangerine/50 transition-all duration-300 shadow-retro hover:shadow-warm"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-cream-dark">
                <Image
                  src={product.images.hero}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-xl text-checkerboard group-hover:text-tangerine transition-colors font-medium">
                      {product.name}
                    </h3>
                    <span className="font-sans text-base font-bold text-tangerine">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <p className="text-xs text-walnut mt-1.5 line-clamp-2 leading-relaxed">
                    {product.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-checkerboard/10 flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider text-xs font-semibold text-checkerboard group-hover:text-tangerine flex items-center space-x-1 transition-colors">
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-tangerine" />
                  </span>
                  <span className="text-xs text-walnut">
                    {product.materials.woodOptions[0]?.name || 'Solid Wood'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
