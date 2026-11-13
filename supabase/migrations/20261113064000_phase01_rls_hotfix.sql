-- ==============================================================================
-- FURNITURE VILLAGE — PHASE 01 RLS HOTFIX
-- 1. Decouples public catalog policies from is_admin to prevent anon execution errors
-- 2. Grants public select on storage.buckets for public = true buckets
-- ==============================================================================

BEGIN;

-- 1. Public catalog policies
DROP POLICY IF EXISTS "Public catalog view" ON public.products;
CREATE POLICY "Public catalog view" ON public.products
  FOR SELECT TO PUBLIC
  USING (is_published IS TRUE AND status = 'active');

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
  );

-- 2. Storage bucket metadata visibility for public buckets
DROP POLICY IF EXISTS "Public buckets view" ON storage.buckets;
CREATE POLICY "Public buckets view" ON storage.buckets
  FOR SELECT TO PUBLIC
  USING (public = true);

COMMIT;
