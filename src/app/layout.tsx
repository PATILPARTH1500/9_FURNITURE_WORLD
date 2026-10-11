import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { BRAND_CONFIG } from '@/config/brand';

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} — ${BRAND_CONFIG.tagline}`,
  description: BRAND_CONFIG.subtext,
  keywords: [
    'Architectural Furniture',
    'Scandinavian Design',
    'Japanese Joinery',
    'Luxury Furniture',
    'Lounge Chair',
    'Craftsmanship',
  ],
  authors: [{ name: BRAND_CONFIG.name }],
  openGraph: {
    title: `${BRAND_CONFIG.name} — ${BRAND_CONFIG.tagline}`,
    description: BRAND_CONFIG.subtext,
    type: 'website',
    locale: 'en_US',
    siteName: BRAND_CONFIG.name,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-charcoal-950 text-foreground antialiased selection:bg-accent selection:text-charcoal-950">
        <Navbar />
        <CartDrawer />
        {children}
        <Footer />
      </body>
    </html>
  );
}

