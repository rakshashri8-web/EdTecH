-- ============================================================
-- MIGRATION 006: FIX PERMISSION DENIED FOR TABLE PROFILES & TABLES
-- ============================================================

-- 1. Grant schema usage to anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Grant table-level access to authenticated and anon
-- (Row-Level Security RLS remains active and strictly enforced!)
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 3. Set default privileges so any future tables automatically have permissions
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 4. Specifically ensure helper security functions are executable
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin_or_service() TO anon, authenticated, service_role;

-- 5. Ensure anwarshaik7288@gmail.com is granted admin role
UPDATE public.profiles
SET role = 'admin'
WHERE LOWER(email) = 'anwarshaik7288@gmail.com';

-- 6. Ensure rakshashri8@gmail.com is super_admin
UPDATE public.profiles
SET role = 'super_admin'
WHERE LOWER(email) = 'rakshashri8@gmail.com';
