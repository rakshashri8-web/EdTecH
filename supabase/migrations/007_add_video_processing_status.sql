-- Step 1: Add ALL missing columns safely
ALTER TABLE public.lesson_videos
  ADD COLUMN IF NOT EXISTS duration TEXT,
  ADD COLUMN IF NOT EXISTS video_processing_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS video_processed_at TIMESTAMPTZ;

-- Step 2: Mark existing valid durations as completed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'lesson_videos' AND column_name = 'duration'
  ) THEN
    UPDATE public.lesson_videos
    SET video_processing_status = 'completed', video_processed_at = NOW()
    WHERE duration IS NOT NULL 
      AND duration != '' 
      AND duration != 'Processing video...'
      AND lesson_id NOT LIKE 'SYSTEM_%';

    UPDATE public.lesson_videos
    SET duration = NULL, video_processing_status = 'pending'
    WHERE duration = 'Processing video...' 
      AND lesson_id NOT LIKE 'SYSTEM_%';
  END IF;
END $$;
