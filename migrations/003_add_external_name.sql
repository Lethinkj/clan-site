-- Add external_name column to users and populate from username
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS external_name TEXT;

-- Populate existing rows from username when available
UPDATE users
SET external_name = username
WHERE external_name IS NULL AND username IS NOT NULL;

-- Index for faster lookups by external_name
CREATE INDEX IF NOT EXISTS idx_users_external_name ON users(external_name);

-- Note: run this migration against your DB (psql or Supabase SQL editor).
