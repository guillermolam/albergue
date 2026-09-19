#!/usr/bin/env bash
set -euo pipefail

export PATH="${CARGO_HOME:-${HOME}/.cargo}/bin:${PATH}"

if ! command -v zizmor >/dev/null 2>&1; then
	echo "zizmor not on PATH; run .github/scripts/install-zizmor.sh first" >&2
	exit 1
fi

report_json="$(mktemp)"
trap 'rm -f "$report_json"' EXIT

env -u GH_TOKEN -u GITHUB_TOKEN -u ZIZMOR_GITHUB_TOKEN \
	zizmor --offline --no-progress --pedantic --no-ignores --format json \
	.github/workflows/*.yml .github/actions/**/*.yml >"${report_json}"

if [[ "$(jq 'length' "${report_json}")" != "0" ]]; then
	echo "zizmor findings detected:" >&2
	cat "${report_json}" >&2
	exit 1
fi

echo "zizmor: no findings"
