#!/usr/bin/env bash
set -euo pipefail

if [[ -z ${CLOUDFLARE_API_TOKEN:-} ]]; then
	echo "CLOUDFLARE_API_TOKEN is required" >&2
	exit 1
fi

if [[ -z ${CLOUDFLARE_ACCOUNT_ID:-} ]]; then
	echo "CLOUDFLARE_ACCOUNT_ID is required" >&2
	exit 1
fi

pnpm exec wrangler deploy
