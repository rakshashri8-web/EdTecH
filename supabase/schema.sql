-- ============================================================
-- COMPLETE SECURE ROW LEVEL SECURITY (RLS) MIGRATION
-- FOR EDTECH LMS DATABASE & SUPABASE STORAGE
-- ============================================================

-- ------------------------------------------------------------
-- 0. ADMIN & SERVICE SECURITY HELPER FUNCTIONS
-- ------------------------------------------------------------
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
      AND role = 'admin'
  );
$$;

-- Restrict execution of is_admin() to authenticated users (NO anon access)
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;


CREATE OR REPLACE FUNCTION public.is_admin_or_service()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT 
    current_setting('role', true) = 'service_role' 
    OR auth.role() = 'service_role'
    OR (
      auth.role() = 'authenticated' 
      AND EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
      )
    );
$$;

-- Restrict execution of is_admin_or_service() to authenticated users & service_role (NO anon access)
REVOKE EXECUTE ON FUNCTION public.is_admin_or_service() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin_or_service() TO authenticated, service_role;


-- ------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anti-Role Escalation Trigger
CREATE OR REPLACE FUNCTION public.prevent_profile_role_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT public.is_admin_or_service() THEN
      RAISE EXCEPTION 'Security Violation: Only administrators can modify user roles.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_profile_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_profile_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_role_escalation();

-- Trigger to automatically create profile entry upon auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Student'),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    'student'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiles Policies
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON public.profiles;

-- Students can SELECT only their own profile; Admins view all
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR (auth.role() = 'authenticated' AND public.is_admin()));

-- Users can INSERT their own profile
CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR (auth.role() = 'authenticated' AND public.is_admin()));

-- Students can UPDATE only their own profile
CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR (auth.role() = 'authenticated' AND public.is_admin()))
  WITH CHECK ((auth.uid() = id AND role = 'student') OR (auth.role() = 'authenticated' AND public.is_admin()));

-- Only admins can DELETE profiles
CREATE POLICY "profiles_delete_policy" ON public.profiles
  FOR DELETE USING (auth.role() = 'authenticated' AND public.is_admin());


-- ------------------------------------------------------------
-- 2. COURSES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC NOT NULL DEFAULT 0,
  thumbnail TEXT NOT NULL,
  instructor_name TEXT NOT NULL DEFAULT 'Shaik Anwar',
  instructor_role TEXT NOT NULL DEFAULT 'Senior Data Scientist',
  difficulty TEXT NOT NULL DEFAULT 'Beginner',
  duration TEXT NOT NULL DEFAULT '40 Hours',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to published courses" ON public.courses;
DROP POLICY IF EXISTS "Allow admin full access to courses" ON public.courses;
DROP POLICY IF EXISTS "courses_select_policy" ON public.courses;
DROP POLICY IF EXISTS "courses_insert_policy" ON public.courses;
DROP POLICY IF EXISTS "courses_update_policy" ON public.courses;
DROP POLICY IF EXISTS "courses_delete_policy" ON public.courses;

-- Public read access to published courses; Admins view all (anon safe)
CREATE POLICY "courses_select_policy" ON public.courses
  FOR SELECT USING (published = true OR (auth.role() = 'authenticated' AND public.is_admin()));

-- Only Admins can modify courses
CREATE POLICY "courses_insert_policy" ON public.courses
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "courses_update_policy" ON public.courses
  FOR UPDATE USING (auth.role() = 'authenticated' AND public.is_admin()) WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "courses_delete_policy" ON public.courses
  FOR DELETE USING (auth.role() = 'authenticated' AND public.is_admin());


-- ------------------------------------------------------------
-- 3. COURSE MODULES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  "order" INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to modules" ON public.course_modules;
DROP POLICY IF EXISTS "Allow admin full access to modules" ON public.course_modules;
DROP POLICY IF EXISTS "course_modules_select_policy" ON public.course_modules;
DROP POLICY IF EXISTS "course_modules_insert_policy" ON public.course_modules;
DROP POLICY IF EXISTS "course_modules_update_policy" ON public.course_modules;
DROP POLICY IF EXISTS "course_modules_delete_policy" ON public.course_modules;

