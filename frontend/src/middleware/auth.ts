import { defineMiddleware } from "astro:middleware";
import { AUTH_SESSION_KEY, type LoginResponse } from "@albergue/api-contract";

/**
 * Auth gate (ASTRO-004 / AUTH-003 / AUTH-004).
 *
 * Identity authority is the backend (users table); the verified identity is
 * carried in the server-side Astro session, so this middleware trusts the
 * session driver — the cookie holds only an opaque session ID.
 *
 * RBAC: /admin requires an authenticated admin; everyone else is a guest.
 */
export const authMiddleware = defineMiddleware(async (context, next) => {
  const identity = await context.session?.get<LoginResponse>(AUTH_SESSION_KEY);

  context.locals.user = identity ? { id: identity.id, email: "", name: identity.username } : null;
  context.locals.role = identity?.role ?? "guest";
  context.locals.sessionToken = context.session?.sessionID ?? null;

  const { pathname } = context.url;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!identity) {
      return context.redirect("/auth");
    }
    if (identity.role !== "admin") {
      return new Response("Forbidden", {
        status: 403,
        headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  }

  return next();
});
