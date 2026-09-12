#!/usr/bin/env bash
# Generate nightly release version tag
set -euo pipefail

echo "🗓️ Generating nightly version..."

DATE=$(date +%Y%m%d)
HOUR=$(date +%H%M)
VERSION="nightly-$DATE-$HOUR"

echo "📦 Generated version: $VERSION"
echo "version=$VERSION" >> "$GITHUB_OUTPUT"