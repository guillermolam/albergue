# Albergue Municipal Carrascalejo - Frontend

Astro SSR frontend with Solid.js islands and selectable deployment targets.

## Stack

- Astro (Vite-powered)
- pnpm
- Client-side progressive enhancement via Astro, Solid.js islands, RoughJS, and Nano Stores

## Quick start

```bash
cd frontend
pnpm install
pnpm dev
```

Build and preview the default Cloudflare target:

```bash
pnpm build
pnpm preview
```

## Deployment targets

Choose a provider interactively:

```bash
pnpm run deploy
```

Or choose explicitly, which is recommended for CI:

```bash
pnpm run deploy cloudflare
pnpm run deploy netlify
pnpm run deploy stormkit
```

Validate any provider without publishing by appending `--dry-run`, for example
`pnpm run deploy stormkit --dry-run`.

| Provider           | Adapter/runtime            | Build                       | Deploy                       |
| ------------------ | -------------------------- | --------------------------- | ---------------------------- |
| Cloudflare Workers | `@astrojs/cloudflare`      | `pnpm run build:cloudflare` | `pnpm run deploy:cloudflare` |
| Netlify Functions  | `@astrojs/netlify`         | `pnpm run build:netlify`    | `pnpm run deploy:netlify`    |
| Stormkit           | `@astrojs/node` standalone | `pnpm run build:stormkit`   | `pnpm run deploy:stormkit`   |

Cloudflare requires Wrangler authentication (`wrangler login` locally or
`CLOUDFLARE_API_TOKEN` in CI). Netlify requires a linked site (`pnpm exec netlify link`) and
authentication (`netlify login` locally or `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` in CI).

Import this repository in Stormkit, set the application root to `frontend`, and copy the settings
from `stormkit.json`. `pnpm run deploy:stormkit` validates the standalone Node build and then calls
Stormkit's Deployments API using `STORMKIT_ALBERGUE_KEY` (legacy `STROMKIT_ALBERGUE_KEY` also
accepted). The current branch is deployed and
published by default. Set `STORMKIT_BRANCH` to override the branch, `STORMKIT_PUBLISH=0` to create
an unpublished deployment, and set `STORMKIT_ENV_ID` for this non-environment-level key. The
environment ID is shown in Stormkit under **App → Environment → Config**.
Use `pnpm run stormkit:status` to validate the key without triggering a deployment.

For post-deployment tests, provide the deployed URL:

```bash
FRONTEND_URL=https://example.com pnpm e2e
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm clean
pnpm format
pnpm type-check
pnpm e2e
```

Astro command families are exposed as pnpm scripts for development (`dev:*`), preview
(`preview:*`), synchronization (`astro:sync*`), diagnostics (`astro:info`, `check:*`), and
deployment. Run `pnpm astro --help` for the complete installed Astro CLI tree.

## Runtime scripts

The base runtime entrypoint is loaded by layouts:

- `src/scripts/runtime.ts`

See `src/scripts/README.md` for the `data-*` contracts used by the runtime modules.

## Windows note

If you are in a \\wsl.localhost\\... path, some Windows tools fail due to UNC path limitations.
Prefer running frontend commands inside WSL (for example: cd frontend && pnpm build).
