# 🚀 Quick Start Checklist

Complete these steps to get your dynamic event management system live!

## ☑️ Pre-Deployment Checklist

### 1. Database Setup
```bash
□ Open Supabase Dashboard: https://kxolautvyktglktnnvdl.supabase.co
□ Go to SQL Editor
□ Copy content from database-schema.sql
□ Run the SQL script
□ Verify tables created: events, moderators
□ (Optional) Run migrate-events.sql to import existing 4 events
```

### 2. Configure Admin User
```bash
□ Get Captain Bash's Discord User ID
  - Enable Developer Mode in Discord
  - Right-click profile → Copy User ID
□ Open: src/lib/supabase.ts
□ Find line: export const ADMIN_DISCORD_ID = 'captainbash'
□ Replace 'captainbash' with actual Discord ID
□ Save file
```

### 3. Local Testing
```bash
□ Terminal: npm run dev
□ Open: http://localhost:3000/login
□ Login with Captain Bash's Discord ID + username
□ Test: Add a new event
□ Test: Add a new member
□ Visit: http://localhost:3000/events
□ Verify: Events display correctly
□ Verify: Stats calculate automatically
```

### 4. Deploy to Vercel
```bash
□ Push code to GitHub
  git add .
  git commit -m "Add dynamic event management system"
  git push

□ Go to: https://vercel.com
□ Import your GitHub repository
□ Add Environment Variables:
  - VITE_SUPABASE_URL = https://kxolautvyktglktnnvdl.supabase.co
  - VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
□ Deploy!
□ Wait for deployment to complete
□ Visit your site
```

### 5. Post-Deployment Testing
```bash
□ Visit: yoursite.com/login
□ Login as admin
□ Add a test event
□ Visit: yoursite.com/events
□ Verify event appears
□ Delete test event
□ Add moderators if needed
```

---

## 📋 Files to Review Before Deploying

### Critical Files (MUST configure)
- [ ] `src/lib/supabase.ts` - Update ADMIN_DISCORD_ID
- [ ] `.env` - Verify Supabase credentials (already done ✅)

### Optional Files (for reference)
- [ ] `SETUP_GUIDE.md` - Detailed setup instructions
- [ ] `ADMIN_GUIDE.md` - How to use admin dashboard
- [ ] `IMPLEMENTATION_SUMMARY.md` - What was built

### Database Files
- [ ] `database-schema.sql` - Run in Supabase
- [ ] `migrate-events.sql` - Optional: Import existing events

---

## 🎯 Quick Test Plan

### Test 1: Admin Login ✅
1. Go to `/login`
2. Enter Discord ID: `[Captain Bash's ID]`
3. Enter username: `captainbash`
4. Should redirect to `/admin` dashboard

### Test 2: Add Event ✅
1. In Admin Dashboard → Events tab
2. Fill form with test event
3. Click "Add Event"
4. Should see success message
5. Event should appear in list below

### Test 3: Public View ✅
1. Go to `/events` (public page)
2. Should see the event you just added
3. Stats should update automatically

### Test 4: Add Member ✅
1. In Admin Dashboard → Members tab
2. Fill form with test member
3. Add birthday (DD/MM format)
4. Click "Add Member"
5. Should see member in list

### Test 5: Add Moderator ✅
1. In Admin Dashboard → Moderators tab
2. Enter Discord ID + username
3. Click "Add Moderator"
4. Should see moderator in list
5. Test: Login as that moderator (should work)

---

## 🔧 Troubleshooting Quick Fixes

### Problem: Can't login
**Solution**: 
1. Check Discord ID is correct (18-digit number)
2. Check `ADMIN_DISCORD_ID` in supabase.ts
3. Clear browser cache

### Problem: Events not showing
**Solution**:
1. Check browser console for errors
2. Verify `.env` file exists
3. Check Supabase dashboard for data
4. Verify RLS policies are set

### Problem: Can't add events
**Solution**:
1. Check if logged in as admin/moderator
2. Check browser console for errors
3. Verify all required fields are filled
4. Check Supabase dashboard for table structure

### Problem: Stats showing 0
**Solution**:
1. Verify events exist in database
2. Check events have numeric attendees
3. Refresh the page
4. Check browser console

---

## 📞 Support Resources

1. **Setup Questions**: Read `SETUP_GUIDE.md`
2. **Usage Questions**: Read `ADMIN_GUIDE.md`
3. **Technical Details**: Read `IMPLEMENTATION_SUMMARY.md`
4. **Database Issues**: Check Supabase Dashboard
5. **Code Issues**: Check browser console

---

## ✨ One-Minute Deploy (After Setup)

If everything is configured:

```bash
# Push to GitHub
git add .
git commit -m "Deploy clan site"
git push

# Vercel will auto-deploy!
```

That's it! Your site is live. 🎉

---

## 🎉 Success Criteria

You know everything is working when:

✅ Can login at `/login` with Discord ID  
✅ Admin dashboard shows at `/admin`  
✅ Can add/edit events in dashboard  
✅ Events show on `/events` page  
✅ Stats calculate automatically  
✅ Can add members with birthdays  
✅ Can add/remove moderators  
✅ Site is live on Vercel  

---

**Estimated Time**: 15-20 minutes total  
**Difficulty**: Easy 🟢  
**Required**: Supabase account, Discord ID, GitHub repo  

---

Ready to go live? Start with step 1! 🚀
