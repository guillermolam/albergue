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

# This Worker now bundles the backend too (frontend and backend merged --
# see frontend/src/lib/backend-api.ts), so its own DATABASE_URL secret is
# what backend/src/lib/db.ts connects with. There's no separate backend
# deploy to provision it anymore, and a missing secret doesn't fail the
# deploy on its own (db.ts falls back to a localhost default) -- it just
# makes every DB-backed page/action fail at request time. Fail fast here
# instead.
if ! pnpm exec wrangler secret list 2>/dev/null | grep -q '"name": *"DATABASE_URL"'; then
	echo "DATABASE_URL secret is not set on the albergue Worker -- run: wrangler secret put DATABASE_URL" >&2
	exit 1
fi

pnpm exec wrangler deploy
