/**
 * Custom error types for the domain model
 */

export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error,
    public readonly query?: string,
    public readonly params?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends Error {
  constructor(
    resource: string,
    id: string | number,
    public readonly cause?: Error,
  ) {
    super(`${resource} with id ${id} not found`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string = 'Rate limit exceeded',
    public readonly retryAfter?: number,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ExternalServiceError extends Error {
  constructor(
    message: string,
    public readonly service: string,
    public readonly statusCode?: number,
    public readonly cause?: Error,
  ) {
    super(message);
    this.name = 'ExternalServiceError';
  }
}

/**
 * Result type for operations that can fail
 */
export type Result<T, E extends Error = Error> = 
  | { success: true; data: T }
  | { success: false; error: E; retries?: number };

/**
 * Retry configuration for resilient operations
 */
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: (error: Error) => boolean;
}

/**
 * Default retry configuration
 */
export const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  baseDelay: 100,
  maxDelay: 5000,
  backoffMultiplier: 2,
  retryableErrors: (error) => {
    // Retry on transient errors
    if (error.name === 'DatabaseError') return true;
    if (error.name === 'RateLimitError') return true;
    if (error.message.includes('connection')) return true;
    if (error.message.includes('timeout')) return true;
    if (error.message.includes('deadlock')) return true;
    return false;
  },
};

/**
 * Sleep utility for retry delays
 */
export const sleep = (ms: number): Promise<void> => 
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Execute a function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {},
): Promise<Result<T>> {
  const retryConfig = { ...defaultRetryConfig, ...config };
  let lastError: Error | undefined;
  let retries = 0;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      const result = await fn();
      return { success: true, data: result };
    } catch (error) {
      lastError = error as Error;
      retries = attempt;

      // Don't retry if not retryable
      if (!retryConfig.retryableErrors?.(lastError)) {
        break;
      }

      // Don't retry on last attempt
      if (attempt >= retryConfig.maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        retryConfig.baseDelay * Math.pow(retryConfig.backoffMultiplier, attempt),
        retryConfig.maxDelay,
      );

      // Add jitter to prevent thundering herd
      const jitter = delay * 0.1 * Math.random();
      await sleep(delay + jitter);
    }
  }

  return { 
    success: false, 
    error: lastError!, 
    retries 
  };
}

/**
 * Wrapper for database operations with automatic retry
 */
export async function withDbRetry<T>(
  fn: () => Promise<T>,
  config?: Partial<RetryConfig>,
): Promise<T> {
  const result = await withRetry(fn, {
    ...config,
    retryableErrors: (error) => {
      // Always retry database errors
      if (error.name === 'DatabaseError') return true;
      if (error.message.includes('connection reset')) return true;
      if (error.message.includes('timeout')) return true;
      return config?.retryableErrors?.(error) ?? false;
    },
  });

  if (!result.success) {
    throw result.error;
  }
  return result.data;
}
