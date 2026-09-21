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

/**
 * Last-resort committed defaults for the B01 Smplrspace floor plan --
 * real values, not secrets. All three are `access: 'public'` in
 * astro.config.shared.mjs and get inlined verbatim into the client-side JS
 * bundle by design, so keeping them out of git bought no actual security:
 * it only meant any build path that didn't happen to have the same GitHub
 * Actions secrets independently wired (a direct `wrangler deploy` from a
 * machine without them exported, a fresh clone, a different CI runner)
 * silently shipped the "coming soon" placeholder instead of the real floor
 * plan -- confirmed happening repeatedly in production (2026-09-21), a
 * competing deploy path undoing this fix within seconds of every correct
 * one. Baking the real values in here means every build path resolves the
 * identical, correct config deterministically, with no dependency on which
 * environment happened to run it. Sourced from Smplrspace's own dashboard
 * (prj_l3kaqeh); rotate here (and in the GitHub Actions secrets, which
 * still take priority when set) if the client token or space ever change.
 */
const SMPLR_B01_DEFAULTS = {
  PUBLIC_SMPLR_ORGANIZATION_ID: 'c279e1c7-a40f-4c8a-9cb2-7e610690bd33',
  PUBLIC_SMPLR_CLIENT_TOKEN: 'pub_ba75a06067b745b9a90561d9f878d5b0',
  PUBLIC_SMPLR_SPACE_B01_ID: 'spc_ira3ue5m',
};

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

/**
 * Throws if a resolved B01 value doesn't look like a real Smplrspace
 * identifier. The committed defaults above make "missing" structurally
 * impossible now, so the only way to reach this is a malformed override
 * (a typo'd env var, a broken root .env value) -- catch it at build time
 * with a clear message instead of silently shipping a broken or
 * "not configured" floor plan.
 */
function validateSmplrB01Config(resolved) {
  const {
    PUBLIC_SMPLR_ORGANIZATION_ID: orgId,
    PUBLIC_SMPLR_CLIENT_TOKEN: clientToken,
    PUBLIC_SMPLR_SPACE_B01_ID: spaceId,
  } = resolved;

  const problems = [];
  if (!orgId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orgId)) {
    problems.push(
      `PUBLIC_SMPLR_ORGANIZATION_ID (${orgId ? `"${orgId}"` : 'unset'}) doesn't look like a real Smplrspace organization UUID.`
    );
  }
  if (!clientToken || !/^pub_.+/.test(clientToken)) {
    problems.push(
      `PUBLIC_SMPLR_CLIENT_TOKEN doesn't look like a real Smplrspace public token (expected a "pub_" prefix followed by real content).`
    );
  }
  if (!spaceId || !/^spc_.+/.test(spaceId)) {
    problems.push(
      `PUBLIC_SMPLR_SPACE_B01_ID (${spaceId ? `"${spaceId}"` : 'unset'}) doesn't look like a real Smplrspace space id (expected an "spc_" prefix followed by real content).`
    );
  }

  if (problems.length > 0) {
    throw new Error(
      `Smplrspace B01 configuration is invalid:\n  - ${problems.join('\n  - ')}\n` +
        'This should be structurally impossible -- frontend/scripts/root-env.mjs ships real committed ' +
        'defaults for all three values. Check for a malformed override (an env var or root .env value ' +
        'that shadows the default with something broken) before touching the defaults themselves.'
    );
  }
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

  // Priority per key: real environment (CI secret, shell export) > value
  // derived from the gitignored root .env > committed B01 default. B02/B03
  // have no committed default -- no real Smplrspace project exists for
  // either yet, so "unset" is their correct, intentional state.
  const resolved = {};
  const allKeys = new Set([...Object.keys(derived), ...Object.keys(SMPLR_B01_DEFAULTS)]);
  for (const key of allKeys) {
    const value = process.env[key] || derived[key] || SMPLR_B01_DEFAULTS[key];
    if (value) {
      process.env[key] = value;
      resolved[key] = value;
    }
  }

  validateSmplrB01Config(resolved);

  return resolved;
}
