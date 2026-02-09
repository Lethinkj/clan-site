-- Simple Schema Fix - Just add missing columns
-- Copy and paste this ENTIRE script into Supabase SQL Editor

-- Add created_at to quiz_attempts
ALTER TABLE quiz_attempts
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Add started_at to quiz_attempts
ALTER TABLE quiz_attempts
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;

-- Add submitted_at to quiz_attempts
ALTER TABLE quiz_attempts
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ;

-- Add is_submitted to quiz_attempts
ALTER TABLE quiz_attempts
ADD COLUMN IF NOT EXISTS is_submitted BOOLEAN DEFAULT FALSE;

-- Add total_score to quiz_attempts
ALTER TABLE quiz_attempts
ADD COLUMN IF NOT EXISTS total_score INTEGER DEFAULT 0;

-- Add created_at to quiz_leaderboard
ALTER TABLE quiz_leaderboard
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Add updated_at to quiz_leaderboard
ALTER TABLE quiz_leaderboard
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add avg_response_time to quiz_leaderboard
ALTER TABLE quiz_leaderboard
ADD COLUMN IF NOT EXISTS avg_response_time DECIMAL(10,2) DEFAULT 0;

-- Add time_limit_seconds to quiz_questions
ALTER TABLE quiz_questions
ADD COLUMN IF NOT EXISTS time_limit_seconds INTEGER DEFAULT 30;

-- Add response_time_seconds to quiz_answers
ALTER TABLE quiz_answers
ADD COLUMN IF NOT EXISTS response_time_seconds DECIMAL(10,2);

-- Verify columns were added
SELECT 'SUCCESS: All columns added!' as status;

-- Show quiz_attempts columns
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'quiz_attempts'
ORDER BY ordinal_position;
