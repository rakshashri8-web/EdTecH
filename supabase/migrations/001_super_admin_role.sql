-- ============================================================
-- MIGRATION: 001_super_admin_role.sql
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================
-- INSTRUCTIONS:
-- 1. Go to https://supabase.com/dashboard → Your Project → SQL Editor
-- 2. Paste this entire file and click "Run"
-- 3. Verify success by checking Table Editor → profiles → role column
-- ============================================================

-- Step 1: Update profiles role CHECK constraint to include 'super_admin'
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('student', 'admin', 'super_admin'));

-- Step 2: Update is_admin() function to return true for both admin AND super_admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
$$;

-- Step 3: Add new is_super_admin() function
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
  );
$$;

-- Step 4: Update RLS policies to allow super_admin same access as admin
-- (is_admin() already covers super_admin after Step 2, so existing policies are fine)
-- Re-create any admin-specific policies if they used literal 'admin' check:

-- Profiles: allow admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Profiles: allow admins to update any profile
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (is_admin());

-- Enrollments: allow admins to view all enrollments
DROP POLICY IF EXISTS "Admins can view all enrollments" ON enrollments;
CREATE POLICY "Admins can view all enrollments"
  ON enrollments FOR SELECT
  USING (is_admin());

-- Enrollments: allow admins to update enrollments
DROP POLICY IF EXISTS "Admins can update enrollments" ON enrollments;
CREATE POLICY "Admins can update enrollments"
  ON enrollments FOR UPDATE
  USING (is_admin());

-- Courses: allow admins full access
DROP POLICY IF EXISTS "Admins can manage courses" ON courses;
CREATE POLICY "Admins can manage courses"
  ON courses FOR ALL
  USING (is_admin());

-- Modules: allow admins full access
DROP POLICY IF EXISTS "Admins can manage modules" ON course_modules;
CREATE POLICY "Admins can manage modules"
  ON course_modules FOR ALL
  USING (is_admin());

-- Lessons: allow admins full access
DROP POLICY IF EXISTS "Admins can manage lessons" ON lessons;
CREATE POLICY "Admins can manage lessons"
  ON lessons FOR ALL
  USING (is_admin());

-- Step 5: Add new columns to enrollments table (safe with IF NOT EXISTS check)
ALTER TABLE enrollments
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Step 6: Add published column to lessons table
ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;

-- ============================================================
-- VERIFICATION QUERIES (run these after migration to confirm)
-- ============================================================
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'enrollments';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'lessons';
-- SELECT routine_name FROM information_schema.routines WHERE routine_name IN ('is_admin', 'is_super_admin');
-- ============================================================
