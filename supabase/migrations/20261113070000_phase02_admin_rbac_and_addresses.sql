-- ==============================================================================
-- FURNITURE VILLAGE — PHASE 02: ADMIN RBAC, INDIAN ADDRESS REGISTRY & AVATARS
-- Target: Supabase (PostgreSQL 17)
-- Fully non-destructive, forward-only migration
-- ==============================================================================

BEGIN;

-- ==============================================================================
-- 1. PROFILES ADMIN CONSISTENCY & AUDIT LOGGING
-- ==============================================================================

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS check_admin_consistency;

ALTER TABLE public.profiles
  ADD CONSTRAINT check_admin_consistency
  CHECK (
    (role = 'admin' AND is_admin IS TRUE) OR
    (role != 'admin' AND is_admin IS FALSE)
  );

-- Enhanced Privilege Protection with Audit Logging
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

    -- Record privilege modification in admin audit log
    INSERT INTO public.admin_activity_logs (
      admin_id,
      action,
      resource_type,
      resource_id,
      details
    ) VALUES (
      COALESCE((SELECT auth.uid()), NEW.id),
      'CHANGE_ROLE',
      'profiles',
      NEW.id::text,
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role,
        'old_is_admin', OLD.is_admin,
        'new_is_admin', NEW.is_admin
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Secure Admin Provisioning RPC (Accessible strictly by service_role)
CREATE OR REPLACE FUNCTION public.provision_admin(target_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_clean_email TEXT := lower(trim(target_email));
BEGIN
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE lower(email) = v_clean_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Target user with email % not found in auth.users', v_clean_email USING ERRCODE = 'P0002';
  END IF;

  INSERT INTO public.profiles (id, role, is_admin, updated_at)
  VALUES (v_user_id, 'admin', true, NOW())
  ON CONFLICT (id) DO UPDATE
    SET role = 'admin',
        is_admin = true,
        updated_at = NOW();

  INSERT INTO public.admin_activity_logs (
    admin_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    v_user_id,
    'PROVISION_ADMIN',
    'profiles',
    v_user_id::text,
    jsonb_build_object(
      'email', v_clean_email,
      'provisioned_at', NOW()
    )
  );

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.provision_admin(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.provision_admin(TEXT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.provision_admin(TEXT) TO service_role;


-- ==============================================================================
-- 2. INDIAN ADDRESS REGISTRY & DATABASE INTEGRITY
-- ==============================================================================

ALTER TABLE public.addresses
  ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS landmark TEXT,
  ADD COLUMN IF NOT EXISTS address_type TEXT NOT NULL DEFAULT 'Home' CHECK (address_type IN ('Home', 'Work', 'Other')),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

ALTER TABLE public.addresses
  ALTER COLUMN country SET DEFAULT 'India';

-- Indian 6-digit PIN code validation
ALTER TABLE public.addresses
  DROP CONSTRAINT IF EXISTS check_indian_pin;

ALTER TABLE public.addresses
  ADD CONSTRAINT check_indian_pin
  CHECK (postal_code ~ '^[1-9][0-9]{5}$');

-- Enforce at most one default address per customer
CREATE UNIQUE INDEX IF NOT EXISTS idx_addresses_single_default_per_user
  ON public.addresses (user_id)
  WHERE is_default IS TRUE;

CREATE INDEX IF NOT EXISTS idx_addresses_user_id
  ON public.addresses (user_id);

-- Trigger: Enforce single default on insert/update and auto-set first address as default
CREATE OR REPLACE FUNCTION public.handle_address_default()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.is_default IS TRUE THEN
    UPDATE public.addresses
    SET is_default = FALSE
    WHERE user_id = NEW.user_id
      AND id IS DISTINCT FROM NEW.id
      AND is_default IS TRUE;
  END IF;

  -- If this is the user's first address, mark it as default automatically
  IF TG_OP = 'INSERT' AND NOT EXISTS (
    SELECT 1 FROM public.addresses WHERE user_id = NEW.user_id AND id IS DISTINCT FROM NEW.id
  ) THEN
    NEW.is_default := TRUE;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_address_default() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_address_default() FROM anon, authenticated;

DROP TRIGGER IF EXISTS tr_handle_address_default ON public.addresses;
CREATE TRIGGER tr_handle_address_default
  BEFORE INSERT OR UPDATE OF is_default ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_address_default();

-- Trigger: Automatically reassign default address upon deletion
CREATE OR REPLACE FUNCTION public.handle_address_deletion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF OLD.is_default IS TRUE THEN
    UPDATE public.addresses
    SET is_default = TRUE
    WHERE id = (
      SELECT id FROM public.addresses
      WHERE user_id = OLD.user_id
      ORDER BY created_at DESC
      LIMIT 1
    );
  END IF;
  RETURN OLD;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_address_deletion() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_address_deletion() FROM anon, authenticated;

DROP TRIGGER IF EXISTS tr_handle_address_deletion ON public.addresses;
CREATE TRIGGER tr_handle_address_deletion
  AFTER DELETE ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_address_deletion();

-- Hardened Address RLS Policies
DROP POLICY IF EXISTS "Users manage own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can view own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can insert own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Admins can view all addresses" ON public.addresses;

CREATE POLICY "Users can view own addresses" ON public.addresses
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own addresses" ON public.addresses
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update own addresses" ON public.addresses
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete own addresses" ON public.addresses
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins can view all addresses" ON public.addresses
  FOR SELECT TO authenticated
  USING (public.is_admin());


-- ==============================================================================
-- 3. STORAGE BUCKET: AVATARS & SECURITY POLICIES
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

DROP POLICY IF EXISTS "Avatar images are publicly readable." ON storage.objects;
CREATE POLICY "Avatar images are publicly readable."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'avatars' );

DROP POLICY IF EXISTS "Users can upload own avatar." ON storage.objects;
CREATE POLICY "Users can upload own avatar."
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Users can update own avatar." ON storage.objects;
CREATE POLICY "Users can update own avatar."
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Users can delete own avatar." ON storage.objects;
CREATE POLICY "Users can delete own avatar."
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Admins can manage all avatars." ON storage.objects;
CREATE POLICY "Admins can manage all avatars."
  ON storage.objects FOR ALL TO authenticated
  USING ( bucket_id = 'avatars' AND public.is_admin() )
  WITH CHECK ( bucket_id = 'avatars' AND public.is_admin() );

COMMIT;
