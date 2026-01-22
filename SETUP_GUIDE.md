# Clan Site - Dynamic Event Management System

This is a modern React + TypeScript website with Supabase backend for managing clan events, members, and moderators.

## Features

### 🎯 Dynamic Event Management
- Add, edit, and delete events
- Upcoming and past events sections
- Auto-calculated statistics (total events, attendees, ratings)
- Image support for events

### 👥 Member Management
- Add members with Discord User ID
- Track birthdays (stored in existing `birthdays` table)
- Mark clan members vs guests
- Uses existing `users` table from Discord bot

### 🔐 Authentication & Authorization
- Simple login with Discord ID
- Admin role (Captain Bash)
- Moderator role with limited permissions
- Protected admin routes

### 👮 Role-Based Access Control
- **Admin (Captain Bash)**: Full access - add/edit/delete events, manage members, add/remove moderators
- **Moderators**: Can edit events and view members (cannot delete events or manage moderators)

## Database Schema

### New Tables

#### `events` table
```sql
- id (UUID, Primary Key)
- title (TEXT)
- description (TEXT)
- date (TEXT) - e.g., "April 5, 2025"
- time (TEXT) - e.g., "10:00 AM - 3:00 PM"
- location (TEXT)
- attendees (TEXT) - e.g., "20+" or "30"
- rating (TEXT) - e.g., "4.9/5"
- tag (TEXT) - event category
- status (TEXT) - 'upcoming' or 'completed'
- image_url (TEXT) - optional
- created_at, updated_at (TIMESTAMP)
```

#### `moderators` table
```sql
- id (UUID, Primary Key)
- discord_user_id (TEXT, UNIQUE)
- username (TEXT)
- added_at (TIMESTAMP)
- added_by (TEXT) - Discord ID of admin who added them
```

### Existing Tables Used
- `users` - For member data (discord_user_id, username, display_name, is_clan_member)
- `birthdays` - For storing member birthdays (user_id, name, date in DD/MM format)

## Setup Instructions

### 1. Database Setup

1. Go to your Supabase dashboard: https://kxolautvyktglktnnvdl.supabase.co
2. Navigate to SQL Editor
3. Run the SQL script from `database-schema.sql`:

```sql
-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  attendees TEXT NOT NULL,
  rating TEXT,
  tag TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'completed')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Create moderators table
CREATE TABLE IF NOT EXISTS moderators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_user_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  added_by TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_moderators_discord_id ON moderators(discord_user_id);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderators ENABLE ROW LEVEL SECURITY;

-- Allow all for service role
CREATE POLICY "Enable all for anon" ON events FOR ALL USING (true);
CREATE POLICY "Enable all for anon" ON moderators FOR ALL USING (true);
```

### 2. Configure Admin User

1. Open [src/lib/supabase.ts](src/lib/supabase.ts)
2. Update the `ADMIN_DISCORD_ID` constant with Captain Bash's actual Discord user ID:

```typescript
export const ADMIN_DISCORD_ID = 'YOUR_DISCORD_ID_HERE' // Replace with actual Discord ID
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Environment Variables

The `.env` file has already been created with your Supabase credentials. Keep it secure and never commit it to version control.

### 5. Run Development Server

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

## Usage Guide

### For Admin (Captain Bash)

1. Navigate to `/login`
2. Enter your Discord User ID, username, and display name
3. You'll be redirected to `/admin` dashboard

**Admin Dashboard Tabs:**
- **Events**: Add new events, edit existing ones, delete events
- **Members**: Add members with Discord ID and birthday
- **Moderators**: Add or remove moderators

### For Moderators

1. Admin must first add you as a moderator
2. Navigate to `/login` and sign in with your Discord ID
3. You'll see the moderator dashboard with:
   - Events tab (can edit, but not delete)
   - Members tab (view only)

### For Visitors

- Visit `/events` to see all upcoming and past events
- Events are dynamically loaded from the database
- Statistics are automatically calculated

## Pages

- `/` or `/home` - Home page
- `/about` - About page
- `/members` - Members page
- `/events` - Dynamic events page (public)
- `/login` - Login page
- `/admin` - Admin/Moderator dashboard (protected)

## File Structure

```
src/
├── components/
│   └── admin/
│       ├── EventForm.tsx       # Add/edit event form
│       ├── EventList.tsx       # List all events with edit/delete
│       ├── MemberForm.tsx      # Add member form
│       └── ModeratorManagement.tsx  # Manage moderators
├── contexts/
│   └── AuthContext.tsx         # Authentication context
├── lib/
│   └── supabase.ts            # Supabase client & types
├── pages/
│   ├── Admin.tsx              # Admin dashboard
│   ├── Events.tsx             # Public events page (dynamic)
│   ├── Login.tsx              # Login page
│   └── ...
└── App.tsx                    # Main app with routing
```

## Security Notes

1. The `.env` file contains your service role key - keep it secure
2. Row Level Security (RLS) is enabled on all new tables
3. The service key allows the bot and admin panel full access
4. Admin role is hardcoded in the code - only Captain Bash should have the admin Discord ID
5. Moderators are stored in the database and can be added/removed by admin

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

The site will automatically rebuild when you push changes.

## Migrating Existing Events

To add your existing 4 events to the database:

1. Go to `/login` and sign in as admin
2. Navigate to the Events tab
3. Add each event manually using the form, or
4. Use the Supabase dashboard to bulk insert via SQL:

```sql
INSERT INTO events (title, description, date, time, location, attendees, rating, tag, status)
VALUES 
  ('Weekly Bash 18', 'Join us for a day of learning, collaboration, and fun with fellow developers in the Aura-7F community.', 'April 5, 2025', '10:00 AM - 3:00 PM', 'Big Data Lab', '20', '4.9/5', 'Weekly Bash', 'completed'),
  ('Aura-Connect 1', 'Join us for a day of learning, collaboration, and fun with fellow developers in the Aura-7F community.', 'August 23, 2025', '10:00 AM - 3:00 PM', 'Big Data Lab', '25+', '4.9/5', 'Weekly Bash', 'completed'),
  ('Project Showcase 2', 'BBB Members showcasing their latest projects and innovations to the community.', 'August 31, 2025', '4:00 PM - 7:00 PM', 'Online Meeting', '25+', '4.7/5', 'Project Showcase', 'completed'),
  ('Aura-Connect 2', 'Join us for a day of learning, collaboration, and fun with fellow developers in the Aura-7F community.', 'November 1, 2025', '10:00 AM - 3:00 PM', 'Big Data Lab', '30+', '4.8/5', 'Weekly Bash', 'completed');
```

## Troubleshooting

### Events not loading?
- Check browser console for errors
- Verify Supabase credentials in `.env`
- Ensure tables were created successfully
- Check RLS policies are set to allow access

### Can't login?
- Verify Discord User ID is correct
- Check if moderator status is set (if not admin)
- Look for errors in browser console

### Stats not calculating?
- Stats are calculated from all events in the database
- Refresh the events page to recalculate

## Support

For issues or questions, contact Captain Bash on Discord.
