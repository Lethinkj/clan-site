# Aura-7F Website V2.0 - Complete Tech Stack & Dependencies

## 📋 Overview

This document outlines the complete technology stack for Version 2.0, including all dependencies, frameworks, libraries, and tools.

---

## 1. CORE TECHNOLOGIES

### Frontend Framework
- **React**: 18.3.1
  - Library for building UIs
  - Component-based architecture
  - Hooks API for state management
  - Server components support (future)

- **TypeScript**: 5.4.0
  - Type safety
  - Better IDE support
  - Self-documenting code
  - Compile-time error detection

- **Vite**: 5.2.0
  - Build tool & dev server
  - Lightning-fast HMR
  - Tree-shaking and code splitting
  - Native ES modules support

### Backend Runtime
- **Node.js**: 18 LTS (minimum)
  - Runtime environment
  - Package management (npm)
  - Event-driven architecture

### Database
- **PostgreSQL**: 16+
  - Relational database
  - Full-text search
  - JSON/JSONB support
  - PostGIS for geo-spatial (optional)

- **Supabase**: Hosted PostgreSQL
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Storage bucket integration

### Caching
- **Redis**: 7+
  - In-memory cache
  - Session storage
  - Rate limiting
  - Real-time message queue

---

## 2. STATE MANAGEMENT & DATA FETCHING

### State Management
- **Zustand**: 4.4.0
  - Lightweight state management
  - Simple API
  - DevTools support
  - <2KB bundle size

### Data Fetching & Caching
- **TanStack Query** (@tanstack/react-query): 5.0.0
  - Server state management
  - Automatic caching & synchronization
  - Background refetching
  - Optimistic updates

Alternative or Complementary:
- **SWR**: 2.2.4
  - Simpler alternative to React Query
  - Lightweight
  - Good for lightweight use cases

---

## 3. ROUTING & NAVIGATION

### Router
- **React Router**: 6.20.2
  - Client-side routing
  - Code splitting support
  - Nested routes
  - Dynamic segments

### URL Management
- **useSearchParams** (built-in)
- **QS library**: For complex query string handling

---

## 4. STYLING & UI

### CSS Framework
- **Tailwind CSS**: 3.4.8
  - Utility-first CSS
  - PurgeCSS integration
  - Dark mode support
  - Responsive design classes

### UI Component Libraries (to evaluate)
- **shadcn/ui**: Headless components
- **Radix UI**: Accessible primitives
- **Headless UI**: Tailwind-compatible components

### CSS-in-JS (for component-scoped styles)
- **Styled Components** or **Emotion**: For dynamic styling
- **CSS Modules**: For scope isolation

### Icons
- **Lucide React**: 0.268.0
  - Icon library
  - 400+ SVG icons
  - Tree-shakeable
  - Consistent naming

- **Tabler Icons React**: 3.36.1
  - Alternative icon library
  - Good for admin dashboards

### Color & Design System
- **Tailwind Color Extensions**: Custom palette
- Consider: **Storybook** for design system documentation

---

## 5. ANIMATIONS & TRANSITIONS

### Animation Libraries
- **Framer Motion**: 12.29.2
  - React animation library
  - Gesture support
  - Layout animations
  - Variants & orchestration

- **GSAP**: 3.14.2
  - High-performance animations
  - Timeline control
  - Plugin ecosystem
  - Complex choreography

- **TailwindCSS Animate**: 1.0.7
  - Tailwind animation utilities
  - Out-of-box animations
  - Lightweight

- **Motion**: 12.29.0
  - Modern animation library
  - Smaller bundle size

### Transition Libraries
- **Headless UI**: For transitions
- **Radix UI**: For primitives with transitions

### 3D Graphics
- **Three.js**: 0.167.1
  - 3D graphics library
  - WebGL rendering
  - Perfect for backgrounds

- **Babylon.js** (alternative): More complete 3D engine

