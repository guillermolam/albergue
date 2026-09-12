#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${VERSION_TAG:-}" ]]; then
  echo "VERSION_TAG environment variable is required" >&2
  exit 1
fi

if [[ -z "${GH_TOKEN:-}" && -z "${GITHUB_TOKEN:-}" ]]; then
  echo "GH_TOKEN or GITHUB_TOKEN environment variable is required" >&2
  exit 1
fi

gh release create "$VERSION_TAG" \
  --title "Nightly Release $VERSION_TAG" \
  --notes "## Nightly Release

Built from latest main branch including dependency updates." \
  --prerelease
