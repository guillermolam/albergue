/**
 * API Middleware Utilities
 * Request/Response middleware for Hono
 */

import type { Context, Next } from 'hono';
import type { MiddlewareHandler } from 'hono';
import { withRetry, formatError, CircuitBreaker, AppError } from './errors';

/**
 * Request ID generator
 */
let requestCounter = 0;

export function generateRequestId(): string {
  return `req-${process.pid || 0}-${Date.now()}-${++requestCounter}`;
}

/**
 * Request Context Utilities
 */

export interface RequestContext {
  requestId: string;
  startTime: number;
  ip: string;
  userAgent?: string;
  userId?: number | string;
  sessionId?: string;
}

// Type-safe way to add context to request
declare global {
  namespace Hono {
    interface ContextVariableMap {
      requestContext: RequestContext;
    }
  }
}

/**
 * Request context middleware
 * Adds request ID, timing, and client info to context
 */
export function requestContextMiddleware(): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    
    const ip = c.req.header('x-forwarded-for') || 
               c.req.header('x-real-ip') || 
               c.env?.remoteAddress || 
               'unknown';
    
    const userAgent = c.req.header('user-agent');
    
    const requestContext: RequestContext = {
      requestId,
      startTime,
      ip,
      userAgent,
    };
    
    c.set('requestContext', requestContext);
    
    // Add request ID to response headers
    c.header('x-request-id', requestId);
    c.header('x-response-time', '0'); // Will be updated later
    
    await next();
    
    // Update response time
    const responseTime = Date.now() - startTime;
    c.header('x-response-time', String(responseTime));
  };
}

/**
 * Error handling middleware
 * Catches errors and formats them consistently
 */
export function errorHandlerMiddleware(): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    try {
      await next();
    } catch (error: any) {
      const requestContext = c.get('requestContext') || { requestId: 'unknown' };
      
      console.error(`
[${new Date().toISOString()}] 
[${requestContext.requestId}] 
[${c.req.method}] ${c.req.path}
Error: ${error.message || String(error)}
Stack: ${error.stack || 'No stack'}
`);

      const formatted = formatError(error);
      const status = formatted.status || 500;
      
      c.status(status);
      return c.json({
        success: false,
        error: formatted.error,
        details: formatted.details,
        requestId: requestContext.requestId,
        timestamp: new Date().toISOString(),
      });
    }
  };
}

/**
 * Circuit breaker middleware
 * Wraps route handlers with circuit breaker
 */
export function circuitBreakerMiddleware(
  circuitBreaker?: CircuitBreaker
): MiddlewareHandler {
  const breaker = circuitBreaker || new CircuitBreaker();
  
  return async (c: Context, next: Next) => {
    await breaker.execute(async () => {
      await next();
    });
  };
}

/**
 * Retry middleware
 * Automatically retries failed requests
 */
export function retryMiddleware(
  options: {
    maxAttempts?: number;
    baseDelay?: number;
    maxDelay?: number;
    retryableStatuses?: number[];
    onRetry?: (attempt: number, error: Error) => void;
  } = {}
): MiddlewareHandler {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 5000,
    retryableStatuses = [500, 502, 503, 504],
    onRetry,
  } = options;

  return async (c: Context, next: Next) => {
    let lastError: Error | undefined;
    let attempt = 0;

    while (attempt < maxAttempts) {
      try {
        await next();
        return;
      } catch (error: any) {
        lastError = error;
        attempt++;
        
        // Check if retryable
        const status = error.status || error.statusCode || 0;
        const isRetryable = retryableStatuses.includes(status) || 
                          (error.name === 'TypeError' && error.message?.includes('fetch'));
        
        if (!isRetryable || attempt >= maxAttempts) {
          throw error;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          baseDelay * Math.pow(2, attempt - 1),
          maxDelay
        ) * (0.5 + Math.random()); // Add jitter
        
        if (onRetry) {
          onRetry(attempt, lastError);
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error('Unknown error');
  };
}

/**
 * Rate limiting middleware
 */

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const rateLimitStore: RateLimitStore = {};

export function rateLimiterMiddleware(
  options: {
    windowMs?: number;
    maxRequests?: number;
    keyGenerator?: (c: Context) => string;
    onRateLimited?: (c: Context) => void;
  } = {}
): MiddlewareHandler {
  const {
    windowMs = 60000, // 1 minute
    maxRequests = 100,
    keyGenerator = (c: Context) => c.env?.remoteAddress || 'global',
    onRateLimited,
  } = options;

  return async (c: Context, next: Next) => {
    const key = keyGenerator(c);
    const now = Date.now();
    
    const record = rateLimitStore[key] || { count: 0, resetTime: now + windowMs };
    
    // Reset if window has passed
    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }
    
    // Check if rate limited
    if (record.count >= maxRequests) {
      c.status(429);
      c.header('retry-after', String(Math.ceil((record.resetTime - now) / 1000)));
      
      if (onRateLimited) {
        onRateLimited(c);
      }
      
      return c.json({
        success: false,
        error: 'Rate limit exceeded',
        retryAfter: record.resetTime - now,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Increment and continue
    record.count++;
    rateLimitStore[key] = record;
    
    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      cleanupRateLimitStore(now);
    }
    
    await next();
  };
}

function cleanupRateLimitStore(now: number) {
  for (const key in rateLimitStore) {
    if (now > rateLimitStore[key].resetTime) {
      delete rateLimitStore[key];
    }
  }
}

/**
 * Caching middleware
 */

interface CacheEntry<T> {
  data: T;
  expires: number;
}

const memoryCache: Map<string, CacheEntry<any>> = new Map();

export function cachingMiddleware(
  options: {
    ttl?: number;
    keyGenerator?: (c: Context) => string;
    shouldCache?: (c: Context) => boolean;
    onCacheHit?: (c: Context) => void;
    onCacheMiss?: (c: Context) => void;
  } = {}
): MiddlewareHandler {
  const {
    ttl = 60000, // 1 minute
    keyGenerator = (c: Context) => `${c.req.method}:${c.req.path}`,
    shouldCache = () => true,
    onCacheHit,
    onCacheMiss,
  } = options;

  return async (c: Context, next: Next) => {
    if (c.req.method !== 'GET') {
      return await next();
    }
    
    const key = keyGenerator(c);
    const cached = memoryCache.get(key);
    
    if (cached && cached.expires > Date.now()) {
      if (onCacheHit) onCacheHit(c);
      
      c.header('x-cache', 'HIT');
      return c.json(cached.data);
    }
    
    if (onCacheMiss) onCacheMiss(c);
    
    // Capture response
    const originalJson = c.res.json.bind(c.res);
    c.res.json = (data: any) => {
      c.header('x-cache', shouldCache(c) ? 'MISS' : 'BYPASS');
      
      if (shouldCache(c)) {
        memoryCache.set(key, {
          data,
          expires: Date.now() + ttl,
        });
      }
      
      return originalJson(data);
    };
    
    await next();
  };
}

/**
 * Response compression middleware
 */
export function compressionMiddleware(): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    await next();
    
    // Only compress JSON responses
    if (c.res.headers.get('content-type')?.includes('application/json')) {
      const body = c.res.body;
      if (body && typeof body === 'object') {
        // Simple stringification (real compression would need compression library)
        c.res.body = JSON.stringify(body);
      }
    }
  };
}

/**
 * Request validation middleware
 */
export function validateRequest<T>(
  schema: any, // Zod schema
  source: 'body' | 'query' | 'header' = 'body'
): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    let data: unknown;
    
    try {
      switch (source) {
        case 'body':
          data = await c.req.json();
          break;
        case 'query':
          data = c.req.query();
          break;
        case 'header':
          data = Object.fromEntries(c.req.raw.headers);
          break;
        default:
          data = await c.req.json();
      }
      
      // Validate with schema
      // @ts-ignore - Zod schema parsing
      const validated = schema.parse(data);
      
      // Store validated data on context
      c.set('validatedData', validated);
      
      await next();
    } catch (error: any) {
      c.status(400);
      return c.json({
        success: false,
        error: 'Validation failed',
        details: error.errors?.map((e: any) => ({
          path: e.path?.join('.') || 'root',
          message: e.message,
        })),
        timestamp: new Date().toISOString(),
      });
    }
  };
}

