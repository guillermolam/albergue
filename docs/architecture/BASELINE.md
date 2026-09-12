# Verified architecture baseline

Verified on 2026-09-12 at revision `521c119`.

## Active topology

- `frontend/`: Astro 7 server output. Cloudflare is primary; Netlify and
  Node/Stormkit are portability targets. Seventeen file routes exist: fifteen
  explicitly prerendered, one explicitly on-demand, and two using the server
  default. Browser behavior is plain TypeScript; there are no hydrated
  framework islands.
- `backend/`: TypeScript Hono API on Node with Drizzle/PostgreSQL. It exposes
  76 handlers and imports the authoritative schema package.
- `domain_model/`: `schema.ts` is the active Drizzle schema for nine tables.
  PostgreSQL migration ownership is fixed by ADR-0001.
- `figma/`: untracked React/Vite design reference. It is outside the pnpm
  workspace and is not a production runtime.
- `domain_model/rust/` and `packages/astro-roughjs/`: experimental paths. CI
  does not treat them as production.

## Data flow and trust

The browser renders Astro HTML and runs browser TypeScript. Astro is the web
boundary. Hono owns domain queries and commands. PostgreSQL is durable
production storage. External payment, OCR, authentication, and government
services remain undecided. Browser price, availability, identity, payment, and
authorization state is not trustworthy.

Known baseline violations are tracked for later phases: persistent browser PII
and payment state, public mock admin pages, missing auth, and non-transactional
booking writes. Phase 0 does not alter those flows.

## Validation baseline

PR CI now installs the root lockfile and runs:

- frontend format, incremental TypeScript gate, incremental Astro gate, smoke
  tests, and separate Cloudflare, Netlify, and Node/Stormkit builds;
- full frontend TypeScript and Astro diagnostics as explicit non-blocking debt
  reports;
- backend type checking, Vitest, and Hono route smoke tests;
- domain migration-chain validation.

The full frontend diagnostic currently reports 66 errors across 91 files.
Making that check blocking would make CI permanently red; keeping the named
full check visible with `continue-on-error` preserves the debt without hiding
it. The blocking gate has expanded beyond the former six-file allowlist and
must grow as existing errors are repaired.

## Unresolved ADRs

Authentication, PSP, sessions, API contracts, Rust disposition, navigation,
RoughJS ownership, content, i18n, 3D assets, and PII controls remain open. They
belong to later phases. ADR-0001 resolves only the PostgreSQL migration chain.
