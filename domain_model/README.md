# Domain Model (Drizzle/PostgreSQL)

This package owns the authoritative domain schema for Albergue Municipal Carrascalejo.

## Authority

- `schema.ts` is the source of truth for the PostgreSQL model.
- `migrations/` is the journaled Drizzle migration chain.
- `scripts/check-migration-chain.mjs` validates the chain.
- The former Rust/SeaORM/Turso workspace was removed because it duplicated the PostgreSQL model and was never authoritative.

## Schema Areas

The schema covers users, pilgrims, beds, bookings, payments, pricing, government submissions, notifications, and audit logging.

## Migration Workflow

Install dependencies from the repository root, then validate the canonical chain:

```bash
pnpm --filter @albergue/domain-model migration:check
```

After changing `schema.ts`, generate a migration with the repository's Drizzle configuration:

```bash
pnpm --filter @albergue/domain-model exec drizzle-kit generate --config=drizzle.config.ts
```

Database CI applies only journaled PostgreSQL migrations. Legacy SQL files and reference snapshots are not executable migration inputs.
