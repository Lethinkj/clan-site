# Discord Login Setup Guide

## Overview
This guide will help you set up Discord OAuth2 authentication for the Aura7F website. The implementation allows users to login with their Discord credentials without needing a database initially.

## Step 1: Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Enter an application name (e.g., "AURA-7F Guild")
4. Agree to terms and click "Create"

## Step 2: Get Your Credentials

### Client ID & Client Secret
1. In your application, go to the **OAuth2** tab
2. Click "General" from the left menu
3. Copy your **Client ID** - paste this in `.env` as `VITE_DISCORD_CLIENT_ID`
4. Click "Reset Secret" under CLIENT SECRET
5. Copy the secret - paste this in `.env` as `VITE_DISCORD_CLIENT_SECRET`

⚠️ **IMPORTANT**: Keep your Client Secret private! Never commit it to git or share it publicly.

### Redirect URI
1. Still in OAuth2 > General
2. Scroll to "Redirects"
3. Click "Add Redirect" 
4. Add these URIs:
   - **Development**: `http://localhost:3000/login`
   - **Production**: `https://yourdomain.com/login`
5. Save Changes

## Step 3: Configure Scopes

1. Go to OAuth2 > Advanced
2. Make sure these scopes are enabled (should be by default):
   - `identify` - Get user's Discord ID and username
   - `email` - Get user's email address

## Step 4: Update Environment Variables

Create or update your `.env` file in the project root:

```env
# Discord OAuth2 Configuration
VITE_DISCORD_CLIENT_ID=your_actual_client_id_here
VITE_DISCORD_CLIENT_SECRET=your_actual_client_secret_here
VITE_DISCORD_REDIRECT_URI=http://localhost:3000/login
```

### For Production
Update redirect URI when deploying:
```env
VITE_DISCORD_REDIRECT_URI=https://aura7f.com/login
```

## Step 5: Test the Implementation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Click "Login with Discord" button

4. You'll be redirected to Discord's login page

5. Enter your Discord credentials:
   - **Username** or email
   - **Password**

6. If credentials are correct, Discord redirects you back to the app with user data

7. User data is stored in `sessionStorage` and `localStorage`:
   - **sessionStorage**: User info (ID, username, email, avatar)
   - **localStorage**: Discord access token

## How It Works (Without Database)

### Step 1: User Initiates Login
- User clicks "Login with Discord" button
- App redirects to Discord's OAuth authorization page

### Step 2: Discord Authenticates
- User enters Discord credentials
- Discord verifies username and password
- If valid, Discord returns an authorization code

### Step 3: Exchange Code for Token
- Backend exchanges authorization code for access token
- Access token is used to fetch user information

### Step 4: Validate User
- User data is validated (username, ID, account status)
- Invalid accounts are rejected (bots, system accounts, etc.)

### Step 5: Store User Data
```javascript
{
  id: "12345678",
  username: "YourDiscordName",
  email: "email@example.com",
  avatar: "avatar_hash",
  discriminator: "0001",
  verified: true,
  mfa_enabled: false,
  loginTime: "2024-01-15T10:30:00Z"
}
```

### Step 6: Redirect to App
- User is redirected to `/admin` (or wherever you choose)
- SessionStorage contains user data
- User remains logged in for the session

## Security Features Implemented

✅ **Username Validation**
- Minimum 2 characters
- Rejects bot accounts and system accounts

✅ **Account Verification**
- Checks for valid Discord account status
- Validates MFA settings

✅ **Token Management**
- Access token stored securely in localStorage
- Session data in sessionStorage (cleared on browser close)

✅ **Error Handling**
- Clear error messages for failed authentications
- Prevents invalid users from accessing the app

## Future Enhancements

When ready to integrate with database, you can:

1. **Store User Data**
   ```sql
   CREATE TABLE discord_users (
     id VARCHAR PRIMARY KEY,
     username VARCHAR NOT NULL,
     email VARCHAR,
     avatar_url VARCHAR,
     access_token VARCHAR,
     last_login TIMESTAMP,
     created_at TIMESTAMP
   )
   ```

2. **Link to Existing Users**
   - Match Discord email with existing members
   - Create new member profiles automatically

3. **Permissions & Roles**
   - Store Discord user role in database
   - Control access based on Discord roles

4. **Persistent Sessions**
   - Use database instead of sessionStorage
   - Implement session management
   - Add "Remember Me" functionality

## Troubleshooting

### "Discord configuration missing" Error
- Check that `VITE_DISCORD_CLIENT_ID` and `VITE_DISCORD_REDIRECT_URI` are in `.env`
- Restart the dev server after adding env variables

### "Failed to get Discord user info" Error
- Verify your Client Secret is correct in `.env`
- Check that redirect URI matches exactly in Discord Developer Portal

### User Can't Login
- Verify Discord username and password are correct
- Check that the Discord account is verified
- Ensure the Discord account has email verified (may be required)

### "Invalid Redirect URI" Error
- The redirect URI must match exactly in Discord Developer Portal
- Check for trailing slashes, protocols (http vs https)
- Common mistake: forgetting the port number for localhost

## Files Modified/Created

- **[src/pages/Login.tsx](../src/pages/Login.tsx)** - Added Discord login UI and handlers
- **[src/lib/discord.ts](../src/lib/discord.ts)** - Discord authentication utilities
- **.env.example** - Template for environment variables

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_DISCORD_CLIENT_ID` | Your Discord app ID | `1234567890` |
| `VITE_DISCORD_CLIENT_SECRET` | Your Discord app secret | `abc123xyz...` |
| `VITE_DISCORD_REDIRECT_URI` | Where Discord redirects after auth | `http://localhost:3000/login` |

---

**Status**: ✅ Discord OAuth2 authentication is implemented and ready to use without a database.
