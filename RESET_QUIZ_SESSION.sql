-- Reset Quiz for New Session
-- Run this when starting a new session of a quiz to clear old data

-- Replace YOUR_QUIZ_ID with the actual quiz ID

-- Option 1: Clear all leaderboard entries for this quiz
DELETE FROM quiz_leaderboard WHERE quiz_id = 'YOUR_QUIZ_ID';

-- Option 2: Clear all attempts and answers for this quiz
-- (This also clears leaderboard due to foreign key cascades)
DELETE FROM quiz_answers
WHERE attempt_id IN (
  SELECT id FROM quiz_attempts WHERE quiz_id = 'YOUR_QUIZ_ID'
);

DELETE FROM quiz_attempts WHERE quiz_id = 'YOUR_QUIZ_ID';

-- Verify everything is cleared
SELECT 'Attempts' as table_name, COUNT(*) as count
FROM quiz_attempts
WHERE quiz_id = 'YOUR_QUIZ_ID'

UNION ALL

SELECT 'Leaderboard' as table_name, COUNT(*) as count
FROM quiz_leaderboard
WHERE quiz_id = 'YOUR_QUIZ_ID';

-- Should show 0 for both
