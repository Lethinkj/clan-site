-- Test Script - Run AFTER FIX_SCHEMA.sql
-- This verifies that the leaderboard will work correctly

-- ============================================
-- TEST 1: Verify Schema
-- ============================================

-- Check that all critical columns exist
SELECT
  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_attempts' AND column_name = 'created_at')
    THEN '✅ quiz_attempts.created_at EXISTS'
    ELSE '❌ quiz_attempts.created_at MISSING'
  END as check_1;

SELECT
  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_leaderboard' AND column_name = 'avg_response_time')
    THEN '✅ quiz_leaderboard.avg_response_time EXISTS'
    ELSE '❌ quiz_leaderboard.avg_response_time MISSING'
  END as check_2;

SELECT
  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_answers' AND column_name = 'response_time_seconds')
    THEN '✅ quiz_answers.response_time_seconds EXISTS'
    ELSE '❌ quiz_answers.response_time_seconds MISSING'
  END as check_3;

-- ============================================
-- TEST 2: Check Current Data
-- ============================================

-- Count quiz users
SELECT
  COUNT(*) as total_users,
  COUNT(CASE WHEN name IS NOT NULL THEN 1 END) as users_with_names
FROM quiz_users;

-- Count quiz attempts
SELECT
  COUNT(*) as total_attempts,
  COUNT(CASE WHEN is_submitted = true THEN 1 END) as submitted_attempts,
  COUNT(CASE WHEN total_score > 0 THEN 1 END) as attempts_with_score
FROM quiz_attempts;

-- Count quiz answers
SELECT
  COUNT(*) as total_answers,
  COUNT(CASE WHEN is_correct = true THEN 1 END) as correct_answers,
  AVG(response_time_seconds) as avg_response_time
FROM quiz_answers;

-- Count leaderboard entries
SELECT COUNT(*) as leaderboard_entries
FROM quiz_leaderboard;

-- ============================================
-- TEST 3: Check Recent Activity
-- ============================================

-- Show recent attempts with details
SELECT
  qa.id,
  qa.quiz_id,
  qa.user_id,
  qu.name as user_name,
  qa.total_score,
  qa.started_at,
  qa.created_at,
  (SELECT COUNT(*) FROM quiz_answers WHERE attempt_id = qa.id) as answers_count
FROM quiz_attempts qa
LEFT JOIN quiz_users qu ON qa.user_id = qu.id
ORDER BY qa.created_at DESC
LIMIT 5;

-- Show recent answers
SELECT
  qa.id,
  qa.attempt_id,
  qa.question_id,
  qa.selected_answer,
  qa.is_correct,
  qa.response_time_seconds,
  qu.name as user_name
FROM quiz_answers qa
LEFT JOIN quiz_attempts qat ON qa.attempt_id = qat.id
LEFT JOIN quiz_users qu ON qat.user_id = qu.id
ORDER BY qa.id DESC
LIMIT 5;

-- ============================================
-- TEST 4: Check Leaderboard Data
-- ============================================

-- Show current leaderboard entries (if any)
SELECT
  l.id,
  l.quiz_id,
  l.user_id,
  u.name as user_name,
  l.score,
  l.avg_response_time,
  l.rank,
  l.is_hidden,
  l.is_removed,
  l.created_at
FROM quiz_leaderboard l
LEFT JOIN quiz_users u ON l.user_id = u.id
ORDER BY l.score DESC, l.avg_response_time ASC
LIMIT 10;

-- ============================================
-- TEST 5: Simulate Leaderboard Insert
-- ============================================

-- This checks if an INSERT would work
-- (This is a DRY RUN - won't actually insert)

EXPLAIN (FORMAT TEXT)
INSERT INTO quiz_leaderboard (
  quiz_id,
  user_id,
  attempt_id,
  score,
  time_taken_seconds,
  avg_response_time,
  is_hidden,
  is_removed,
  rank
) VALUES (
  '00000000-0000-0000-0000-000000000000',  -- Fake UUID
  '00000000-0000-0000-0000-000000000000',  -- Fake UUID
  '00000000-0000-0000-0000-000000000000',  -- Fake UUID
  100,
  60,
  5.5,
  false,
  false,
  1
)
ON CONFLICT (quiz_id, user_id) DO UPDATE
SET score = EXCLUDED.score,
    avg_response_time = EXCLUDED.avg_response_time,
    updated_at = NOW();

-- ============================================
-- SUMMARY
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '📊 Test Summary Complete';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Check the results above:';
  RAISE NOTICE '1. All checks should show ✅';
  RAISE NOTICE '2. Counts should show your data';
  RAISE NOTICE '3. Recent activity should list entries';
  RAISE NOTICE '4. EXPLAIN should show no errors';
  RAISE NOTICE '';
  RAISE NOTICE 'If all looks good, try answering a question in the app!';
  RAISE NOTICE '========================================';
END $$;
