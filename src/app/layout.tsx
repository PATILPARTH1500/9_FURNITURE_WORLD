import type { Metadata } from 'next';
import './globals.css';
import { playfair, dmSans } from './fonts';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { BRAND_CONFIG } from '@/config/brand';

export const metadata: Metadata = {
  title: `${BRAND_CONFIG.name} — ${BRAND_CONFIG.tagline}`,
  description: BRAND_CONFIG.subtext,
  keywords: [
    'Furniture Village',
    'Retro Modern Furniture',
    'Curved Bouclé Sofa',
    'Solid Walnut Dining Table',
    'Olive Velvet Bed',
    'Orange Pendant Lighting',
    'Playful Home Design',
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
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans bg-cream text-checkerboard antialiased selection:bg-tangerine selection:text-white min-h-screen flex flex-col overflow-x-hidden">
        <Navbar />
        <CartDrawer />
        <div className="grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
