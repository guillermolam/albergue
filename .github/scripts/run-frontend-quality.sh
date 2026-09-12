#!/usr/bin/env bash
set -euo pipefail

# Gating checks — must stay green
pnpm --filter albergue-carrascalejo-frontend format:check
pnpm --filter albergue-carrascalejo-frontend type-check
pnpm --filter albergue-carrascalejo-frontend check:astro

pnpm --filter albergue-carrascalejo-frontend e2e
