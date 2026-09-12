# ADR-0002: Rust/Turso persistence path is experimental, non-production

Status: accepted
Date: 2026-09-12

## Context

`domain_model/rust/` contains a parallel persistence stack: SeaORM entities and
migrations, a Seaography GraphQL service, and a Turso/libSQL sync tool. ADR-0001
left it "experimental pending ADR-RUST". ARCH-007 requires an explicit choice.

## Decision

The Rust/Turso path is **experimental tooling, not on the production path**.

- The canonical PostgreSQL schema and migration chain are Drizzle
  (`domain_model/schema.ts` + journaled migrations), per ADR-0001.
- No CI job builds, tests, or deploys the Rust crates. They must not be wired
  into production deployment.
- The SeaORM schema copy is allowed to drift; it carries no authority. If it
  conflicts with `schema.ts`, `schema.ts` wins.
- `turso-sync` may be used for local/offline experiments only.

## Consequences

- Promoting this path to migration tooling or a production service requires a
  superseding ADR, a tested upgrade path from the Drizzle chain, and CI
  coverage — the same bar ADR-0001 sets for any chain change.
- If no experiment has justified it by the Phase 13 deployment convergence
  review, delete `domain_model/rust/` rather than let it rot.
