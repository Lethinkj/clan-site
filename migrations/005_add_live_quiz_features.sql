-- Migration: Add Live Quiz Features
-- Run this in Supabase SQL Editor

-- Add quiz type and live quiz fields to quizzes table
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS quiz_type TEXT DEFAULT 'self_paced' CHECK (quiz_type IN ('self_paced', 'live'));
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS is_live_active BOOLEAN DEFAULT FALSE;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS current_question_id UUID REFERENCES quiz_questions(id) ON DELETE SET NULL;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS question_start_time TIMESTAMPTZ;

-- Add per-question time limit
ALTER TABLE quiz_questions ADD COLUMN IF NOT EXISTS time_limit_seconds INTEGER DEFAULT 30;

-- Add response time tracking for speed-based scoring
ALTER TABLE quiz_answers ADD COLUMN IF NOT EXISTS response_time_seconds DECIMAL(10, 2);

-- Update RLS policies to allow moderators to manage quizzes
DROP POLICY IF EXISTS "Moderators can manage quizzes" ON quizzes;
CREATE POLICY "Moderators can manage quizzes" ON quizzes
  FOR ALL USING (true);

DROP POLICY IF EXISTS "Moderators can manage questions" ON quiz_questions;
CREATE POLICY "Moderators can manage questions" ON quiz_questions
  FOR ALL USING (true);

-- Create live quiz sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS live_quiz_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  host_id TEXT NOT NULL,
  current_question_index INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_live_quiz_sessions_quiz ON live_quiz_sessions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_live_quiz_sessions_active ON live_quiz_sessions(is_active);

-- Enable RLS
ALTER TABLE live_quiz_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policy for live sessions
CREATE POLICY "Anyone can view active sessions" ON live_quiz_sessions
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Moderators can manage sessions" ON live_quiz_sessions
  FOR ALL USING (true);

-- Update leaderboard to include response time
ALTER TABLE quiz_leaderboard ADD COLUMN IF NOT EXISTS avg_response_time DECIMAL(10, 2);

-- Function to calculate score with time bonus
CREATE OR REPLACE FUNCTION calculate_quiz_score_with_time(attempt_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total_score INTEGER := 0;
  time_bonus INTEGER := 0;
BEGIN
  -- Calculate base score and time bonus
  SELECT
    COALESCE(SUM(
      CASE
        WHEN qa.is_correct = TRUE THEN
          qq.points +
          -- Time bonus: faster answers get more bonus (max 5 points per question)
          CASE
            WHEN qa.response_time_seconds IS NOT NULL AND qa.response_time_seconds < qq.time_limit_seconds * 0.5 THEN 5
            WHEN qa.response_time_seconds IS NOT NULL AND qa.response_time_seconds < qq.time_limit_seconds * 0.7 THEN 3
            WHEN qa.response_time_seconds IS NOT NULL AND qa.response_time_seconds < qq.time_limit_seconds * 0.9 THEN 1
            ELSE 0
          END
        ELSE 0
      END
    ), 0)
  INTO total_score
  FROM quiz_answers qa
  JOIN quiz_questions qq ON qa.question_id = qq.id
  WHERE qa.attempt_id = attempt_uuid;

  -- Update the attempt with the calculated score
  UPDATE quiz_attempts
  SET total_score = total_score,
      is_submitted = TRUE,
      submitted_at = NOW()
  WHERE id = attempt_uuid;

  RETURN total_score;
END;
$$ LANGUAGE plpgsql;

-- Update leaderboard ranks with time-based tiebreaker
CREATE OR REPLACE FUNCTION update_quiz_leaderboard_ranks()
RETURNS TRIGGER AS $$
BEGIN
  WITH ranked_scores AS (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY quiz_id
        ORDER BY
          score DESC,
          avg_response_time ASC NULLS LAST,
          created_at ASC
      ) as new_rank
    FROM quiz_leaderboard
    WHERE quiz_id = NEW.quiz_id
      AND is_removed = FALSE
  )
  UPDATE quiz_leaderboard
  SET rank = ranked_scores.new_rank
  FROM ranked_scores
  WHERE quiz_leaderboard.id = ranked_scores.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
