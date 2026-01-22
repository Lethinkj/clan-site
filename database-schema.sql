-- SQL Schema for Clan Site

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  end_time TEXT,
  location TEXT NOT NULL,
  attendees TEXT NOT NULL,
  rating TEXT,
  tag TEXT NOT NULL,
  custom_category TEXT,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'live', 'ended', 'completed')),
  image_url TEXT,
  max_registrations INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Moderators table (with email/password auth)
-- Admins and moderators are stored in the same table, distinguished by is_admin flag
CREATE TABLE IF NOT EXISTS moderators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  added_by TEXT -- Email of admin who added them (NULL for initial admin)
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_moderators_email ON moderators(email);

-- Insert initial admin user (password: Aura@12345)
-- Password hash is generated using: btoa(email + ':' + password)
-- You can update this hash if you change the password
INSERT INTO moderators (email, username, password_hash, is_admin, added_by)
VALUES (
  'aura7f.bytebashblitz@gmail.com',
  'Captain Bash',
  'YXVyYTdmLmJ5dGViYXNoYmxpdHpAZ21haWwuY29tOkF1cmFAMTIzNDU=',
  TRUE,
  NULL
) ON CONFLICT (email) DO NOTHING;

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  discord_id TEXT,
  -- For project showcase
  registration_no TEXT,
  department TEXT,
  year TEXT,
  section TEXT,
  clan TEXT,
  project_title TEXT,
  project_category TEXT,
  project_description TEXT,
  -- For weekly bash
  attending BOOLEAN,
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for event registrations
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON event_registrations(email);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderators ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow all for service role
CREATE POLICY "Enable all for anon" ON events FOR ALL USING (true);
CREATE POLICY "Enable all for anon" ON moderators FOR ALL USING (true);
CREATE POLICY "Enable all for anon" ON event_registrations FOR ALL USING (true);

-- Note: The following tables already exist in your database:
-- - users (discord_user_id, username, display_name, is_clan_member, etc.)
-- - birthdays (user_id, name, date)
-- These will be used for member management

-- Migration to add max_registrations to existing events table:
-- ALTER TABLE events ADD COLUMN IF NOT EXISTS max_registrations INTEGER;

-- Migration to add is_admin column to existing moderators table:
-- ALTER TABLE moderators ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
-- ALTER TABLE moderators ALTER COLUMN added_by DROP NOT NULL;

-- Migration for new event fields:
-- ALTER TABLE events ADD COLUMN IF NOT EXISTS end_time TEXT;
-- ALTER TABLE events ADD COLUMN IF NOT EXISTS custom_category TEXT;
-- ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;
-- ALTER TABLE events ADD CONSTRAINT events_status_check CHECK (status IN ('upcoming', 'live', 'ended', 'completed'));

-- Migration for new registration fields:
-- ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS registration_no TEXT;
-- ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS department TEXT;
-- ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS year TEXT;
-- ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS section TEXT;
-- ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS clan TEXT;
-- ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS project_title TEXT;
-- ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS project_category TEXT;
-- ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS project_description TEXT;
-- ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS attending BOOLEAN;
