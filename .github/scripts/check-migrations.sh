#!/usr/bin/env bash
set -euo pipefail

pnpm --filter @albergue/domain-model migration:check
