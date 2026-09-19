#!/usr/bin/env bash
set -euo pipefail

# Root package.json's "postinstall" builds @albergue/domain-model and
# @albergue/api-contract (their package.json "exports" point at dist/,
# which only tsc produces) — this runs automatically here, and everywhere
# else `pnpm install` runs (Cloudflare/Netlify/Stormkit native build
# pipelines included), so every consumer gets it without a bespoke step.
pnpm install --frozen-lockfile
