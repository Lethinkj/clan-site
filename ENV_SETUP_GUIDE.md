# Environment Variables Complete Reference & Setup Guide

## Overview
This guide explains every environment variable used in Aura-7F Website Version 2.0, how to configure them, and what they do.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Variable Categories](#variable-categories)
3. [Development Setup](#development-setup)
4. [Staging Setup](#staging-setup)
5. [Production Setup](#production-setup)
6. [Feature Flags](#feature-flags)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start

### For Local Development
```bash
cp .env.local.example .env.local
# Edit .env.local with your local development values
npm run dev
```

### For Staging Deployment
```bash
# Deploy with staging environment
vercel deploy --env staging
```

### For Production Deployment
```bash
# Deploy with production environment
vercel deploy --prod --env production
```

---

## Variable Categories

### 🔐 SUPABASE Configuration

**`VITE_SUPABASE_URL`**
- **Type**: URL
- **Required**: Yes
- **Format**: `https://[project-id].supabase.co`
- **Description**: Your Supabase project URL
- **Where to find**: Supabase Dashboard → Settings → API
- **Development**: `http://localhost:54321` (local Supabase)
- **Staging**: Your staging Supabase project URL
- **Production**: Your production Supabase project URL

**`VITE_SUPABASE_ANON_KEY`**
- **Type**: JWT Token
- **Required**: Yes
- **Format**: Long JWT token starting with `eyJ...`
- **Description**: Anonymous/public API key for client-side requests
- **Security**: Safe to expose in browser code
- **Where to find**: Supabase Dashboard → Settings → API → Project API keys
- **Development**: Copy from local Supabase instance
- **Rotation**: Rotate quarterly or on key compromise

**`VITE_SUPABASE_SERVICE_KEY`**
- **Type**: JWT Token
- **Required**: No (server-side use only)
- **Format**: Long JWT token starting with `eyJ...`
- **Description**: Service role key with full database access
- **Security**: ⚠️ KEEP SECRET - Never expose in browser
- **Where to find**: Supabase Dashboard → Settings → API → Service role key
- **Usage**: Backend functions, migrations, admin operations
- **Note**: Only store in `.env.local` (not in .env files committed to git)

---

### 🌐 API Configuration

**`VITE_API_URL`**
- **Type**: URL
- **Required**: Yes
- **Format**: Full URL with protocol and path
- **Description**: Base URL for backend API calls
- **Values by environment**:
  - Development: `http://localhost:3000/api`
  - Staging: `https://api-staging.aura7f.com`
  - Production: `https://api.aura7f.com`
- **Usage**: All API client requests are prefixed with this URL
- **Example**: `const response = await fetch(`${VITE_API_URL}/events`)`

**`VITE_API_TIMEOUT`**
- **Type**: Number (milliseconds)
- **Required**: No
- **Default**: `30000` (30 seconds)
- **Description**: Request timeout for API calls
- **Recommended values**:
  - Development: 30000 (allow for debugging pauses)
  - Staging: 30000
  - Production: 30000
- **Usage**: Prevents hanging requests, triggers error handling

---

### 🏢 Environment Configuration

**`VITE_ENVIRONMENT`**
- **Type**: String
- **Required**: Yes
- **Allowed values**: `development`, `staging`, `production`
- **Description**: Current environment identifier
- **Usage**: Conditional feature loading, styling, behavior
- **Example**:
  ```typescript
  if (import.meta.env.VITE_ENVIRONMENT === 'production') {
    enableErrorTracking()
  }
  ```

**`VITE_LOG_LEVEL`**
- **Type**: String
- **Required**: No
- **Allowed values**: `debug`, `info`, `warn`, `error`
- **Description**: Minimum log level to output
- **Values by environment**:
  - Development: `debug` (verbose logging)
  - Staging: `info` (important events only)
  - Production: `error` (errors only)
- **Usage**: Filters console output and logs
- **Example**:
  ```typescript
  if (['debug', 'info'].includes(LOG_LEVEL)) {
    console.log('Analytics event:', event)
  }
  ```

**`VITE_ENABLE_DEVTOOLS`**
- **Type**: Boolean
- **Required**: No
- **Allowed values**: `true`, `false`
- **Description**: Enables development tools and debugging
- **Values by environment**:
  - Development: `true`
  - Staging: `false`
  - Production: `false`
- **Usage**: Redux DevTools, React Query profiler, error logging verbosity

**`VITE_ENABLE_MOCK_DATA`**
- **Type**: Boolean
- **Required**: No
- **Allowed values**: `true`, `false`
- **Description**: Use mock data instead of real API calls
- **Usage**: Offline development, testing without backend
- **Example**: Useful when Supabase is down or for demo purposes

---

### 🔐 Authentication Configuration

**`VITE_OAUTH_GOOGLE_CLIENT_ID`**
- **Type**: String (OAuth Client ID)
- **Required**: For OAuth auth flow
- **Format**: Long alphanumeric string with dots
- **Description**: Google OAuth 2.0 client ID
- **Where to find**: Google Cloud Console → Credentials → OAuth 2.0 Client IDs
- **Setup**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com)
  2. Create OAuth 2.0 credentials
  3. Add redirect URIs:
     - Dev: `http://localhost:3000/auth/callback/google`
     - Staging: `https://staging.aura7f.com/auth/callback/google`
     - Prod: `https://aura7f.com/auth/callback/google`

**`VITE_OAUTH_GITHUB_CLIENT_ID`**
- **Type**: String (OAuth Client ID)
- **Required**: For OAuth auth flow
- **Description**: GitHub OAuth 2.0 client ID
- **Where to find**: GitHub Settings → Developer settings → OAuth Apps
- **Setup**: Similar to Google OAuth

**`VITE_OAUTH_DISCORD_CLIENT_ID`**
- **Type**: String (OAuth Client ID)
- **Required**: For Discord auth
- **Where to find**: Discord Developer Portal → Applications → OAuth2
- **Description**: Discord bot client ID for OAuth

**`VITE_SESSION_TIMEOUT`**
- **Type**: Number (milliseconds)
- **Required**: No
- **Default**: `3600000` (1 hour)
- **Description**: Session expiration time
- **Usage**: Auto-logout after inactivity
- **Recommended**:
  - Development: 3600000 (1 hour)
  - Staging: 1800000 (30 minutes)
  - Production: 1800000 (30 minutes)

---

### ✨ Feature Flags

**`VITE_ENABLE_REALTIME`**
- **Type**: Boolean
- **Required**: No
- **Description**: Enable Supabase real-time features
- **Components**: Live notifications, presence, real-time leaderboard
- **Default**: `true` (all environments)

**`VITE_ENABLE_OFFLINE_MODE`**
- **Type**: Boolean
- **Required**: No
- **Description**: Enable offline functionality with Service Worker
- **Default**: `false` (dev/staging), `true` (production)
- **Usage**: PWA offline support, cached data

**`VITE_ENABLE_PWA`**
- **Type**: Boolean
- **Required**: No
- **Description**: Progressive Web App features
- **Default**: `false` (dev), `true` (staging/production)
- **Includes**: Install prompt, offline pages, push notifications

**`VITE_ENABLE_ANALYTICS`**
- **Type**: Boolean
- **Required**: No
- **Description**: Enable user analytics tracking
- **Default**: `false` (development), `true` (staging/production)
- **Services**: Mixpanel, GA4, Sentry tracking

---

### 💳 External Services

**`VITE_STRIPE_PUBLIC_KEY`**
- **Type**: String (Stripe Public Key)
- **Required**: For payments
- **Format**: Starts with `pk_test_` (test) or `pk_live_` (production)
- **Where to find**: Stripe Dashboard → Developers → API keys
- **Usage**: Stripe.js for payment forms
- **Security**: Safe to expose (public key)
- **Test keys**:
  - Publishable: `pk_test_51...`
  - Test card: `4242 4242 4242 4242`

**`VITE_SENDGRID_API_KEY`**
- **Type**: String (SendGrid API Key)
- **Required**: For email sending
- **Where to find**: SendGrid Dashboard → Settings → API Keys
- **Usage**: Transactional emails (password reset, confirmations)
- **Security**: ⚠️ KEEP SECRET - Store only in backend env

**`VITE_SENTRY_DSN`**
- **Type**: URL (Sentry DSN)
- **Required**: For error tracking
- **Format**: `https://key@sentry.io/projectid`
- **Where to find**: Sentry Dashboard → Settings → Client Keys (DSN)
- **Usage**: Error and exception tracking
- **Default**: Empty string (disabled)

---

### 📊 Monitoring & Analytics

**`VITE_ENABLE_ERROR_TRACKING`**
- **Type**: Boolean
- **Required**: No
- **Description**: Enable Sentry error tracking
- **Default**: `false` (dev), `true` (staging/production)
- **Requires**: `VITE_SENTRY_DSN` to be configured

**`VITE_ENABLE_PERFORMANCE_MONITORING`**
- **Type**: Boolean
- **Required**: No
- **Description**: Enable performance monitoring (Core Web Vitals)
- **Default**: `false` (dev), `true` (staging/production)
- **Tracks**: LCP, FID, CLS, FCP, TTFB

**`VITE_MIXPANEL_TOKEN`**
- **Type**: String (Mixpanel Project Token)
- **Required**: For analytics
- **Where to find**: Mixpanel → Project settings → Project tokens
- **Usage**: User behavior analytics, event tracking
- **Default**: Empty string (disabled)

---

### 🔨 Build Configuration

**`VITE_BUILD_ANALYZE`**
- **Type**: Boolean
- **Required**: No
- **Description**: Generate bundle analysis report
- **Usage**: `npm run build -- --analyze`
- **Output**: `dist/stats.html` with bundle size breakdown

**`VITE_BUILD_TARGET`**
- **Type**: String (ECMAScript version)
- **Required**: No
- **Allowed values**: `es2015`, `es2020`, `es2021`, `esnext`
- **Default**: `es2020`
- **Recommendation**: Keep as `es2020` for modern browser support

---

### 🎯 Feature Flags (V2.0 New Features)

**`VITE_FF_PREMIUM_TIERS`**
- **Type**: Boolean
- **Description**: Enable subscription/premium tier system
- **Default**: `false` (development), `true` (production)

**`VITE_FF_MESSAGING`**
- **Type**: Boolean
- **Description**: Enable direct messaging between members
- **Default**: `false` (development), `true` (staging/production)

**`VITE_FF_BLOG`**
- **Type**: Boolean
- **Description**: Enable blog/articles system
- **Default**: `false` (development), `true` (staging/production)

**`VITE_FF_ANALYTICS`**
- **Type**: Boolean
- **Description**: Enable analytics dashboard
- **Default**: `false` (development), `true` (staging/production)

---

### 🚀 Deployment Configuration

**`VITE_DEPLOYMENT_URL`**
- **Type**: URL
- **Required**: No
- **Description**: Public URL of deployed site
- **Values**:
  - Development: `http://localhost:3000`
  - Staging: `https://staging.aura7f.com`
  - Production: `https://aura7f.com`
- **Usage**: Social sharing, email links, redirects

**`VITE_DEPLOYMENT_REGION`**
- **Type**: String
- **Description**: Deployment region for geo-optimization
- **Values**: `us-east-1`, `eu-west-1`, `ap-southeast-1`, etc.
- **Default**: `us-east-1`

---

### 🔒 Security & HTTPS

**`VITE_CONTENT_SECURITY_POLICY`**
- **Type**: Boolean
- **Required**: No (production only)
- **Description**: Enable Content Security Policy headers
- **Default**: `false` (dev/staging), `true` (production)

**`VITE_ENABLE_HTTPS_ONLY`**
- **Type**: Boolean
- **Required**: No
- **Description**: Redirect all HTTP to HTTPS
- **Default**: `false` (dev), `true` (production)

**`VITE_ENABLE_CORS_PROTECTION`**
- **Type**: Boolean
- **Required**: No
- **Description**: Enforce CORS for API requests
- **Default**: `false` (dev), `true` (production)

---

## Development Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/aura7f-site.git
cd aura7f-site
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Local Supabase (Optional)
```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Initialize local Supabase
supabase start

# This will give you local credentials to use in .env.local
```

### Step 4: Create .env.local
```bash
cp .env.local.example .env.local
# Edit file with your local values
```

### Step 5: Generate Local OAuth Keys (Optional)
For testing OAuth locally:
```bash
# Use localhost tunneling service (ngrok, localtunnel)
ngrok http 3000
# Then register OAuth apps with the tunneled URL
```

### Step 6: Start Development Server
```bash
npm run dev
# Site runs at http://localhost:3000
```

---

## Staging Setup

### Prerequisites
- Staging Supabase project created
- Staging domain configured (staging.aura7f.com)
- OAuth apps registered with staging domain
- Staging payment keys from Stripe obtained

### Step 1: Create .env.staging
```bash
cp .env.staging.example .env.staging
# Update all placeholders with staging values
```

### Step 2: Configure secrets in Vercel
```bash
# Via Vercel CLI
vercel env add VITE_SUPABASE_URL staging
vercel env add VITE_SUPABASE_ANON_KEY staging
# ... for all environment variables

# Or via Vercel Dashboard
# Project Settings → Environment Variables → Add staging values
```

### Step 3: Deploy to Staging
```bash
# Via Vercel CLI
vercel deploy --env staging

# Or push to staging branch
git push origin develop
# (if configured to auto-deploy)
```

### Step 4: Verify Deployment
```bash
# Check staging site
open https://staging.aura7f.com

# Verify environment variables
# Check browser console for no errors
# Test features (login, create event, etc.)
```

---

## Production Setup

### ⚠️ Security Checklist
- [ ] All secrets rotated from staging
- [ ] HTTPS enforced
- [ ] CORS whitelist configured
- [ ] CSP headers configured
- [ ] Database backups enabled
- [ ] Monitoring & alerting enabled
- [ ] Error tracking enabled
- [ ] Rate limiting configured
- [ ] WAF/DDoS protection enabled
- [ ] SSL certificate valid

### Step 1: Create .env.production
```bash
cp .env.production.example .env.production
# Update all placeholders with production values
# ⚠️ Use real (pk_live_) Stripe keys
# ⚠️ Use production Supabase project
```

### Step 2: Verify Secrets
```bash
# Never commit .env.production to git
echo ".env.production" >> .gitignore
```

### Step 3: Configure Vercel Secrets
```bash
# All values should be in Vercel Project Settings
# Never paste secrets in terminal commands!
vercel env add (use UI instead)
```

### Step 4: Pre-deployment Testing
```bash
# Run full test suite
npm run test:all

# Run production build locally
npm run build:production
npm run preview:production

# Performance check
npm run lighthouse

# Security check
npm run security:audit
```

### Step 5: Deploy to Production
```bash
# Create release tag
git tag v2.0.0
git push origin v2.0.0

# Deploy via CI/CD (automated on tag push)
# Or manual:
vercel deploy --prod

# Verify production
open https://aura7f.com
```

### Step 6: Post-Deployment
```bash
# Monitor error tracking (Sentry)
# Monitor analytics (Mixpanel)
# Check Core Web Vitals
# Test payment flow
# Verify email sending
```

---

## Feature Flags

### Using Feature Flags in Code

```typescript
// Check if feature is enabled
const isPremiumEnabled = import.meta.env.VITE_FF_PREMIUM_TIERS === 'true'

if (isPremiumEnabled) {
  // Show premium features
  return <PremiumTierSelector />
}

// Or use custom hook
const { isPremiumEnabled, isMessagingEnabled } = useFeatureFlags()

// Or create a wrapper component
<FeatureFlagWrapper flag="VITE_FF_BLOG">
  <BlogSection />
</FeatureFlagWrapper>
```

### Rollout Strategy

1. **Develop**: All feature flags = `false`
2. **Staging**: Test flags = `true`, production flags = check
3. **Production**: Gradually enable based on testing

### Disabling Features in Production

If a feature needs to be disabled urgently:
```bash
# Update Vercel environment variable
vercel env add VITE_FF_FEATURE_NAME false

# Or use feature flag service (recommended for large-scale)
# Integrations: LaunchDarkly, Statsig, Split.io
```

---

## Troubleshooting

### Issue: "Missing Supabase environment variables"
```
❌ Error: Missing Supabase environment variables

Solution:
1. Check .env.local exists in project root
2. Verify VITE_SUPABASE_URL is set
3. Verify VITE_SUPABASE_ANON_KEY is set
4. npm run dev (should work now)
```

### Issue: API Requests Failing
```
❌ POST /api/events 404 Not Found

Solutions:
1. Check VITE_API_URL is correct for your environment
2. Check API server is running (for development)
3. Check CORS settings in API
4. Verify API endpoints exist
5. Check network tab in DevTools
```

### Issue: OAuth Login Not Working
```
❌ Error: Redirect URI mismatch

Solutions:
1. Check OAuth Client ID is correct for environment
2. Verify redirect URIs in OAuth provider match your domain
3. For local testing, use ngrok tunnel
4. Clear browser cookies and try again
```

### Issue: Emails Not Sending
```
❌ Email not received

Solutions:
1. Check VITE_SENDGRID_API_KEY is set (backend only)
2. Verify SendGrid API key is valid
3. Check email is not in spam
4. Verify email template exists in SendGrid
5. Check Sentry error logs
```

### Issue: High Bundle Size
```
❌ Bundle size exceeds 500KB

Solutions:
1. Run: npm run build:analyze
2. Identify large dependencies
3. Consider code splitting
4. Tree-shake unused code
5. Lazy load heavy components
```

### Issue: Poor Performance
```
❌ Lighthouse score below 90

Solutions:
1. Check Core Web Vitals in Sentry
2. Profile in DevTools Performance tab
3. Optimize images with Sharp
4. Implement caching headers
5. Enable gzip compression
```

---

## Environment Variables Checklist

### Development
- [ ] VITE_SUPABASE_URL (local)
- [ ] VITE_SUPABASE_ANON_KEY (local)
- [ ] VITE_API_URL (localhost)
- [ ] VITE_ENVIRONMENT=development
- [ ] VITE_ENABLE_DEVTOOLS=true

### Staging
- [ ] All development variables
- [ ] VITE_SUPABASE_URL (staging)
- [ ] VITE_SUPABASE_ANON_KEY (staging)
- [ ] VITE_API_URL (staging)
- [ ] VITE_OAUTH_*_CLIENT_ID (staging)
- [ ] VITE_SENTRY_DSN (staging)
- [ ] VITE_STRIPE_PUBLIC_KEY (test key)

### Production
- [ ] All staging variables
- [ ] VITE_SUPABASE_URL (production)
- [ ] VITE_SUPABASE_ANON_KEY (production)
- [ ] VITE_API_URL (production)
- [ ] VITE_OAUTH_*_CLIENT_ID (production)
- [ ] VITE_SENTRY_DSN (production)
- [ ] VITE_STRIPE_PUBLIC_KEY (live key) ⚠️
- [ ] VITE_ENABLE_HTTPS_ONLY=true
- [ ] VITE_ENABLE_CORS_PROTECTION=true

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Environment Variables Guide**: https://vitejs.dev/guide/env-and-mode.html
- **12-Factor App**: https://12factor.net/config
- **Security Best Practices**: https://owasp.org/

---

**Last Updated**: May 8, 2026
**Version**: 2.0.0
