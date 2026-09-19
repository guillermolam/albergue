import { defineMiddleware } from 'astro:middleware';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Baseline security headers (ASTRO-004) + CSRF origin check (AUTH-005).
 *
 * The session cookie is SameSite=Lax and HttpOnly (Astro session defaults),
 * which already blocks cross-site POSTs from carrying it. Defense in depth:
 * mutating requests that carry cookies and declare a cross-site Origin are
 * rejected. Server-to-server calls (no Origin header) pass.
 *
 * CSP is deliberately deferred: Swup, inline island scripts and RoughJS
 * need a nonce-based policy designed against the real script inventory.
 * Tracked under the Phase 11 security budgets.
 */
export const securityMiddleware = defineMiddleware(async (context, next) => {
  if (
    MUTATING_METHODS.has(context.request.method) &&
    context.request.headers.has('cookie') &&
    context.request.headers.has('origin')
  ) {
    const origin = context.request.headers.get('origin')!;
    if (new URL(origin).origin !== context.url.origin) {
      return new Response('Forbidden', {
        status: 403,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  }

  const response = await next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
});
