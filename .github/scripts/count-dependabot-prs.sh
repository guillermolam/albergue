#!/usr/bin/env bash
# Count open Dependabot PRs with dependencies label
set -euo pipefail

echo "Counting open Dependabot PRs..."

if [[ -z ${GH_TOKEN:-} && -z ${GITHUB_TOKEN:-} ]]; then
	echo "GH_TOKEN or GITHUB_TOKEN environment variable is required" >&2
	exit 1
fi

count=$(gh pr list --state open --label "dependencies" --json number --jq 'length')

printf 'Found %s open dependency PRs\n' "${count}"
printf 'count=%s\n' "${count}" >>"${GITHUB_OUTPUT}"
