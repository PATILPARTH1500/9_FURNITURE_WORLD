import { supabase } from '@/lib/supabase/client';
import { Product, ProductVariant, DimensionSpec } from '@/types';
import { WOOD_MATERIALS, UPHOLSTERY_MATERIALS } from '@/data/catalog';

export interface DbCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface DbProductVariant {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  finish_name: string;
  wood_finish_id: string | null;
  fabric_finish_id: string | null;
  wood_species: string | null;
  upholstery_fabric: string | null;
  price: number;
  compare_at_price: number | null;
  lead_time_weeks: number;
  in_stock: boolean;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  created_at: string;
}

export interface DbProductMedia {
  id: string;
  product_id: string;
  variant_id: string | null;
  media_type: 'image' | 'model_glb' | 'model_usdz' | 'texture';
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface DbProduct {
  id: string;
  slug: string;
  name: string;
  designer: string | null;
  year: number | null;
  category_id: string | null;
  subtitle: string | null;
  description: string | null;
  architectural_statement: string | null;
  base_price: number;
  compare_at_price: number | null;
  currency: string;
  dimensions_json: Record<string, unknown>;
  is_featured: boolean;
  is_published: boolean;
  status: 'active' | 'draft' | 'archived';
  width_cm: number | null;
  depth_cm: number | null;
  height_cm: number | null;
  seat_height_cm: number | null;
  weight_kg: number | null;
  primary_material: string | null;
  secondary_material: string | null;
  care_instructions: string | null;
  assembly_required: boolean;
  lead_time_weeks: number;
  is_new_arrival: boolean;
  white_glove_eligible: boolean;
  sku: string | null;
  warranty_info: string | null;
  created_at: string;
  updated_at: string;
  categories?: DbCategory | null;
  product_variants?: DbProductVariant[];
  product_media?: DbProductMedia[];
}

export interface AdminProductPayload {
  id?: string;
  name: string;
  slug?: string;
  sku?: string;
  category_id?: string;
  category_slug?: string;
  subtitle?: string;
  description?: string;
  architectural_statement?: string;
  base_price: number;
  compare_at_price?: number | null;
  currency?: string;
  status: 'active' | 'draft' | 'archived';
  is_published: boolean;
  is_featured: boolean;
  width_cm?: number | null;
  depth_cm?: number | null;
  height_cm?: number | null;
  seat_height_cm?: number | null;
  weight_kg?: number | null;
  primary_material?: string;
  secondary_material?: string;
  care_instructions?: string;
  assembly_required?: boolean;
  lead_time_weeks?: number;
  warranty_info?: string;
  variants?: Array<{
    id?: string;
    sku?: string;
    name: string;
    finish_name: string;
    wood_species?: string;
    upholstery_fabric?: string;
    price: number;
    compare_at_price?: number | null;
    lead_time_weeks?: number;
    stock: number;
    status: 'active' | 'draft' | 'archived';
  }>;
  media?: Array<{
    url: string;
    media_type?: string;
    alt_text?: string;
    is_primary?: boolean;
    display_order?: number;
  }>;
}

export interface AdminProductListItem {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  category_id: string | null;
  category_name: string;
  category_slug: string;
  base_price: number;
  compare_at_price: number | null;
  currency: string;
  status: 'active' | 'draft' | 'archived';
  is_published: boolean;
  is_featured: boolean;
  stock: number;
  in_stock: boolean;
  primary_image: string;
  variants_count: number;
  updated_at: string;
  created_at: string;
}

/**
 * Maps raw database product row into frontend Product interface
 */
export function mapDbProductToFrontend(
  db: DbProduct,
  categorySlugOverride?: string
): Product {
  const categorySlug = categorySlugOverride || db.categories?.slug || 'seating';

  const mediaList = [...(db.product_media || [])].sort((a, b) => a.display_order - b.display_order);
  const primaryMedia = mediaList.find((m) => m.is_primary) || mediaList[0];

  const heroImage = primaryMedia?.url || '/images/products/kronos-lounge-chair.webp';
  const editorialImage = mediaList[1]?.url || heroImage;
  const detailImage = mediaList[2]?.url || heroImage;
  const inSituImage = mediaList[3]?.url || heroImage;

  const galleryImages = mediaList.length > 0 ? mediaList.map((m) => m.url) : [heroImage];

  const variants: ProductVariant[] = (db.product_variants || []).map((v) => ({
    id: v.id,
    sku: v.sku,
    name: v.name,
    finishName: v.finish_name,
    woodMaterialId: v.wood_finish_id || 'oak-natural',
    fabricMaterialId: v.fabric_finish_id || 'boucle-cream',
    price: Number(v.price),
    compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : undefined,
    inStock: v.in_stock,
    stock: v.stock,
    leadTimeWeeks: v.lead_time_weeks || db.lead_time_weeks || 2,
    images: [heroImage],
    woodSpecies: v.wood_species || undefined,
    upholsteryFabric: v.upholstery_fabric || undefined,
    status: v.status,
  }));

  const dimensions: DimensionSpec = {
    widthCm: Number(db.width_cm || 0),
    depthCm: Number(db.depth_cm || 0),
    heightCm: Number(db.height_cm || 0),
    seatHeightCm: db.seat_height_cm ? Number(db.seat_height_cm) : undefined,
    weightKg: Number(db.weight_kg || 0),
  };

  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    designer: db.designer || 'Furniture World',
    year: db.year || 2024,
    category: categorySlug,
    subtitle: db.subtitle || `${db.name} in solid finish`,
    description: db.description || '',
    architecturalStatement: db.architectural_statement || '“Mindful design crafted for modern family living.”',
    price: Number(db.base_price),
    compareAtPrice: db.compare_at_price ? Number(db.compare_at_price) : undefined,
    currency: db.currency || 'INR',
    dimensions,
    materials: {
      woodOptions: WOOD_MATERIALS,
      upholsteryOptions: UPHOLSTERY_MATERIALS,
      hardware: db.secondary_material || 'Concealed steel fixtures and durable solid timber joinery.',
    },
    variants: variants.length > 0 ? variants : [
      {
        id: `var-${db.id}`,
        sku: db.sku || `${db.slug}-STD`,
        name: `${db.name} Standard`,
        finishName: 'Standard Finish',
        woodMaterialId: 'oak-natural',
        fabricMaterialId: 'boucle-cream',
        price: Number(db.base_price),
        compareAtPrice: db.compare_at_price ? Number(db.compare_at_price) : undefined,
        inStock: true,
        stock: 5,
        leadTimeWeeks: db.lead_time_weeks || 2,
        images: [heroImage],
      }
    ],
    annotations: [],
    images: {
      hero: heroImage,
      editorial: editorialImage,
      detail: detailImage,
      inSitu: inSituImage,
    },
    gallery: galleryImages,
    featured: Boolean(db.is_featured),
    tags: [db.categories?.name || 'Furniture', db.primary_material || 'Solid Wood'].filter(Boolean) as string[],
    sku: db.sku || undefined,
    status: db.status,
    isPublished: db.is_published,
    warrantyInfo: db.warranty_info || undefined,
    primaryMaterial: db.primary_material || undefined,
    secondaryMaterial: db.secondary_material || undefined,
    careInstructions: db.care_instructions || undefined,
    assemblyRequired: db.assembly_required,
    leadTimeWeeks: db.lead_time_weeks,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export const productService = {
  /**
   * Fetch active categories for storefront navigation
   */
  async getCategories(): Promise<{ data: DbCategory[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { data: (data as DbCategory[]) || [], error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch categories';
      return { data: [], error: msg };
    }
  },

  /**
   * Fetch published & active products for the public storefront
   */
  async getPublishedProducts(options?: {
    categorySlug?: string;
    sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'featured';
    search?: string;
  }): Promise<{ data: Product[]; error: string | null }> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (*),
          product_variants (*),
          product_media (*)
        `)
        .eq('is_published', true)
        .eq('status', 'active');

      if (options?.categorySlug && options.categorySlug !== 'all') {
        const { data: catData } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', options.categorySlug)
          .single();

        if (catData?.id) {
          query = query.eq('category_id', catData.id);
        }
      }

      if (options?.search && options.search.trim()) {
        const term = `%${options.search.trim()}%`;
        query = query.or(`name.ilike.${term},subtitle.ilike.${term},description.ilike.${term},sku.ilike.${term}`);
      }

      // Sorting
      switch (options?.sortBy) {
        case 'price-asc':
          query = query.order('base_price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('base_price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'featured':
        default:
          query = query
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;
      if (error) throw error;

      const products = ((data as unknown as DbProduct[]) || []).map((p) => mapDbProductToFrontend(p));
      return { data: products, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch products';
      return { data: [], error: msg };
    }
  },

  /**
   * Fetch single product by slug
   */
  async getProductBySlug(slug: string): Promise<{ data: Product | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (*),
          product_variants (*),
          product_media (*)
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      if (!data) return { data: null, error: 'Product not found' };

      const product = mapDbProductToFrontend(data as unknown as DbProduct);
      return { data: product, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Product lookup failed';
      return { data: null, error: msg };
    }
  },

  /**
   * Search active products
   */
  async searchProducts(searchTerm: string): Promise<{ data: Product[]; error: string | null }> {
    if (!searchTerm.trim()) {
      return this.getPublishedProducts({ sortBy: 'featured' });
    }
    return this.getPublishedProducts({ search: searchTerm, sortBy: 'featured' });
  },

  /**
   * ADMIN: Fetch all products for the Store Management Product table
   */
  async getAllProductsForAdmin(options?: {
    search?: string;
    categoryId?: string;
    status?: string;
  }): Promise<{ data: AdminProductListItem[]; error: string | null }> {
    try {
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          sku,
          base_price,
          compare_at_price,
          currency,
          status,
          is_published,
          is_featured,
          created_at,
          updated_at,
          category_id,
          categories (id, name, slug),
          product_variants (id, stock, in_stock),
          product_media (url, is_primary, display_order)
        `)
        .order('created_at', { ascending: false });

      if (options?.categoryId && options.categoryId !== 'all') {
        query = query.eq('category_id', options.categoryId);
      }

      if (options?.status && options.status !== 'all') {
        query = query.eq('status', options.status);
      }

      if (options?.search && options.search.trim()) {
        const term = `%${options.search.trim()}%`;
        query = query.or(`name.ilike.${term},slug.ilike.${term},sku.ilike.${term}`);
      }

      const { data, error } = await query;
      if (error) throw error;

      const items: AdminProductListItem[] = ((data as unknown as any[]) || []).map((row) => {
        const variants = row.product_variants || [];
        const totalStock = variants.reduce((sum: number, v: any) => sum + (v.stock || 0), 0);
        const hasStock = variants.length === 0 ? true : variants.some((v: any) => v.in_stock && v.stock > 0);

        const media = row.product_media || [];
        const primary = media.find((m: any) => m.is_primary) || media[0];

        return {
          id: row.id,
          name: row.name,
          slug: row.slug,
          sku: row.sku,
          category_id: row.category_id || null,
          category_name: row.categories?.name || 'Uncategorized',
          category_slug: row.categories?.slug || 'uncategorized',
          base_price: Number(row.base_price),
          compare_at_price: row.compare_at_price ? Number(row.compare_at_price) : null,
          currency: row.currency || 'INR',
          status: row.status,
          is_published: row.is_published,
          is_featured: row.is_featured,
          stock: totalStock,
          in_stock: hasStock,
          primary_image: primary?.url || '/images/products/kronos-lounge-chair.webp',
          variants_count: variants.length,
          updated_at: row.updated_at,
          created_at: row.created_at,
        };
      });

      return { data: items, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch admin product list';
      return { data: [], error: msg };
    }
  },

  /**
   * ADMIN: Fetch full details for a product by ID for editing
   */
  async getProductByIdForAdmin(id: string): Promise<{ data: DbProduct | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (*),
          product_variants (*),
          product_media (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data: data as unknown as DbProduct, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Product fetch failed';
      return { data: null, error: msg };
    }
  },

  /**
   * ADMIN: Atomic create or update product via stored procedure
   */
  async saveProduct(payload: AdminProductPayload): Promise<{
    success: boolean;
    productId?: string;
    slug?: string;
    error?: string;
  }> {
    try {
      const { data, error } = await supabase.rpc('admin_save_product', {
        payload,
      });

      if (error) throw error;

      const res = data as { success?: boolean; product_id?: string; slug?: string };
      return {
        success: Boolean(res?.success),
        productId: res?.product_id,
        slug: res?.slug,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save product in database.';
      return { success: false, error: msg };
    }
  },

  /**
   * ADMIN: Toggle product publication
   */
  async setProductPublication(id: string, isPublished: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          is_published: isPublished,
          status: isPublished ? 'active' : 'draft',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update publication status.';
      return { success: false, error: msg };
    }
  },

  /**
   * ADMIN: Archive a product
   */
  async archiveProduct(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          status: 'archived',
          is_published: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to archive product.';
      return { success: false, error: msg };
    }
  },