-- Public view for published course modules; Admins view all (anon safe)
CREATE POLICY "course_modules_select_policy" ON public.course_modules
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.courses WHERE id = course_modules.course_id AND published = true)
    OR (auth.role() = 'authenticated' AND public.is_admin())
  );

-- Only Admins can modify modules
CREATE POLICY "course_modules_insert_policy" ON public.course_modules
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "course_modules_update_policy" ON public.course_modules
  FOR UPDATE USING (auth.role() = 'authenticated' AND public.is_admin()) WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "course_modules_delete_policy" ON public.course_modules
  FOR DELETE USING (auth.role() = 'authenticated' AND public.is_admin());


-- ------------------------------------------------------------
-- 4. LESSONS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration TEXT NOT NULL DEFAULT '15 mins',
  "order" INT NOT NULL DEFAULT 1,
  is_preview BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to preview lessons or enrolled lessons" ON public.lessons;
DROP POLICY IF EXISTS "Allow admin full access to lessons" ON public.lessons;
DROP POLICY IF EXISTS "lessons_select_policy" ON public.lessons;
DROP POLICY IF EXISTS "lessons_insert_policy" ON public.lessons;
DROP POLICY IF EXISTS "lessons_update_policy" ON public.lessons;
DROP POLICY IF EXISTS "lessons_delete_policy" ON public.lessons;

-- Access lessons ONLY if preview, enrolled & approved, or admin (anon safe)
CREATE POLICY "lessons_select_policy" ON public.lessons
  FOR SELECT USING (
    is_preview = true
    OR (auth.role() = 'authenticated' AND public.is_admin())
    OR (
      auth.uid() IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.enrollments 
        WHERE user_id = auth.uid() 
          AND course_id = lessons.course_id 
          AND status = 'approved'
      )
    )
  );

-- Only Admins can modify lessons
CREATE POLICY "lessons_insert_policy" ON public.lessons
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "lessons_update_policy" ON public.lessons
  FOR UPDATE USING (auth.role() = 'authenticated' AND public.is_admin()) WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "lessons_delete_policy" ON public.lessons
  FOR DELETE USING (auth.role() = 'authenticated' AND public.is_admin());


-- ------------------------------------------------------------
-- 5. ENROLLMENTS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  utr TEXT NOT NULL,
  screenshot_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Anti-Status Tampering Trigger for Enrollments
CREATE OR REPLACE FUNCTION public.prevent_enrollment_status_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NOT public.is_admin_or_service() THEN
      RAISE EXCEPTION 'Security Violation: Only authorized administrators or service roles can approve or reject enrollments.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_enrollment_status_tampering ON public.enrollments;
CREATE TRIGGER trg_prevent_enrollment_status_tampering
  BEFORE UPDATE ON public.enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_enrollment_status_tampering();

DROP POLICY IF EXISTS "Students can view their own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Students can insert their own enrollment" ON public.enrollments;
DROP POLICY IF EXISTS "Only Admin can update enrollment status" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_select_policy" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_insert_policy" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_update_policy" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_delete_policy" ON public.enrollments;

-- Students can SELECT only their own enrollments; Admins view all
CREATE POLICY "enrollments_select_policy" ON public.enrollments
  FOR SELECT USING (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()));

-- Students can INSERT their own enrollment with pending status
CREATE POLICY "enrollments_insert_policy" ON public.enrollments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id 
    AND (status = 'pending' OR status IS NULL OR (auth.role() = 'authenticated' AND public.is_admin()))
  );

-- Only Admins can UPDATE or DELETE enrollments
CREATE POLICY "enrollments_update_policy" ON public.enrollments
  FOR UPDATE USING (auth.role() = 'authenticated' AND public.is_admin()) WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "enrollments_delete_policy" ON public.enrollments
  FOR DELETE USING (auth.role() = 'authenticated' AND public.is_admin());


