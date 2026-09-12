/**
 * Authentication contract.
 * Until Phase 5 lands HttpOnly session auth, the only credential is a static
 * admin bearer token (ADMIN_API_TOKEN) verified by the backend.
 */

export type Role = "admin" | "pilgrim" | "guest";

export interface AuthenticatedUser {
  id: string;
  role: Role;
}

/** Header carrying `Bearer <token>` credentials. */
export const AUTHORIZATION_HEADER = "authorization";

/** Astro session key under which the verified identity is stored (AUTH-002). */
export const AUTH_SESSION_KEY = "auth";

export interface LoginRequest {
  username: string;
  password: string;
}

/** Verified identity returned by POST /api/auth/login. */
export interface LoginResponse {
  id: string;
  username: string;
  role: Role;
}
