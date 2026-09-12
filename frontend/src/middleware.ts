import { sequence } from 'astro:middleware';
import { requestIdMiddleware } from './middleware/request-id';
import { securityMiddleware } from './middleware/security';
import { localeMiddleware } from './middleware/locale';
import { authMiddleware } from './middleware/auth';
import { mockApiMiddleware } from './middleware/mock-api';

/**
 * Middleware chain (ASTRO-004). Order matters:
 * request-id → security → locale → auth → mock-api (dev only, terminal).
 */
export const onRequest = sequence(
  requestIdMiddleware,
  securityMiddleware,
  localeMiddleware,
  authMiddleware,
  mockApiMiddleware
);
