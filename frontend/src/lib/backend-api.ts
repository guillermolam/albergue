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

// Deliberately dynamic (not `import { env } from 'cloudflare:workers'` at
// module scope): this file is imported by prerendered pages too, and Astro
// prerenders in plain Node, whose ESM loader throws
// ERR_UNSUPPORTED_ESM_URL_SCHEME on the `cloudflare:` protocol -- a static
// top-level import crashes the entire build. A dynamic import is only
// resolved when actually awaited (i.e. inside a live Workers request), so
// wrapping it in try/catch degrades cleanly everywhere else (Node
// prerendering, local `astro dev` without `wrangler dev`, tests).
async function getBackendBinding(): Promise<CloudflareServiceBinding | undefined> {
  try {
    const cf = await import('cloudflare:workers');
    return cf.env.BACKEND;
  } catch {
    return undefined;
  }
}

/**
 * Low-level Worker→backend request. Prefers the BACKEND Service Binding
 * (production) and falls back to a cache-bypassed fetch of BACKEND_API_URL
 * (local `astro dev`, tests). The binding path does not require
 * BACKEND_API_URL — Cloudflare routes by binding name, not URL host.
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

  // Same-account Worker-to-Worker calls (this Worker -> "albergue-backend")
  // must go through the Service Binding, not a raw fetch() to the
  // sibling's *.workers.dev URL: Cloudflare's public routing layer
  // returns a bare "Worker not found" for that kind of subrequest when
  // issued from inside a Worker, even though the exact same URL resolves
  // fine from outside (confirmed live in production). The binding calls
  // the sibling Worker directly, bypassing DNS/TLS/edge routing (and its
  // cache) entirely. Falls back to a normal cache-bypassed fetch when the
  // binding isn't provisioned (e.g. local `astro dev` without
  // `wrangler dev`).
  const backend = await getBackendBinding();
  if (backend) {
    // Host is ignored by the binding; only the path/query/headers/body matter.
    const url = new URL(path, 'https://backend.internal');
    return backend.fetch(new Request(url, requestInit));
  }

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
    // Also covers BackendUnavailableError when neither binding nor URL exist.
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