-- ------------------------------------------------------------
-- 6. PAYMENTS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  provider TEXT NOT NULL DEFAULT 'upi',
  transaction_id TEXT,
  utr TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Anti-Fake Payment Trigger: Safely checks INSERT vs UPDATE for student vs service_role / admin
CREATE OR REPLACE FUNCTION public.prevent_payment_status_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Trusted service_role and Admin operations bypass tampering checks
  IF public.is_admin_or_service() THEN
    RETURN NEW;
  END IF;

  IF (TG_OP = 'INSERT') THEN
    -- On INSERT: Students can create only their own initial pending payment record
    IF NEW.user_id IS DISTINCT FROM auth.uid() THEN
      RAISE EXCEPTION 'Security Violation: Users can only create payment records for themselves.';
    END IF;
    IF NEW.status IS DISTINCT FROM 'pending' THEN
      RAISE EXCEPTION 'Security Violation: Initial payment status must be pending.';
    END IF;
  ELSIF (TG_OP = 'UPDATE') THEN
    -- On UPDATE: Students cannot modify payment verification or status fields
    IF (NEW.status IS DISTINCT FROM OLD.status OR 
        NEW.amount IS DISTINCT FROM OLD.amount OR 
        NEW.transaction_id IS DISTINCT FROM OLD.transaction_id OR 
        NEW.provider IS DISTINCT FROM OLD.provider OR 
        NEW.currency IS DISTINCT FROM OLD.currency OR 
        NEW.utr IS DISTINCT FROM OLD.utr OR 
        NEW.user_id IS DISTINCT FROM OLD.user_id OR 
        NEW.course_id IS DISTINCT FROM OLD.course_id OR 
        NEW.enrollment_id IS DISTINCT FROM OLD.enrollment_id) THEN
      RAISE EXCEPTION 'Security Violation: Students cannot modify payment verification or status fields.';
    END IF;
    IF NEW.status = 'completed' THEN
      RAISE EXCEPTION 'Security Violation: Payment completion must be verified server-side or by an administrator.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_payment_status_tampering ON public.payments;
CREATE TRIGGER trg_prevent_payment_status_tampering
  BEFORE INSERT OR UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_payment_status_tampering();

DROP POLICY IF EXISTS "payments_select_policy" ON public.payments;
DROP POLICY IF EXISTS "payments_insert_policy" ON public.payments;
DROP POLICY IF EXISTS "payments_update_policy" ON public.payments;
DROP POLICY IF EXISTS "payments_delete_policy" ON public.payments;

-- Students view only their own payment records; Admins view all
CREATE POLICY "payments_select_policy" ON public.payments
  FOR SELECT USING (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()));

-- Students can insert initial pending payment records
CREATE POLICY "payments_insert_policy" ON public.payments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id 
    AND (status = 'pending' OR (auth.role() = 'authenticated' AND public.is_admin()))
  );

-- Only trusted Admins / Server-side processes can update payment status
CREATE POLICY "payments_update_policy" ON public.payments
  FOR UPDATE USING (auth.role() = 'authenticated' AND public.is_admin()) WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "payments_delete_policy" ON public.payments
  FOR DELETE USING (auth.role() = 'authenticated' AND public.is_admin());


-- ------------------------------------------------------------
-- 7. LESSON PROGRESS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT true,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view and update own lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "Admin can view all lesson progress" ON public.lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_select_policy" ON public.lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_insert_policy" ON public.lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_update_policy" ON public.lesson_progress;
DROP POLICY IF EXISTS "lesson_progress_delete_policy" ON public.lesson_progress;

-- Students manage strictly their own progress; Admins view all
CREATE POLICY "lesson_progress_select_policy" ON public.lesson_progress
  FOR SELECT USING (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()));

CREATE POLICY "lesson_progress_insert_policy" ON public.lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "lesson_progress_update_policy" ON public.lesson_progress
  FOR UPDATE USING (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()))
  WITH CHECK (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()));

CREATE POLICY "lesson_progress_delete_policy" ON public.lesson_progress
  FOR DELETE USING (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()));


