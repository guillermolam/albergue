#!/usr/bin/env bash
set -euo pipefail

pnpm --filter albergue-carrascalejo-frontend exec playwright install --with-deps chromium
