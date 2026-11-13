-- ==============================================================================
-- Migration: 20261113082941_phase03_product_catalogue_and_categories.sql
-- Furniture Village Phase 03: Product Catalogue, Categories, Variants, Inventory,
-- Storage Hardening, and Atomic Product Management
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- 1. CATEGORIES TABLE EXTENSIONS & RLS POLICIES
-- ==============================================================================

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Ensure RLS is enabled on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Drop legacy/overly-permissive policies
DROP POLICY IF EXISTS "Public categories view" ON public.categories;
DROP POLICY IF EXISTS "Admins manage all categories" ON public.categories;

-- Policy: Public can view active categories (or admins can view all)
CREATE POLICY "Public categories view" ON public.categories
  FOR SELECT TO PUBLIC
  USING (
    is_active IS TRUE
    OR (SELECT auth.uid() IS NOT NULL AND public.is_admin())
  );

-- Policy: Only verified admins can insert, update, or delete categories
CREATE POLICY "Admins manage all categories" ON public.categories
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO authenticated;

-- ==============================================================================
-- 2. PRODUCTS TABLE EXTENSIONS & CONSTRAINTS
-- ==============================================================================

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS sku TEXT,
  ADD COLUMN IF NOT EXISTS warranty_info TEXT;

-- Set default currency explicitly to INR
ALTER TABLE public.products
  ALTER COLUMN currency SET DEFAULT 'INR';

-- Check constraints for valid INR prices and discounts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_products_price_positive'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT chk_products_price_positive CHECK (base_price >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_products_compare_price'
  ) THEN
    ALTER TABLE public.products
      ADD CONSTRAINT chk_products_compare_price CHECK (compare_at_price IS NULL OR compare_at_price > base_price);
  END IF;
END $$;

-- ==============================================================================
-- 3. PRODUCT VARIANTS TABLE EXTENSIONS & CONSTRAINTS
-- ==============================================================================

ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS size TEXT,
  ADD COLUMN IF NOT EXISTS color TEXT,
  ADD COLUMN IF NOT EXISTS material TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_variants_status'
  ) THEN
    ALTER TABLE public.product_variants
      ADD CONSTRAINT chk_variants_status CHECK (status IN ('active', 'draft', 'archived'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_variants_price_positive'
  ) THEN
    ALTER TABLE public.product_variants
      ADD CONSTRAINT chk_variants_price_positive CHECK (price >= 0);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_variants_compare_price'
  ) THEN
    ALTER TABLE public.product_variants
      ADD CONSTRAINT chk_variants_compare_price CHECK (compare_at_price IS NULL OR compare_at_price > price);
  END IF;
END $$;

-- ==============================================================================
-- 4. PERFORMANCE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON public.categories(display_order ASC);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status_published ON public.products(status, is_published);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku);

