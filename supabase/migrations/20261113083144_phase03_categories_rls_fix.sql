-- ==============================================================================
-- Migration: 20261113083144_phase03_categories_rls_fix.sql
-- Decouples public categories SELECT policy from is_admin to prevent anon
-- execution errors, mirroring phase01_rls_hotfix for products/variants/media.
-- ==============================================================================

BEGIN;

DROP POLICY IF EXISTS "Public categories view" ON public.categories;
CREATE POLICY "Public categories view" ON public.categories
  FOR SELECT TO PUBLIC
  USING (is_active IS TRUE);

COMMIT;
