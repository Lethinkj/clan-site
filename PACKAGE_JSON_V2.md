# Updated package.json for Aura-7F Website V2.0

```json
{
  "name": "aura-7f-site-v2",
  "version": "2.0.0",
  "description": "Aura-7F clan website - Version 2.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "dev:debug": "vite --debug",
    "build": "tsc && vite build",
    "build:development": "vite build --mode development",
    "build:staging": "vite build --mode staging",
    "build:production": "vite build --mode production",
    "preview": "vite preview --port 4173",
    "preview:staging": "vite preview --port 4174",
    "preview:production": "vite preview --port 4175",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui",
    "e2e:debug": "playwright test --debug",
    "lighthouse": "npm run build && lighthouse http://localhost:4173",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "analyze": "vite build --analyze",
    "clean": "rm -rf dist node_modules",
    "prepare": "husky install"
  },
  "dependencies": {
    "@gsap/react": "^2.1.2",
    "@sendgrid/mail": "^7.7.0",
    "@supabase/supabase-js": "^2.91.0",
    "@tabler/icons-react": "^3.36.1",
    "@tanstack/react-query": "^5.0.0",
    "@vercel/analytics": "^1.5.0",
    "axios": "^1.6.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "dayjs": "^1.11.10",
    "framer-motion": "^12.29.2",
    "gl-matrix": "^3.4.4",
    "gsap": "^3.14.2",
    "jose": "^4.14.4",
    "lodash-es": "^4.17.21",
    "lucide-react": "^0.268.0",
    "motion": "^12.29.0",
    "postprocessing": "^6.38.2",
    "react": "^18.3.1",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.50.0",
    "react-router-dom": "^6.20.2",
    "stripe": "^13.6.0",
    "tailwind-merge": "^3.4.0",
    "tailwindcss-animate": "^1.0.7",
    "three": "^0.167.1",
    "zod": "^3.22.4",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@storybook/addon-essentials": "^7.5.0",
    "@storybook/addon-interactions": "^7.5.0",
    "@storybook/addon-links": "^7.5.0",
    "@storybook/blocks": "^7.5.0",
    "@storybook/react": "^7.5.0",
    "@storybook/react-vite": "^7.5.0",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.5.1",
    "@types/node": "^20.10.0",
    "@types/react": "^18.3.27",
    "@types/react-dom": "^18.2.11",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.7.0",
    "@vitest/ui": "^0.34.6",
    "autoprefixer": "^10.4.0",
    "baseline-browser-mapping": "^2.9.17",
    "eslint": "^8.54.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "husky": "^8.0.3",
    "lint-staged": "^15.2.0",
    "postcss": "^8.5.0",
    "prettier": "^3.1.1",
    "tailwindcss": "^3.4.8",
    "typescript": "^5.4.0",
    "vite": "^5.2.0",
    "vite-plugin-visualizer": "^0.9.0",
    "vitest": "^0.34.6"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss}": [
      "prettier --write"
    ]
  },
  "browserslist": [
    "defaults",
    "not ie 11"
  ],
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "keywords": [
    "clan",
    "community",
    "events",
    "quizzes",
    "members",
    "react",
    "typescript",
    "tailwindcss"
  ]
}
```

## Migration Guide for package.json

### Keys Changes from V1.0 to V2.0

#### New Dependencies (Added)
```json
{
  "@tanstack/react-query": "^5.0.0",           // Server state management
  "axios": "^1.6.0",                           // HTTP client
  "react-hook-form": "^7.50.0",                // Form handling
  "zod": "^3.22.4",                            // Schema validation
  "zustand": "^4.4.0",                         // State management
  "jose": "^4.14.4",                           // JWT handling
  "stripe": "^13.6.0",                         // Payment processing
  "@sendgrid/mail": "^7.7.0",                  // Email service
  "lodash-es": "^4.17.21",                     // Utility functions
  "dayjs": "^1.11.10"                          // Date manipulation
}
```

