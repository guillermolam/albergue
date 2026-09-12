#!/usr/bin/env bash
# Count open Dependabot PRs with dependencies label
set -euo pipefail

echo "🔍 Counting open Dependabot PRs..."

# Requires GITHUB_TOKEN environment variable
if [[ -z "${GITHUB_TOKEN:-}" ]]; then
    echo "❌ GITHUB_TOKEN environment variable is required"
    exit 1
fi

count=$(gh pr list --state open --label "dependencies" --json number --jq 'length')

echo "📊 Found $count open dependency PRs"
echo "count=$count" >> "$GITHUB_OUTPUT"