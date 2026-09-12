import { defineMiddleware } from 'astro:middleware';

/**
 * Auth gate (ASTRO-004).
 *
 * Phase 5 (AUTH-*) replaces the null identity with HttpOnly session
 * resolution. Until then every request is a guest and /admin stays closed.
 */
export const authMiddleware = defineMiddleware(async (context, next) => {
  context.locals.user = null;
  context.locals.role = 'guest';
  context.locals.sessionToken = null;

  const { pathname } = context.url;
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new Response('Admin access is disabled until server-verified authentication is available.', {
      status: 403,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  return next();
});
