#!/usr/bin/env bash
set -euo pipefail

# Workspace packages (@albergue/domain-model, @albergue/api-contract) are
# built by install-workspace-deps.sh during environment setup.
pnpm --filter albergue-backend type-check
pnpm --filter albergue-backend test