CREATE INDEX IF NOT EXISTS idx_product_media_product_id ON public.product_media(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_variant_id ON public.inventory(variant_id);

-- ==============================================================================
-- 5. ATOMIC ADMIN PRODUCT SAVE FUNCTION
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.admin_save_product(payload JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_is_admin BOOLEAN := public.is_admin();
  v_product_id UUID;
  v_category_id UUID;
  v_slug TEXT;
  v_name TEXT;
  v_sku TEXT;
  v_base_price NUMERIC;
  v_compare_at_price NUMERIC;
  v_currency TEXT;
  v_status TEXT;
  v_is_published BOOLEAN;
  v_is_featured BOOLEAN;
  v_subtitle TEXT;
  v_description TEXT;
  v_architectural_statement TEXT;
  v_width_cm NUMERIC;
  v_depth_cm NUMERIC;
  v_height_cm NUMERIC;
  v_seat_height_cm NUMERIC;
  v_weight_kg NUMERIC;
  v_primary_material TEXT;
  v_secondary_material TEXT;
  v_care_instructions TEXT;
  v_assembly_required BOOLEAN;
  v_lead_time_weeks INT;
  v_warranty_info TEXT;
  v_variant JSONB;
  v_variant_id UUID;
  v_variant_sku TEXT;
  v_variant_price NUMERIC;
  v_variant_compare NUMERIC;
  v_stock INT;
  v_media JSONB;
  v_actor_id UUID := (SELECT auth.uid());
BEGIN
  -- 1. Authorization check: fail closed
  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Only store administrators can create or edit products.' USING ERRCODE = '42501';
  END IF;

  -- 2. Extract and validate required fields
  v_name := trim(payload->>'name');
  IF v_name IS NULL OR length(v_name) = 0 THEN
    RAISE EXCEPTION 'Product name is required.' USING ERRCODE = '23502';
  END IF;

  v_slug := lower(trim(payload->>'slug'));
  IF v_slug IS NULL OR length(v_slug) = 0 THEN
    -- Auto-generate slug from name
    v_slug := lower(regexp_replace(v_name, '[^a-zA-Z0-9]+', '-', 'g'));
    v_slug := trim(both '-' from v_slug);
  END IF;

  v_base_price := (payload->>'base_price')::NUMERIC;
  IF v_base_price IS NULL OR v_base_price < 0 THEN
    RAISE EXCEPTION 'Valid positive base price is required.' USING ERRCODE = '23514';
  END IF;

  IF payload ? 'compare_at_price' AND (payload->>'compare_at_price') IS NOT NULL AND length(payload->>'compare_at_price') > 0 THEN
    v_compare_at_price := (payload->>'compare_at_price')::NUMERIC;
    IF v_compare_at_price <= v_base_price THEN
      RAISE EXCEPTION 'Compare-at price must be greater than base price.' USING ERRCODE = '23514';
    END IF;
  ELSE
    v_compare_at_price := NULL;
  END IF;

  -- Resolve category if provided
  IF payload ? 'category_id' AND (payload->>'category_id') IS NOT NULL AND length(payload->>'category_id') > 0 THEN
    v_category_id := (payload->>'category_id')::UUID;
  ELSIF payload ? 'category_slug' AND (payload->>'category_slug') IS NOT NULL THEN
    SELECT id INTO v_category_id FROM public.categories WHERE slug = lower(trim(payload->>'category_slug'));
  ELSE
    v_category_id := NULL;
  END IF;

  v_sku := nullif(trim(payload->>'sku'), '');
  v_currency := coalesce(nullif(trim(payload->>'currency'), ''), 'INR');
  v_status := coalesce(nullif(trim(payload->>'status'), ''), 'active');
  IF v_status NOT IN ('active', 'draft', 'archived') THEN
    v_status := 'active';
  END IF;

  v_is_published := coalesce((payload->>'is_published')::BOOLEAN, true);
  v_is_featured := coalesce((payload->>'is_featured')::BOOLEAN, false);
  v_subtitle := payload->>'subtitle';
  v_description := payload->>'description';
  v_architectural_statement := payload->>'architectural_statement';

  v_width_cm := (payload->>'width_cm')::NUMERIC;
  v_depth_cm := (payload->>'depth_cm')::NUMERIC;
  v_height_cm := (payload->>'height_cm')::NUMERIC;
  v_seat_height_cm := (payload->>'seat_height_cm')::NUMERIC;
  v_weight_kg := (payload->>'weight_kg')::NUMERIC;

  v_primary_material := payload->>'primary_material';
  v_secondary_material := payload->>'secondary_material';
  v_care_instructions := payload->>'care_instructions';
  v_assembly_required := coalesce((payload->>'assembly_required')::BOOLEAN, false);
  v_lead_time_weeks := coalesce((payload->>'lead_time_weeks')::INT, 2);
  v_warranty_info := payload->>'warranty_info';

  -- Check if updating existing product or inserting new
  IF payload ? 'id' AND (payload->>'id') IS NOT NULL AND length(payload->>'id') > 0 THEN
    v_product_id := (payload->>'id')::UUID;

    UPDATE public.products SET
      name = v_name,
      slug = v_slug,
      sku = v_sku,
      category_id = v_category_id,
      base_price = v_base_price,
      compare_at_price = v_compare_at_price,
      currency = v_currency,
      status = v_status,
      is_published = v_is_published,
      is_featured = v_is_featured,
      subtitle = v_subtitle,
      description = v_description,
      architectural_statement = v_architectural_statement,
      width_cm = v_width_cm,
      depth_cm = v_depth_cm,
      height_cm = v_height_cm,
      seat_height_cm = v_seat_height_cm,
      weight_kg = v_weight_kg,
      primary_material = v_primary_material,
      secondary_material = v_secondary_material,
      care_instructions = v_care_instructions,
      assembly_required = v_assembly_required,
      lead_time_weeks = v_lead_time_weeks,
      warranty_info = v_warranty_info,
      updated_at = timezone('utc'::text, now())
    WHERE id = v_product_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product with ID % not found for update.', v_product_id USING ERRCODE = 'P0002';
    END IF;
  ELSE
    INSERT INTO public.products (
      name, slug, sku, category_id, base_price, compare_at_price, currency,
      status, is_published, is_featured, subtitle, description, architectural_statement,
      width_cm, depth_cm, height_cm, seat_height_cm, weight_kg,
      primary_material, secondary_material, care_instructions, assembly_required,
      lead_time_weeks, warranty_info
    ) VALUES (
      v_name, v_slug, v_sku, v_category_id, v_base_price, v_compare_at_price, v_currency,
      v_status, v_is_published, v_is_featured, v_subtitle, v_description, v_architectural_statement,
      v_width_cm, v_depth_cm, v_height_cm, v_seat_height_cm, v_weight_kg,
      v_primary_material, v_secondary_material, v_care_instructions, v_assembly_required,
      v_lead_time_weeks, v_warranty_info
    )
    RETURNING id INTO v_product_id;
  END IF;

  -- 3. Handle Variants if supplied in payload
  IF payload ? 'variants' AND jsonb_array_length(payload->'variants') > 0 THEN
    FOR v_variant IN SELECT * FROM jsonb_array_elements(payload->'variants')
    LOOP
      v_variant_sku := coalesce(nullif(trim(v_variant->>'sku'), ''), v_slug || '-' || floor(random()*8999+1000)::text);
      v_variant_price := coalesce((v_variant->>'price')::NUMERIC, v_base_price);
      IF (v_variant->>'compare_at_price') IS NOT NULL AND length(v_variant->>'compare_at_price') > 0 THEN
        v_variant_compare := (v_variant->>'compare_at_price')::NUMERIC;
      ELSE
        v_variant_compare := NULL;
      END IF;
      v_stock := coalesce((v_variant->>'stock')::INT, 5);

      -- Upsert variant
      INSERT INTO public.product_variants (
        product_id, sku, name, finish_name, wood_species, upholstery_fabric,
        price, compare_at_price, lead_time_weeks, in_stock, stock, status
      ) VALUES (
        v_product_id,
        v_variant_sku,
        coalesce(nullif(trim(v_variant->>'name'), ''), v_name),
        coalesce(nullif(trim(v_variant->>'finish_name'), ''), 'Standard'),
        v_variant->>'wood_species',
        v_variant->>'upholstery_fabric',
        v_variant_price,
        v_variant_compare,
        coalesce((v_variant->>'lead_time_weeks')::INT, v_lead_time_weeks),
        (v_stock > 0),
        v_stock,
        coalesce(nullif(trim(v_variant->>'status'), ''), 'active')
      )
      ON CONFLICT (sku) DO UPDATE SET
        name = EXCLUDED.name,
        finish_name = EXCLUDED.finish_name,
        wood_species = EXCLUDED.wood_species,
        upholstery_fabric = EXCLUDED.upholstery_fabric,
        price = EXCLUDED.price,
        compare_at_price = EXCLUDED.compare_at_price,
        lead_time_weeks = EXCLUDED.lead_time_weeks,
        in_stock = EXCLUDED.in_stock,
        stock = EXCLUDED.stock,
        status = EXCLUDED.status
      RETURNING id INTO v_variant_id;

      -- Sync inventory record for variant
      INSERT INTO public.inventory (variant_id, quantity_available, quantity_reserved, restock_threshold)
      VALUES (v_variant_id, v_stock, 0, 2)
      ON CONFLICT (variant_id) DO UPDATE SET
        quantity_available = EXCLUDED.quantity_available,
        updated_at = timezone('utc'::text, now());
    END LOOP;
  ELSE
    -- If no variants array passed and creating a new product without variants, create a default variant
    IF NOT EXISTS (SELECT 1 FROM public.product_variants WHERE product_id = v_product_id) THEN
      v_variant_sku := coalesce(v_sku, upper(regexp_replace(v_slug, '[^a-zA-Z0-9]+', '-', 'g')) || '-DEFAULT');
      INSERT INTO public.product_variants (
        product_id, sku, name, finish_name, price, compare_at_price,
        lead_time_weeks, in_stock, stock, status
      ) VALUES (
        v_product_id,
        v_variant_sku,
        v_name,
        'Standard Finish',
        v_base_price,
        v_compare_at_price,
        v_lead_time_weeks,
        true,
        5,
        'active'
      )
      RETURNING id INTO v_variant_id;

      INSERT INTO public.inventory (variant_id, quantity_available, quantity_reserved, restock_threshold)
      VALUES (v_variant_id, 5, 0, 2)
      ON CONFLICT (variant_id) DO UPDATE SET
        quantity_available = EXCLUDED.quantity_available,
        updated_at = timezone('utc'::text, now());
    END IF;
  END IF;

  -- 4. Handle Media if supplied in payload
  IF payload ? 'media' AND jsonb_array_length(payload->'media') > 0 THEN
    -- Delete existing media for product to allow full sync, or upsert
    DELETE FROM public.product_media WHERE product_id = v_product_id;

    FOR v_media IN SELECT * FROM jsonb_array_elements(payload->'media')
    LOOP
      INSERT INTO public.product_media (
        product_id, media_type, url, alt_text, is_primary, display_order
      ) VALUES (
        v_product_id,
        coalesce(nullif(trim(v_media->>'media_type'), ''), 'image'),
        trim(v_media->>'url'),
        coalesce(v_media->>'alt_text', v_name),
        coalesce((v_media->>'is_primary')::BOOLEAN, false),
        coalesce((v_media->>'display_order')::INT, 0)
      );
    END LOOP;
  END IF;

  -- 5. Audit Log Entry
  INSERT INTO public.admin_activity_logs (
    admin_id, action, target_type, target_id, details
  ) VALUES (
    v_actor_id,
    CASE WHEN payload ? 'id' THEN 'product_updated' ELSE 'product_created' END,
    'product',
    v_product_id,
    jsonb_build_object(
      'product_id', v_product_id,
      'name', v_name,
      'slug', v_slug,
      'price', v_base_price,
      'status', v_status,
      'is_published', v_is_published
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'product_id', v_product_id,
    'slug', v_slug
  );
END;
$$;

REVOKE ALL ON FUNCTION public.admin_save_product(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_save_product(JSONB) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_save_product(JSONB) TO authenticated;

-- ==============================================================================
-- 6. IDEMPOTENT CATEGORIES SEED
-- ==============================================================================

INSERT INTO public.categories (slug, name, description, display_order, is_active)
VALUES
  ('seating', 'Sofas & Seating', 'Curved cream bouclé sofas, sculptural armchairs, and comfortable lounge seating.', 1, true),
  ('tables', 'Dining & Accent Tables', 'Solid American walnut dining tables, pedestal tables, and natural stone side tables.', 2, true),
  ('beds', 'Beds & Bedroom', 'Upholstered olive velvet beds, solid timber slats, and peaceful bedroom furniture.', 3, true),
  ('lighting', 'Lighting & Lamps', 'Ambient dome pendants, mouth-blown glass lamps, and warm studio lighting.', 4, true),
  ('storage', 'Storage & Credenzas', 'Solid wood credenzas, sideboards, wardrobes, and minimalist cabinets.', 5, true),
  ('decor', 'Decor & Objects', 'Curated ceramic objects, tactile cushions, and collectible accessories.', 6, true),
  ('chairs', 'Chairs & Armchairs', 'Ergonomic dining chairs, plush armchairs, and occasional seating.', 7, true),
  ('coffee-tables', 'Coffee Tables', 'Sculptural wood and stone coffee tables for modern family living.', 8, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- ==============================================================================
-- 7. IDEMPOTENT CURATED SHOWROOM PRODUCTS SEED (6 PIECES)
-- ==============================================================================

DO $$
DECLARE
  v_cat_seating UUID;
  v_cat_tables UUID;
  v_cat_beds UUID;
  v_cat_lighting UUID;
  v_prod_id UUID;
  v_var_id UUID;
BEGIN
  -- Resolve Category IDs
  SELECT id INTO v_cat_seating FROM public.categories WHERE slug = 'seating';
  SELECT id INTO v_cat_tables FROM public.categories WHERE slug = 'tables';
  SELECT id INTO v_cat_beds FROM public.categories WHERE slug = 'beds';
  SELECT id INTO v_cat_lighting FROM public.categories WHERE slug = 'lighting';

  -- ----------------------------------------------------------------------------
  -- Product 1: Kronos Lounge Chair
  -- ----------------------------------------------------------------------------
  INSERT INTO public.products (
    slug, name, designer, year, category_id, subtitle, description, architectural_statement,
    base_price, currency, is_featured, is_published, status,
    width_cm, depth_cm, height_cm, seat_height_cm, weight_kg,
    primary_material, secondary_material, care_instructions, assembly_required,
    lead_time_weeks, sku, warranty_info
  ) VALUES (
    'kronos-lounge-chair',
    'Kronos Lounge Chair',
    'Furniture World',
    2024,
    v_cat_seating,
    'Sculptural Armchair in Cream Bouclé & Natural Oak',
    'A generous, comfortable lounge chair built with a gently curved solid oak frame and deep cream bouclé cushioning. Its welcoming 112° recline offers comfortable support whether reading a book or relaxing with family.',
    '“Comfort and cheerful colour should live together naturally in every modern living room.”',
    1850,
    'INR',
    true,
    true,
    'active',
    84, 89, 76, 41, 24,
    'Solid European White Oak',
    'Cream Textured Bouclé',
    'Vacuum fabric gently with a soft brush attachment. Wipe timber surfaces with a slightly damp microfibre cloth; condition annually with natural beeswax.',
    false,
    2,
    'FW-KRN-001',
    '5-year structural timber frame warranty; 2-year upholstery cushioning warranty.'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    category_id = EXCLUDED.category_id,
    base_price = EXCLUDED.base_price,
    currency = EXCLUDED.currency,
    is_published = EXCLUDED.is_published,
    status = EXCLUDED.status,
    warranty_info = EXCLUDED.warranty_info
  RETURNING id INTO v_prod_id;

  -- Variants for Kronos
  INSERT INTO public.product_variants (
    product_id, sku, name, finish_name, wood_species, upholstery_fabric, price, compare_at_price, lead_time_weeks, in_stock, stock, status
  ) VALUES
    (v_prod_id, 'FW-KRN-OAK-BOU', 'Natural Oak / Cream Bouclé', 'Natural Oak & Cream Bouclé', 'Natural White Oak', 'Cream Textured Bouclé', 1850, NULL, 2, true, 12, 'active')
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price, in_stock = EXCLUDED.in_stock, stock = EXCLUDED.stock
  RETURNING id INTO v_var_id;
  INSERT INTO public.inventory (variant_id, quantity_available, quantity_reserved, restock_threshold)
  VALUES (v_var_id, 12, 0, 2) ON CONFLICT (variant_id) DO UPDATE SET quantity_available = 12;

  INSERT INTO public.product_variants (
    product_id, sku, name, finish_name, wood_species, upholstery_fabric, price, compare_at_price, lead_time_weeks, in_stock, stock, status
  ) VALUES
    (v_prod_id, 'FW-KRN-WAL-OLV', 'Walnut / Olive Green Velvet', 'Warm Walnut & Olive Velvet', 'Warm American Walnut', 'Olive Green Velvet', 1950, 2200, 2, true, 8, 'active')
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price, compare_at_price = EXCLUDED.compare_at_price, in_stock = EXCLUDED.in_stock, stock = EXCLUDED.stock
  RETURNING id INTO v_var_id;
  INSERT INTO public.inventory (variant_id, quantity_available, quantity_reserved, restock_threshold)
  VALUES (v_var_id, 8, 0, 2) ON CONFLICT (variant_id) DO UPDATE SET quantity_available = 8;

  INSERT INTO public.product_variants (
    product_id, sku, name, finish_name, wood_species, upholstery_fabric, price, compare_at_price, lead_time_weeks, in_stock, stock, status
  ) VALUES
    (v_prod_id, 'FW-KRN-ASH-PCH', 'Black Ash / Washed Peach Linen', 'Black Ash & Peach Linen', 'Checkerboard Black Ash', 'Washed Peach Linen', 1890, NULL, 3, true, 5, 'active')
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price, in_stock = EXCLUDED.in_stock, stock = EXCLUDED.stock
  RETURNING id INTO v_var_id;
  INSERT INTO public.inventory (variant_id, quantity_available, quantity_reserved, restock_threshold)
  VALUES (v_var_id, 5, 0, 2) ON CONFLICT (variant_id) DO UPDATE SET quantity_available = 5;

  -- Media for Kronos
  DELETE FROM public.product_media WHERE product_id = v_prod_id;
  INSERT INTO public.product_media (product_id, media_type, url, alt_text, is_primary, display_order)
  VALUES
    (v_prod_id, 'image', '/images/products/kronos-lounge-chair.webp', 'Kronos Lounge Chair in Cream Bouclé and Natural Oak', true, 0),
    (v_prod_id, 'image', '/images/film/cognac-leather.webp', 'Kronos Lounge Chair Walnut and Olive Velvet Detail', false, 1),
    (v_prod_id, 'image', '/images/film/exploded-view.webp', 'Kronos Frame Precision Joinery', false, 2),
    (v_prod_id, 'image', '/videos/scenes/posters/scene-1-living.webp', 'Kronos Lounge Chair Living Room Context', false, 3);

  -- ----------------------------------------------------------------------------
  -- Product 2: Sölve Walnut Dining Table
  -- ----------------------------------------------------------------------------
  INSERT INTO public.products (
    slug, name, designer, year, category_id, subtitle, description, architectural_statement,
    base_price, currency, is_featured, is_published, status,
    width_cm, depth_cm, height_cm, seat_height_cm, weight_kg,
    primary_material, secondary_material, care_instructions, assembly_required,
    lead_time_weeks, sku, warranty_info
  ) VALUES (
    'solve-dining-table',
    'Sölve Walnut Dining Table',
    'Furniture World',
    2024,
    v_cat_tables,
    'Round Solid Walnut Dining Table',
    'A generous 150cm round dining table made from solid European walnut with soft beveled edges and a sculptural pedestal base. Seats six people comfortably with generous legroom all around.',
    '“A table made for long dinners, game nights, and morning coffee together.”',
    2450,
    'INR',
    true,
    true,
    'active',
    150, 150, 75, NULL, 68,
    'Solid American Walnut',
    'Solid Steel Base Plate',
    'Wipe clean with a damp lint-free cloth. Use coasters for hot pans and liquids.',
    true,
    3,
    'FW-SLV-002',
    '10-year solid wood structural warranty.'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    category_id = EXCLUDED.category_id,
    base_price = EXCLUDED.base_price,
    currency = EXCLUDED.currency,
    is_published = EXCLUDED.is_published,
    status = EXCLUDED.status,
    warranty_info = EXCLUDED.warranty_info
  RETURNING id INTO v_prod_id;

  INSERT INTO public.product_variants (
    product_id, sku, name, finish_name, wood_species, price, lead_time_weeks, in_stock, stock, status
  ) VALUES
    (v_prod_id, 'FW-SLV-WAL-150', 'Warm American Walnut 150cm', 'Warm Walnut', 'Warm American Walnut', 2450, 3, true, 6, 'active')
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price, in_stock = EXCLUDED.in_stock, stock = EXCLUDED.stock
  RETURNING id INTO v_var_id;
  INSERT INTO public.inventory (variant_id, quantity_available, quantity_reserved, restock_threshold)
  VALUES (v_var_id, 6, 0, 2) ON CONFLICT (variant_id) DO UPDATE SET quantity_available = 6;

  DELETE FROM public.product_media WHERE product_id = v_prod_id;
  INSERT INTO public.product_media (product_id, media_type, url, alt_text, is_primary, display_order)
  VALUES
    (v_prod_id, 'image', '/images/products/solve-dining-table.webp', 'Sölve Walnut Dining Table Round 150cm', true, 0),
    (v_prod_id, 'image', '/images/collections/collection-monolith-dining.webp', 'Sölve Dining Table Room Setting', false, 1),
    (v_prod_id, 'image', '/images/film/macro-joinery.webp', 'Sölve Table Pedestal Joinery Detail', false, 2);

  -- ----------------------------------------------------------------------------
  -- Product 3: Arcos Curved Bouclé Sofa
  -- ----------------------------------------------------------------------------
  INSERT INTO public.products (
    slug, name, designer, year, category_id, subtitle, description, architectural_statement,
    base_price, currency, is_featured, is_published, status,
    width_cm, depth_cm, height_cm, seat_height_cm, weight_kg,
    primary_material, secondary_material, care_instructions, assembly_required,
    lead_time_weeks, sku, warranty_info
  ) VALUES (
    'arcos-travertine-bench',
    'Arcos Curved Bouclé Sofa',
    'Furniture World',
    2024,
    v_cat_seating,
    'Curved Cream Bouclé 3-Seater Sofa',
    'A welcoming curved three-seater sofa wrapped in textured cream bouclé fabric. Featuring deep foam cushioning, solid timber frame, and matching round cushions for relaxing evenings at home.',
    '“A sculptural curve that naturally softens living spaces and welcomes family gathering.”',
    2950,
    'INR',
    true,
    true,
    'active',
    235, 105, 78, 42, 75,
    'FSC-Certified Beech Wood Frame',
    'Cream Textured Bouclé',
    'Spot clean with gentle fabric foam cleanser; avoid direct sunlight to preserve yarn luster.',
    false,
    2,
    'FW-ARC-003',
    '5-year internal frame warranty; 2-year upholstery cushioning warranty.'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    category_id = EXCLUDED.category_id,
    base_price = EXCLUDED.base_price,
    currency = EXCLUDED.currency,
    is_published = EXCLUDED.is_published,
    status = EXCLUDED.status,
    warranty_info = EXCLUDED.warranty_info
  RETURNING id INTO v_prod_id;

  INSERT INTO public.product_variants (
    product_id, sku, name, finish_name, wood_species, upholstery_fabric, price, lead_time_weeks, in_stock, stock, status
  ) VALUES
    (v_prod_id, 'FW-ARC-BOU-CRM', 'Cream Bouclé 235cm', 'Cream Bouclé', 'Natural White Oak', 'Cream Textured Bouclé', 2950, 2, true, 4, 'active')
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price, in_stock = EXCLUDED.in_stock, stock = EXCLUDED.stock
  RETURNING id INTO v_var_id;
  INSERT INTO public.inventory (variant_id, quantity_available, quantity_reserved, restock_threshold)
  VALUES (v_var_id, 4, 0, 2) ON CONFLICT (variant_id) DO UPDATE SET quantity_available = 4;

  DELETE FROM public.product_media WHERE product_id = v_prod_id;
  INSERT INTO public.product_media (product_id, media_type, url, alt_text, is_primary, display_order)
  VALUES
    (v_prod_id, 'image', '/images/products/arcos-boucle-sofa.webp', 'Arcos Curved Bouclé Sofa in Cream', true, 0),
    (v_prod_id, 'image', '/images/film/interior-villa.webp', 'Arcos Sofa Living Room Setting', false, 1),
    (v_prod_id, 'image', '/images/film/macro-boucle.webp', 'Arcos Cream Bouclé Texture Detail', false, 2);

  -- ----------------------------------------------------------------------------
  -- Product 4: Nordica Olive Velvet Bed
  -- ----------------------------------------------------------------------------
  INSERT INTO public.products (
    slug, name, designer, year, category_id, subtitle, description, architectural_statement,
    base_price, currency, is_featured, is_published, status,
    width_cm, depth_cm, height_cm, seat_height_cm, weight_kg,
    primary_material, secondary_material, care_instructions, assembly_required,
    lead_time_weeks, sku, warranty_info
  ) VALUES (
    'nordica-minimalist-daybed',
    'Nordica Olive Velvet Bed',
    'Furniture World',
    2024,
    v_cat_beds,
    'King Bed with Channel-Tufted Olive Headboard',
    'A statement king bed frame with an upholstered olive green velvet headboard. Comes with solid wooden sprung slats for breathable mattress support and restful sleep.',
    '“Deep olive velvet and warm timber create a cozy, grounded bedroom atmosphere.”',
    2150,
    'INR',
    true,
    true,
    'active',
    195, 218, 122, NULL, 62,
    'Solid Timber Slats & Frame',
    'Olive Green Velvet',
    'Brush velvet lightly in direction of pile. Retighten corner bolts after 30 days of setup.',
    true,
    2,
    'FW-NOR-004',
    '5-year timber frame and slat warranty.'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    category_id = EXCLUDED.category_id,
    base_price = EXCLUDED.base_price,
    currency = EXCLUDED.currency,
    is_published = EXCLUDED.is_published,
    status = EXCLUDED.status,
    warranty_info = EXCLUDED.warranty_info
  RETURNING id INTO v_prod_id;

  INSERT INTO public.product_variants (
    product_id, sku, name, finish_name, wood_species, upholstery_fabric, price, lead_time_weeks, in_stock, stock, status
  ) VALUES
    (v_prod_id, 'FW-NOR-BED-OLV', 'Olive Velvet King', 'Olive Green Velvet', 'Warm American Walnut', 'Olive Green Velvet', 2150, 2, true, 7, 'active')
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price, in_stock = EXCLUDED.in_stock, stock = EXCLUDED.stock
  RETURNING id INTO v_var_id;
  INSERT INTO public.inventory (variant_id, quantity_available, quantity_reserved, restock_threshold)
  VALUES (v_var_id, 7, 0, 2) ON CONFLICT (variant_id) DO UPDATE SET quantity_available = 7;

  DELETE FROM public.product_media WHERE product_id = v_prod_id;
  INSERT INTO public.product_media (product_id, media_type, url, alt_text, is_primary, display_order)
  VALUES
    (v_prod_id, 'image', '/images/products/nordica-velvet-bed.webp', 'Nordica Olive Velvet King Bed', true, 0),
    (v_prod_id, 'image', '/images/collections/collection-ambient-horizons.webp', 'Nordica Bed Bedroom Setting', false, 1),
    (v_prod_id, 'image', '/images/film/exploded-view.webp', 'Nordica Bed Solid Slat Architecture', false, 2);

  -- ----------------------------------------------------------------------------
  -- Product 5: Solaris Tangerine Pendant Lamp
  -- ----------------------------------------------------------------------------
  INSERT INTO public.products (
    slug, name, designer, year, category_id, subtitle, description, architectural_statement,
    base_price, currency, is_featured, is_published, status,
    width_cm, depth_cm, height_cm, seat_height_cm, weight_kg,
    primary_material, secondary_material, care_instructions, assembly_required,
    lead_time_weeks, sku, warranty_info
  ) VALUES (
    'kanso-tensegrity-luminaire',
    'Solaris Tangerine Pendant Lamp',
    'Furniture World',
    2024,
    v_cat_lighting,
    'Glossy Orange Dome Ceiling Light',
    'A retro-modern dome pendant lamp in vibrant tangerine orange with a glossy baked-enamel finish. Projects warm, glare-free downward light over dining tables and kitchen islands.',
    '“A pop of glossy tangerine that instantly brings warmth and cheer to any room.”',
    480,
    'INR',
    true,
    true,
    'active',
    50, 50, 32, NULL, 4.5,
    'Spun Enamel Steel',
    'Solid Brass Ceiling Canopy',
    'Dust with dry microfiber cloth. Turn off mains electrical power before wiping shade or changing bulb.',
    true,
    1,
    'FW-SOL-005',
    '2-year electrical and socket components warranty.'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    category_id = EXCLUDED.category_id,
    base_price = EXCLUDED.base_price,
    currency = EXCLUDED.currency,
    is_published = EXCLUDED.is_published,
    status = EXCLUDED.status,
    warranty_info = EXCLUDED.warranty_info
  RETURNING id INTO v_prod_id;

  INSERT INTO public.product_variants (
    product_id, sku, name, finish_name, price, lead_time_weeks, in_stock, stock, status
  ) VALUES
    (v_prod_id, 'FW-SOL-TNG-50', 'Gloss Tangerine 50cm', 'Gloss Tangerine', 480, 1, true, 15, 'active')
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price, in_stock = EXCLUDED.in_stock, stock = EXCLUDED.stock
  RETURNING id INTO v_var_id;
  INSERT INTO public.inventory (variant_id, quantity_available, quantity_reserved, restock_threshold)
  VALUES (v_var_id, 15, 0, 2) ON CONFLICT (variant_id) DO UPDATE SET quantity_available = 15;

  DELETE FROM public.product_media WHERE product_id = v_prod_id;
  INSERT INTO public.product_media (product_id, media_type, url, alt_text, is_primary, display_order)
  VALUES
    (v_prod_id, 'image', '/images/products/solis-pendant-light.webp', 'Solaris Tangerine Dome Pendant Light 50cm', true, 0),
    (v_prod_id, 'image', '/images/collections/collection-monolith-dining.webp', 'Solaris Pendant Light Dining Room Ambient Setting', false, 1),
    (v_prod_id, 'image', '/images/film/hero-plinth.webp', 'Solaris Lamp Brass Canopy and Finish Detail', false, 2);

  -- ----------------------------------------------------------------------------
  -- Product 6: Tera Solid Oak Side Table
  -- ----------------------------------------------------------------------------
  INSERT INTO public.products (
    slug, name, designer, year, category_id, subtitle, description, architectural_statement,
    base_price, currency, is_featured, is_published, status,
    width_cm, depth_cm, height_cm, seat_height_cm, weight_kg,
    primary_material, secondary_material, care_instructions, assembly_required,
    lead_time_weeks, sku, warranty_info
  ) VALUES (
    'petal-tangerine-coffee-table',
    'Tera Solid Oak Side Table',
    'Furniture World',
    2024,
    v_cat_tables,
    'Sculptural Solid Oak Accent Table with Travertine',
    'A sculptural cylindrical side table carved from European white oak with an inset round top of honed natural travertine stone. Sturdy, versatile, and finished with botanical wax oils.',
    '“Natural timber grain and organic porous stone unite in quiet sculptural balance.”',
    890,
    'INR',
    true,
    true,
    'active',
    55, 55, 48, NULL, 22,
    'Solid European White Oak',
    'Honed Italian Travertine Stone',
    'Sealed travertine requires only a damp cloth wipe; clean liquids promptly to protect natural stone porosity.',
    false,
    1,
    'FW-TER-006',
    '5-year timber and stone craftsmanship warranty.'
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    category_id = EXCLUDED.category_id,
    base_price = EXCLUDED.base_price,
    currency = EXCLUDED.currency,
    is_published = EXCLUDED.is_published,
    status = EXCLUDED.status,
    warranty_info = EXCLUDED.warranty_info
  RETURNING id INTO v_prod_id;

  INSERT INTO public.product_variants (
    product_id, sku, name, finish_name, wood_species, price, lead_time_weeks, in_stock, stock, status
  ) VALUES
    (v_prod_id, 'FW-TER-OAK-TRV', 'Natural Oak & Travertine', 'Natural Oak / Travertine', 'Natural White Oak', 890, 1, true, 9, 'active')
  ON CONFLICT (sku) DO UPDATE SET price = EXCLUDED.price, in_stock = EXCLUDED.in_stock, stock = EXCLUDED.stock
  RETURNING id INTO v_var_id;
  INSERT INTO public.inventory (variant_id, quantity_available, quantity_reserved, restock_threshold)
  VALUES (v_var_id, 9, 0, 2) ON CONFLICT (variant_id) DO UPDATE SET quantity_available = 9;

  DELETE FROM public.product_media WHERE product_id = v_prod_id;
  INSERT INTO public.product_media (product_id, media_type, url, alt_text, is_primary, display_order)
  VALUES
    (v_prod_id, 'image', '/images/products/tera-side-table.webp', 'Tera Solid Oak Side Table with Travertine Inset Top', true, 0),
    (v_prod_id, 'image', '/images/lifestyle/toy-car-vintage-racer.webp', 'Tera Side Table Living Space Accent', false, 1),
    (v_prod_id, 'image', '/images/film/hero-plinth.webp', 'Tera Side Table Travertine Stone Surface Detail', false, 2);

END $$;

COMMIT;
