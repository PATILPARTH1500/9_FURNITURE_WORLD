export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  subtext: string;
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  contact: {
    legalEntity: string;
    gstin: string;
    email: string;
    address: string;
    showroom: string;
    phone: string;
    hours: string;
  };
  socials: {
    instagram: string;
    journal: string;
    pinterest: string;
  };
  navigation: { label: string; href: string }[];
  announcement: string;
}

export const BRAND_CONFIG: BrandConfig = {
  name: "FURNITURE WORLD",
  shortName: "FURNITURE WORLD",
  tagline: "Colourful furniture, beautifully made for your home.",
  subtext: "Retro-modern sofas, solid wood dining tables, and warm bedroom furniture designed for comfortable family living.",
  currency: "INR",
  currencySymbol: "₹",
  freeShippingThreshold: 5000,
  contact: {
    legalEntity: "Furniture World India Pvt. Ltd.",
    gstin: "29AABCF1234F1Z5",
    email: "care@furnitureworld.com",
    address: "Furniture World Flagship, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
    showroom: "Flagship Experience Store, Indiranagar, Bengaluru",
    phone: "+91 80 4000 8879",
    hours: "Monday – Saturday: 10:00 AM – 7:00 PM IST",
  },
  socials: {
    instagram: "https://instagram.com",
    journal: "/collections",
    pinterest: "https://pinterest.com",
  },
  navigation: [
    { label: "Home", href: "/#home" },
    { label: "Explore Tour", href: "/#explore" },
    { label: "Collections", href: "/#collections" },
    { label: "Our Story", href: "/#our-story" },
    { label: "Materials", href: "/#materials" },
    { label: "Journal", href: "/#journal" },
  ],
  announcement: "White-glove room delivery & assembly across major Indian cities",
};

/**
 * Centralized currency and price formatter for India (INR)
 * Formats numbers using standard Indian grouping (e.g. ₹1,850 or ₹1,50,000)
 */
export function formatPrice(amount: number, includeCode: boolean = false): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${BRAND_CONFIG.currencySymbol}0`;
  }
  const formatted = amount.toLocaleString('en-IN');
  if (includeCode) {
    return `${BRAND_CONFIG.currencySymbol}${formatted} ${BRAND_CONFIG.currency}`;
  }
  return `${BRAND_CONFIG.currencySymbol}${formatted}`;
}
