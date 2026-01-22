-- Migration: Add new event and registration fields
-- Run this in Supabase SQL Editor

-- Add new columns to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS end_time TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS custom_category TEXT;

-- Update status constraint to include new statuses
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check;
ALTER TABLE events ADD CONSTRAINT events_status_check 
  CHECK (status IN ('upcoming', 'live', 'ended', 'completed'));

-- Add new columns to event_registrations table
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS registration_no TEXT;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS year TEXT;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS section TEXT;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS clan TEXT;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS project_title TEXT;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS project_category TEXT;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS project_description TEXT;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS attending BOOLEAN;

-- Optional: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
