#!/usr/bin/env bash
# Auto-merge approved Dependabot PRs
set -euo pipefail

echo "Auto-merging Dependabot PRs..."

if [[ -z ${GH_TOKEN:-} && -z ${GITHUB_TOKEN:-} ]]; then
	echo "GH_TOKEN or GITHUB_TOKEN environment variable is required" >&2
	exit 1
fi

merged_count=0
failed_count=0

while IFS= read -r pr_number; do
	if [[ -z ${pr_number} ]]; then
		continue
	fi

	printf 'Processing PR %s\n' "${pr_number}"

	if gh pr merge "${pr_number}" --auto --squash; then
		printf 'Queued PR %s for auto-merge\n' "${pr_number}"
		merged_count=$((merged_count + 1))
	else
		printf 'Could not merge PR %s\n' "${pr_number}" >&2
		failed_count=$((failed_count + 1))
	fi
done < <(gh pr list --state open --label "dependencies" --json number --jq '.[].number')

printf 'Summary: %s queued for merge, %s failed\n' "${merged_count}" "${failed_count}"

if [[ ${failed_count} -gt 0 ]]; then
	echo "Some PRs failed to merge - manual review may be required" >&2
	exit 1
fi

echo "All dependency PRs processed successfully"
