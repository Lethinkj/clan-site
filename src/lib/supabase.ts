import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  end_time?: string
  location: string
  attendees: string
  rating: string
  tag: string
  custom_category?: string
  status: 'upcoming' | 'live' | 'ended' | 'completed'
  image_url?: string
  max_registrations?: number
  created_at: string
  updated_at: string
}

export interface EventRegistration {
  id: string
  event_id: string
  name: string
  email: string
  discord_id?: string
  // Project showcase fields
  registration_no?: string
  department?: string
  year?: string
  section?: string
  clan?: string
  project_title?: string
  project_category?: string
  project_description?: string
  // Weekly bash
  attending?: boolean
  registered_at: string
}

export interface User {
  id: string
  discord_user_id: string
  username: string
  is_clan_member: boolean
  joined_at: string
  last_active?: string
  avatar_url?: string
}

export interface Birthday {
  id: string
  user_id: string
  name: string
  date: string
  created_at: string
}

export interface Moderator {
  id: string
  email: string
  username: string
  password_hash: string
  is_admin: boolean
  added_at: string
  added_by: string | null
}

// Hash function for passwords using base64 encoding
// Format: base64(email:password) - simple but effective for this use case
export function hashPassword(email: string, password: string): string {
  return btoa(email + ':' + password)
}

// Verify password against hash
export function verifyPassword(email: string, password: string, hash: string): boolean {
  return hashPassword(email, password) === hash
}
