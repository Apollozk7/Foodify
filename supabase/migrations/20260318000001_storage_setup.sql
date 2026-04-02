-- Storage setup for Apetit
-- Migration: 20260318000001_storage_setup.sql

-- 1. Create the 'generations' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('generations', 'generations', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up RLS for the 'generations' bucket
-- Allow public access to read files (since it's a public bucket)
CREATE POLICY "Public Access" 
    ON storage.objects 
    FOR SELECT 
    USING (bucket_id = 'generations');

-- Allow anyone (authenticated or anon) to upload files to the 'inputs/' folder
-- This is necessary because we are using Clerk for auth but Supabase for storage
-- and haven't fully synced the two with custom JWTs yet.
CREATE POLICY "Anyone can upload inputs" 
    ON storage.objects 
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'generations' AND 
        (storage.foldername(name))[1] = 'inputs'
    );

-- Allow users to delete their own uploaded files (optional, but good practice)
-- Note: This requires a way to identify the owner, usually via metadata or folder structure.
-- For this prototype, we'll keep it simple.