-- ------------------------------------------------------------
-- 8. PROJECT SUBMISSIONS & ASSESSMENTS TABLES
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id INT NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  github_url TEXT NOT NULL,
  demo_url TEXT,
  explanation TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can insert and view own project submissions" ON public.project_submissions;
DROP POLICY IF EXISTS "project_submissions_select_policy" ON public.project_submissions;
DROP POLICY IF EXISTS "project_submissions_insert_policy" ON public.project_submissions;
DROP POLICY IF EXISTS "project_submissions_update_policy" ON public.project_submissions;
DROP POLICY IF EXISTS "project_submissions_delete_policy" ON public.project_submissions;

CREATE POLICY "project_submissions_select_policy" ON public.project_submissions
  FOR SELECT USING (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()));

CREATE POLICY "project_submissions_insert_policy" ON public.project_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()));

CREATE POLICY "project_submissions_update_policy" ON public.project_submissions
  FOR UPDATE USING (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()))
  WITH CHECK (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()));

CREATE POLICY "project_submissions_delete_policy" ON public.project_submissions
  FOR DELETE USING (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()));


CREATE TABLE IF NOT EXISTS public.project_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id INT NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  score INT NOT NULL,
  score_breakdown JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('passed', 'review_recommended')),
  answers JSONB NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

ALTER TABLE public.project_assessments ENABLE ROW LEVEL SECURITY;

-- Anti-Assessment Result Tampering Trigger
CREATE OR REPLACE FUNCTION public.prevent_project_assessment_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.is_admin_or_service() THEN
    RAISE EXCEPTION 'Security Violation: Students cannot alter completed assessment scores or answers.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_project_assessment_tampering ON public.project_assessments;
CREATE TRIGGER trg_prevent_project_assessment_tampering
  BEFORE UPDATE ON public.project_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_project_assessment_tampering();

DROP POLICY IF EXISTS "Students can insert and view own project assessments" ON public.project_assessments;
DROP POLICY IF EXISTS "project_assessments_select_policy" ON public.project_assessments;
DROP POLICY IF EXISTS "project_assessments_insert_policy" ON public.project_assessments;
DROP POLICY IF EXISTS "project_assessments_update_policy" ON public.project_assessments;
DROP POLICY IF EXISTS "project_assessments_delete_policy" ON public.project_assessments;

-- Students view ONLY their own assessment results; Admins view all
CREATE POLICY "project_assessments_select_policy" ON public.project_assessments
  FOR SELECT USING (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()));

-- Only trusted server-side service-role or Admin can insert assessment scores
CREATE POLICY "project_assessments_insert_policy" ON public.project_assessments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

-- Only Admins can modify or delete assessment results
CREATE POLICY "project_assessments_update_policy" ON public.project_assessments
  FOR UPDATE USING (auth.role() = 'authenticated' AND public.is_admin()) WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "project_assessments_delete_policy" ON public.project_assessments
  FOR DELETE USING (auth.role() = 'authenticated' AND public.is_admin());


-- ------------------------------------------------------------
-- 9. CERTIFICATES TABLE SECURITY
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Anti-Certificate Issuance Tampering Trigger
CREATE OR REPLACE FUNCTION public.prevent_certificate_issuance_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NOT public.is_admin_or_service() THEN
    RAISE EXCEPTION 'Security Violation: Only trusted server-side logic or administrators can issue or modify certificates.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_certificate_issuance_tampering ON public.certificates;
CREATE TRIGGER trg_prevent_certificate_issuance_tampering
  BEFORE INSERT OR UPDATE ON public.certificates
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_certificate_issuance_tampering();

DROP POLICY IF EXISTS "Public read access for verified certificates" ON public.certificates;
DROP POLICY IF EXISTS "Students or system can create certificate" ON public.certificates;
DROP POLICY IF EXISTS "certificates_select_policy" ON public.certificates;
DROP POLICY IF EXISTS "certificates_insert_policy" ON public.certificates;
DROP POLICY IF EXISTS "certificates_update_policy" ON public.certificates;
DROP POLICY IF EXISTS "certificates_delete_policy" ON public.certificates;

