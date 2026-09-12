#!/usr/bin/env bash
set -euo pipefail

pnpm --filter @albergue/domain-model --filter @albergue/api-contract build
pnpm --filter albergue-backend type-check
pnpm --filter albergue-backend test