### Particle Effects
- **Postprocessing**: 6.38.2
  - Post-processing effects
  - Bloom, motion blur, etc.

---

## 6. FORMS & VALIDATION

### Form Handling
- **React Hook Form**: 7.50.0
  - Minimal re-renders
  - Excellent performance
  - Flexible validation
  - Built-in error handling

### Validation Schema
- **Zod**: 3.22.4
  - TypeScript-first validation
  - Runtime validation
  - Schema composition
  - Error messages

Alternative:
- **Yup**: More mature, larger bundle size

### Form Builder (for complex forms)
- **React Final Form**: Simpler alternative to Formik
- **Formik** (if needed): Industry standard

---

## 7. AUTHENTICATION & SECURITY

### Authentication
- **Supabase Auth**: Built-in
  - Email/password
  - OAuth integration
  - Session management
  - JWT tokens

### OAuth Providers
- Google OAuth 2.0
- GitHub OAuth 2.0
- Discord OAuth

### Password Hashing (Backend)
- **Bcrypt.js**: 10.0.0
- **Argon2**: More secure alternative

### JWT Handling
- **Jose**: 4.14.4
  - JWT creation & verification
  - JWE support
  - Runtime security

### Rate Limiting
- **express-rate-limit**: 7.0.0
- Redis-based for distributed systems

---

## 8. API & HTTP CLIENT

### HTTP Client
- **Axios**: 1.6.0
  - Promise-based
  - Request/response interceptors
  - Request cancellation
  - CORS support

### API Client Library
- **openapi-fetch**: If using OpenAPI spec

---

## 9. UTILITIES

### Date & Time
- **dayjs**: 1.11.10
  - Lightweight date library
  - 2KB minified
  - Plugin system
  - Great locale support

### Functional Programming
- **lodash-es**: 4.17.21
  - Tree-shakeable utility library
  - Common functions
  - Performance utilities

### Data Transformation
- **Immer**: 10.0.0
  - Immutable updates
  - Draft API
  - Better performance

### Class Utilities
- **classnames**: 2.3.2
  - Conditional CSS classes
- **clsx**: 2.1.1
  - Smaller alternative
- **tailwind-merge**: 3.4.0
  - Merge Tailwind classes

### Number Formatting
- **numeral.js** or **decimal.js** for precise calculations

---

## 10. TESTING

### Testing Framework
- **Vitest**: 0.34.6
  - Vite-native test runner
  - Jest-compatible API
  - Fast execution
  - ESM support

- **Jest**: 29.0.0 (alternative)

### Component Testing
- **React Testing Library**: 14.0.0
  - User-behavior testing
  - Accessible component testing
  - Best practices enforced

### DOM Testing Utilities
- **@testing-library/jest-dom**: 6.1.5
  - Custom matchers
  - DOM assertions

### E2E Testing
- **Playwright**: 1.40.0
  - Cross-browser testing
  - Visual regression
  - Performance testing

- **Cypress** (alternative): Better DX, slower

### Mock Data & MSW
- **MSW** (Mock Service Worker): 1.3.2
  - Network mocking
  - Intercept API calls
  - Works in browser & Node

### Visual Regression Testing
- **Chromatic**: For Storybook
- **Percy**: Visual regression service

---

## 11. BUILD & BUNDLING

### Build Tool
- **Vite**: 5.2.0 (already listed)

### Build Optimization
- **vite-plugin-compression**: Gzip/Brotli compression
- **@vitejs/plugin-react**: React Fast Refresh

### Bundle Analysis
- **@bundle-stats/html**: Bundle analysis
- **vite-plugin-visualizer**: Bundle visualization

---

## 12. CODE QUALITY

### Linting
- **ESLint**: 8.54.0
  - JavaScript linting
  - Error detection
  - Style enforcement

### Formatting
- **Prettier**: 3.1.1
  - Code formatter
  - Consistent style
  - Opinionated

