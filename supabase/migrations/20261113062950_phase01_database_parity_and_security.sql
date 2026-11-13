-- ==============================================================================
-- FURNITURE VILLAGE — PHASE 01: DATABASE PARITY, SECURITY ARCHITECTURE & STORAGE
-- Target: Supabase (PostgreSQL 17)
-- Fully resolves all security vulnerabilities & establishes LexCC parity
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- 1. ADMIN RBAC & PRIVILEGE PROTECTION
-- ==============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'concierge')),
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone TEXT;

-- Narrowly scoped, deterministic admin check function safe from search_path hijacking
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND (is_admin IS TRUE OR role = 'admin')
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- Prevent customers from escalating their own role or is_admin status
CREATE OR REPLACE FUNCTION public.protect_profile_privileges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Profile ownership ID cannot be altered' USING ERRCODE = '42501';
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role OR NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
    IF (SELECT auth.uid()) IS NOT NULL AND NOT public.is_admin() THEN
      RAISE EXCEPTION 'Only an administrator can alter account roles or privileges' USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.protect_profile_privileges() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.protect_profile_privileges() FROM anon, authenticated;

DROP TRIGGER IF EXISTS tr_protect_profile_privileges ON public.profiles;
CREATE TRIGGER tr_protect_profile_privileges
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_privileges();

-- Profiles Admin RLS
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ==============================================================================
-- 2. CART ISOLATION & IDEMPOTENT GUEST CART MERGE
-- ==============================================================================

-- Remove the unsafe guest cart policies that permitted user_id IS NULL cross-tenant access
DROP POLICY IF EXISTS "Users can view own carts" ON public.carts;
DROP POLICY IF EXISTS "Users can insert own carts" ON public.carts;
DROP POLICY IF EXISTS "Users can update own carts" ON public.carts;
DROP POLICY IF EXISTS "Users can manage cart items" ON public.cart_items;

-- Authenticated database carts are strictly scoped to auth.uid()
CREATE POLICY "Authenticated users view own cart" ON public.carts
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Authenticated users insert own cart" ON public.carts
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Authenticated users update own cart" ON public.carts
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Authenticated users delete own cart" ON public.carts
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'carts_user_id_unique'
  ) THEN
    ALTER TABLE public.carts ADD CONSTRAINT carts_user_id_unique UNIQUE (user_id);
  END IF;
END;
$$;

