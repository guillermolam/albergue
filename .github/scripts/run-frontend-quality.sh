#!/usr/bin/env bash
set -euo pipefail

pnpm --filter albergue-carrascalejo-frontend format:check
pnpm --filter albergue-carrascalejo-frontend type-check
pnpm --filter albergue-carrascalejo-frontend check:astro

# Debt reports are informative and should not fail the gating quality job.
pnpm --filter albergue-carrascalejo-frontend type-check:full || true
pnpm --filter albergue-carrascalejo-frontend check:astro:full || true

pnpm --filter albergue-carrascalejo-frontend e2e
