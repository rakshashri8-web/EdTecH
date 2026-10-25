-- Update course thumbnails in Supabase to point to the local 493x266 artwork
-- Replaces old Unsplash placeholders with instant-loading local images

UPDATE public.courses
SET thumbnail = '/images/courses/data_analyst_493x266(2).png'
WHERE slug ILIKE '%analyst%' OR slug ILIKE '%analytics%' OR title ILIKE '%Analyst%' OR title ILIKE '%Analytics%';

UPDATE public.courses
SET thumbnail = '/images/courses/data_science_493x266(2).png'
WHERE slug ILIKE '%data-science%' OR title ILIKE '%Data Science%';

UPDATE public.courses
SET thumbnail = '/images/courses/ai_ml_493x266(2).png'
WHERE (slug ILIKE '%ai-ml%' OR slug ILIKE '%ai_ml%' OR (title ILIKE '%AI%' AND title ILIKE '%ML%') OR title ILIKE '%Mastery%')
  AND title NOT ILIKE '%Data Science%';

UPDATE public.courses
SET thumbnail = '/images/courses/gen_ai_493x266(2).png'
WHERE slug ILIKE '%gen%' OR title ILIKE '%Generative%';

UPDATE public.courses
SET thumbnail = '/images/courses/agentic_ai_493x266(2).png'
WHERE slug ILIKE '%agent%' OR title ILIKE '%Agentic%';