-- Cart items scoped strictly through cart owner
CREATE POLICY "Authenticated users manage own cart items" ON public.cart_items
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
        AND carts.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
        AND carts.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "Admins view all cart items" ON public.cart_items
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- Cart merge event tracking table
CREATE TABLE IF NOT EXISTS public.cart_merge_events (
  merge_id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.cart_merge_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.cart_merge_events FROM anon, authenticated;
GRANT ALL ON TABLE public.cart_merge_events TO service_role;

-- Idempotent guest-to-authenticated cart merge stored procedure
CREATE OR REPLACE FUNCTION public.merge_guest_cart(
  p_merge_id UUID,
  p_items JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID := (SELECT auth.uid());
  v_cart_id UUID;
  v_item JSONB;
  v_variant_id UUID;
  v_quantity INTEGER;
  v_claimed BOOLEAN := FALSE;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required to merge carts' USING ERRCODE = '42501';
  END IF;

  IF p_merge_id IS NULL
     OR p_items IS NULL
     OR jsonb_typeof(p_items) IS DISTINCT FROM 'array'
     OR jsonb_array_length(p_items) = 0
     OR jsonb_array_length(p_items) > 50 THEN
    RAISE EXCEPTION 'A valid cart merge payload is required' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.carts (user_id)
  VALUES (v_user_id)
  ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
  RETURNING id INTO v_cart_id;

  INSERT INTO public.cart_merge_events (merge_id, user_id, cart_id)
  VALUES (p_merge_id, v_user_id, v_cart_id)
  ON CONFLICT (merge_id) DO NOTHING
  RETURNING TRUE INTO v_claimed;

  IF NOT COALESCE(v_claimed, FALSE) THEN
    RETURN TRUE; -- Idempotent retry success
  END IF;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items) LOOP
    IF COALESCE(v_item->>'variant_id', '') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
       OR COALESCE(v_item->>'quantity', '') !~ '^[0-9]+$' THEN
      CONTINUE;
    END IF;

    v_variant_id := (v_item->>'variant_id')::UUID;
    v_quantity := LEAST(GREATEST((v_item->>'quantity')::INTEGER, 1), 99);

    IF EXISTS (
      SELECT 1 FROM public.product_variants pv
      JOIN public.products p ON p.id = pv.product_id
      WHERE pv.id = v_variant_id
        AND p.is_published = true
    ) THEN
      INSERT INTO public.cart_items (cart_id, variant_id, quantity)
      VALUES (v_cart_id, v_variant_id, v_quantity)
      ON CONFLICT (cart_id, variant_id) DO UPDATE
        SET quantity = LEAST(public.cart_items.quantity + EXCLUDED.quantity, 99);
    END IF;
  END LOOP;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.merge_guest_cart(UUID, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.merge_guest_cart(UUID, JSONB) FROM anon;
GRANT EXECUTE ON FUNCTION public.merge_guest_cart(UUID, JSONB) TO authenticated;


-- ==============================================================================
-- 3. ORDERS & PRICING SECURITY HARDENING
-- ==============================================================================

-- Remove client-side order forgery vulnerability
DROP POLICY IF EXISTS "Customers can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can insert own order items" ON public.order_items;

REVOKE INSERT ON TABLE public.orders FROM anon, authenticated;
REVOKE UPDATE ON TABLE public.orders FROM anon, authenticated;
REVOKE DELETE ON TABLE public.orders FROM anon, authenticated;

REVOKE INSERT ON TABLE public.order_items FROM anon, authenticated;
REVOKE UPDATE ON TABLE public.order_items FROM anon, authenticated;
REVOKE DELETE ON TABLE public.order_items FROM anon, authenticated;

GRANT ALL ON TABLE public.orders TO service_role;
GRANT ALL ON TABLE public.order_items TO service_role;

-- Add order fulfillment & payment tracking columns
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'razorpay' CHECK (payment_method IN ('razorpay', 'cod', 'stripe', 'wire')),
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS courier_name TEXT,
  ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS guest_access_token_hash TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_signature TEXT,
  ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMPTZ;

-- Immutable price snapshot column on order_items
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS price_at_time DECIMAL(10, 2);

-- Admin order policies
DROP POLICY IF EXISTS "Admins can view and manage all orders" ON public.orders;
CREATE POLICY "Admins can view and manage all orders" ON public.orders
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can view and manage all order items" ON public.order_items;
CREATE POLICY "Admins can view and manage all order items" ON public.order_items
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- ==============================================================================
-- 4. WISHLIST & WISHLIST ITEMS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT wishlists_user_id_unique UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id UUID NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT wishlist_items_unique_entry UNIQUE (wishlist_id, product_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist_id ON public.wishlist_items(wishlist_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wishlist" ON public.wishlists
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own wishlist" ON public.wishlists
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own wishlist" ON public.wishlists
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can manage own wishlist items" ON public.wishlist_items
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id
        AND wishlists.user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.wishlists
      WHERE wishlists.id = wishlist_items.wishlist_id
        AND wishlists.user_id = (SELECT auth.uid())
    )
  );


-- ==============================================================================
-- 5. FURNITURE PRODUCT & VARIANT ATTRIBUTES
-- ==============================================================================

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  ADD COLUMN IF NOT EXISTS width_cm NUMERIC(6, 1),
  ADD COLUMN IF NOT EXISTS depth_cm NUMERIC(6, 1),
  ADD COLUMN IF NOT EXISTS height_cm NUMERIC(6, 1),
  ADD COLUMN IF NOT EXISTS seat_height_cm NUMERIC(6, 1),
  ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(6, 1),
  ADD COLUMN IF NOT EXISTS primary_material TEXT,
  ADD COLUMN IF NOT EXISTS secondary_material TEXT,
  ADD COLUMN IF NOT EXISTS care_instructions TEXT,
  ADD COLUMN IF NOT EXISTS assembly_required BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lead_time_weeks INT DEFAULT 4,
  ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS white_glove_eligible BOOLEAN DEFAULT true;

ALTER TABLE public.product_variants
  ADD COLUMN IF NOT EXISTS wood_species TEXT,
  ADD COLUMN IF NOT EXISTS upholstery_fabric TEXT,
  ADD COLUMN IF NOT EXISTS stock INT NOT NULL DEFAULT 5 CHECK (stock >= 0);

-- Prevent variant & media leakage for draft/unpublished products
DROP POLICY IF EXISTS "Public variants view" ON public.product_variants;
CREATE POLICY "Public variants view" ON public.product_variants
  FOR SELECT TO PUBLIC
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_variants.product_id
        AND p.is_published IS TRUE
        AND p.status = 'active'
    )
    OR (SELECT auth.uid() IS NOT NULL AND public.is_admin())
  );

