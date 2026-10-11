import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { COLLECTIONS_DATA, PRODUCTS_CATALOG } from '@/data/catalog';

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
    <main className="min-h-screen bg-charcoal-950 text-sand-100 pt-28 pb-24">
      {/* Hero Header */}
      <div className="relative h-[55vh] min-h-[420px] w-full border-b border-white/10 overflow-hidden flex items-end">
        <Image
          src={collection.coverImage}
          alt={collection.title}
          fill
          className="object-cover brightness-[0.55]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-16 w-full space-y-4">
          <Link
            href="/collections"
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-sand-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Collections</span>
          </Link>
          <h1 className="font-serif text-5xl md:text-7xl text-ivory font-light tracking-tight">
            {collection.title}
          </h1>
          <p className="text-sm md:text-base text-sand-300 font-light max-w-2xl leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Curator Statement */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 border-b border-white/10">
        <div className="max-w-2xl bg-charcoal-900/60 border-l-2 border-accent p-6 md:p-8">
          <p className="font-serif text-lg md:text-xl text-sand-200 italic font-light leading-relaxed">
            {collection.curatorNote}
          </p>
          <span className="text-[10px] uppercase font-mono tracking-widest text-accent block mt-3">
            Atelier Curatorial Direction
          </span>
        </div>
      </div>

      {/* Series Pieces Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-serif text-3xl text-ivory">Editions in this Series</h2>
          <span className="font-mono text-xs text-sand-400">
            {collectionProducts.length} Pieces
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectionProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex flex-col border border-white/5 hover:border-white/20 transition-all duration-300 bg-charcoal-900/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-charcoal-900">
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
                    <h3 className="font-serif text-lg text-ivory group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-mono text-sm text-sand-200">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-sand-400 font-light mt-1 line-clamp-2">
                    {product.subtitle}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="uppercase tracking-widest text-[11px] text-sand-300 group-hover:text-white flex items-center space-x-1">
                    <span>Explore Edition</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                  <span className="text-[10px] font-mono text-sand-500">
                    {product.dimensions.widthCm}×{product.dimensions.depthCm} cm
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

