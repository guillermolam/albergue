/**
 * Authentication contract.
 * Until Phase 5 lands HttpOnly session auth, the only credential is a static
 * admin bearer token (ADMIN_API_TOKEN) verified by the backend.
 */

export type Role = 'admin' | 'pilgrim' | 'guest';

export interface AuthenticatedUser {
  id: string;
  role: Role;
}

/** Header carrying `Bearer <token>` credentials. */
export const AUTHORIZATION_HEADER = 'authorization';