-- Students view ONLY their own certificates; Admins view all
CREATE POLICY "certificates_select_policy" ON public.certificates
  FOR SELECT USING (auth.uid() = user_id OR (auth.role() = 'authenticated' AND public.is_admin()));

-- Only trusted server-side service-role or Admin can issue certificates (NO student INSERT)
CREATE POLICY "certificates_insert_policy" ON public.certificates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

-- Only Admins can modify or revoke certificates
CREATE POLICY "certificates_update_policy" ON public.certificates
  FOR UPDATE USING (auth.role() = 'authenticated' AND public.is_admin()) WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "certificates_delete_policy" ON public.certificates
  FOR DELETE USING (auth.role() = 'authenticated' AND public.is_admin());

-- Secure Public Certificate Verification Function
-- Exposes ONLY minimum verification info without public table access
CREATE OR REPLACE FUNCTION public.verify_certificate(p_certificate_number TEXT)
RETURNS TABLE (
  certificate_number TEXT,
  issued_at TIMESTAMPTZ,
  course_title TEXT,
  student_name TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_temp
STABLE
AS $$
  SELECT 
    c.certificate_number,
    c.issued_at,
    co.title AS course_title,
    p.full_name AS student_name
  FROM public.certificates c
  JOIN public.courses co ON co.id = c.course_id
  JOIN public.profiles p ON p.id = c.user_id
  WHERE c.certificate_number = p_certificate_number;
$$;

REVOKE EXECUTE ON FUNCTION public.verify_certificate(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_certificate(TEXT) TO authenticated, anon;


-- ------------------------------------------------------------
-- 10. CONTACT MESSAGES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert a contact message" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins can view or update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_select_policy" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_insert_policy" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_update_policy" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_delete_policy" ON public.contact_messages;

-- Admins can view contact messages (prevents public leakage)
CREATE POLICY "contact_messages_select_policy" ON public.contact_messages
  FOR SELECT USING (auth.role() = 'authenticated' AND public.is_admin());

-- Anyone (public or student) can send a contact message
CREATE POLICY "contact_messages_insert_policy" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Only Admins can update status or delete
CREATE POLICY "contact_messages_update_policy" ON public.contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated' AND public.is_admin()) WITH CHECK (auth.role() = 'authenticated' AND public.is_admin());

CREATE POLICY "contact_messages_delete_policy" ON public.contact_messages
  FOR DELETE USING (auth.role() = 'authenticated' AND public.is_admin());


-- ------------------------------------------------------------
-- 11. SUPABASE STORAGE BUCKET & RLS (PAYMENT SCREENSHOTS)
-- ------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-screenshots',
  'payment-screenshots',
  false, -- Private Bucket
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880;

-- Drop insecure legacy storage policies
DROP POLICY IF EXISTS "Authenticated users can upload payment screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own payment screenshots or Admins view all" ON storage.objects;
DROP POLICY IF EXISTS "payment_screenshots_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "payment_screenshots_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "payment_screenshots_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "payment_screenshots_delete_policy" ON storage.objects;

-- Students upload only to their own files/folders; Admins upload anywhere
CREATE POLICY "payment_screenshots_insert_policy" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'payment-screenshots' 
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR name LIKE auth.uid()::text || '_%'
      OR (auth.role() = 'authenticated' AND public.is_admin())
    )
  );

-- Students access strictly their own payment screenshots; Admins access all
CREATE POLICY "payment_screenshots_select_policy" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'payment-screenshots' 
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR name LIKE auth.uid()::text || '_%'
      OR (auth.role() = 'authenticated' AND public.is_admin())
    )
  );

CREATE POLICY "payment_screenshots_update_policy" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'payment-screenshots' 
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR name LIKE auth.uid()::text || '_%'
      OR (auth.role() = 'authenticated' AND public.is_admin())
    )
  );

CREATE POLICY "payment_screenshots_delete_policy" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'payment-screenshots' 
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR name LIKE auth.uid()::text || '_%'
      OR (auth.role() = 'authenticated' AND public.is_admin())
    )
  );