/**
 * Authentication middleware (placeholder)
 */
export function authMiddleware(
  options: {
    requireAuth?: boolean;
    roles?: string[];
  } = {}
): MiddlewareHandler {
  const { requireAuth = true, roles = [] } = options;

  return async (c: Context, next: Next) => {
    // In a real implementation, this would validate tokens, sessions, etc.
    const user = c.get('user');
    
    if (requireAuth && !user) {
      c.status(401);
      return c.json({
        success: false,
        error: 'Authentication required',
        timestamp: new Date().toISOString(),
      });
    }
    
    if (roles.length > 0 && user && !roles.includes(user.role)) {
      c.status(403);
      return c.json({
        success: false,
        error: 'Insufficient permissions',
        timestamp: new Date().toISOString(),
      });
    }
    
    await next();
  };
}

/**
 * Logging middleware
 */
export function loggingMiddleware(
  options: {
    logRequests?: boolean;
    logResponses?: boolean;
    logErrors?: boolean;
    logger?: (...args: any[]) => void;
  } = {}
): MiddlewareHandler {
  const {
    logRequests = true,
    logResponses = true,
    logErrors = true,
    logger = console.log,
  } = options;

  return async (c: Context, next: Next) => {
    const start = Date.now();
    const requestContext = c.get('requestContext') || {};
    
    // Log request
    if (logRequests) {
      logger(`
[${new Date().toISOString()}] 
[${requestContext.requestId || 'unknown'}] 
[${c.req.method}] ${c.req.path}
IP: ${requestContext.ip}
UA: ${requestContext.userAgent || 'unknown'}
`);
    }
    
    try {
      await next();
      
      const duration = Date.now() - start;
      
      // Log response
      if (logResponses) {
        logger(`
[${new Date().toISOString()}] 
[${requestContext.requestId || 'unknown'}] 
[${c.req.method}] ${c.req.path}
Status: ${c.res.status}
Duration: ${duration}ms
`);
      }
    } catch (error: any) {
      const duration = Date.now() - start;
      
      // Log error
      if (logErrors) {
        logger(`
[${new Date().toISOString()}] 
[${requestContext.requestId || 'unknown'}] 
[${c.req.method}] ${c.req.path}
Status: ${error.status || 500}
Duration: ${duration}ms
Error: ${error.message || String(error)}
`);
      }
      
      throw error;
    }
  };
}

/**
 * Correlation ID middleware
 * Tracks requests across services
 */
export function correlationIdMiddleware(): MiddlewareHandler {
  return async (c: Context, next: Next) => {
    const correlationId = 
      c.req.header('x-correlation-id') || 
      c.req.header('x-request-id') || 
      generateRequestId();
    
    c.set('correlationId', correlationId);
    c.header('x-correlation-id', correlationId);
    
    await next();
  };
}

export {
  generateRequestId,
  requestContextMiddleware,
  errorHandlerMiddleware,
  circuitBreakerMiddleware,
  retryMiddleware,
  rateLimiterMiddleware,
  cachingMiddleware,
  compressionMiddleware,
  validateRequest,
  authMiddleware,
  loggingMiddleware,
  correlationIdMiddleware,
};
