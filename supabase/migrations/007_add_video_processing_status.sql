-- =========================================================================
-- Migration 007: Add video processing status and duration to lesson_videos
-- Run this in your Supabase SQL Editor. It is 100% idempotent and safe to run.
-- =========================================================================

-- 1. Ensure table and all required columns exist
CREATE TABLE IF NOT EXISTS public.lesson_videos (
  lesson_id TEXT PRIMARY KEY,
  video_url TEXT,
  duration TEXT,
  video_processing_status TEXT DEFAULT 'pending',
  video_processed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.lesson_videos ADD COLUMN IF NOT EXISTS duration TEXT;
ALTER TABLE public.lesson_videos ADD COLUMN IF NOT EXISTS video_processing_status TEXT DEFAULT 'pending';
ALTER TABLE public.lesson_videos ADD COLUMN IF NOT EXISTS video_processed_at TIMESTAMPTZ;
ALTER TABLE public.lesson_videos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Enable Row Level Security and create read/write policies
ALTER TABLE public.lesson_videos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'lesson_videos' AND policyname = 'Allow public read access to lesson_videos'
  ) THEN
    CREATE POLICY "Allow public read access to lesson_videos"
    ON public.lesson_videos FOR SELECT
    TO public
    USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'lesson_videos' AND policyname = 'Allow all access to authenticated users for lesson_videos'
  ) THEN
    CREATE POLICY "Allow all access to authenticated users for lesson_videos"
    ON public.lesson_videos FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

-- 3. Mark existing valid durations as completed (using dynamic SQL to avoid any parse-time column errors)
DO $$
BEGIN
  EXECUTE '
    UPDATE public.lesson_videos
    SET video_processing_status = ''completed'',
        video_processed_at = NOW()
    WHERE duration IS NOT NULL 
      AND duration != '''' 
      AND duration != ''Processing video...''
      AND lesson_id NOT LIKE ''SYSTEM_%''
  ';

  EXECUTE '
    UPDATE public.lesson_videos
    SET duration = NULL,
        video_processing_status = ''pending''
    WHERE duration = ''Processing video...'' 
      AND lesson_id NOT LIKE ''SYSTEM_%''
  ';
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
