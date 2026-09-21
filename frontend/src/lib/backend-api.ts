/**
 * Server-only Hono client. Used by Actions and on-demand pages.
 * Never imported from client islands.
 */
import backendApp from 'albergue-backend/app';
import type { ApiResponse } from '@albergue/api-contract';

/**
 * Low-level Worker→backend request.
 *
 * Calls the backend's Hono app in-process via `.request()` instead of an
 * HTTP fetch to any URL -- there is no separate backend Worker anymore
 * (frontend and backend are deployed together; see wrangler.jsonc). This
 * replaced three earlier Worker-to-Worker approaches, all of which failed
 * for reasons specific to that architecture: a raw fetch() to the sibling
 * Worker's *.workers.dev URL got a bare "Worker not found" from
 * Cloudflare's public routing layer; a Service Binding accessed via a
 * dynamic `cloudflare:workers` import hung indefinitely at runtime; the
 * same binding via a static import crashed Node-based prerendering and
 * every non-Cloudflare build target. In-process invocation has none of
 * those failure modes -- it's a plain function call, not a network hop,
 * and `backend/src/app.ts` reads every secret it needs via `process.env`
 * (never Hono's `c.env`/Cloudflare bindings), so no env-threading is
 * needed here either.
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

  return backendApp.request(path, requestInit);
}

export async function backendJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<{ ok: true; status: number; data: T } | { ok: false; status: number; message: string }> {
  let response: Response;
  try {
    response = await backendFetch(path, init);
  } catch (error) {
    // A thrown error out of the in-process call (a bug in a route handler,
    // not a network condition anymore) must still degrade the same way a
    // missing/misconfigured backend used to, rather than crash the page
    // render.
    console.error(`backendJson failure: ${(error as Error).message}`);
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
    // status, content-type, and body *length* are logged.
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
