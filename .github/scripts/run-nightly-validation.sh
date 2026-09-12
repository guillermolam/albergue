#!/usr/bin/env bash
set -euo pipefail

pnpm --filter albergue-carrascalejo-frontend build
pnpm --filter albergue-carrascalejo-frontend type-check
