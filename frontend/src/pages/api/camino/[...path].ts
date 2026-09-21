/**
 * Same-origin /api/camino/* for browser islands.
 * Proxies to the Hono backend via Cloudflare Service Binding when available,
 * otherwise BACKEND_API_URL (local Node). Anonymous session cookie stamped here.
 */
import type { APIRoute } from 'astro';
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

/** Worker→Worker via Service Binding; public *.workers.dev fetch returns CF 1042. */
async function callBackend(path: string, init: RequestInit): Promise<Response> {
  try {
    const { env } = await import('cloudflare:workers');
    if (env.BACKEND) {
      const request = new Request(new URL(path, 'https://albergue-backend.internal'), init);
      return env.BACKEND.fetch(request);
    }
  } catch {
    // Plain Node / astro dev — no cloudflare:workers module.
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
