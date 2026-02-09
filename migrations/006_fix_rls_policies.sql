-- Migration: Simplified RLS Policies for Quiz System
-- Run this in Supabase SQL Editor
-- These policies work with application-level authentication

-- ============================================
-- QUIZZES TABLE
-- ============================================

DROP POLICY IF EXISTS "Moderators can manage quizzes" ON quizzes;
DROP POLICY IF EXISTS "Public can view active quizzes" ON quizzes;
DROP POLICY IF EXISTS "Public can manage quizzes" ON quizzes;

-- Allow reading all quizzes (for both admin and users)
CREATE POLICY "Public can view quizzes" ON quizzes
  FOR SELECT
  USING (true);

-- Allow inserting quizzes
CREATE POLICY "Public can insert quizzes" ON quizzes
  FOR INSERT
  WITH CHECK (true);

-- Allow updating quizzes
CREATE POLICY "Public can update quizzes" ON quizzes
  FOR UPDATE
  USING (true);

-- Allow deleting quizzes
CREATE POLICY "Public can delete quizzes" ON quizzes
  FOR DELETE
  USING (true);

-- ============================================
-- QUIZ_QUESTIONS TABLE
-- ============================================

DROP POLICY IF EXISTS "Moderators can manage questions" ON quiz_questions;

CREATE POLICY "Public can manage questions" ON quiz_questions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- QUIZ_USERS TABLE
-- ============================================

DROP POLICY IF EXISTS "Anyone can create quiz user" ON quiz_users;
DROP POLICY IF EXISTS "Users can view own data" ON quiz_users;
DROP POLICY IF EXISTS "Service role can manage users" ON quiz_users;
DROP POLICY IF EXISTS "Users can select for login" ON quiz_users;

CREATE POLICY "Public can manage quiz users" ON quiz_users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- QUIZ_ATTEMPTS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can create attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can view own attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can update own attempts" ON quiz_attempts;

CREATE POLICY "Public can manage attempts" ON quiz_attempts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- QUIZ_ANSWERS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can create answers" ON quiz_answers;
DROP POLICY IF EXISTS "Users can view answers" ON quiz_answers;
DROP POLICY IF EXISTS "Users can update answers" ON quiz_answers;
DROP POLICY IF EXISTS "Users can view own answers" ON quiz_answers;

CREATE POLICY "Public can manage answers" ON quiz_answers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- QUIZ_LEADERBOARD TABLE
-- ============================================

DROP POLICY IF EXISTS "Anyone can view leaderboard" ON quiz_leaderboard;
DROP POLICY IF EXISTS "Users can upsert leaderboard" ON quiz_leaderboard;
DROP POLICY IF EXISTS "Service role can manage leaderboard" ON quiz_leaderboard;
DROP POLICY IF EXISTS "Users can update leaderboard" ON quiz_leaderboard;

CREATE POLICY "Public can manage leaderboard" ON quiz_leaderboard
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- LIVE_QUIZ_SESSIONS TABLE
-- ============================================

DROP POLICY IF EXISTS "Anyone can view active sessions" ON live_quiz_sessions;
DROP POLICY IF EXISTS "Moderators can manage sessions" ON live_quiz_sessions;

CREATE POLICY "Public can manage sessions" ON live_quiz_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- NOTE: Security Explanation
-- ============================================
-- These policies are permissive because we use application-level authentication
-- (moderators table for admins, quiz_users table for users).
-- RLS is enabled but allows all operations since authentication is handled
-- in the application layer rather than Supabase Auth.
--
-- The security comes from:
-- 1. Admin routes protected by AuthContext (checks moderators table)
-- 2. Quiz routes protected by QuizAuthContext (checks quiz_users table)
-- 3. Application logic validates access before operations
--
-- In production, consider:
-- 1. Moving to Supabase Auth for better RLS integration
-- 2. Using custom JWT claims to enforce row-level permissions
-- 3. Rate limiting and API security measures

