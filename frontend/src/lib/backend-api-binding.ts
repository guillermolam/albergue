/**
 * backendJson, but via a STATIC `cloudflare:workers` import so it goes
 * through the BACKEND Service Binding -- the reliable, Cloudflare-documented
 * mechanism for same-account Worker-to-Worker calls (a raw fetch() to the
 * sibling's *.workers.dev URL gets a bare "Worker not found" from
 * Cloudflare's public routing layer when issued from inside a Worker,
 * confirmed live in production).
 *
 * Deliberately its own module, duplicating backend-api.ts's envelope
 * parsing rather than sharing it: backend-api.ts is imported by prerendered
 * pages too, and Astro prerenders in plain Node, whose ESM loader throws on
 * the `cloudflare:` protocol scheme -- a static top-level import there
 * crashes the whole build. A dynamic `import('cloudflare:workers')` inside
 * backend-api.ts avoided that crash but then hung indefinitely once
 * deployed (confirmed live: the backend Worker's own logs never showed the
 * request arriving, for several minutes). This file is ONLY safe to import
 * from a page with `export const prerender = false` -- never from
 * backend-api.ts or anything it or a prerendered page might reach.
 */
import { env } from 'cloudflare:workers';
import type { ApiResponse } from '@albergue/api-contract';

export async function backendJsonViaBinding<T>(
  path: string,
  init: RequestInit = {}
): Promise<{ ok: true; status: number; data: T } | { ok: false; status: number; message: string }> {
  if (!env.BACKEND) {
    console.error('backendJsonViaBinding failure: BACKEND service binding is not configured.');
    return { ok: false, status: 503, message: 'BACKEND service binding is not configured.' };
  }

  const requestInit: RequestInit = {
    ...init,
    headers: {
      accept: 'application/json',
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...init.headers,
    },
  };

  let response: Response;
  try {
    response = await env.BACKEND.fetch(
      new Request(new URL(path, 'https://backend.internal'), requestInit)
    );
  } catch (error) {
    console.error(`backendJsonViaBinding failure: network error: ${(error as Error).message}`);
    return { ok: false, status: 503, message: (error as Error).message };
  }

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
    console.error(
      `backendJsonViaBinding failure: status=${response.status} contentType=${response.headers.get('content-type')} bodyLength=${bodyLength ?? '(unreadable)'} message=${envelope?.message ?? envelope?.error ?? '(no message)'}`
    );
    return {
      ok: false,
      status: response.status,
      message: envelope?.message ?? envelope?.error ?? `Backend ${response.status}`,
    };
  }

  return { ok: true, status: response.status, data: envelope.data };
}
