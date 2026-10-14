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
  name: "FURNITURE VILLAGE",
  shortName: "FURNITURE VILLAGE",
  tagline: "Colourful furniture, beautifully made for your home.",
  subtext: "Retro-modern sofas, solid wood dining tables, and warm bedroom furniture designed for comfortable family living.",
  currency: "INR",
  currencySymbol: "₹",
  freeShippingThreshold: 5000,
  contact: {
    legalEntity: "[Furniture Village India Pvt. Ltd. — Owner Legal Entity to Confirm]",
    gstin: "[GSTIN — Pending Owner Registration Input]",
    email: "care@furniturevillage.com",
    address: "Furniture Village Flagship, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038",
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
    { label: "Living Room", href: "/#living" },
    { label: "Dining Room", href: "/#dining" },
    { label: "Kitchen", href: "/#kitchen" },
    { label: "Family Lounge", href: "/#lounge" },
    { label: "Bedroom", href: "/#bedroom" },
    { label: "All Furniture", href: "/collections" },
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
