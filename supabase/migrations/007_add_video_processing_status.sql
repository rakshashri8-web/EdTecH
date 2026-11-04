-- Migration 007: Add video_processing_status and video_processed_at to lesson_videos
-- This prevents "Processing video..." from being saved as duration permanently.
-- Status values: 'pending' | 'processing' | 'completed' | 'unavailable'

ALTER TABLE public.lesson_videos
  ADD COLUMN IF NOT EXISTS video_processing_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS video_processed_at TIMESTAMPTZ;

-- For any existing rows that have a real duration saved, mark them as completed
UPDATE public.lesson_videos
SET
  video_processing_status = 'completed',
  video_processed_at = NOW()
WHERE
  duration IS NOT NULL
  AND duration != ''
  AND duration != 'Processing video...'
  AND lesson_id NOT LIKE 'SYSTEM_%';

-- For rows stuck with "Processing video..." as duration, clear it and mark as pending
UPDATE public.lesson_videos
SET
  duration = NULL,
  video_processing_status = 'pending'
WHERE
  duration = 'Processing video...'
  AND lesson_id NOT LIKE 'SYSTEM_%';
