/**
 * Error Handling Utilities
 * Centralized error types and handlers for the application
 */

import type { ZodError } from 'zod';

/**
 * Custom Application Errors
 */

// Base application error
class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly statusCode: number,
    message: string,
    public readonly details?: any,
    public readonly isRetryable: boolean = false
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Database errors
export class DatabaseError extends AppError {
  constructor(
    message: string,
    details?: any,
    isRetryable: boolean = true
  ) {
    super('DB_ERROR', 500, message, details, isRetryable);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    super(
      'NOT_FOUND',
      404,
      `${resource} not found${id ? ` with id ${id}` : ''}`
    );
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', 400, message, details, false);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super('CONFLICT_ERROR', 409, message, details, false);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', 401, message, undefined, false);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super('FORBIDDEN', 403, message, undefined, false);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super('RATE_LIMIT', 429, message, { retryAfter }, true);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = 'Service unavailable', retryAfter?: number) {
    super('SERVICE_UNAVAILABLE', 503, message, { retryAfter }, true);
  }
}

/**
 * Retry Configuration
 */
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter: boolean;
  retryableStatuses: number[];
  retryableErrors: string[];
}

export const defaultRetryConfig: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
  jitter: true,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  retryableErrors: ['DB_ERROR', 'SERVICE_UNAVAILABLE', 'RATE_LIMIT'],
};

/**
 * Retry with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const retryConfig = { ...defaultRetryConfig, ...config };
  const { maxAttempts, baseDelay, maxDelay, backoffMultiplier, jitter, retryableErrors, retryableStatuses } = retryConfig;

  let lastError: Error | undefined;
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      attempt++;

      // Check if error is retryable
      const isRetryable = isRetryableError(error, retryableErrors, retryableStatuses);
      
      if (!isRetryable || attempt >= maxAttempts) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = calculateBackoffDelay(attempt, baseDelay, maxDelay, backoffMultiplier, jitter);
      
      console.warn(
        `Attempt ${attempt}/${maxAttempts} failed for ${operation.name || 'operation'}. ` +
        `Retrying in ${delay}ms. Error: ${error.message || String(error)}`
      );

      // Wait for the calculated delay
      await sleep(delay);
    }
  }

  // This should never be reached, but just in case
  throw lastError || new Error('Unknown error during retry');
}

/**
 * Execute operation with circuit breaker pattern
 */
export class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failureCount: number = 0;
  private nextAttempt: number = 0;
  
  constructor(
    private readonly maxFailures: number = 5,
    private readonly resetTimeout: number = 30000,
    private readonly halfOpenMaxAttempts: number = 3
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    const now = Date.now();
    
    if (this.state === 'OPEN') {
      if (now < this.nextAttempt) {
        throw new ServiceUnavailableError(
          `Service in circuit breaker OPEN state. Retry after ${this.nextAttempt - now}ms`,
          this.nextAttempt - now
        );
      }
      // Move to HALF_OPEN state
      this.state = 'HALF_OPEN';
      this.nextAttempt = now + this.resetTimeout;
    }

    try {
      const result = await operation();
      
      // Success - reset circuit breaker
      this.reset();
      return result;
    } catch (error: any) {
      this.failureCount++;
      
      if (this.state === 'HALF_OPEN' && this.failureCount >= this.halfOpenMaxAttempts) {
        // Back to OPEN state
        this.trip();
      } else if (this.state === 'CLOSED' && this.failureCount >= this.maxFailures) {
        this.trip();
      }
      
      throw error;
    }
  }

  private trip(): void {
    this.state = 'OPEN';
    this.nextAttempt = Date.now() + this.resetTimeout;
    this.failureCount = 0;
  }

  private reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.nextAttempt = 0;
  }

  getState(): string {
    return this.state;
  }

  getFailureCount(): number {
    return this.failureCount;
  }
}

// Global circuit breakers for different services
export const dbCircuitBreaker = new CircuitBreaker(10, 60000);

/**
 * Helper functions
 */

