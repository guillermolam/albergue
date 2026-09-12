import { defineMiddleware } from 'astro:middleware';

/**
 * Baseline security headers (ASTRO-004).
 *
 * CSP is deliberately deferred: Swup, inline island scripts and RoughJS
 * need a nonce-based policy designed against the real script inventory.
 * Tracked under the Phase 11 security budgets.
 */
export const securityMiddleware = defineMiddleware(async (context, next) => {
  const response = await next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
});
