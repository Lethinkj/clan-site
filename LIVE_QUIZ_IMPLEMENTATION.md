# Quiz System Updates - Live Mode Implementation

## Changes Completed:

### 1. Database Migration (005_add_live_quiz_features.sql)
- Added `quiz_type` field ('self_paced' | 'live')
- Added live quiz control fields
- Added per-question `time_limit_seconds`
- Added `response_time_seconds` for speed scoring
- Updated RLS policies to allow moderators
- Added live quiz sessions table
- Updated scoring function with time bonuses

### 2. Type Definitions Updated (src/lib/supabase.ts)
- Updated `Quiz` interface with live fields
- Updated `QuizQuestion` with `time_limit_seconds`
- Updated `QuizAnswer` with `response_time_seconds`
- Updated `QuizLeaderboardEntry` with `avg_response_time`

### 3. Moderator Access (src/pages/Admin.tsx)
- Changed quiz tabs to use `isModerator` instead of `isAdmin`
- Moderators can now manage quizzes and leaderboard
- Only admins can manage quiz users

## Next Steps Needed:

### 4. Update QuizManagement Component
Add these fields to the form:
- Quiz type selector (Self-Paced / Live)
- Per-question time limit (10-30 seconds)
- Default values: quiz_type='self_paced', time_limit_seconds=30

### 5. Create Live Quiz Host Component (`src/components/admin/LiveQuizHost.tsx`)
Features:
- Select quiz to host
- Start/Stop live session
- Display current question to all users
- Control "Next Question" button
- Real-time leaderboard view
- Question timer display

### 6. Create Live Quiz Participate Component (`src/pages/LiveQuizParticipate.tsx`)
Features:
- Join live quiz session
- See only current question shown by admin
- Submit answer with time tracking
- Wait for admin to show next question
- Real-time leaderboard updates

### 7. Add Routes
- `/admin/quiz/host/:id` - Admin hosting interface
- `/quiz/live/:id` - User participation interface

## Fix for Save Issue:

The save issue is likely due to missing default values in the INSERT statement. The QuizManagement component needs to be updated to include default values for the new fields:

```typescript
// When creating quiz:
{
  title,
  description,
  time_limit_minutes: timeLimit,
  is_active: isActive,
  created_by: user?.email,
  quiz_type: quizType || 'self_paced',  // ADD THIS
  is_live_active: false,                 // ADD THIS
}

// When creating questions:
{
  quiz_id: newQuiz.id,
  ...q,
  question_order: index + 1,
  time_limit_seconds: q.time_limit_seconds || 30  // ADD THIS
}
```

## Quick Setup Instructions:

1. Run migration: `migrations/005_add_live_quiz_features.sql` in Supabase
2. The types are already updated
3. ModeratorAccess is already fixed
4. Need to update QuizManagement to add new fields
5. Need to create LiveQuizHost and LiveQuizParticipate components

Would you like me to:
A) Update QuizManagement component with the fix and new fields?
B) Create the Live Quiz Host component?
C) Create the Live Quiz Participate component?
D) All of the above?
