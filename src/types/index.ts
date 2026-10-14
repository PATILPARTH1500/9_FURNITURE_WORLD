export type MaterialType = 'wood' | 'fabric' | 'leather' | 'metal' | 'stone';

export interface MaterialOption {
  id: string;
  name: string;
  type: MaterialType;
  colorHex: string;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  description: string;
  finishThumbnail?: string;
  swatchTone: string;
}

export interface DimensionSpec {
  widthCm: number;
  depthCm: number;
  heightCm: number;
  seatHeightCm?: number;
  weightKg: number;
}

export interface ProductPartAnnotation {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coordinates: [number, number, number]; // 3D coordinates [x, y, z]
  partKey: 'cushion' | 'backrest' | 'frame' | 'legs' | 'joinery';
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  finishName: string;
  woodMaterialId: string;
  fabricMaterialId: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  leadTimeWeeks: number;
  images: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  designer: string;
  year: number;
  category: 'seating' | 'tables' | 'storage' | 'lighting' | 'objects' | 'beds';
  subtitle: string;
  description: string;
  architecturalStatement: string;
  price: number;
  currency: string;
  dimensions: DimensionSpec;
  materials: {
    woodOptions: MaterialOption[];
    upholsteryOptions: MaterialOption[];
    hardware: string;
  };
  variants: ProductVariant[];
  annotations: ProductPartAnnotation[];
  images: {
    hero: string;
    editorial: string;
    detail: string;
    inSitu: string;
  };
  featured: boolean;
  tags: string[];
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  productCount: number;
  curatorNote: string;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  woodFinish: string;
  fabricFinish: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