### Type Checking
- **TypeScript**: 5.4.0 (already listed)

### Commit Messages
- **Husky**: 8.0.3
  - Git hooks
  - Pre-commit linting

### Pre-commit Linting
- **lint-staged**: 15.2.0
  - Lint staged files
  - Performance optimization

---

## 13. MONITORING & ERROR TRACKING

### Error Tracking
- **Sentry**: SaaS service
  - Error aggregation
  - Session replay
  - Performance monitoring

### Analytics
- **Mixpanel**: SaaS service
  - User event tracking
  - Funnel analysis
  - Cohort analysis

- **Google Analytics 4**: GA4 alternative
- **Plausible**: Privacy-focused analytics

### Performance Monitoring
- **Web Vitals**: 3.5.0
  - Core Web Vitals
  - Field data collection

### Monitoring Infrastructure
- **Prometheus**: Metrics collection
- **Grafana**: Visualization
- **New Relic**: Full monitoring platform

---

## 14. PAYMENTS & MONETIZATION

### Payment Processing
- **Stripe SDK**: For payment handling
  - Payment forms
  - Subscription management
  - Invoice generation

### Billing
- **Stripe API** (Node.js SDK)
  - Server-side operations

---

## 15. EMAIL

### Email Service
- **SendGrid**: Transactional emails
  - Templating
  - Tracking

Alternative:
- **Mailgun**
- **AWS SES**

### Email Client (Node.js)
- **@sendgrid/mail**: 7.7.0

---

## 16. FILE STORAGE & CDN

### Storage
- **Supabase Storage**: Built-in
  - File uploads
  - Image resizing
  - CDN integration

### Image Optimization
- **Sharp**: 0.32.6
  - Image processing
  - Resize, crop, compress
  - Multiple formats

### CDN
- **Cloudflare**: CDN & DDoS protection
- **Vercel Edge**: Integrated with hosting

---

## 17. DEVELOPMENT TOOLS

### package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext ts,tsx",
    "format": "prettier --write .",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "analyze": "vite build --analyze"
  }
}
```

### Version Control
- **Git**: Distributed version control
- **GitHub**: Repository hosting
- **GitHub Actions**: CI/CD

### Documentation
- **Storybook**: 7.0.0+
  - Component documentation
  - Interactive demos
  - Accessibility testing

---

## 18. DOCKER & CONTAINERIZATION

### Container Runtime
- **Docker**: 20.10+
  - Application containerization
  - Multi-stage builds

### Orchestration
- **Docker Compose**: Local development
- **Kubernetes** (optional): Production scaling

---

## 19. DEPLOYMENT & HOSTING

### Frontend Hosting
- **Vercel**: Optimized for Next.js/React
  - Git integration
  - Automatic deployments
  - Edge functions

- **Netlify**: Alternative
- **AWS S3 + CloudFront**: DIY CDN

### Backend Hosting
- **Render**
- **Railway**
- **Heroku** (legacy)
- **AWS EC2/ECS**
- **Google Cloud Run**

### Database
- **Supabase**: PostgreSQL managed service

---

## 20. OPTIONAL/ADVANCED TECHNOLOGIES

### Full-text Search
- **Elasticsearch**: Distributed search
- **Meilisearch**: Simple, fast search
- **PostgreSQL Full-text Search**: Built-in

### Real-time Communication
- **WebSockets** (built into Supabase Realtime)
- **Socket.IO**: If additional features needed

### Message Queue
- **Bull**: Redis-based job queue
- **AWS SQS**, **RabbitMQ**: Enterprise options

### Server-side Rendering (if needed)
- **Next.js**: React SSR framework
- **Remix**: Alternative full-stack framework

### Headless CMS (if needed)
- **Contentful**
- **Sanity**
- **Strapi**

### Static Site Generator
- Probably not needed for this SPA

---

## 21. SECURITY LIBRARIES

### CORS Handling
- **cors**: 2.8.5 (backend)

### Helmet Security
- **helmet**: 7.1.0
  - HTTP headers security
  - XSS protection
  - CSRF protection

### Sanitization
- **DOMPurify**: 3.0.6
  - XSS prevention
  - HTML sanitization

- **bleach** (Python backend)

### Encryption
- **tweetnacl.js**: Cryptography
- **libsodium**: If serious crypto needed

---

## 22. RECOMMENDED PACKAGE.JSON STRUCTURE

### Development Dependencies
```json
{
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.3.27",
    "@types/react-dom": "^18.2.11",
    "@vitejs/plugin-react": "^4.7.0",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.0.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^8.54.0",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0",
    "postcss": "^8.5.0",
    "prettier": "^3.1.1",
    "tailwindcss": "^3.4.8",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "vitest": "^0.34.6"
  }
}
```

### Production Dependencies
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.91.0",
    "@tabler/icons-react": "^3.36.1",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "dayjs": "^1.11.10",
    "framer-motion": "^12.29.2",
    "gsap": "^3.14.2",
    "lodash-es": "^4.17.21",
    "react": "^18.3.1",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.50.0",
    "react-router-dom": "^6.20.2",
    "tailwind-merge": "^3.4.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.22.4",
    "zustand": "^4.4.0"
  }
}
```

