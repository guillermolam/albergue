/**
 * Resiliency Tests
 * Tests for error handling, retries, circuit breakers, and middleware
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  withRetry,
  CircuitBreaker,
  DatabaseError,
  NotFoundError,
  ValidationError,
  formatError,
  executeSafely,
  executeBatch,
  defaultRetryConfig,
} from '../lib/errors';

// Mock functions for testing
let attemptCount = 0;
const mockSuccess = () => Promise.resolve('success');
const mockFailThenSuccess = () => {
  attemptCount++;
  if (attemptCount < 2) {
    return Promise.reject(new Error('Temporary failure'));
  }
  return Promise.resolve('success after retry');
};
const mockAlwaysFail = () => Promise.reject(new Error('Always fails'));
const mockRetryableError = () => Promise.reject(new DatabaseError('Connection failed'));
const mockNonRetryableError = () => Promise.reject(new ValidationError('Invalid input'));

// Reset attempt count
const resetAttempts = () => { attemptCount = 0; };

describe('withRetry', () => {
  beforeEach(resetAttempts);
  afterEach(resetAttempts);

  it('should return immediately on success', async () => {
    const result = await withRetry(mockSuccess);
    expect(result).toBe('success');
  });

  it('should retry and succeed after temporary failure', async () => {
    const result = await withRetry(mockFailThenSuccess, {
      maxAttempts: 3,
      baseDelay: 10,
    });
    expect(result).toBe('success after retry');
    expect(attemptCount).toBe(2);
  });

  it('should throw after max attempts exceeded', async () => {
    await expect(withRetry(mockAlwaysFail, {
      maxAttempts: 3,
      baseDelay: 10,
    })).rejects.toThrow('Always fails');
  });

  it('should not retry non-retryable errors', async () => {
    await expect(withRetry(mockNonRetryableError, {
      maxAttempts: 3,
      baseDelay: 10,
    })).rejects.toThrow(ValidationError);
    expect(attemptCount).toBe(1);
  });

  it('should retry retryable errors', async () => {
    await expect(withRetry(mockRetryableError, {
      maxAttempts: 3,
      baseDelay: 10,
    })).rejects.toThrow(DatabaseError);
    expect(attemptCount).toBe(3);
  });

  it('should respect custom retry configuration', async () => {
    const startTime = Date.now();
    
    await expect(withRetry(mockAlwaysFail, {
      maxAttempts: 2,
      baseDelay: 50,
      maxDelay: 100,
      backoffMultiplier: 1,
      jitter: false,
    })).rejects.toThrow();
    
    const elapsed = Date.now() - startTime;
    // Should be at least baseDelay * (1 + 2) = 150ms with some margin
    expect(elapsed).toBeGreaterThanOrEqual(100);
  });
});

describe('CircuitBreaker', () => {
  it('should start in CLOSED state', () => {
    const breaker = new CircuitBreaker();
    expect(breaker.getState()).toBe('CLOSED');
    expect(breaker.getFailureCount()).toBe(0);
  });

  it('should open after max failures', async () => {
    const breaker = new CircuitBreaker(3, 1000, 1);
    const mockFail = () => Promise.reject(new Error('Failed'));

    // First 3 failures should pass through
    for (let i = 0; i < 3; i++) {
      await expect(breaker.execute(mockFail)).rejects.toThrow();
    }

    expect(breaker.getState()).toBe('OPEN');
    expect(breaker.getFailureCount()).toBe(0); // Reset on trip
  });

  it('should reject immediately when OPEN', async () => {
    const breaker = new CircuitBreaker(1, 1000, 1);
    const mockFail = () => Promise.reject(new Error('Failed'));

    await expect(breaker.execute(mockFail)).rejects.toThrow();
    expect(breaker.getState()).toBe('OPEN');

    // Should fail immediately
    const start = Date.now();
    await expect(breaker.execute(mockFail)).rejects.toThrow(/circuit breaker/);
    const elapsed = Date.now() - start;
    
    // Should be almost immediate (< 100ms)
    expect(elapsed).toBeLessThan(100);
  });

  it('should move to HALF_OPEN after reset timeout', async () => {
    const breaker = new CircuitBreaker(1, 50, 1); // 50ms timeout
    const mockFail = () => Promise.reject(new Error('Failed'));

    await expect(breaker.execute(mockFail)).rejects.toThrow();
    expect(breaker.getState()).toBe('OPEN');

    // Wait for reset timeout
    await new Promise(resolve => setTimeout(resolve, 60));

    // Next attempt should move to HALF_OPEN
    const mockSuccess = () => Promise.resolve('success');
    const result = await breaker.execute(mockSuccess);
    
    expect(result).toBe('success');
    expect(breaker.getState()).toBe('CLOSED');
  });

  it('should reset to CLOSED on success', async () => {
    const breaker = new CircuitBreaker(3, 1000, 1);
    const mockFail = () => Promise.reject(new Error('Failed'));
    const mockSuccess = () => Promise.resolve('success');

    // Fail twice (under threshold)
    await expect(breaker.execute(mockFail)).rejects.toThrow();
    await expect(breaker.execute(mockFail)).rejects.toThrow();
    
    expect(breaker.getState()).toBe('CLOSED');
    expect(breaker.getFailureCount()).toBe(2);

    // Success should reset
    await breaker.execute(mockSuccess);
    expect(breaker.getState()).toBe('CLOSED');
    expect(breaker.getFailureCount()).toBe(0);
  });
});

describe('Error Classes', () => {
  it('should create DatabaseError with correct properties', () => {
    const error = new DatabaseError('Connection failed', { host: 'localhost' });
    expect(error.code).toBe('DB_ERROR');
    expect(error.statusCode).toBe(500);
    expect(error.message).toContain('Connection failed');
    expect(error.details).toEqual({ host: 'localhost' });
    expect(error.isRetryable).toBe(true);
    expect(error instanceof Error).toBe(true);
  });

  it('should create NotFoundError with correct properties', () => {
    const error = new NotFoundError('Pilgrim', 123);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain('Pilgrim');
    expect(error.message).toContain('123');
    expect(error.isRetryable).toBe(false);
  });

  it('should create ValidationError with correct properties', () => {
    const error = new ValidationError('Invalid email format', { field: 'email' });
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.statusCode).toBe(400);
    expect(error.isRetryable).toBe(false);
  });
});

describe('formatError', () => {
  it('should format AppError correctly', () => {
    const error = new DatabaseError('Connection failed', { host: 'localhost' });
    const formatted = formatError(error);
    
    expect(formatted.error).toContain('Connection failed');
    expect(formatted.details).toEqual({ host: 'localhost' });
    expect(formatted.status).toBe(500);
  });

  it('should format generic Error', () => {
    const error = new Error('Something went wrong');
    const formatted = formatError(error);
    
    expect(formatted.error).toBe('Something went wrong');
    expect(formatted.status).toBe(500);
    expect(formatted.details).toBeUndefined();
  });

  it('should format Zod validation error', () => {
    const mockZodError = {
      errors: [
        { path: ['email'], message: 'Invalid email' },
        { path: ['password'], message: 'Too short' },
      ],
    };
    
    const formatted = formatError(mockZodError);
    
    expect(formatted.error).toBe('Validation failed');
    expect(formatted.status).toBe(400);
    expect(formatted.details).toHaveLength(2);
    expect(formatted.details[0].path).toBe('email');
  });

  it('should format unknown error', () => {
    const formatted = formatError('Unknown error');
    
    expect(formatted.error).toBe('Unknown error');
    expect(formatted.status).toBe(500);
  });
});

describe('executeSafely', () => {
  it('should return success result', async () => {
    const result = await executeSafely(mockSuccess);
    expect(result.success).toBe(true);
    expect(result.data).toBe('success');
    expect(result.error).toBeUndefined();
  });

  it('should return error result', async () => {
    const result = await executeSafely(mockAlwaysFail);
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error.message).toBe('Always fails');
  });
});

describe('executeBatch', () => {
  it('should process all items successfully', async () => {
    const items = [1, 2, 3, 4, 5];
    const mockOperation = async (n: number) => `processed-${n}`;

    const result = await executeBatch(items, mockOperation, 10);

    expect(result.succeeded).toHaveLength(5);
    expect(result.failed).toHaveLength(0);
    expect(result.succeededCount).toBe(5);
    expect(result.failedCount).toBe(0);
    expect(result.total).toBe(5);
  });

  it('should handle partial failures', async () => {
    const items = [1, 2, 3, 4, 5];
    const mockOperation = async (n: number) => {
      if (n % 2 === 0) {
        throw new Error(`Even number ${n}`);
      }
      return `processed-${n}`;
    };

    const result = await executeBatch(items, mockOperation, 10);

    expect(result.succeeded).toHaveLength(2);
    expect(result.failed).toHaveLength(3);
    expect(result.succeededCount).toBe(2);
    expect(result.failedCount).toBe(3);
    expect(result.failed[0].item).toBe(2);
    expect(result.failed[0].error.message).toContain('Even number');
  });

  it('should stop on first error when configured', async () => {
    const items = [1, 2, 3, 4, 5];
    const mockOperation = async (n: number) => {
      if (n === 3) {
        throw new Error('Stop at 3');
      }
      return `processed-${n}`;
    };

    const result = await executeBatch(items, mockOperation, 10, true);

    expect(result.succeeded).toHaveLength(2); // 1, 2
    expect(result.failed).toHaveLength(1); // 3
    expect(result.succeededCount).toBe(2);
    expect(result.failedCount).toBe(1);
  });

  it('should process in batches', async () => {
    const items = Array.from({ length: 25 }, (_, i) => i + 1);
    const mockOperation = async (n: number) => n;

    const result = await executeBatch(items, mockOperation, 10);

    expect(result.succeeded).toHaveLength(25);
    expect(result.total).toBe(25);
  });
});

describe('defaultRetryConfig', () => {
  it('should have sensible defaults', () => {
    expect(defaultRetryConfig.maxAttempts).toBe(3);
    expect(defaultRetryConfig.baseDelay).toBe(1000);
    expect(defaultRetryConfig.maxDelay).toBe(30000);
    expect(defaultRetryConfig.backoffMultiplier).toBe(2);
    expect(defaultRetryConfig.jitter).toBe(true);
    expect(defaultRetryConfig.retryableStatuses).toContain(500);
    expect(defaultRetryConfig.retryableStatuses).toContain(503);
    expect(defaultRetryConfig.retryableErrors).toContain('DB_ERROR');
  });
});
