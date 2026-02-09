-- Fix Missing Columns in Quiz Tables
-- Run this in Supabase SQL Editor to fix schema issues

-- ============================================
-- STEP 1: Check current schema
-- ============================================

-- Check quiz_attempts columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'quiz_attempts'
ORDER BY ordinal_position;

-- Check quiz_leaderboard columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'quiz_leaderboard'
ORDER BY ordinal_position;

-- Check quiz_questions columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'quiz_questions'
ORDER BY ordinal_position;

-- ============================================
-- STEP 2: Add missing columns to quiz_attempts
-- ============================================

-- Add created_at if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE quiz_attempts ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE 'Added created_at column to quiz_attempts';
  END IF;
END $$;

-- Add started_at if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'started_at'
  ) THEN
    ALTER TABLE quiz_attempts ADD COLUMN started_at TIMESTAMPTZ;
    RAISE NOTICE 'Added started_at column to quiz_attempts';
  END IF;
END $$;

-- Add submitted_at if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'submitted_at'
  ) THEN
    ALTER TABLE quiz_attempts ADD COLUMN submitted_at TIMESTAMPTZ;
    RAISE NOTICE 'Added submitted_at column to quiz_attempts';
  END IF;
END $$;

-- Add is_submitted if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'is_submitted'
  ) THEN
    ALTER TABLE quiz_attempts ADD COLUMN is_submitted BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Added is_submitted column to quiz_attempts';
  END IF;
END $$;

-- Add total_score if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_attempts' AND column_name = 'total_score'
  ) THEN
    ALTER TABLE quiz_attempts ADD COLUMN total_score INTEGER DEFAULT 0;
    RAISE NOTICE 'Added total_score column to quiz_attempts';
  END IF;
END $$;

-- ============================================
-- STEP 3: Add missing columns to quiz_leaderboard
-- ============================================

-- Add created_at if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_leaderboard' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE quiz_leaderboard ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE 'Added created_at column to quiz_leaderboard';
  END IF;
END $$;

-- Add updated_at if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_leaderboard' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE quiz_leaderboard ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE 'Added updated_at column to quiz_leaderboard';
  END IF;
END $$;

-- Add avg_response_time if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_leaderboard' AND column_name = 'avg_response_time'
  ) THEN
    ALTER TABLE quiz_leaderboard ADD COLUMN avg_response_time DECIMAL(10,2) DEFAULT 0;
    RAISE NOTICE 'Added avg_response_time column to quiz_leaderboard';
  END IF;
END $$;

-- ============================================
-- STEP 4: Add missing columns to quiz_questions
-- ============================================

-- Add time_limit_seconds if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_questions' AND column_name = 'time_limit_seconds'
  ) THEN
    ALTER TABLE quiz_questions ADD COLUMN time_limit_seconds INTEGER DEFAULT 30;
    RAISE NOTICE 'Added time_limit_seconds column to quiz_questions';
  END IF;
END $$;

-- ============================================
-- STEP 5: Add missing columns to quiz_answers
-- ============================================

-- Add response_time_seconds if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quiz_answers' AND column_name = 'response_time_seconds'
  ) THEN
    ALTER TABLE quiz_answers ADD COLUMN response_time_seconds DECIMAL(10,2);
    RAISE NOTICE 'Added response_time_seconds column to quiz_answers';
  END IF;
END $$;

-- ============================================
-- STEP 6: Verify all columns were added
-- ============================================

-- Check quiz_attempts again
SELECT 'quiz_attempts' as table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'quiz_attempts'
ORDER BY ordinal_position;

-- Check quiz_leaderboard again
SELECT 'quiz_leaderboard' as table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'quiz_leaderboard'
ORDER BY ordinal_position;

-- Check quiz_questions again
SELECT 'quiz_questions' as table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'quiz_questions'
ORDER BY ordinal_position;

-- Check quiz_answers again
SELECT 'quiz_answers' as table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'quiz_answers'
ORDER BY ordinal_position;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Schema fix complete! All missing columns should now be added.';
  RAISE NOTICE '📋 Review the column lists above to verify.';
END $$;
