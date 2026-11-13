-- ==============================================================================
-- SECURITY HARDENING & RLS INITPLAN OPTIMIZATIONS
-- Resolves Supabase DB Linter findings:
-- 1. Revoke public/anon execute on trigger functions (SECURITY DEFINER)
-- 2. Optimize RLS policies using (SELECT auth.uid()) to avoid per-row re-evaluation
-- ==============================================================================

-- 1. REVOKE PUBLIC ACCESS TO SECURITY DEFINER TRIGGER FUNCTIONS
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
    EXECUTE 'REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;';
  END IF;
END $$;

-- 2. PROFILES RLS OPTIMIZATION
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING ((SELECT auth.uid()) = id) WITH CHECK ((SELECT auth.uid()) = id);

-- 3. CARTS RLS OPTIMIZATION
DROP POLICY IF EXISTS "Users can view own carts" ON public.carts;
CREATE POLICY "Users can view own carts" ON public.carts
    FOR SELECT USING ((SELECT auth.uid()) = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can insert own carts" ON public.carts;
CREATE POLICY "Users can insert own carts" ON public.carts
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update own carts" ON public.carts;
CREATE POLICY "Users can update own carts" ON public.carts
    FOR UPDATE USING ((SELECT auth.uid()) = user_id OR user_id IS NULL)
    WITH CHECK ((SELECT auth.uid()) = user_id OR user_id IS NULL);

-- 4. CART ITEMS RLS OPTIMIZATION
DROP POLICY IF EXISTS "Users can manage cart items" ON public.cart_items;
CREATE POLICY "Users can manage cart items" ON public.cart_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.carts
            WHERE carts.id = cart_items.cart_id
            AND (carts.user_id = (SELECT auth.uid()) OR carts.user_id IS NULL)
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.carts
            WHERE carts.id = cart_items.cart_id
            AND (carts.user_id = (SELECT auth.uid()) OR carts.user_id IS NULL)
        )
    );

-- 5. ADDRESSES RLS OPTIMIZATION
DROP POLICY IF EXISTS "Users manage own addresses" ON public.addresses;
CREATE POLICY "Users manage own addresses" ON public.addresses
    FOR ALL USING ((SELECT auth.uid()) = user_id)
    WITH CHECK ((SELECT auth.uid()) = user_id);

-- 6. ORDERS RLS OPTIMIZATION
DROP POLICY IF EXISTS "Customers view own orders" ON public.orders;
CREATE POLICY "Customers view own orders" ON public.orders
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Customers can insert own orders" ON public.orders;
CREATE POLICY "Customers can insert own orders" ON public.orders
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- 7. ORDER ITEMS RLS OPTIMIZATION
DROP POLICY IF EXISTS "Customers view own order items" ON public.order_items;
CREATE POLICY "Customers view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = (SELECT auth.uid())
        )
    );

DROP POLICY IF EXISTS "Customers can insert own order items" ON public.order_items;
CREATE POLICY "Customers can insert own order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = (SELECT auth.uid())
        )
    );

-- 8. PAYMENTS RLS OPTIMIZATION
DROP POLICY IF EXISTS "Customers view own payments" ON public.payments;
CREATE POLICY "Customers view own payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = payments.order_id
            AND orders.user_id = (SELECT auth.uid())
        )
    );
