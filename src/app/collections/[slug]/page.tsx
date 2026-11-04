import React from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import { notFound } from '@/components/common/navigation';
import { ArrowUpRight, Sparkles, Compass } from 'lucide-react';
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

  const otherCollections = COLLECTIONS_DATA.filter((c) => c.slug !== collection.slug);

  return (
    <main className="min-h-screen bg-cream text-checkerboard pt-28 pb-24 relative overflow-hidden bg-architectural-grid">
      <div className="absolute inset-0 bg-fine-grain pointer-events-none" />

      {/* Hero Header */}
      <div className="relative h-[56vh] min-h-[460px] w-full border-b border-checkerboard/15 overflow-hidden flex items-end">
        <Image
          src={collection.coverImage}
          alt={collection.title}
          fill
          className="object-cover brightness-[0.68]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-checkerboard/95 via-checkerboard/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-16 w-full space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-cream/70">
            <Link href="/" className="hover:text-tangerine transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-tangerine transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-mustard font-semibold">{collection.title}</span>
          </nav>

          <div className="pt-2">
            <span className="inline-flex items-center space-x-1.5 font-mono text-[11px] uppercase tracking-wider text-mustard font-semibold bg-checkerboard/70 border border-mustard/30 px-3 py-1 rounded-full backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-mustard" />
              <span>Curated Showroom Suite</span>
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white font-medium tracking-tight">
            {collection.title}
          </h1>
          <p className="text-sm md:text-base text-cream-light font-normal max-w-2xl leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Curator Statement */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 border-b border-checkerboard/10 relative z-10">
        <div className="max-w-3xl bg-white/95 backdrop-blur-xs p-8 md:p-10 rounded-2xl border-l-4 border-tangerine shadow-retro">
          <span className="font-mono text-[11px] uppercase tracking-wider text-tangerine font-semibold block mb-2">
            Curator&apos;s Architectural Note
          </span>
          <p className="font-serif text-xl md:text-2xl text-checkerboard italic font-normal leading-relaxed">
            &ldquo;{collection.curatorNote}&rdquo;
          </p>
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-checkerboard/10 text-xs">
            <span className="font-sans font-medium text-walnut">
              Design Philosophy · Furniture World Atelier
            </span>
            <span className="font-mono text-[11px] text-tangerine font-semibold">
              {collection.year || 2026} Edition
            </span>
          </div>
        </div>
      </div>

      {/* Series Pieces Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-checkerboard/10 gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-tangerine font-semibold block">
              Architectural Specifications
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-checkerboard font-semibold mt-1">
              Pieces in this Suite
            </h2>
            <p className="text-xs text-walnut mt-1">
              Ergonomically engineered and hand-finished with honest, tactile materials.
            </p>
          </div>
          <span className="font-mono text-xs text-tangerine font-semibold bg-white px-3.5 py-1.5 rounded-full border border-checkerboard/10 shadow-2xs self-start sm:self-auto">
            {collectionProducts.length} Handcrafted Works
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectionProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex flex-col rounded-2xl border border-checkerboard/10 bg-white/95 backdrop-blur-xs overflow-hidden hover:border-tangerine/60 transition-all duration-300 shadow-retro hover:shadow-warm"
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
                  <span className="font-sans text-[11px] uppercase tracking-wider text-tangerine font-semibold block mb-1">
                    {product.category}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-xl text-checkerboard group-hover:text-tangerine transition-colors font-semibold">
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

                {/* Material Finish Swatches */}
                <div className="pt-3 border-t border-checkerboard/10">
                  <div className="flex items-center justify-between text-[11px] font-mono text-walnut mb-2">
                    <span>Available Finishes</span>
                    <span className="text-checkerboard font-semibold">
                      {product.materials.woodOptions.length} Woods · {product.materials.upholsteryOptions.length} Fabrics
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {product.materials.woodOptions.map((w) => (
                      <span
                        key={w.id}
                        title={w.name}
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: w.colorHex }}
                      />
                    ))}
                    <span className="text-walnut/30 text-xs px-1">|</span>
                    {product.materials.upholsteryOptions.map((f) => (
                      <span
                        key={f.id}
                        title={f.name}
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: f.colorHex }}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-checkerboard/10 flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider text-xs font-semibold text-checkerboard group-hover:text-tangerine flex items-center space-x-1 transition-colors">
                    <span>Configure & Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-tangerine transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                  <span className="text-xs text-walnut font-medium">
                    {product.materials.woodOptions[0]?.name || 'Solid Wood'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Explore Other Curated Suites */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-24 relative z-10">
        <div className="p-8 md:p-12 rounded-2xl bg-checkerboard text-white border border-white/10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="font-mono text-[10px] tracking-wider uppercase text-mustard font-semibold flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5 text-mustard" />
                <span>Continue Your Journey</span>
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium">
                Explore More Architectural Collections
              </h3>
              <p className="text-xs text-cream/70 font-light leading-relaxed">
                Discover our complementary dining, lounge, and ambient lighting suites tailored for harmonious interiors.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {otherCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="px-5 py-2.5 rounded-full border border-white/20 bg-white/10 hover:bg-white hover:text-checkerboard text-xs font-semibold transition-all"
                >
                  {col.title} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
