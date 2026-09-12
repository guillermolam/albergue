# AGENTS.md - Repo-Specific Guidance

## Monorepo & Package Manager
- pnpm workspace (root packages: `frontend`, `backend`, `domain_model`)
- Root `package.json` defines workspace scripts (filters to frontend/dev, etc.)

## Key Scripts
- `pnpm dev`: Start Astro dev server (localhost:4321) [frontend]
- `pnpm build`: Build for Cloudflare (default) [frontend: `build:cloudflare`]
- `pnpm preview`: Preview built site [frontend: `preview:cloudflare`]
- `pnpm format`: Run Prettier [frontend]
- `pnpm typecheck`: Run tsc6 with tsconfig.typecheck.json [frontend]
- `pnpm test:e2e`: Run Playwright tests [frontend]
- Backend: `pnpm --filter albergue-backend dev` (dev server), `test` (vitest)

## Deployment
- Frontend deploy: `pnpm run deploy` [frontend: `node scripts/deploy.mjs`]
- Targets: Cloudflare (default), Netlify (`deploy:netlify`), Stormkit (`deploy:stormkit`)
- Build targets: `build:cloudflare`, `build:netlify`, `build:stormkit`

## Env Vars
- `PUBLIC_APP_URL`: Required for absolute URLs in emails/sitemap

## Frontend Stack
- Astro 7.3.2 (server output: `output: 'server'`)
- @swup/astro (globalInstance: true, theme: 'fade')
- RoughJS: Activated via `data-rough-frame` on canvas; alias in vite config
- webcoreui: Integrated via `webcore()` integration
- UnoCSS: Atomic CSS (configured via uno.config.ts)
- Icons: astro-icon (configured in astro.config.shared.mjs)

## Backend Stack
- Hono API routes (likely in `src/api/`)
- drizzle-orm (PostgreSQL) in backend (dependencies) and domain_model (schemas)
- Domain model in `packages/domain_model/`

## Type Checking & Linting
- TypeScript 6.0 (`@typescript/typescript6`)
- `tsconfig.typecheck.json` (stricter than app config)
- No ESLint; lint = type check (`pnpm typecheck` runs `tsc6 -p tsconfig.typecheck.json --noEmit`)

## Node/pnpm Versions
- Node: >=22.12.0 (frontend), >=18.0.0 (backend) [check engines in package.json]
- pnpm: >=10.0.0 (frontend), >=9.0.0 (implied by root)

## Gotchas
- Build defaults to Cloudflare; use `build:netlify` or `build:stormkit` for other targets
- Swup: Global instance enabled (no manual init needed)
- No separate `packages/runtime`; contracts likely in backend/domain

## Important Notes
- All UI components use webcoreui primitives
- Icons auto-loaded via astro-icon (no manual imports)
- API routes are Hono wrappers around domain services (via `@albergue/domain-model`)
