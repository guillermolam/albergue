#!/usr/bin/env bash
# Count open Dependabot PRs with dependencies label
set -euo pipefail

echo "🔍 Counting open Dependabot PRs..."

# Requires GH_TOKEN or GITHUB_TOKEN environment variable
if [[ -z "${GH_TOKEN:-}" && -z "${GITHUB_TOKEN:-}" ]]; then
    echo "❌ GH_TOKEN or GITHUB_TOKEN environment variable is required"
    exit 1
fi

count=$(gh pr list --state open --label "dependencies" --json number --jq 'length')

echo "📊 Found $count open dependency PRs"
echo "count=$count" >> "$GITHUB_OUTPUT"