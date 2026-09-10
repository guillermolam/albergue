# Project Notes for AI Agents

## Application Status

### Frontend Status: ✅ OPERATIONAL
- **Framework**: Astro 7.3.2 (updated from 6.1.3)
- **Runtime**: Cloudflare Workers adapter
- **UI Framework**: Solid.js 1.9.15 for interactive islands
- **Dev Server**: Running successfully on http://localhost:4321/
- **Package Manager**: pnpm 10.29.3

### Backend/Gateway Status: ⚠️ NOT IMPLEMENTED
- Backend and gateway directories referenced in taskfiles but not present in current codebase
- Planned services include: auth-service, booking-service, document-validation-service, etc.
- These appear to be planned but not yet implemented

## Recent Quality Improvements

### 1. Astro Version Update
- **Issue**: Outdated Astro 6.1.3 with 7.3.2 available
- **Solution**: Updated to Astro 7.3.2 using `pnpm dlx @astrojs/upgrade`
- **Impact**: Latest features, security patches, and performance improvements

### 2. Dead Code Cleanup (2026-09-10)
- **Issue**: ~15,728 lines of dead code identified across the codebase
- **Solution**: Removed all zero-risk dead code:
  - Fixed broken import in `_figma-demo.astro` (components/data-display → core/Stats)
  - Removed unused `toast.ts.unused` file
  - Removed 14 unused library files (~12,000 lines):
    - api-client.ts, arrival-info.ts, auth.ts, booking.ts, country.ts
    - document-validation.ts, fetch-client.ts, notifications.ts
    - performance-monitor.ts, pilgrim-validation.ts, reviews.ts
    - bundle-optimizer.ts, utils.ts, config.ts, config-ssr.ts, gateway-config.ts
    - Empty lib/api/ directory
  - Removed 3 placeholder pages: auth.astro, _admin.astro, slug..astro
- **Impact**: Cleaner codebase, faster builds, reduced maintenance burden
- **Status**: Application runs successfully with no errors

### 3. Dependency Updates (2026-09-10)
- **Issue**: Multiple outdated dependencies with security and performance implications
- **Solution**: Systematically updated all dependencies to latest versions:
  - Updated safe dependencies: @nanostores/persistent, @supabase/supabase-js, alpinejs, prettier, tailwind-merge, three
  - Upgraded nanostores from 0.11.4 to 1.5.3 (major version update)
  - Updated prettier-plugin-astro from 0.14.1 to 1.0.0
  - Added @typescript/typescript6 for TypeScript 6 compatibility with @astrojs/check
  - TypeScript 7.0.2 installed via peer dependencies (native Go compiler for fast builds)
  - TypeScript 6.0.3 available via @typescript/typescript6 for type-checking scripts (tsc6)
  - Migrated anime.js API from default export to named `animate` export (animejs 4.5.0 breaking change)
  - Updated TypeScript configuration for TS 7.0 compatibility (removed deprecated `baseUrl`, `esModuleInterop`)
  - Skipped redis 6.0 upgrade (not actively used in codebase)
- **Impact**: Latest security patches, performance improvements, and bug fixes
- **Status**: Application builds and runs successfully with all updates

### 4. Route Verification (2026-09-10)
- **Issue**: Needed to verify all routes render correctly after dependency updates
- **Solution**: Systematically tested all routes:
  - Main routes: `/`, `/book`, `/camino`, `/dashboard`, `/booking`, `/camino-dashboard`, `/info`, `/booking-confirmed`, `/404` - All render successfully with 200 status
  - Admin routes: `/admin`, `/admin/services`, `/admin/services-realtime` - All render successfully with 200 status
  - Demo routes: `/demo-camino`, `/demo-user-profile`, `/demo-booking-confirmed` - All render successfully with 200 status
  - Fixed duplicate import statement in `booking-confirmed.astro` (removed erroneous line 36)
- **Remediation**: Fixed syntax error in booking-confirmed.astro that was rendering raw import statements in HTML
- **Status**: All routes verified working correctly, no errors or warnings in dev server

## Build Commands

### Frontend Development
```bash
cd frontend
pnpm install        # Install dependencies
pnpm dev            # Start development server
pnpm build          # Build for production
pnpm preview        # Preview production build
```

### Quality Checks
```bash
cd frontend
pnpm type-check     # TypeScript type checking
pnpm lint           # ESLint linting
pnpm format         # Prettier formatting
```

## Project Architecture

### Technology Stack
- **Frontend**: Astro 7.3.2 + Solid.js + UnoCSS (presetMini)
- **Runtime**: Cloudflare Workers (wasm32-unknown-unknown)
- **Planned Backend**: Rust workspace with Spin/Fermyon Cloud
- **Database**: PostgreSQL + Redis + Supabase

### Design System
- **Style**: Neo-Brutalism with sketch/handwritten elements
- **Colors**: White (#FFFFFF), Green (#00AB39), Greyscale, Black (#000000)
- **Borders**: 2-4px solid black, no border-radius
- **Fonts**: Caveat/Patrick Hand (headings), IBM Plex (body)
- **No emojis, gradients, or extra colors allowed**

### Project Policies
- **Banned**: Tailwind CSS, React, Bun
- **Required**: UnoCSS presetMini, Solid.js for interactivity, pnpm
- **Policy Enforcement**: OPA Rego policies (21 rules) via pre-commit hooks

## Known Issues & Limitations

1. **Backend/Gateway Not Implemented**: The taskfiles reference backend and gateway services that don't exist in the current codebase
2. **Solid.js Configuration**: Some Vite warnings about React dependencies may persist due to test files
3. **Content Layer**: Astro content layer not configured (not needed for this project)

## Development Workflow

### Starting the Application
```bash
# Currently only frontend is operational
cd frontend && pnpm dev

# Full stack (when backend/gateway implemented)
task dev:run-all
```

### Quality Standards
- Always run type checking before committing
- Use Solid.js for interactive components (not React)
- Follow the neo-brutalism design system
- Adhere to OPA policy rules (no shortcuts allowed)
- Pursue excellence over shortest path

## Agent Guidelines

When working on this project:
1. **Quality First**: Always choose the trade-off that leads to best quality, not shortest path
2. **Policy Compliance**: Respect the banned technologies and architectural decisions
3. **Testing**: Ensure all quality checks pass before considering work complete
4. **Documentation**: Update this file with any significant changes or discoveries
5. **Dependencies**: Always use pnpm and respect the 7-day age rule for new packages

## Environment Requirements

- **Node.js**: >= 22.12.0
- **pnpm**: >= 10.0.0
- **Rust**: stable with wasm32-unknown-unknown and wasm32-wasip2 targets
- **Spin CLI**: v3.6+ (for backend when implemented)
- **wrangler**: 4.131.0 (for Cloudflare Workers)

---
*Last Updated: 2026-09-10*
*Status: Frontend operational with all dependencies updated and routes verified, backend/gateway planned*
