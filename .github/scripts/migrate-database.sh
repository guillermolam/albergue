#!/usr/bin/env bash
# Applies tracked Drizzle migrations to the real production database.
# Distinct from `db:push`: this uses drizzle-kit's journaled `migrate`
# command, which only applies migrations the target database hasn't
# already recorded -- safe to run on every deploy, unlike `push` (which
# diffs and force-syncs the whole schema on every run).
set -euo pipefail

if [[ -z ${DATABASE_URL:-} ]]; then
	echo "DATABASE_URL is required" >&2
	exit 1
fi

pnpm run db:migrate:apply
