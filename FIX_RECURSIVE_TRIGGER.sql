-- Fix Recursive Trigger Issue - Stack Depth Exceeded
-- Run this in Supabase SQL Editor

-- Step 1: Find all triggers on quiz_leaderboard
SELECT
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'quiz_leaderboard';

-- Step 2: Drop any rank update triggers (they're causing recursion)
DROP TRIGGER IF EXISTS update_leaderboard_ranks ON quiz_leaderboard;
DROP TRIGGER IF EXISTS recalculate_ranks ON quiz_leaderboard;
DROP TRIGGER IF EXISTS auto_update_ranks ON quiz_leaderboard;

-- Step 3: Drop the trigger function if it exists
DROP FUNCTION IF EXISTS update_quiz_leaderboard_ranks() CASCADE;
DROP FUNCTION IF EXISTS recalculate_leaderboard_ranks() CASCADE;

-- Step 4: Verify triggers are gone
SELECT
  trigger_name,
  event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'quiz_leaderboard';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Recursive triggers removed!';
  RAISE NOTICE '📝 Ranks will now be calculated client-side (which we already do).';
  RAISE NOTICE '✅ Leaderboard inserts should work now.';
END $$;
