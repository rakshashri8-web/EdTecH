-- ============================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION FOR PAYMENT SCREENSHOTS
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-screenshots',
  'payment-screenshots',
  false,
  5242880, -- 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880;

-- Storage RLS Policies
CREATE POLICY "Authenticated users can upload payment screenshots"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'payment-screenshots' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view their own payment screenshots or Admins view all"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'payment-screenshots' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1] 
      OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );
