# Admin Quick Reference Guide

## Initial Setup Checklist

### 1. Database Setup
- [ ] Run `database-schema.sql` in Supabase SQL Editor
- [ ] Verify `events` table created
- [ ] Verify `moderators` table created
- [ ] Run `migrate-events.sql` to import existing events (optional)

### 2. Configure Admin
- [ ] Get Captain Bash's Discord User ID
- [ ] Update `ADMIN_DISCORD_ID` in `src/lib/supabase.ts`
- [ ] Test login at `/login`

### 3. Deploy
- [ ] Push to GitHub
- [ ] Connect to Vercel
- [ ] Add environment variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] Deploy and test

---

## How to Get Discord User ID

### Method 1: Enable Developer Mode
1. Open Discord → Settings → Advanced
2. Enable "Developer Mode"
3. Right-click on your profile → Copy User ID

### Method 2: Using Bot
If your bot has a command to get user ID, use that.

---

## Admin Dashboard Guide

### URL Structure
- Login: `https://yoursite.com/login`
- Admin Dashboard: `https://yoursite.com/admin`

### Events Management

#### Adding a New Event
1. Go to Admin Dashboard → Events tab
2. Fill in the form:
   - **Title**: Event name (e.g., "Weekly Bash 19")
   - **Tag**: Category (Weekly Bash, Project Showcase, Workshop, etc.)
   - **Date**: Full date (e.g., "January 22, 2026")
   - **Time**: Time range (e.g., "10:00 AM - 3:00 PM")
   - **Location**: Venue (e.g., "Big Data Lab" or "Online")
   - **Attendees**: Number (e.g., "25+" or "30")
   - **Rating**: Optional rating (e.g., "4.8/5")
   - **Status**: "upcoming" or "completed"
   - **Image URL**: Optional image link
   - **Description**: Event details
3. Click "Add Event"

#### Editing an Event
1. Find the event in the list
2. Click "Edit"
3. Modify fields
4. Click "Update Event"

#### Deleting an Event (Admin Only)
1. Find the event in the list
2. Click "Delete"
3. Confirm deletion

### Members Management

#### Adding a New Member
1. Go to Admin Dashboard → Members tab
2. Fill in the form:
   - **Discord User ID**: User's Discord ID (required)
   - **Username**: Discord username (required)
   - **Display Name**: Server display name (optional)
   - **Birthday**: DD/MM format (e.g., "15/08") (optional)
   - **Clan Member**: Check if they're a clan member
3. Click "Add Member"

**Note**: Member data is stored in the existing `users` table. Birthdays go to the `birthdays` table.

### Moderators Management (Admin Only)

#### Adding a Moderator
1. Go to Admin Dashboard → Moderators tab
2. Enter:
   - **Discord User ID**: Moderator's Discord ID
   - **Username**: Their username
3. Click "Add Moderator"

#### Removing a Moderator
1. Find the moderator in the list
2. Click "Remove"
3. Confirm removal

**Moderator Permissions**:
- ✅ Can edit events
- ❌ Cannot delete events
- ✅ Can view members
- ❌ Cannot add/remove members
- ❌ Cannot manage other moderators

---

## Common Tasks

### Updating Event Statistics
Statistics (total events, attendees, average rating) are calculated automatically from the database. No manual action needed.

### Changing Event from Upcoming to Completed
1. Edit the event
2. Change **Status** from "upcoming" to "completed"
3. Add a **Rating** if available
4. Save

### Adding Event Images
1. Upload image to a hosting service (Imgur, Cloudinary, etc.)
2. Copy the direct image URL
3. When adding/editing event, paste URL in **Image URL** field

### Bulk Import Members
If you need to import many members at once:
1. Open Supabase dashboard
2. Go to Table Editor → `users`
3. Use the "Insert row" feature or run SQL:

```sql
INSERT INTO users (discord_user_id, username, display_name, is_clan_member)
VALUES 
  ('123456789', 'user1', 'User One', true),
  ('987654321', 'user2', 'User Two', true);
```

---

## Troubleshooting

### "User already exists" when adding member
This member is already in the database. Check the members list below the form.

### "User is already a moderator"
This person is already added as a moderator. Check the moderators list.

### Can't see admin dashboard
- Verify you're logged in
- Check that your Discord ID matches `ADMIN_DISCORD_ID` in the code
- Clear browser cache and try again

### Events not showing on public page
- Verify events are in the database (check Supabase dashboard)
- Check browser console for errors
- Ensure `.env` file has correct Supabase credentials

### Stats showing 0
- Make sure events are actually in the database
- Check that events have proper numeric values for attendees
- Refresh the page

---

## Database Direct Access

### Supabase Dashboard
URL: https://kxolautvyktglktnnvdl.supabase.co

### Quick SQL Queries

**View all events:**
```sql
SELECT * FROM events ORDER BY date DESC;
```

**View all members:**
```sql
SELECT * FROM users ORDER BY created_at DESC;
```

**View all moderators:**
```sql
SELECT * FROM moderators;
```

**Count upcoming events:**
```sql
SELECT COUNT(*) FROM events WHERE status = 'upcoming';
```

**Get total attendees:**
```sql
SELECT SUM(CAST(REGEXP_REPLACE(attendees, '[^0-9]', '', 'g') AS INTEGER)) 
FROM events;
```

---

## Security Best Practices

1. **Never share the service role key** (in `.env` file)
2. **Only give moderator role to trusted members**
3. **Keep admin Discord ID private**
4. **Regularly review moderator list**
5. **Use Supabase dashboard to check for suspicious activity**

---

## Support Contacts

- Technical issues: Contact developer
- Database issues: Check Supabase dashboard
- Discord bot integration: Contact bot maintainer

---

## Future Enhancements (Ideas)

- [ ] Upload images directly (instead of URLs)
- [ ] Email notifications for new events
- [ ] Event calendar view
- [ ] Export events to CSV
- [ ] Member profile pages
- [ ] Event RSVP system
- [ ] Discord bot commands to add events
- [ ] Automated birthday reminders on website

---

**Last Updated**: January 22, 2026
