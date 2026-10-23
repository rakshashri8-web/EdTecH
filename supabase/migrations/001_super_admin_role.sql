-- ============================================================
-- AUDITED TRANSACTIONAL PRODUCTION MIGRATION
-- File: supabase/migrations/001_super_admin_role.sql
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. UPDATE ROLE CHECK CONSTRAINT ON PROFILES
-- ------------------------------------------------------------
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('student', 'admin', 'super_admin'));

-- ------------------------------------------------------------
-- 2. SECURITY DEFINER HELPER FUNCTIONS (SAFE SEARCH_PATH)
-- ------------------------------------------------------------

-- A. is_admin(): True for both 'admin' and 'super_admin'
-- Automatically upgrades all 17 preserved admin policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- B. is_super_admin(): True ONLY for 'super_admin'
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
      AND role = 'super_admin'
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_super_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated, service_role;

-- C. is_admin_or_service(): Powers triggers on payments & enrollments
CREATE OR REPLACE FUNCTION public.is_admin_or_service()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT 
    current_setting('role', true) IN ('service_role', 'postgres', 'supabase_admin')
    OR auth.role() = 'service_role'
    OR (
      auth.role() = 'authenticated' 
      AND EXISTS (
        SELECT 1 
        FROM public.profiles 
        WHERE id = auth.uid() 
          AND role IN ('admin', 'super_admin')
      )
    );
$$;

REVOKE EXECUTE ON FUNCTION public.is_admin_or_service() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin_or_service() TO authenticated, service_role;

-- ------------------------------------------------------------
-- 3. AIRTIGHT ROLE-ESCALATION TRIGGER (BEFORE INSERT OR UPDATE)
-- Locks Super Admin role exclusively to rakshashri8@gmail.com
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.prevent_profile_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_is_direct_dba BOOLEAN;
  v_is_super_admin BOOLEAN;
BEGIN
  -- Identify direct database superuser sessions (Supabase SQL Editor).
  -- PostgREST web client requests connect as session_user = 'authenticator',
  -- ensuring v_is_direct_dba is ALWAYS FALSE for all web requests.
  v_is_direct_dba := (
    session_user IN ('postgres', 'supabase_admin')
    AND auth.uid() IS NULL
    AND (auth.role() IS NULL OR auth.role() = '')
  );

  -- Check if caller is an authenticated Super Admin or system admin
  v_is_super_admin := v_is_direct_dba OR (
    auth.role() = 'authenticated' 
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 
      FROM public.profiles 
      WHERE id = auth.uid() 
        AND role = 'super_admin' 
        AND LOWER(email) = 'rakshashri8@gmail.com'
    )
  );

  -- Handle INSERT attempts
  IF TG_OP = 'INSERT' THEN
    IF NEW.role != 'student' AND NOT v_is_super_admin THEN
      RAISE EXCEPTION 'Security Violation: Only a Super Admin or direct database administrator can create administrator profiles.';
    END IF;
    -- Only rakshashri8@gmail.com can ever hold super_admin
    IF NEW.role = 'super_admin' AND LOWER(NEW.email) != 'rakshashri8@gmail.com' THEN
      RAISE EXCEPTION 'Security Violation: Only rakshashri8@gmail.com is authorized to hold the Super Admin role.';
    END IF;
    RETURN NEW;
  END IF;

  -- Handle UPDATE attempts
  IF TG_OP = 'UPDATE' THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      -- Rule 1: Only rakshashri8@gmail.com can ever hold super_admin
      IF NEW.role = 'super_admin' THEN
        IF LOWER(NEW.email) != 'rakshashri8@gmail.com' THEN
          RAISE EXCEPTION 'Security Violation: Only rakshashri8@gmail.com is authorized to hold the Super Admin role.';
        END IF;
        IF NOT v_is_direct_dba THEN
          RAISE EXCEPTION 'Security Violation: Super Admin role can only be assigned directly via Supabase SQL Editor.';
        END IF;
      END IF;

      -- Rule 2: Super Admin cannot be demoted through client requests
      IF OLD.role = 'super_admin' AND NOT v_is_direct_dba THEN
        RAISE EXCEPTION 'Security Violation: Cannot alter or revoke Super Admin privileges through client requests.';
      END IF;

      -- Rule 3: Granting or revoking 'admin' role requires Super Admin privileges
      IF (OLD.role = 'admin' OR NEW.role = 'admin') AND NOT v_is_super_admin THEN
        RAISE EXCEPTION 'Security Violation: Only the Super Admin can grant or revoke administrator roles.';
      END IF;

      -- Rule 4: General role modification lockdown (students cannot change roles)
      IF NOT v_is_super_admin THEN
        RAISE EXCEPTION 'Security Violation: Unauthorized role modification.';
      END IF;
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_profile_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_profile_role_escalation
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_role_escalation();

