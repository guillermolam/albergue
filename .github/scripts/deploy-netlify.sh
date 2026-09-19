#!/usr/bin/env bash
set -euo pipefail

if [[ -z ${NETLIFY_AUTH_TOKEN:-} ]]; then
	echo "NETLIFY_AUTH_TOKEN is required" >&2
	exit 1
fi

if [[ -z ${NETLIFY_SITE_ID:-} ]]; then
	echo "NETLIFY_SITE_ID is required" >&2
	exit 1
fi

pnpm run build:netlify
pnpm exec netlify deploy --prod --no-build --dir="$(pwd)/dist"
