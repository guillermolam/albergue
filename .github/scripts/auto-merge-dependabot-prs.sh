#!/usr/bin/env bash
# Auto-merge approved Dependabot PRs
set -euo pipefail

echo "🤖 Auto-merging Dependabot PRs..."

# Requires GITHUB_TOKEN environment variable
if [[ -z "${GITHUB_TOKEN:-}" ]]; then
    echo "❌ GITHUB_TOKEN environment variable is required" 
    exit 1
fi

merged_count=0
failed_count=0

# Get list of open dependency PRs
while IFS= read -r pr_number; do
    if [[ -z "$pr_number" ]]; then
        continue
    fi
    
    echo "🔄 Processing PR #$pr_number"
    
    if gh pr merge "$pr_number" --auto --squash; then
        echo "✅ Successfully queued PR #$pr_number for auto-merge"
        ((merged_count++))
    else
        echo "❌ Could not merge PR #$pr_number"
        ((failed_count++))
    fi
done < <(gh pr list --state open --label "dependencies" --json number --jq '.[].number')

echo "📊 Summary: $merged_count queued for merge, $failed_count failed"

if [[ $failed_count -gt 0 ]]; then
    echo "⚠️ Some PRs failed to merge - manual review may be required"
    exit 1
fi

echo "🎉 All dependency PRs processed successfully"