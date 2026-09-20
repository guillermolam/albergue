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

export async function backendJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<{ ok: true; status: number; data: T } | { ok: false; status: number; message: string }> {
  let base: string;
  try {
    base = requireBackendUrl();
  } catch (error) {
    console.error(`backendJson failure: ${(error as Error).message}`);
    return { ok: false, status: 503, message: (error as Error).message };
  }

  let response: Response;
  try {
    response = await fetch(`${base}${path}`, {
      ...init,
      // Diagnostic: rule out a stale cached response for this
      // same-account *.workers.dev -> *.workers.dev fetch (a browser/curl
      // request to the identical URL succeeds; this Worker's own outbound
      // fetch to it doesn't). Standard `cache: 'no-store'` may not govern
      // Workers subrequests the way it does browser fetches, so this also
      // sets the Workers-specific `cf` cache directives as a belt-and-
      // suspenders bypass.
      cache: 'no-store',
      cf: { cacheTtl: 0, cacheEverything: false },
      headers: {
        accept: 'application/json',
        ...(init.body ? { 'content-type': 'application/json' } : {}),
        ...init.headers,
      },
    });
  } catch (error) {
    // A network-level failure (connection refused, DNS, timeout, ...)
    // throws rather than resolving a Response -- without this, it was
    // an uncaught exception that crashed the entire page render instead
    // of degrading the same way a missing/misconfigured URL does.
    console.error(`backendJson failure: base=${base} network error: ${(error as Error).message}`);
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
      `backendJson failure: base=${base} status=${response.status} contentType=${response.headers.get('content-type')} bodyLength=${bodyLength ?? '(unreadable)'} message=${envelope?.message ?? envelope?.error ?? '(no message)'}`
    );
    return {
      ok: false,
      status: response.status,
      message: envelope?.message ?? envelope?.error ?? `Backend ${response.status}`,
    };
  }

  return { ok: true, status: response.status, data: envelope.data };
}
