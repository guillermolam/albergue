#!/usr/bin/env bash
set -euo pipefail

# Ensure pinned SHAs match the latest stable release tags.
# Expected format in repo:
#   owner/repo@<40-hex-sha> # vX.Y.Z

readonly WORKFLOW_DIR=".github/workflows"
readonly ACTIONS_DIR=".github/actions"

github_api_get() {
	local endpoint="$1"

	if command -v gh >/dev/null 2>&1; then
		gh api "${endpoint}"
		return 0
	fi

	local auth_header=()
	if [[ -n ${GH_TOKEN:-} ]]; then
		auth_header=(-H "Authorization: Bearer ${GH_TOKEN}")
	elif [[ -n ${GITHUB_TOKEN:-} ]]; then
		auth_header=(-H "Authorization: Bearer ${GITHUB_TOKEN}")
	fi

	curl -fsSL "${auth_header[@]}" "https://api.github.com/${endpoint}"
}

check_pinned_action() {
	local repo="$1"
	local expected_tag="$2"

	# `local x=$(cmd)` masks cmd's exit status behind local's own — set -e
	# won't catch a failed substitution here, so each call is split from its
	# declaration to fail loudly instead of silently comparing against "".
	local latest_tag
	latest_tag="$(github_api_get "repos/${repo}/releases/latest" | jq -r '.tag_name')"

	if [[ ${latest_tag} != "${expected_tag}" ]]; then
		echo "latest tag drift for ${repo}: expected ${expected_tag}, got ${latest_tag}" >&2
		exit 1
	fi

	local latest_sha
	latest_sha="$(github_api_get "repos/${repo}/git/ref/tags/${expected_tag}" | jq -r '.object.sha')"

	# Lightweight tags point directly to commits; annotated tags point to tag objects.
	local object_type
	object_type="$(github_api_get "repos/${repo}/git/ref/tags/${expected_tag}" | jq -r '.object.type')"

	if [[ ${object_type} == "tag" ]]; then
		latest_sha="$(
			github_api_get "repos/${repo}/git/tags/${latest_sha}" |
				jq -r '.object.sha'
		)"
	fi

	local pattern="${repo}@${latest_sha}"
	if ! grep -rn --fixed-strings "${pattern}" "${WORKFLOW_DIR}" "${ACTIONS_DIR}" >/dev/null; then
		echo "pinned SHA mismatch for ${repo}: expected ${pattern}" >&2
		exit 1
	fi

	if ! grep -rn --fixed-strings "${pattern} # ${expected_tag}" "${WORKFLOW_DIR}" "${ACTIONS_DIR}" >/dev/null; then
		echo "missing version comment for ${repo}: expected '# ${expected_tag}'" >&2
		exit 1
	fi

	echo "ok ${repo} ${expected_tag} ${latest_sha}"
}

check_pinned_action "actions/checkout" "v7.0.1"
check_pinned_action "actions/setup-node" "v7.0.0"
check_pinned_action "actions/setup-go" "v7.0.0"
check_pinned_action "pnpm/action-setup" "v6.1.0"
