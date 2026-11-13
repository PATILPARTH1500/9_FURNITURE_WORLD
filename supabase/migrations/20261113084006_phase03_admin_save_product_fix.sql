-- ==============================================================================
-- Migration: 20261113084006_phase03_admin_save_product_fix.sql
-- Corrects admin_activity_logs column references (resource_type, resource_id)
-- in admin_save_product stored procedure.
-- ==============================================================================

BEGIN;

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

  -- 5. Audit Log Entry (using resource_type and resource_id matching table schema)
  INSERT INTO public.admin_activity_logs (
    admin_id, action, resource_type, resource_id, details
  ) VALUES (
    v_actor_id,
    CASE WHEN payload ? 'id' THEN 'product_updated' ELSE 'product_created' END,
    'product',
    v_product_id::TEXT,
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

COMMIT;