-- ------------------------------------------------------------
-- 4. HARDEN PROFILES INSERT & UPDATE POLICIES (DEFENSE-IN-DEPTH)
-- Replaces live CSV row 24 and row 26
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT 
  WITH CHECK (
    -- Normal self-registration requires role to be 'student'
    ((auth.uid() = id) AND (role = 'student'))
    -- Super Admin can insert profiles with administrator roles
    OR (auth.role() = 'authenticated' AND public.is_super_admin())
  );

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE 
  USING (
    auth.uid() = id 
    OR (auth.role() = 'authenticated' AND public.is_admin())
  )
  WITH CHECK (
    -- Students can update own profile; role MUST remain 'student'
    ((auth.uid() = id) AND (role = 'student'))
    -- Ordinary admins can update student profiles, but resulting role MUST be 'student'
    OR (auth.role() = 'authenticated' AND public.is_admin() AND role = 'student')
    -- Only Super Admins can save a profile with an administrator role
    OR (auth.role() = 'authenticated' AND public.is_super_admin())
  );

-- ------------------------------------------------------------
-- 5. SAFELY ADD AUDIT COLUMNS TO ENROLLMENTS
-- ------------------------------------------------------------
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- ------------------------------------------------------------
-- 6. ADD PUBLISHED COLUMN TO LESSONS
-- ------------------------------------------------------------
-- A. Populate all EXISTING lessons with true (visibility preserved)
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;

-- B. Set default for NEW future lessons to false (draft mode)
ALTER TABLE public.lessons
  ALTER COLUMN published SET DEFAULT false;

-- ------------------------------------------------------------
-- 7. PLUG LESSONS DATA LEAK & ESTABLISH UNIFIED ACCESS POLICY
-- Drops CSV row 16 ("Allow public read access to preview lessons" USING true)
-- Replaces CSV row 19 ("lessons_select_policy")
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read access to preview lessons" ON public.lessons;
DROP POLICY IF EXISTS "Allow public read access to preview lessons or enrolled lessons" ON public.lessons;
DROP POLICY IF EXISTS "lessons_select_policy" ON public.lessons;

CREATE POLICY "lessons_select_policy" ON public.lessons
  FOR SELECT USING (
    -- 1. Admins and Super Admins view all lessons (published & drafts)
    (auth.role() = 'authenticated' AND public.is_admin())
    -- 2. Anyone (including public visitors) can view published preview lessons
    OR (
      published = true 
      AND is_preview = true
    )
    -- 3. Enrolled students can view published lessons for approved courses
    OR (
      published = true
      AND auth.uid() IS NOT NULL
      AND EXISTS (
        SELECT 1 
        FROM public.enrollments 
        WHERE enrollments.user_id = auth.uid() 
          AND enrollments.course_id = lessons.course_id 
          AND enrollments.status = 'approved'
      )
    )
  );

-- ------------------------------------------------------------
-- 8. DEFENSIVE CLEANUP OF UNWANTED DRAFT POLICY NAMES
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Admins can update enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage modules" ON public.course_modules;
DROP POLICY IF EXISTS "Admins can manage lessons" ON public.lessons;

COMMIT;