#### New Dev Dependencies (Added)
```json
{
  "@playwright/test": "^1.40.0",               // E2E testing
  "@testing-library/react": "^14.0.0",         // Component testing
  "@testing-library/jest-dom": "^6.1.5",       // DOM matchers
  "@storybook/react": "^7.5.0",                // Component documentation
  "vitest": "^0.34.6",                         // Unit testing
  "eslint": "^8.54.0",                         // Linting
  "prettier": "^3.1.1",                        // Code formatting
  "husky": "^8.0.3",                           // Git hooks
  "lint-staged": "^15.2.0",                    // Pre-commit linting
  "vite-plugin-visualizer": "^0.9.0"           // Bundle analysis
}
```

#### Deprecated/Removed
- `"mdb-react-ui-kit"` (too heavy, replaced with custom components)
- `"baseline-browser-mapping"` (outdated)

#### Updated Versions
- React: 18.2.0 → 18.3.1
- React Router: 6.20.2 → 6.20.2 (same)
- Tailwind CSS: 3.4.8 (same, well maintained)
- TypeScript: 5.2.0 → 5.4.0
- Vite: 5.2.0 (same)

### Installation Instructions

```bash
# Update to V2.0 package.json
npm run clean                    # Clean old dependencies
cp package.json package.json.bak # Backup

# Replace package.json with v2 version, then:
npm install

# Install Husky git hooks
npm run prepare

# Verify installation
npm run type-check
npm run lint
npm run test
```

### New Scripts Explanation

| Script | Purpose | Usage |
|--------|---------|-------|
| `npm run type-check` | TypeScript validation | Pre-commit check |
| `npm run lint` | ESLint validation | CI/CD pipeline |
| `npm run lint:fix` | Auto-fix lint issues | Development |
| `npm run format` | Format code with Prettier | Before commit |
| `npm run test` | Run unit tests | CI/CD pipeline |
| `npm run test:coverage` | Test coverage report | Coverage tracking |
| `npm run e2e` | End-to-end tests | Pre-release check |
| `npm run storybook` | Component documentation | Development |
| `npm run analyze` | Bundle size analysis | Optimization |

### Breaking Changes

#### Before (V1.0)
```typescript
import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

function MyComponent() {
  const { user } = useContext(AuthContext)
  return <div>{user?.username}</div>
}
```

#### After (V2.0)
```typescript
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user } = useAuth()
  return <div>{user?.username}</div>
}
```

### Configuration File Changes

#### tsconfig.json (for TypeScript 5.4)
```json
{
  "compilerOptions": {
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ES2021"
  }
}
```

#### .eslintrc.cjs (New)
```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off'
  }
}
```

#### .prettierrc (New)
```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

#### .prettierignore (New)
```
dist
build
node_modules
```

---

## Installation Checklist

- [ ] Backup current package.json
- [ ] Replace with V2.0 version
- [ ] Run `npm install`
- [ ] Run `npm run prepare` (setup Husky)
- [ ] Run `npm run type-check`
- [ ] Run `npm run lint`
- [ ] Run `npm run test`
- [ ] Verify `npm run build` works
- [ ] Commit changes
- [ ] Update CI/CD pipelines with new scripts
- [ ] Update team documentation
- [ ] Test on staging environment
- [ ] Deploy to production

---

## Performance Impact

### Bundle Size Changes
- V1.0: ~450KB (gzipped)
- V2.0: ~500KB (gzipped) - estimated
- Reason: New dependencies (React Query, Zustand, etc.)

### Mitigation
- Code splitting for lazy-loaded routes
- Tree-shaking unused code
- Dynamic imports for heavy components
- Bundle analysis: `npm run analyze`

### Runtime Performance
- Improved with React Query caching
- Better state management with Zustand
- Faster form validation with React Hook Form

---

## Compatibility Notes

- Node.js: ≥18.0.0 (require 18+ for ES modules)
- npm: ≥9.0.0 (for better dependency resolution)
- Browsers: ES2021 compatible (IE 11 not supported)
- React: 18.3.1 (React 19 when stable)

---

## Next Steps

1. Review documentation: [V2_PLAN.md](./V2_PLAN.md)
2. Setup environment: [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)
3. Review tech stack: [TECH_STACK_V2.md](./TECH_STACK_V2.md)
4. Start development with `npm run dev`
5. Create feature branches for V2.0 implementation

---

**Version**: 2.0.0
**Date**: May 8, 2026
**Status**: Ready for Implementation