DROP POLICY IF EXISTS "Public media view" ON public.product_media;
CREATE POLICY "Public media view" ON public.product_media
  FOR SELECT TO PUBLIC
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_media.product_id
        AND p.is_published IS TRUE
        AND p.status = 'active'
    )
    OR (SELECT auth.uid() IS NOT NULL AND public.is_admin())
  );

DROP POLICY IF EXISTS "Public catalog view" ON public.products;
CREATE POLICY "Public catalog view" ON public.products
  FOR SELECT TO PUBLIC
  USING (
    (is_published IS TRUE AND status = 'active')
    OR (SELECT auth.uid() IS NOT NULL AND public.is_admin())
  );

-- Admin product policies
CREATE POLICY "Admins manage all products" ON public.products
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins manage all variants" ON public.product_variants
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins manage all media" ON public.product_media
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Secure Inventory Exposure: remove public query of exact warehouse numbers
DROP POLICY IF EXISTS "Public can view inventory" ON public.inventory;

CREATE POLICY "Admins view inventory" ON public.inventory
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins manage inventory" ON public.inventory
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Secure public view for storefront availability
CREATE OR REPLACE VIEW public.storefront_inventory AS
  SELECT 
    i.variant_id,
    (i.quantity_available > 0) AS in_stock
  FROM public.inventory i
  JOIN public.product_variants pv ON pv.id = i.variant_id
  JOIN public.products p ON p.id = pv.product_id
  WHERE p.is_published IS TRUE AND p.status = 'active';

GRANT SELECT ON public.storefront_inventory TO anon, authenticated;


-- ==============================================================================
-- 6. WRITE-ONLY NEWSLETTER SUBSCRIBERS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('home', 'footer', 'gazette', 'website')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  unsubscribed_at TIMESTAMPTZ,
  CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email)
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.newsletter_subscribers FROM anon;
GRANT SELECT ON TABLE public.newsletter_subscribers TO authenticated;
GRANT ALL ON TABLE public.newsletter_subscribers TO service_role;

CREATE POLICY "Admins can view newsletter subscribers" ON public.newsletter_subscribers
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.subscribe_to_newsletter(
  p_email TEXT,
  p_source TEXT DEFAULT 'website'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_email TEXT := lower(trim(p_email));
  v_source TEXT := lower(trim(COALESCE(p_source, 'website')));
BEGIN
  IF length(v_email) > 254
     OR v_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' COLLATE "C" THEN
    RAISE EXCEPTION 'A valid email address is required' USING ERRCODE = '22023';
  END IF;

  IF v_source NOT IN ('home', 'footer', 'gazette', 'website') THEN
    v_source := 'website';
  END IF;

  INSERT INTO public.newsletter_subscribers (
    email,
    source,
    status,
    subscribed_at,
    unsubscribed_at
  )
  VALUES (v_email, v_source, 'active', NOW(), NULL)
  ON CONFLICT (email) DO UPDATE
    SET source = EXCLUDED.source,
        status = 'active',
        subscribed_at = NOW(),
        unsubscribed_at = NULL;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.subscribe_to_newsletter(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.subscribe_to_newsletter(TEXT, TEXT) TO anon, authenticated;


-- ==============================================================================
-- 7. AUDIT LOGS, WEBHOOKS & SYSTEM HEALTH
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view admin activity logs" ON public.admin_activity_logs
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert admin activity logs" ON public.admin_activity_logs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.system_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.system_health_logs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.system_health_logs FROM anon, authenticated;
GRANT ALL ON TABLE public.system_health_logs TO service_role;

CREATE TABLE IF NOT EXISTS public.razorpay_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.razorpay_webhook_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.razorpay_webhook_events FROM anon, authenticated;
GRANT ALL ON TABLE public.razorpay_webhook_events TO service_role;


-- ==============================================================================
-- 8. PRODUCT MEDIA STORAGE BUCKET & RLS
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

DROP POLICY IF EXISTS "Product images are publicly readable." ON storage.objects;
CREATE POLICY "Product images are publicly readable."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'products' );

DROP POLICY IF EXISTS "Admins can upload product images." ON storage.objects;
CREATE POLICY "Admins can upload product images."
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK ( bucket_id = 'products' AND public.is_admin() );

DROP POLICY IF EXISTS "Admins can update product images." ON storage.objects;
CREATE POLICY "Admins can update product images."
  ON storage.objects FOR UPDATE TO authenticated
  USING ( bucket_id = 'products' AND public.is_admin() );

DROP POLICY IF EXISTS "Admins can delete product images." ON storage.objects;
CREATE POLICY "Admins can delete product images."
  ON storage.objects FOR DELETE TO authenticated
  USING ( bucket_id = 'products' AND public.is_admin() );

COMMIT;
