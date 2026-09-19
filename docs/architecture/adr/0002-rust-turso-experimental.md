# ADR-0002: Rust/Turso persistence path is experimental, non-production

Status: superseded
Date: 2026-09-12

## Context

The former `domain_model/rust/` parallel persistence stack contained SeaORM
entities and migrations, a Seaography GraphQL service, and a Turso/libSQL sync
tool. It was never authoritative and duplicated the active Drizzle/PostgreSQL
model.

## Decision

The Rust/Turso path is removed from the repository. This ADR records the
retirement so it is not recreated as a second migration authority.

- The canonical PostgreSQL schema and migration chain are Drizzle
  (`domain_model/schema.ts` + journaled migrations), per ADR-0001.
- Drizzle migrations are the only supported migration path.

## Consequences

- Any future alternative migration system requires a new ADR and a tested
  upgrade path from the Drizzle chain.