---

## 23. DEPENDENCY MANAGEMENT

### Version Strategy
- **Patch**: Bug fixes (e.g., 1.0.1)
- **Minor**: New features (e.g., 1.1.0)
- **Major**: Breaking changes (e.g., 2.0.0)

### npm Version Specifiers
```json
{
  "dependencies": {
    "package": "1.0.0",           // Exact
    "package": "^1.0.0",          // Up to 2.0.0
    "package": "~1.0.0",          // Up to 1.1.0
    "package": ">=1.0.0 <2.0.0"  // Range
  }
}
```

### Updating Dependencies
```bash
npm outdated                # Check outdated packages
npm update                  # Update to latest in range
npm upgrade                 # Force latest versions
npx npm-check-updates -u    # Interactive upgrade
```

### Dependency Auditing
```bash
npm audit                   # Check security issues
npm audit fix               # Auto-fix vulnerabilities
npm audit fix --audit-level=moderate
```

---

## 24. INSTALLATION COMMANDS

### Initial Setup
```bash
# Clone repository
git clone <repo>
cd aura7f-site

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your values

# Start development
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Type Checking
```bash
npm run type-check
```

### Linting & Formatting
```bash
npm run lint
npm run format
```

### Testing
```bash
npm run test
npm run test:coverage
npm run e2e
```

---

## 25. DISK SPACE REQUIREMENTS

| Component | Size |
|-----------|------|
| node_modules | ~800MB |
| Build output (dist) | ~2-3MB |
| TypeScript cache | ~100MB |
| Test coverage | ~50MB |
| **Total** | **~1GB** |

---

## 26. SECURITY CONSIDERATIONS

### Dependencies to Monitor
- Check weekly for security updates
- Subscribe to security advisories
- Regular npm audit
- Consider dependency pinning for production

### Safe Practices
- Use exact versions in production
- Test updates in staging first
- Review changelog before major updates
- Keep Node.js updated
- Use npm ci instead of npm install in CI/CD

---

## 27. PERFORMANCE METRICS

### Bundle Size Targets
- Main bundle: < 300KB (gzipped)
- Vendor bundle: < 200KB (gzipped)
- Total JavaScript: < 500KB (gzipped)

### Runtime Performance
- First Contentful Paint (FCP): < 2s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

---

## NEXT STEPS

1. Review and select optional dependencies
2. Set up development environment
3. Configure CI/CD pipeline
4. Document custom configurations
5. Create architecture decision records (ADRs)

---

**Last Updated**: May 8, 2026
**Version**: 2.0.0
