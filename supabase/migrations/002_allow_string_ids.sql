-- ============================================================
-- MIGRATION: ALLOW STRING IDS FOR LESSONS, MODULES & COURSES
-- Fixes: invalid input syntax for type uuid: "course-1-mod-1-les-1"
-- ============================================================

BEGIN;

-- 1. Temporarily drop policies that reference course_id/lesson_id/module_id columns
DROP POLICY IF EXISTS "lessons_select_policy" ON public.lessons;
DROP POLICY IF EXISTS "lessons_insert_policy" ON public.lessons;
DROP POLICY IF EXISTS "lessons_update_policy" ON public.lessons;
DROP POLICY IF EXISTS "lessons_delete_policy" ON public.lessons;
DROP POLICY IF EXISTS "Allow public read access to preview lessons" ON public.lessons;
DROP POLICY IF EXISTS "Allow public read access to preview lessons or enrolled lessons" ON public.lessons;
DROP POLICY IF EXISTS "Allow admin full access to lessons" ON public.lessons;

DROP POLICY IF EXISTS "course_modules_select_policy" ON public.course_modules;
DROP POLICY IF EXISTS "course_modules_insert_policy" ON public.course_modules;
DROP POLICY IF EXISTS "course_modules_update_policy" ON public.course_modules;
DROP POLICY IF EXISTS "course_modules_delete_policy" ON public.course_modules;
DROP POLICY IF EXISTS "Allow public read access to modules" ON public.course_modules;
DROP POLICY IF EXISTS "Allow admin full access to modules" ON public.course_modules;

DROP POLICY IF EXISTS "courses_select_policy" ON public.courses;
DROP POLICY IF EXISTS "courses_insert_policy" ON public.courses;
DROP POLICY IF EXISTS "courses_update_policy" ON public.courses;
DROP POLICY IF EXISTS "courses_delete_policy" ON public.courses;
DROP POLICY IF EXISTS "Allow public read access to published courses" ON public.courses;
DROP POLICY IF EXISTS "Allow admin full access to courses" ON public.courses;

DROP POLICY IF EXISTS "lesson_progress_select_policy" ON public.lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_insert_policy" ON public.lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_update_policy" ON public.lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_delete_policy" ON public.lesson_progress;
DROP POLICY IF EXISTS "Students can view and update own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Admin can view all lesson progress" ON public.lesson_progress;

DROP POLICY IF EXISTS "enrollments_select_policy" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_insert_policy" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_update_policy" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_delete_policy" ON public.enrollments;

-- 2. Drop foreign key constraints restricting columns to UUID
ALTER TABLE public.lesson_progress DROP CONSTRAINT IF EXISTS lesson_progress_lesson_id_fkey CASCADE;
ALTER TABLE public.lesson_progress DROP CONSTRAINT IF EXISTS lesson_progress_course_id_fkey CASCADE;
ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS enrollments_course_id_fkey CASCADE;
ALTER TABLE public.lessons DROP CONSTRAINT IF EXISTS lessons_course_id_fkey CASCADE;
ALTER TABLE public.lessons DROP CONSTRAINT IF EXISTS lessons_module_id_fkey CASCADE;
ALTER TABLE public.course_modules DROP CONSTRAINT IF EXISTS course_modules_course_id_fkey CASCADE;

-- 3. Convert ID and relationship columns from UUID to TEXT
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

-- 4. Re-create the secure RLS policies (now working with TEXT columns)
CREATE POLICY "courses_select_policy" ON public.courses
  FOR SELECT USING (published = true OR (auth.role() = 'authenticated' AND public.is_admin()));

CREATE POLICY "courses_insert_policy" ON public.courses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "courses_update_policy" ON public.courses
  FOR UPDATE USING (auth.role() = 'authenticated' AND public.is_admin())
  WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "courses_delete_policy" ON public.courses
  FOR DELETE USING (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "course_modules_select_policy" ON public.course_modules
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_modules.course_id AND published = true)
    OR (auth.role() = 'authenticated' AND public.is_admin())
  );

CREATE POLICY "course_modules_insert_policy" ON public.course_modules
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "course_modules_update_policy" ON public.course_modules
  FOR UPDATE USING (auth.role() = 'authenticated' AND public.is_admin())
  WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "course_modules_delete_policy" ON public.course_modules
  FOR DELETE USING (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "lessons_select_policy" ON public.lessons
  FOR SELECT USING (
    is_preview = true
    OR (auth.role() = 'authenticated' AND public.is_admin())
    OR (
      auth.uid() IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM public.enrollments 
        WHERE enrollments.user_id = auth.uid() 
          AND enrollments.course_id = lessons.course_id 
          AND enrollments.status = 'approved'
      )
    )
  );

CREATE POLICY "lessons_insert_policy" ON public.lessons
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "lessons_update_policy" ON public.lessons
  FOR UPDATE USING (auth.role() = 'authenticated' AND public.is_admin())
  WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "lessons_delete_policy" ON public.lessons
  FOR DELETE USING (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "lesson_progress_select_policy" ON public.lesson_progress
  FOR SELECT USING (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()));

CREATE POLICY "lesson_progress_insert_policy" ON public.lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lesson_progress_update_policy" ON public.lesson_progress
  FOR UPDATE USING (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()));

CREATE POLICY "enrollments_select_policy" ON public.enrollments
  FOR SELECT USING (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()));

CREATE POLICY "enrollments_insert_policy" ON public.enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "enrollments_update_policy" ON public.enrollments
  FOR UPDATE USING (auth.role() = 'authenticated' AND public.is_admin());

-- 5. Ensure rakshashri8@gmail.com is permanently admin in Supabase profiles
UPDATE public.profiles
SET role = 'admin'
WHERE LOWER(email) = 'rakshashri8@gmail.com';

-- 6. Ensure public.is_admin() recognizes rakshashri8@gmail.com
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
