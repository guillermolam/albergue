#!/usr/bin/env bash
set -euo pipefail

target="${1:-}"
if [[ -z "$target" ]]; then
  echo "missing build target argument" >&2
  exit 1
fi

pnpm --filter albergue-carrascalejo-frontend "build:${target}"
