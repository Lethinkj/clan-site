-- Migration: Insert existing events from the old static data
-- Run this in Supabase SQL Editor after creating the events table

INSERT INTO events (title, description, date, time, location, attendees, rating, tag, status)
VALUES 
  (
    'Weekly Bash 18',
    'Join us for a day of learning, collaboration, and fun with fellow developers in the Aura-7F community.',
    'April 5, 2025',
    '10:00 AM - 3:00 PM',
    'Big Data Lab',
    '20',
    '4.9/5',
    'Weekly Bash',
    'completed'
  ),
  (
    'Aura-Connect 1',
    'Join us for a day of learning, collaboration, and fun with fellow developers in the Aura-7F community.',
    'August 23, 2025',
    '10:00 AM - 3:00 PM',
    'Big Data Lab',
    '25+',
    '4.9/5',
    'Weekly Bash',
    'completed'
  ),
  (
    'Project Showcase 2',
    'BBB Members showcasing their latest projects and innovations to the community.',
    'August 31, 2025',
    '4:00 PM - 7:00 PM',
    'Online Meeting',
    '25+',
    '4.7/5',
    'Project Showcase',
    'completed'
  ),
  (
    'Aura-Connect 2',
    'Join us for a day of learning, collaboration, and fun with fellow developers in the Aura-7F community.',
    'November 1, 2025',
    '10:00 AM - 3:00 PM',
    'Big Data Lab',
    '30+',
    '4.8/5',
    'Weekly Bash',
    'completed'
  );

-- Verify the events were inserted
SELECT * FROM events ORDER BY date DESC;
