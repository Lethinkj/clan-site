# Debugging Leaderboard Issues

## 🚨 CRITICAL ISSUE FOUND: Missing Database Columns

**Problem**: The `quiz_attempts` table is missing the `created_at` column (and possibly others).

**Solution**: Run these SQL scripts in order:

1. **FIX_SCHEMA.sql** - Adds all missing columns to quiz tables
2. **TEST_AFTER_FIX.sql** - Verifies the fix worked

After running both scripts, try answering a question again and check if the leaderboard updates.

---

## Test Steps to Find the Problem

### Step 1: Check Browser Console

**User Side (after answering a question):**

Open browser console (F12) and look for these logs:
```
✅ Answer saved
✅ Score updated to: [number]
📊 Updating leaderboard: {quiz_id: "...", user_id: "...", score: X}
📝 Leaderboard entry to upsert: {...}
✅ Leaderboard updated successfully
Result: [...]
```

**If you see ❌ errors, copy the full error message!**

---

### Step 2: Manually Check Database

Go to **Supabase Dashboard → SQL Editor** and run this query:

```sql
-- Check if leaderboard entries exist
SELECT
  l.*,
  u.name as user_name,
  u.email as user_email
FROM quiz_leaderboard l
LEFT JOIN quiz_users u ON l.user_id = u.id
ORDER BY l.created_at DESC
LIMIT 20;
```

**What to look for:**
- Are there any rows? If no rows → data isn't being inserted
- Check `is_hidden` and `is_removed` columns → should be `FALSE`
- Check if `user_id` matches users in `quiz_users` table
- Check `score` values

---

### Step 3: Check if Quiz Users Table Has Names

```sql
-- Verify quiz users exist with names
SELECT id, name, email, is_banned
FROM quiz_users
ORDER BY created_at DESC
LIMIT 10;
```

**Problem**: If names are NULL or missing, leaderboard won't show properly.

---

### Step 4: Test Leaderboard Query Directly

Use the exact query the app uses:

```sql
-- Admin leaderboard query
SELECT
  l.*,
  u.name
FROM quiz_leaderboard l
LEFT JOIN quiz_users u ON l.user_id = u.id
WHERE l.quiz_id = 'YOUR_QUIZ_ID_HERE'  -- Replace with actual quiz ID
  AND l.is_removed = false
ORDER BY l.score DESC, l.avg_response_time ASC
LIMIT 10;
```

**Replace `YOUR_QUIZ_ID_HERE` with your actual quiz ID!**

**Expected result:**
- Rows with user names
- Scores in descending order
- No errors

---

### Step 5: Check Foreign Key Constraints

```sql
-- Check if there are constraint violations
SELECT
  constraint_name,
  table_name,
  column_name
FROM information_schema.constraint_column_usage
WHERE table_name = 'quiz_leaderboard';
```

---

## Common Issues and Fixes

### Issue 1: No Data Being Inserted

**Symptoms**: Query returns 0 rows

**Causes**:
- User didn't actually answer any questions
- Insert is failing silently
- RLS policies blocking insert

**Fix**:
1. Check browser console for ❌ errors
2. Verify RLS policies are set (run migration 006)
3. Try answering a question again and watch console

---

### Issue 2: Data Exists But Won't Display

**Symptoms**: Database has rows, but UI shows "No scores yet"

**Causes**:
- `is_hidden = true` or `is_removed = true`
- User names are NULL in quiz_users
- JavaScript error in frontend
- Query filter is wrong

**Fix**:
1. Run this update:
```sql
UPDATE quiz_leaderboard
SET is_hidden = false, is_removed = false
WHERE quiz_id = 'YOUR_QUIZ_ID_HERE';
```

2. Check if quiz_users have names:
```sql
UPDATE quiz_users
SET name = 'Test User'
WHERE name IS NULL OR name = '';
```

---

### Issue 3: Wrong Quiz ID

**Symptoms**: Leaderboard shows for different quiz

**Fix**:
1. In browser console, note the quiz ID from the URL or logs
2. Run query in Step 4 with correct quiz ID
3. Verify data exists for that specific quiz

---

## What to Report Back

Copy and paste results of:

1. **Browser console after answering** (the ✅ or ❌ messages)
2. **Step 2 SQL query results** (the raw data)
3. **Step 4 SQL query results** (leaderboard data for specific quiz)

This will tell us exactly what's wrong!

---

## Quick Fix Attempts

### If nothing else works, try this reset:

```sql
-- Delete and recreate some test data
DELETE FROM quiz_leaderboard WHERE quiz_id = 'YOUR_QUIZ_ID';

-- Insert a test entry (replace IDs with real ones)
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
  'YOUR_QUIZ_ID',
  'YOUR_USER_ID',
  'YOUR_ATTEMPT_ID',
  50,
  120,
  5.5,
  false,
  false,
  1
);

-- Check if it shows up
SELECT * FROM quiz_leaderboard WHERE quiz_id = 'YOUR_QUIZ_ID';
```

Then refresh the admin page and click the refresh button on leaderboard panel.

---

## Additional Debugging

Enable more verbose logging by adding this to browser console:

```javascript
// Run this in browser console to see all Supabase queries
localStorage.setItem('supabase.debug', 'true');
// Refresh page
```

Then try answering again and check console for detailed query logs.
