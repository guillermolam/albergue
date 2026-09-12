#!/usr/bin/env bash
# Generate nightly release version tag
set -euo pipefail

echo "Generating nightly version..."

DATE=$(date +%Y%m%d)
HOUR=$(date +%H%M)
VERSION="nightly-${DATE}-${HOUR}"

printf 'Generated version: %s\n' "${VERSION}"
printf 'version=%s\n' "${VERSION}" >>"${GITHUB_OUTPUT}"
