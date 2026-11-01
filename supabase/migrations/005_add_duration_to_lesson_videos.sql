-- Migration 005: Add duration column to lesson_videos table
ALTER TABLE public.lesson_videos ADD COLUMN IF NOT EXISTS duration TEXT;
