/**
 * Same-origin /api/camino/* for browser islands.
 * Proxies via Cloudflare Service Binding (static import — dynamic
 * `import('cloudflare:workers')` hangs intermittently in production).
 * Local Node falls through when BACKEND is unset.
 */
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { backendFetch } from '../../../lib/backend-api';

export const prerender = false;

const COOKIE = 'camino_sid';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 400;

function newSessionId(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

function readSession(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)camino_sid=([a-zA-Z0-9_-]{8,128})/);
  return match?.[1] ?? null;
}

function sessionCookie(id: string, secure: boolean): string {
  const flags = [
    `${COOKIE}=${id}`,
    'Path=/',
    `Max-Age=${COOKIE_MAX_AGE}`,
    'SameSite=Lax',
    'HttpOnly',
  ];
  if (secure) flags.push('Secure');
  return flags.join('; ');
}

function callBackend(path: string, init: RequestInit): Promise<Response> {
  if (env.BACKEND) {
    return env.BACKEND.fetch(new Request(new URL(path, 'https://albergue-backend.internal'), init));
  }
  return backendFetch(path, init);
}

async function proxyCamino(
  request: Request,
  backendPath: string,
  init: RequestInit = {}
): Promise<Response> {
  let sessionId = readSession(request.headers.get('cookie'));
  const setCookie = !sessionId;
  if (!sessionId) sessionId = newSessionId();

  try {
    const upstream = await callBackend(backendPath, {
      ...init,
      headers: {
        ...(init.headers ?? {}),
        'X-Camino-Session': sessionId,
        'X-Requested-With': 'XMLHttpRequest',
        accept: 'application/json',
      },
    });
    const body = await upstream.text();
    const headers = new Headers({
      'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      'Cache-Control': 'no-store',
    });
    if (setCookie) {
      const secure = new URL(request.url).protocol === 'https:';
      headers.set('Set-Cookie', sessionCookie(sessionId, secure));
    }
    return new Response(body, { status: upstream.status, headers });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Backend unavailable',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const GET: APIRoute = async ({ request, params }) => {
  const rest = params.path ?? '';
  return proxyCamino(request, `/api/camino/${rest}`);
};

export const POST: APIRoute = async ({ request, params }) => {
  const rest = params.path ?? '';
  const body = await request.text();
  return proxyCamino(request, `/api/camino/${rest}`, {
    method: 'POST',
    body,
    headers: { 'Content-Type': 'application/json' },
  });
};
