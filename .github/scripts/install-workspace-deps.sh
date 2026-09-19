#!/usr/bin/env bash
set -euo pipefail

pnpm install --frozen-lockfile

# Shared workspace packages must be built before any job that consumes them
# (frontend actions import @albergue/api-contract, backend imports both) —
# their package.json "exports" point at dist/, which only tsc produces.
pnpm --filter @albergue/domain-model --filter @albergue/api-contract build
