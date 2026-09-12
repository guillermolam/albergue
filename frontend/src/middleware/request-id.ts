import { defineMiddleware } from 'astro:middleware';

/**
 * Request correlation (ASTRO-004). Propagates an inbound `x-request-id`
 * or mints a new one; exposed on `locals.requestId` and echoed back.
 */
export const requestIdMiddleware = defineMiddleware(async (context, next) => {
  const requestId = context.request.headers.get('x-request-id') ?? crypto.randomUUID();
  context.locals.requestId = requestId;

  const response = await next();
  response.headers.set('x-request-id', requestId);
  return response;
});
