-- Add avatar_url column to users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Note: run this migration against your DB (psql or supabase sql runner).