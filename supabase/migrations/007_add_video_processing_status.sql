-- Step 1: Add ALL missing columns (safe even if some already exist)
ALTER TABLE public.lesson_videos
  ADD COLUMN IF NOT EXISTS duration TEXT,
  ADD COLUMN IF NOT EXISTS video_processing_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS video_processed_at TIMESTAMPTZ;

-- Step 2: Mark existing rows with real durations as completed
UPDATE public.lesson_videos
SET video_processing_status = 'completed', video_processed_at = NOW()
WHERE duration IS NOT NULL AND duration != '' AND duration != 'Processing video...'
  AND lesson_id NOT LIKE 'SYSTEM_%';

-- Step 3: Clear any stuck "Processing video..." rows
UPDATE public.lesson_videos
SET duration = NULL, video_processing_status = 'pending'
WHERE duration = 'Processing video...' AND lesson_id NOT LIKE 'SYSTEM_%';
