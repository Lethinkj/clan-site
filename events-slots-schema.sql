-- 1. Add has_slots to events
ALTER TABLE events ADD COLUMN IF NOT EXISTS has_slots BOOLEAN DEFAULT FALSE;

-- 2. Create event_slots table
CREATE TABLE IF NOT EXISTS event_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,            -- e.g., 1 for Day 1, 2 for Day 2
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,               -- e.g., '10:00:00'
  end_time TIME NOT NULL,                 -- e.g., '10:15:00'
  capacity INTEGER NOT NULL DEFAULT 1,    -- How many can book this slot
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure we don't accidentally create duplicate identical slots
  CONSTRAINT unique_event_slot UNIQUE (event_id, day_number, start_time, end_time)
);

-- Index to quickly look up slots for a specific event
CREATE INDEX IF NOT EXISTS idx_event_slots_event ON event_slots(event_id, day_number);

-- 3. Create event_slot_registrations table
CREATE TABLE IF NOT EXISTS event_slot_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID REFERENCES event_slots(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE, -- Denormalized for easy unique constraint
  user_email TEXT NOT NULL,                              -- To ensure one slot per user per event
  event_registration_id UUID REFERENCES event_registrations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent the same user from booking multiple slots in the same event
  CONSTRAINT unique_user_event_slot UNIQUE (event_id, user_email)
);

CREATE INDEX IF NOT EXISTS idx_esr_slot ON event_slot_registrations(slot_id);

-- Optional: Enable RLS for security
ALTER TABLE event_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_slot_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read for all anon" ON event_slots;
CREATE POLICY "Enable read for all anon" ON event_slots FOR ALL USING (true);

DROP POLICY IF EXISTS "Enable all for anon" ON event_slot_registrations;
CREATE POLICY "Enable all for anon" ON event_slot_registrations FOR ALL USING (true);



-- 4. CONCURRENCY SAFE RPC FUNCTION FOR BOOKING
-- This acts as our API in Supabase. It uses a Database Transaction and FOR UPDATE
-- lock to prevent double booking in high-concurrency situations!
CREATE OR REPLACE FUNCTION book_event_slot(
    p_event_id UUID,
    p_slot_id UUID,
    p_user_email TEXT,
    p_event_registration_id UUID
) RETURNS JSON AS $$
DECLARE
    v_capacity INTEGER;
    v_current_bookings INTEGER;
    v_new_registration RECORD;
    v_has_slots BOOLEAN;
BEGIN
    -- 1. Check if event is valid and has slots enabled
    SELECT has_slots INTO v_has_slots FROM events WHERE id = p_event_id;
    IF NOT v_has_slots THEN
        RAISE EXCEPTION 'Event does not support slot registrations';
    END IF;

    -- 2. Lock the specific slot row to prevent concurrency issues!
    SELECT capacity INTO v_capacity 
    FROM event_slots 
    WHERE id = p_slot_id AND event_id = p_event_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Slot not found';
    END IF;

    -- 3. Check capacity against current bookings
    SELECT count(*) INTO v_current_bookings 
    FROM event_slot_registrations 
    WHERE slot_id = p_slot_id;

    IF v_current_bookings >= v_capacity THEN
        RAISE EXCEPTION 'Slot is completely full';
    END IF;

    -- 4. Check if user already booked (DB unique constraint catches this, but doing it here gives a clean message)
    IF EXISTS (
        SELECT 1 FROM event_slot_registrations 
        WHERE event_id = p_event_id AND user_email = p_user_email
    ) THEN
        RAISE EXCEPTION 'User has already booked a slot for this event';
    END IF;

    -- 5. Insert new registration safely
    INSERT INTO event_slot_registrations (slot_id, event_id, user_email, event_registration_id)
    VALUES (p_slot_id, p_event_id, p_user_email, p_event_registration_id)
    RETURNING * INTO v_new_registration;

    -- Return the inserted rows as JSON to the frontend
    RETURN row_to_json(v_new_registration);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
