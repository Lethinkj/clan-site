# Quiz System Documentation

## Overview

A comprehensive quiz management system with admin controls, user authentication, live leaderboards, and security features. This system is fully integrated into the clan site and supports mobile devices.

## Database Schema

The quiz system uses the following tables in Supabase:

### Tables Created:

1. **quiz_users** - Quiz participant accounts
   - Separate from moderators
   - Email, name, password authentication
   - Ban status tracking

2. **quizzes** - Quiz definitions
   - Title, description, time limits
   - Active/inactive status
   - Created by moderators/admins

3. **quiz_questions** - Quiz questions
   - Multiple choice (A, B, C, D)
   - Point values
   - Correct answer tracking

4. **quiz_attempts** - User quiz sessions
   - Start/end time tracking
   - Tab switch detection
   - Score calculation

5. **quiz_answers** - User responses
   - Selected answers
   - Correctness tracking
   - Auto-save functionality

6. **quiz_leaderboard** - Rankings
   - Score-based ranking
   - Time-based tiebreakers
   - Hide/remove capability

## Setup Instructions

### 1. Database Migration

Run the migration file in Supabase SQL Editor:
```bash
migrations/004_create_quiz_system.sql
```

This will:
- Create all required tables
- Set up Row Level Security (RLS) policies
- Create triggers for automatic rank calculation
- Add helper functions for score calculation

### 2. Admin Access

Admins and moderators can access quiz management through the admin panel:
- Navigate to `/admin`
- Click on the "Quizzes", "Quiz Users", or "Leaderboard" tabs

## Features

### For Admin/Moderators:

#### Quiz Management (`/admin` → Quizzes tab)
- **Create Quizzes**: Build quizzes with multiple questions
- **Edit Quizzes**: Modify existing quiz content
- **Activate/Deactivate**: Control quiz visibility to users
- **Delete Quizzes**: Remove quizzes permanently
- **Question Editor**:
  - Add/remove questions dynamically
  - 4 multiple-choice options per question
  - Set point values per question
  - Reorder questions

#### User Management (`/admin` → Quiz Users tab)
- View all registered quiz users
- Ban/unban users
- Delete user accounts
- View user statistics
- Search users by name or email

#### Leaderboard Management (`/admin` → Leaderboard tab)
- View leaderboards by quiz
- Hide entries (keeps rank but hides from public)
- Remove entries (excludes from ranking)
- Restore hidden/removed entries
- Delete entries permanently
- Real-time updates

### For Users:

#### Authentication (`/quiz/auth`)
- **Sign Up**: Create account with email, name, password
- **Sign In**: Login to existing account
- **Auto-redirect**: Banned users cannot access system

#### Dashboard (`/quiz/dashboard`)
- View available active quizzes
- See quiz details (time limit, description)
- Access leaderboard
- Important instructions displayed

#### Quiz Taking (`/quiz/take/:id`)
**Security Features**:
- ✅ Copy-paste disabled (cut, copy, paste blocked)
- ✅ Tab switch detection with alerts
- ✅ Tab switch count tracked and displayed
- ✅ Right-click context menu disabled
- ✅ Auto-save answers to prevent data loss
- ✅ Auto-submit when time expires

**User Experience**:
- Timer countdown display
- Progress indicator
- Question navigation (jump to any question)
- Visual feedback for answered questions
- Mobile-friendly interface
- Full-screen quiz mode (no header/footer)

#### Results (`/quiz/results/:attemptId`)
- Final score display
- Rank and percentile
- Time taken
- Tab switches count
- Performance feedback
- Quick access to leaderboard

#### Leaderboard (`/quiz/leaderboard`)
- Real-time updates using Supabase subscriptions
- Live indicator
- Sort by quiz
- Rank badges (🥇🥈🥉)
- User highlighting
- Time and score display
- Mobile responsive

## Security Features

### Quiz Taking Security:
1. **Copy-Paste Prevention**: All clipboard operations blocked during quiz
2. **Tab Switch Detection**:
   - Tracks when user switches tabs/windows
   - Shows warning alert
   - Count stored in database
3. **Context Menu Disabled**: Right-click disabled
4. **Time Enforcement**: Auto-submit on timeout
5. **Session Management**: Single attempt per user per quiz

### Authentication Security:
- Password hashing using base64 encoding
- Email validation
- Ban status checking on every page load
- Protected routes with redirect
- Separate auth system from moderators

## User Flow

```
1. User visits /quiz/auth
   ↓
2. Sign up or Sign in
   ↓
3. Redirected to /quiz/dashboard
   ↓
4. Select and start a quiz
   ↓
5. Quiz interface (/quiz/take/:id)
   - Answer questions
   - Navigate between questions
   - Time tracks down
   - Tab switches detected
   ↓
6. Submit quiz (auto or manual)
   ↓
7. Results page (/quiz/results/:attemptId)
   - View score, rank, stats
   ↓
8. Leaderboard (/quiz/leaderboard)
   - Compare with others
   - Live updates
```

## Admin Flow

```
1. Admin logs in at /login
   ↓
2. Navigate to /admin
   ↓
3. Click "Quizzes" tab
   ↓
4. Create New Quiz
   - Add title, description, time limit
   - Add questions with options
   - Set correct answers and points
   - Activate quiz
   ↓
5. Manage Users (Quiz Users tab)
   - Monitor participants
   - Ban if needed
   ↓
6. Manage Leaderboard (Leaderboard tab)
   - Hide suspicious entries
   - Remove cheaters
   - Monitor rankings
```

## Mobile Responsiveness

All quiz components are fully responsive:
- ✅ Touch-friendly buttons
- ✅ Mobile navigation optimized
- ✅ Responsive tables (horizontal scroll)
- ✅ Proper spacing for touch targets
- ✅ Mobile-optimized timer
- ✅ Full-width layouts on small screens

## API/Database Functions

### Automatic Functions:

1. **update_quiz_leaderboard_ranks()**:
   - Automatically recalculates ranks when scores change
   - Triggered on INSERT/UPDATE to leaderboard

2. **calculate_quiz_score(attempt_uuid)**:
   - Calculates total score from answers
   - Marks attempt as submitted
   - Returns final score

### Real-time Features:

- Leaderboard uses Supabase real-time subscriptions
- Instant updates when new entries added
- Live rank changes without refresh

## Technical Stack

- **Frontend**: React + TypeScript
- **Backend**: Supabase (PostgreSQL)
- **Real-time**: Supabase Subscriptions
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Authentication**: Custom JWT-free auth
- **State Management**: React Context API

## Existing Admin Credentials

Admin access uses the existing moderators table. Current admins can:
- Access quiz management tabs
- Create and manage quizzes
- Control user access
- Manage leaderboards

To add quiz management access to more admins, use the existing Moderators tab in the admin panel.

## Notes

- Quiz users are separate from moderators
- Each user can take each quiz only once
- Scores are calculated server-side for security
- Tab switches affect reputation but not score
- Hidden entries still maintain their rank
- Removed entries are excluded from ranking
- All dates/times are in UTC

## Testing Checklist

- [x] User registration
- [x] User login
- [x] Quiz creation (admin)
- [x] Quiz taking with security features
- [x] Tab switch detection
- [x] Copy-paste prevention
- [x] Auto-save functionality
- [x] Score calculation
- [x] Leaderboard display
- [x] Real-time updates
- [x] Ban functionality
- [x] Hide/Remove from leaderboard
- [x] Mobile responsiveness
- [x] Timer auto-submit
- [x] Results page
- [x] Navigation integration

## Support

For issues or questions, contact the development team or create an issue in the repository.
