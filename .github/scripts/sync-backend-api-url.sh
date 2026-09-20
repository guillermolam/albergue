#!/usr/bin/env bash
# Keeps the frontend Worker's BACKEND_API_URL secret in sync with a
# known-correct value on every deploy. Guarded against an empty value:
# `wrangler secret put` happily accepts an empty string as "the secret",
# which previously overwrote a correct value with a blank one the moment
# this ran before the BACKEND_API_URL GitHub secret existed.
set -euo pipefail

if [[ -z ${CLOUDFLARE_API_TOKEN:-} ]]; then
	echo "CLOUDFLARE_API_TOKEN is required" >&2
	exit 1
fi

if [[ -z ${CLOUDFLARE_ACCOUNT_ID:-} ]]; then
	echo "CLOUDFLARE_ACCOUNT_ID is required" >&2
	exit 1
fi

if [[ -z ${BACKEND_API_URL:-} ]]; then
	echo "BACKEND_API_URL is required (refusing to overwrite the live secret with an empty value)" >&2
	exit 1
fi

printf '%s' "$BACKEND_API_URL" | pnpm exec wrangler secret put BACKEND_API_URL