function isRetryableError(
  error: any,
  retryableErrorCodes: string[],
  retryableStatuses: number[]
): boolean {
  // Check if it's an AppError with retryable code
  if (error instanceof AppError) {
    return retryableErrorCodes.includes(error.code);
  }

  // Check for HTTP status codes (from fetch responses)
  if (error.response?.status) {
    return retryableStatuses.includes(error.response.status);
  }

  if (error.statusCode) {
    return retryableStatuses.includes(error.statusCode);
  }

  // Check for specific error messages or types
  if (error.code) {
    return retryableErrorCodes.includes(error.code);
  }

  // Network errors are usually retryable
  if (error.name === 'FetchError' || error.name === 'TypeError') {
    return true;
  }

  return false;
}

function calculateBackoffDelay(
  attempt: number,
  baseDelay: number,
  maxDelay: number,
  backoffMultiplier: number,
  jitter: boolean
): number {
  // Exponential backoff: baseDelay * multiplier^(attempt-1)
  const exponentialDelay = baseDelay * Math.pow(backoffMultiplier, attempt - 1);
  
  // Apply jitter (random factor between 0.5 and 1.5)
  const jitterFactor = jitter ? 0.5 + Math.random() : 1;
  
  const delay = Math.min(Math.floor(exponentialDelay * jitterFactor), maxDelay);
  
  return delay;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format error for API responses
 */
export function formatError(error: any): { error: string; details?: any; status: number } {
  if (error instanceof AppError) {
    return {
      error: error.message,
      details: error.details,
      status: error.statusCode,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      status: 500,
    };
  }

  // Handle Zod validation errors
  if (error?.errors && Array.isArray(error.errors)) {
    return {
      error: 'Validation failed',
      details: error.errors.map((e: any) => ({
        path: e.path?.join('.') || 'root',
        message: e.message,
      })),
      status: 400,
    };
  }

  return {
    error: String(error),
    status: 500,
  };
}

/**
 * Wrap database operations with error handling
 */
export function wrapDatabaseOperation<T extends any[], R>(
  operation: (...args: T) => Promise<R>,
  context: string
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await operation(...args);
    } catch (error: any) {
      console.error(`Database operation failed [${context}]:`, error);
      throw new DatabaseError(
        `Database operation failed: ${context}`,
        { originalError: error.message, context },
        isTransientError(error)
      );
    }
  };
}

/**
 * Check if error is transient (temporary and likely to succeed on retry)
 */
function isTransientError(error: any): boolean {
  const transientMessages = [
    'connection',
    'timeout',
    'deadlock',
    'lock',
    'temporary',
    'unavailable',
    'ETIMEDOUT',
    'ECONNREFUSED',
    'ECONNRESET',
    'ENOTFOUND',
  ];

  const message = (error.message || '').toLowerCase();
  return transientMessages.some(m => message.includes(m));
}

/**
 * Result type for operations that might fail
 */
export type Result<T, E = Error> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: E };

/**
 * Execute operation safely and return Result type
 */
export async function executeSafely<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<Result<T>> {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error: any) {
    console.error(`Operation failed${context ? ` [${context}]` : ''}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

/**
 * Batch execution with partial success handling
 */
export async function executeBatch<T, R>(
  items: T[],
  operation: (item: T) => Promise<R>,
  batchSize: number = 10,
  stopOnFirstError: boolean = false
): Promise<{
  succeeded: R[];
  failed: Array<{ item: T; error: Error }>;
  total: number;
  succeededCount: number;
  failedCount: number;
}> {
  const succeeded: R[] = [];
  const failed: Array<{ item: T; error: Error }> = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    type BatchResult =
      | { success: true; result: R }
      | { success: false; error: Error; item: T };

    const batchPromises = batch.map(async (item): Promise<BatchResult> => {
      try {
        const result = await operation(item);
        return { success: true, result };
      } catch (error: any) {
        return {
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
          item,
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);

    for (const result of batchResults) {
      if (result.success) {
        succeeded.push(result.result);
      } else {
        failed.push({ item: result.item, error: result.error });
        if (stopOnFirstError) break;
      }
    }

    if (stopOnFirstError && failed.length > 0) break;
  }

  return {
    succeeded,
    failed,
    total: items.length,
    succeededCount: succeeded.length,
    failedCount: failed.length,
  };
}

export { AppError };
