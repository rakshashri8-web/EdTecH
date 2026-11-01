-- ============================================================
-- MIGRATION: Rectify course titles to canonical 5 programs
-- ============================================================

-- 1. Data Analyst
UPDATE public.courses
SET title = 'Data Analyst'
WHERE slug ILIKE '%analyst%' OR slug ILIKE '%analytics%' OR title ILIKE '%Analyst%' OR title ILIKE '%Analytics%';

-- 2. Data Science
UPDATE public.courses
SET title = 'Data Science'
WHERE (slug ILIKE '%data-science%' OR title ILIKE '%Data Science%')
  AND title NOT ILIKE '%Data Analyst%';

-- 3. AI / ML Engineer
UPDATE public.courses
SET title = 'AI / ML Engineer'
WHERE (slug ILIKE '%ai-ml%' OR slug ILIKE '%ai_ml%' OR (title ILIKE '%AI%' AND title ILIKE '%ML%') OR title ILIKE '%Mastery%')
  AND title NOT ILIKE '%Data Science%';

-- 4. Generative AI Engineer
UPDATE public.courses
SET title = 'Generative AI Engineer'
WHERE slug ILIKE '%gen%' OR title ILIKE '%Generative%';

-- 5. Agentic AI Engineer
UPDATE public.courses
SET title = 'Agentic AI Engineer'
WHERE slug ILIKE '%agent%' OR title ILIKE '%Agentic%';
