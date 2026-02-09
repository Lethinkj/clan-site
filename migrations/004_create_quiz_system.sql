-- Migration: Create Quiz System Tables
-- Run this in Supabase SQL Editor

-- Create quiz_users table for quiz participants (separate from moderators)
CREATE TABLE IF NOT EXISTS quiz_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES moderators(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT FALSE,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  time_limit_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT CHECK (correct_answer IN ('A', 'B', 'C', 'D')) NOT NULL,
  points INTEGER DEFAULT 10,
  question_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create quiz_attempts table (tracks when users start a quiz)
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES quiz_users(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  total_score INTEGER DEFAULT 0,
  time_taken_seconds INTEGER,
  tab_switches INTEGER DEFAULT 0,
  is_submitted BOOLEAN DEFAULT FALSE,
  UNIQUE(quiz_id, user_id)
);

-- Create quiz_answers table (stores user answers)
CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE NOT NULL,
  selected_answer TEXT CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN DEFAULT FALSE,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);

-- Create leaderboard table (for display and admin management)
CREATE TABLE IF NOT EXISTS quiz_leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES quiz_users(id) ON DELETE CASCADE NOT NULL,
  attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  time_taken_seconds INTEGER NOT NULL,
  rank INTEGER,
  is_hidden BOOLEAN DEFAULT FALSE,
  is_removed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(quiz_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_users_email ON quiz_users(email);
CREATE INDEX IF NOT EXISTS idx_quiz_users_banned ON quiz_users(is_banned);
CREATE INDEX IF NOT EXISTS idx_quizzes_active ON quizzes(is_active);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_order ON quiz_questions(quiz_id, question_order);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_answers_attempt ON quiz_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_quiz ON quiz_leaderboard(quiz_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_rank ON quiz_leaderboard(quiz_id, rank);

-- Enable Row Level Security
ALTER TABLE quiz_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_leaderboard ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quiz_users (users can read their own data)
CREATE POLICY "Users can view their own profile" ON quiz_users
  FOR SELECT USING (auth.uid()::text = id::text);

-- RLS Policies for quizzes (everyone can view active quizzes)
CREATE POLICY "Anyone can view active quizzes" ON quizzes
  FOR SELECT USING (is_active = TRUE);

-- RLS Policies for quiz_questions (users can view questions of active quizzes)
CREATE POLICY "Users can view questions of active quizzes" ON quiz_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = quiz_questions.quiz_id
      AND quizzes.is_active = TRUE
    )
  );

-- RLS Policies for quiz_attempts (users can view and update their own attempts)
CREATE POLICY "Users can manage their own attempts" ON quiz_attempts
  FOR ALL USING (auth.uid()::text = user_id::text);

-- RLS Policies for quiz_answers (users can manage their own answers)
CREATE POLICY "Users can manage their own answers" ON quiz_answers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM quiz_attempts
      WHERE quiz_attempts.id = quiz_answers.attempt_id
      AND quiz_attempts.user_id::text = auth.uid()::text
    )
  );

-- RLS Policies for leaderboard (everyone can view non-hidden entries)
CREATE POLICY "Anyone can view public leaderboard" ON quiz_leaderboard
  FOR SELECT USING (is_hidden = FALSE AND is_removed = FALSE);

-- Function to update leaderboard ranks automatically
CREATE OR REPLACE FUNCTION update_quiz_leaderboard_ranks()
RETURNS TRIGGER AS $$
BEGIN
  WITH ranked_scores AS (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY quiz_id
        ORDER BY score DESC, time_taken_seconds ASC
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

-- Trigger to update ranks when leaderboard changes
CREATE TRIGGER trigger_update_leaderboard_ranks
AFTER INSERT OR UPDATE ON quiz_leaderboard
FOR EACH ROW
EXECUTE FUNCTION update_quiz_leaderboard_ranks();

-- Function to calculate and update score after quiz submission
CREATE OR REPLACE FUNCTION calculate_quiz_score(attempt_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  total_score INTEGER := 0;
  correct_count INTEGER := 0;
BEGIN
  -- Calculate score based on correct answers
  SELECT
    COUNT(*) FILTER (WHERE qa.is_correct = TRUE),
    COALESCE(SUM(qq.points) FILTER (WHERE qa.is_correct = TRUE), 0)
  INTO correct_count, total_score
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
