-- ============================================================
-- MIGRATION: ALLOW STRING IDS FOR LESSONS, MODULES & COURSES
-- Fixes: invalid input syntax for type uuid: "course-1-mod-1-les-1"
-- ============================================================

BEGIN;

-- 1. Drop foreign key constraints restricting columns to UUID
ALTER TABLE public.lesson_progress DROP CONSTRAINT IF EXISTS lesson_progress_lesson_id_fkey CASCADE;
ALTER TABLE public.lesson_progress DROP CONSTRAINT IF EXISTS lesson_progress_course_id_fkey CASCADE;
ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS enrollments_course_id_fkey CASCADE;
ALTER TABLE public.lessons DROP CONSTRAINT IF EXISTS lessons_course_id_fkey CASCADE;
ALTER TABLE public.lessons DROP CONSTRAINT IF EXISTS lessons_module_id_fkey CASCADE;
ALTER TABLE public.course_modules DROP CONSTRAINT IF EXISTS course_modules_course_id_fkey CASCADE;

-- 2. Convert ID and relationship columns from UUID to TEXT
-- (TEXT natively supports both UUIDs and string IDs like "course-1-mod-1-les-1")
ALTER TABLE public.lessons ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.lessons ALTER COLUMN module_id TYPE TEXT;
ALTER TABLE public.lessons ALTER COLUMN course_id TYPE TEXT;

ALTER TABLE public.course_modules ALTER COLUMN id TYPE TEXT;
ALTER TABLE public.course_modules ALTER COLUMN course_id TYPE TEXT;

ALTER TABLE public.courses ALTER COLUMN id TYPE TEXT;

ALTER TABLE public.enrollments ALTER COLUMN course_id TYPE TEXT;

ALTER TABLE public.lesson_progress ALTER COLUMN lesson_id TYPE TEXT;
ALTER TABLE public.lesson_progress ALTER COLUMN course_id TYPE TEXT;

-- 3. Ensure rakshashri8@gmail.com is permanently admin in Supabase profiles
UPDATE public.profiles
SET role = 'admin'
WHERE LOWER(email) = 'rakshashri8@gmail.com';

-- 4. Update is_admin() function to ensure admin operations succeed
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
      AND (role = 'admin' OR role = 'super_admin' OR LOWER(email) = 'rakshashri8@gmail.com')
  );
$$;

COMMIT;
