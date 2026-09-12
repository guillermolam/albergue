# ADR-0001: Canonical PostgreSQL migration chain

Status: accepted  
Date: 2026-09-12

## Decision

The Drizzle journal at `domain_model/migrations/meta/_journal.json` defines the
only production PostgreSQL migration chain. Its current baseline is
`0000_flaky_norrin_radd.sql`, generated from the authoritative
`domain_model/schema.ts`.

Files `001_init_schema.sql` through `005_seed_pricing.sql` are legacy,
unjournaled SQL. They must not run in CI or production. They conflict with the
current schema and include PostgreSQL-invalid inline `INDEX` declarations.
`schemas/postgres.sql` is a reference snapshot, not an executable chain.
The SeaORM migrations and `schemas/sqlite.sql` target SQLite/Turso and remain
experimental pending ADR-RUST.

## Enforcement

`pnpm --filter @albergue/domain-model migration:check` fails when a journal
entry is missing or an unjournaled Drizzle-style `000x_*.sql` appears. Database
CI applies only journaled PostgreSQL migrations. Seed and legacy SQL tests stay
disabled until rewritten against this chain.

All future PostgreSQL changes must update `schema.ts`, use Drizzle generation,
and append to the journal. Rebaselining or adopting a different chain requires
a superseding ADR and a tested upgrade path for deployed databases.
