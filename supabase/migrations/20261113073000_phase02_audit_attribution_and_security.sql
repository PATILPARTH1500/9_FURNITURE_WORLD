-- ==============================================================================
-- FURNITURE VILLAGE — PHASE 02 AUDIT ATTRIBUTION & PROVISIONING HARDENING
-- Target: Supabase (PostgreSQL 17)
-- 1. Makes admin_id nullable in admin_activity_logs for system/service_role actions
-- 2. Accurately attributes provision_admin() to the real actor without misattributing target user
-- 3. Records target account separately from the actor
-- ==============================================================================

BEGIN;

-- 1. Allow nullable admin_id in admin_activity_logs for system/service_role operations
ALTER TABLE public.admin_activity_logs
  ALTER COLUMN admin_id DROP NOT NULL;

-- 2. Update provision_admin() to attribute operations correctly to actor (or system:service_role)
CREATE OR REPLACE FUNCTION public.provision_admin(target_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id UUID;
  v_clean_email TEXT := lower(trim(target_email));
  v_actor_id UUID := (SELECT auth.uid());
BEGIN
  -- Resolve auth.users id for target email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE lower(email) = v_clean_email;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Target user with email % not found in auth.users', v_clean_email USING ERRCODE = 'P0002';
  END IF;

  -- Ensure profile exists and has role = 'admin' and is_admin = true
  INSERT INTO public.profiles (id, role, is_admin, updated_at)
  VALUES (v_user_id, 'admin', true, NOW())
  ON CONFLICT (id) DO UPDATE
    SET role = 'admin',
        is_admin = true,
        updated_at = NOW();

  -- Record audit attribution accurately without misattributing to target user
  INSERT INTO public.admin_activity_logs (
    admin_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    v_actor_id, -- NULL if system/service_role execution
    'PROVISION_ADMIN',
    'profiles',
    v_user_id::text,
    jsonb_build_object(
      'target_email', v_clean_email,
      'target_user_id', v_user_id,
      'actor', CASE WHEN v_actor_id IS NOT NULL THEN v_actor_id::text ELSE 'system:service_role' END,
      'actor_type', CASE WHEN v_actor_id IS NOT NULL THEN 'admin_session' ELSE 'system_service_role' END,
      'provisioned_at', NOW()
    )
  );

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.provision_admin(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.provision_admin(TEXT) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.provision_admin(TEXT) TO service_role;

-- 3. Update protect_profile_privileges() to separate actor from target account
CREATE OR REPLACE FUNCTION public.protect_profile_privileges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_actor_id UUID := (SELECT auth.uid());
BEGIN
  IF NEW.id IS DISTINCT FROM OLD.id THEN
    RAISE EXCEPTION 'Profile ownership ID cannot be altered' USING ERRCODE = '42501';
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role OR NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
    IF v_actor_id IS NOT NULL AND NOT public.is_admin() THEN
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
      v_actor_id,
      'CHANGE_ROLE',
      'profiles',
      NEW.id::text,
      jsonb_build_object(
        'target_user_id', NEW.id,
        'actor', CASE WHEN v_actor_id IS NOT NULL THEN v_actor_id::text ELSE 'system:service_role' END,
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

COMMIT;