  /**
   * ADMIN: Safely delete product (checks if orders reference it)
   */
  async deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check order references first
      const { data: orderRefs, error: refError } = await supabase
        .from('order_items')
        .select('id')
        .eq('product_id', id)
        .limit(1);

      if (refError && refError.code !== 'PGRST116') {
        console.warn('Order reference check note:', refError.message);
      }

      if (orderRefs && orderRefs.length > 0) {
        return {
          success: false,
          error: 'This product has existing customer orders and cannot be permanently deleted. Please archive it instead.',
        };
      }

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete product.';
      return { success: false, error: msg };
    }
  },

  /**
   * ADMIN: Upload image to Supabase Storage 'products' bucket
   */
  async uploadProductImage(file: File, productId: string): Promise<{ url: string; error: string | null }> {
    try {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
      if (!allowedTypes.includes(file.type)) {
        return {
          url: '',
          error: 'Only JPEG, PNG, WebP, and AVIF image formats are allowed.',
        };
      }

      // Validate size (max 5 MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return {
          url: '',
          error: 'Image file size must be less than 5 MB.',
        };
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `${productId || 'general'}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('products').getPublicUrl(filePath);
      return { url: data.publicUrl, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload product image to storage.';
      return { url: '', error: msg };
    }
  },

  /**
   * ADMIN: Delete image from Supabase Storage
   */
  async deleteProductImage(pathOrUrl: string): Promise<{ success: boolean; error: string | null }> {
    try {
      let path = pathOrUrl;
      if (pathOrUrl.includes('/storage/v1/object/public/products/')) {
        path = pathOrUrl.split('/storage/v1/object/public/products/')[1];
      }

      const { error } = await supabase.storage.from('products').remove([path]);
      if (error) throw error;
      return { success: true, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to remove image from storage.';
      return { success: false, error: msg };
    }
  },
};
