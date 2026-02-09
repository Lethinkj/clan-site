-- Migration 007: Add Tab Switch Tracking to Leaderboard
-- Add columns to track when users switch tabs or exit fullscreen

-- Add tab_switch_count to quiz_leaderboard if not exists
ALTER TABLE quiz_leaderboard
ADD COLUMN IF NOT EXISTS tab_switch_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS fullscreen_exits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS was_fullscreen BOOLEAN DEFAULT FALSE;

-- Add tab switch tracking to quiz_attempts if not exists
ALTER TABLE quiz_attempts
ADD COLUMN IF NOT EXISTS tab_switches_during_quiz INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS fullscreen_time_seconds INTEGER DEFAULT 0;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_quiz_leaderboard_tab_switches
ON quiz_leaderboard(quiz_id, tab_switch_count DESC);

-- Update metadata
COMMENT ON COLUMN quiz_leaderboard.tab_switch_count IS 'Total number of times user switched tabs during quiz';
COMMENT ON COLUMN quiz_leaderboard.fullscreen_exits IS 'Number of times user exited fullscreen mode';
COMMENT ON COLUMN quiz_leaderboard.was_fullscreen IS 'Whether user used fullscreen during quiz';

-- Verify columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'quiz_leaderboard'
AND column_name IN ('tab_switch_count', 'fullscreen_exits', 'was_fullscreen');

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Tab switch tracking migration complete!';
  RAISE NOTICE '📊 Added columns: tab_switch_count, fullscreen_exits, was_fullscreen';
END $$;
