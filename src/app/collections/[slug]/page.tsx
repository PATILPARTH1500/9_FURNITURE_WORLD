import React from 'react';
import Image from '@/components/common/Image';
import Link from '@/components/common/Link';
import { notFound } from '@/components/common/navigation';
import { ArrowUpRight } from 'lucide-react';
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
    <main className="min-h-screen bg-[#FBF9F5] text-[#1A1816] pt-28 pb-24 relative overflow-hidden">
      {/* Hero Header */}
      <div className="relative h-[56vh] min-h-[460px] w-full border-b border-stone-200/80 overflow-hidden flex items-end">
        <Image
          src={collection.coverImage}
          alt={collection.title}
          fill
          className="object-cover brightness-[0.68]"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-16 w-full space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-sans uppercase tracking-wider text-white/80">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-[#C84D1B] font-medium">{collection.title}</span>
          </nav>

          <div className="pt-2">
            <span className="inline-flex items-center space-x-1.5 font-sans text-[11px] uppercase tracking-widest text-white/90 font-medium bg-white/15 border border-white/20 px-3.5 py-1.5 rounded-full backdrop-blur-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
              <span>Curated Showroom Suite</span>
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white font-light tracking-tight">
            {collection.title}
          </h1>
          <p className="text-sm md:text-base text-white/80 font-normal max-w-2xl leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Curator Statement */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 border-b border-stone-200/80 relative z-10">
        <div className="max-w-3xl bg-white p-8 md:p-10 rounded-2xl border border-stone-200/80 border-l-4 border-l-[#C84D1B] shadow-[0_4px_20px_rgba(26,24,22,0.04)]">
          <span className="font-sans text-[11px] uppercase tracking-widest text-[#C84D1B] font-semibold block mb-2">
            Design Note
          </span>
          <p className="font-serif text-xl md:text-2xl text-[#1A1816] italic font-light leading-relaxed">
            &ldquo;{collection.curatorNote}&rdquo;
          </p>
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-200/80 text-xs">
            <span className="font-sans font-medium text-[#78716C]">
              Design Philosophy · Furniture World
            </span>
            <span className="font-sans text-[11px] text-[#C84D1B] font-semibold">
              {collection.year || 2026} Edition
            </span>
          </div>
        </div>
      </div>

      {/* Series Pieces Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-stone-200/80 gap-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-widest text-[#C84D1B] font-semibold block">
              Collection Pieces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1816] font-light mt-1">
              Pieces in this Collection
            </h2>
            <p className="text-xs text-[#78716C] mt-1">
              Thoughtfully crafted and hand-finished with high quality, natural materials.
            </p>
          </div>
          <span className="font-sans text-xs text-[#1A1816] font-medium bg-white px-3.5 py-1.5 rounded-full border border-stone-200/80 shadow-2xs self-start sm:self-auto">
            {collectionProducts.length} Handcrafted Works
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectionProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group flex flex-col rounded-2xl border border-stone-200/80 bg-white overflow-hidden hover:border-[#1A1816]/30 transition-all duration-500 shadow-[0_4px_20px_rgba(26,24,22,0.03)] hover:shadow-[0_12px_32px_rgba(26,24,22,0.08)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F2EFE9]">
                <Image
                  src={product.images.hero}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-104"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="font-sans text-[11px] uppercase tracking-widest text-[#C84D1B] font-semibold block mb-1">
                    {product.category}
                  </span>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-serif text-xl text-[#1A1816] group-hover:text-[#C84D1B] transition-colors font-normal">
                      {product.name}
                    </h3>
                    <span className="font-sans text-base font-semibold text-[#1A1816]">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <p className="text-xs text-[#57534E] mt-1.5 line-clamp-2 leading-relaxed">
                    {product.subtitle}
                  </p>
                </div>

                {/* Material Finish Swatches */}
                <div className="pt-3 border-t border-stone-200/80">
                  <div className="flex items-center justify-between text-xs font-sans text-[#78716C] mb-2">
                    <span>Available Finishes</span>
                    <span className="text-[#1A1816] font-medium">
                      {product.materials.woodOptions.length} Woods · {product.materials.upholsteryOptions.length} Fabrics
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {product.materials.woodOptions.map((w) => (
                      <span
                        key={w.id}
                        title={w.name}
                        className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: w.colorHex }}
                      />
                    ))}
                    <span className="text-[#78716C]/40 text-xs px-1">|</span>
                    {product.materials.upholsteryOptions.map((f) => (
                      <span
                        key={f.id}
                        title={f.name}
                        className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: f.colorHex }}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200/80 flex items-center justify-between text-xs">
                  <span className="uppercase tracking-wider text-xs font-semibold text-[#1A1816] group-hover:text-[#C84D1B] flex items-center space-x-1 transition-colors">
                    <span>Configure & Inspect</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#C84D1B] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                  <span className="text-xs text-[#78716C] font-normal">
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
        <div className="p-8 md:p-12 rounded-2xl bg-[#161412] text-white border border-white/10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="font-sans text-[11px] tracking-widest uppercase text-[#C84D1B] font-medium flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C84D1B]" />
                <span>Continue Your Journey</span>
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light">
                Explore More Architectural Collections
              </h3>
              <p className="text-xs text-stone-300 font-normal leading-relaxed">
                Discover our complementary dining, lounge, and ambient lighting suites tailored for harmonious interiors.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {otherCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  className="px-5 py-2.5 rounded-full border border-white/20 bg-white/10 hover:bg-white hover:text-[#1A1816] text-xs font-semibold transition-all"
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
