import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Bridges the handful of values the frontend needs from the monorepo-root
 * `.env` into `process.env`, so Smplrspace credentials live in exactly one
 * place instead of being copy-pasted into `frontend/.env` (Astro only reads
 * the latter, which is why they previously had to be duplicated).
 *
 * Deliberately an allowlist, not a bulk copy: the root `.env` also holds AWS,
 * Neon, Redis, Turso, Mux and Cloudflare credentials that this process has no
 * business holding, and anything named `PUBLIC_*` there would additionally be
 * inlined into the client bundle by Vite.
 *
 * Anything already set in the real environment (CI, Cloudflare, Netlify, a
 * shell export) wins -- this only fills gaps for local development. Parsing is
 * hand-rolled so the Astro config has no dependency to resolve before it
 * loads.
 */

const ROOT_ENV = fileURLToPath(new URL('../../.env', import.meta.url));

/** Minimal KEY=VALUE reader: skips blanks and `#` comments, tolerates an
 * `export ` prefix, and strips one layer of matching quotes. */
export function parseEnvFile(text) {
  const out = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(trimmed);
    if (!match) continue;
    let [, key, value] = match;
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length > 1) ||
      (value.startsWith("'") && value.endsWith("'") && value.length > 1)
    ) {
      value = value.slice(1, -1);
    }
    out[key] = value;
  }
  return out;
}

/** `https://smplr.me/v/ira3ue5m` -> `spc_ira3ue5m`.
 *
 * Smplrspace share links carry the space's short code, and the share page's
 * own canonical URL (`app.smplrspace.com/view/spc_<code>`) shows the id is
 * that code with an `spc_` prefix. The bare short code is NOT a valid
 * spaceId -- smplr.js rejects it with "Invalid spaceId provided". */
export function spaceIdFromShareUrl(url) {
  if (!url) return undefined;
  const shortCode = url.trim().replace(/\/+$/, '').split('/').pop();
  if (!shortCode) return undefined;
  return shortCode.startsWith('spc_') ? shortCode : `spc_${shortCode}`;
}

export function loadRootEnv(envPath = ROOT_ENV) {
  const root = existsSync(envPath) ? parseEnvFile(readFileSync(envPath, 'utf8')) : {};

  const derived = {
    PUBLIC_SMPLR_ORGANIZATION_ID: root.SMPLRSPACE_ORG_ID,
    PUBLIC_SMPLR_CLIENT_TOKEN: root.SMPLRSPACE_API_TOKEN,
    PUBLIC_SMPLR_SPACE_B01_ID:
      root.SMPLRSPACE_SPACE_B01_ID ?? spaceIdFromShareUrl(root.SMPLRSPACE_PUBLIC_URL),
    PUBLIC_SMPLR_SPACE_B02_ID: root.SMPLRSPACE_SPACE_B02_ID,
    PUBLIC_SMPLR_SPACE_B03_ID: root.SMPLRSPACE_SPACE_B03_ID,
  };

  for (const [key, value] of Object.entries(derived)) {
    if (value && !process.env[key]) process.env[key] = value;
  }

  return derived;
}
