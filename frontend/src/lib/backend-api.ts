/**
 * Server-only Hono client. Used by Actions and on-demand pages.
 * Never imported from client islands.
 */
import { BACKEND_API_URL } from 'astro:env/server';
import type { ApiResponse } from '@albergue/api-contract';

export class BackendUnavailableError extends Error {
  constructor(message = 'Backend API is not configured (BACKEND_API_URL).') {
    super(message);
    this.name = 'BackendUnavailableError';
  }
}

export function requireBackendUrl(): string {
  if (!BACKEND_API_URL) {
    throw new BackendUnavailableError();
  }
  return BACKEND_API_URL.replace(/\/$/, '');
}

/**
 * Low-level Worker→backend request.
 *
 * INTERIM STATE: a Service Binding (the Cloudflare-documented, reliable
 * mechanism for same-account Worker-to-Worker calls) was tried here and is
 * still configured in wrangler.jsonc, but every way of reaching it from
 * this SSR code hit a real problem:
 *   - `import { env } from 'cloudflare:workers'` at module scope: this file
 *     is imported by prerendered pages, and Astro prerenders in plain Node,
 *     whose ESM loader throws ERR_UNSUPPORTED_ESM_URL_SCHEME on the
 *     `cloudflare:` protocol -- crashes the whole build.
 *   - Moving that same static import into middleware.ts (SSR-only,
 *     assumed safe from prerendering): still crashes the same way --
 *     Astro's middleware chain runs during prerendering too, not just for
 *     live requests.
 *   - `await import('cloudflare:workers')` (dynamic, inside backendFetch):
 *     avoided the build crash, but the resulting `binding.fetch()` call
 *     hung indefinitely in production -- confirmed live via `wrangler
 *     tail` on the backend Worker, which never showed the request
 *     arriving at all. Suspected workerd limitation around dynamically
 *     importing its own builtin modules; not yet root-caused.
 *
 * Falls back to a normal cache-bypassed fetch of BACKEND_API_URL for now
 * (same as before the Service Binding attempt) -- known to fail fast with
 * a clear "Worker not found" from Cloudflare's public routing layer for a
 * same-account *.workers.dev -> *.workers.dev subrequest issued from
 * inside a Worker, rather than hang. Worse error, but bounded and fast
 * instead of a ~30s platform timeout. Revisit with the binding once a
 * working access pattern is confirmed.
 */
export async function backendFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const requestInit: RequestInit = {
    ...init,
    headers: {
      accept: 'application/json',
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...init.headers,
    },
  };

  const base = requireBackendUrl();
  return fetch(`${base}${path}`, {
    ...requestInit,
    cf: { cacheTtl: 0, cacheEverything: false },
  });
}

export async function backendJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<{ ok: true; status: number; data: T } | { ok: false; status: number; message: string }> {
  let response: Response;
  try {
    response = await backendFetch(path, init);
  } catch (error) {
    // A network-level failure (connection refused, DNS, timeout, ...)
    // throws rather than resolving a Response -- without this, it was
    // an uncaught exception that crashed the entire page render instead
    // of degrading the same way a missing/misconfigured URL does.
    // Also covers BackendUnavailableError when BACKEND_API_URL is unset.
    console.error(`backendJson failure: network error: ${(error as Error).message}`);
    return { ok: false, status: 503, message: (error as Error).message };
  }

  // Read the body defensively: a stream can fail (abort, truncation) even
  // after fetch() itself resolved, and that must degrade the same way a
  // network-level failure does rather than throw out of backendJson.
  let bodyLength: number | null = null;
  let envelope: ApiResponse<T> | null = null;
  try {
    const rawText = await response.text();
    bodyLength = rawText.length;
    envelope = JSON.parse(rawText) as ApiResponse<T>;
  } catch {
    envelope = null;
  }

  if (!response.ok || !envelope?.success || envelope.data === undefined) {
    // Visibility into *why* a backend call failed -- the caller only ever
    // sees a terse "Backend 404"-style message, which wasn't enough to
    // diagnose a live-production mismatch between what backendJson actually
    // fetched and what curling the same path directly returned. Deliberately
    // omits `path` and any response body content: some callers (e.g. the
    // booking reference lookup) put an access credential *in* the path, and
    // an upstream/proxy error page could echo request data -- only the
    // resolved host, status, content-type, and body *length* are logged.
    console.error(
      `backendJson failure: status=${response.status} contentType=${response.headers.get('content-type')} bodyLength=${bodyLength ?? '(unreadable)'} message=${envelope?.message ?? envelope?.error ?? '(no message)'}`
    );
    return {
      ok: false,
      status: response.status,
      message: envelope?.message ?? envelope?.error ?? `Backend ${response.status}`,
    };
  }

  return { ok: true, status: response.status, data: envelope.data };
}
