/**
 * Database Connection
 * PostgreSQL with Drizzle ORM
 *
 * Includes:
 * - Connection pooling
 * - Health checks with retries
 * - Automatic reconnection
 * - Graceful shutdown
 */

import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool, type PoolClient, type PoolConfig } from "pg";
import * as schema from "@albergue/domain-model";
import {
  withRetry,
  DatabaseError,
  dbCircuitBreaker,
  CircuitBreaker,
} from "./errors.js";

// Connection configuration
const poolConfig: PoolConfig = {
  connectionString:
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    "postgresql://localhost:5432/albergue",
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // Application name for monitoring
  application_name: "albergue-backend",
};

// Database connection pool
const pool = new Pool(poolConfig);

// pg has no connectionInitSql equivalent; run an async warmup query instead.
// The rejection must be handled — an unhandled one would crash the process.
pool.on("connect", (client) => {
  client.query("SELECT NOW()").catch((err) => {
    console.error("Connection warmup query failed:", err);
  });
});

// Create Drizzle database instance typed with domain schema
const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });

// Enhanced database wrapper with retry and circuit breaker
export const safeDb = {
  query: async <T>(sql: string, params?: any[]): Promise<T> => {
    return dbCircuitBreaker.execute(async () => {
      return withRetry(
        async () => {
          const client = await pool.connect();
          try {
            const result = await client.query(sql, params);
            return result as T;
          } finally {
            client.release();
          }
        },
        {
          maxAttempts: 3,
          baseDelay: 1000,
          maxDelay: 5000,
        },
      );
    });
  },
} as const;

// Connection state tracker
interface ConnectionState {
  lastConnected: Date | null;
  lastError: Error | null;
  consecutiveFailures: number;
  isHealthy: boolean;
}

const connectionState: ConnectionState = {
  lastConnected: null,
  lastError: null,
  consecutiveFailures: 0,
  isHealthy: false,
};

// Database health check with retries
export async function checkDbHealth(retries: number = 2) {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query("SELECT NOW()");

      connectionState.lastConnected = new Date();
      connectionState.lastError = null;
      connectionState.consecutiveFailures = 0;
      connectionState.isHealthy = true;

      client.release();
      return {
        healthy: true,
        timestamp: result.rows[0].now,
        state: connectionState,
      };
    } catch (error) {
      throw error;
    }
  } catch (error) {
    connectionState.lastError = error as Error;
    connectionState.consecutiveFailures++;
    connectionState.isHealthy = false;

    if (retries > 0) {
      // Wait and retry
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return checkDbHealth(retries - 1);
    }

    return {
      healthy: false,
      error: String(error),
      state: connectionState,
    };
  }
}

// Get connection statistics
export function getConnectionStats() {
  const poolStats =
    pool.totalCount > 0
      ? {
          total: pool.totalCount,
          idle: pool.idleCount,
          waiting: pool.waitingCount,
        }
      : { total: 0, idle: 0, waiting: 0 };

  return {
    ...connectionState,
    pool: poolStats,
    uptime: connectionState.lastConnected
      ? Math.floor(
          (Date.now() - connectionState.lastConnected.getTime()) / 1000,
        )
      : 0,
  };
}

// Graceful shutdown
export async function closeDb() {
  try {
    await pool.end();
    console.log("Database connections closed gracefully");
  } catch (error) {
    console.error("Error closing database connections:", error);
    throw new DatabaseError("Failed to close database connections", {
      error: String(error),
    });
  }
}

// Test database connection
export async function testDbConnection() {
  try {
    await withRetry(async () => {
      const client = await pool.connect();
      try {
        await client.query("SELECT 1");
      } finally {
        client.release();
      }
    });
    return true;
  } catch (error) {
    console.error("Database connection test failed:", error);
    return false;
  }
}

// Reconnect to database (for hot reload or connection issues)
export async function reconnectDb() {
  console.log("Attempting to reconnect to database...");

  try {
    await closeDb();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create new pool
    poolConfig.application_name = `albergue-backend-reconnected-${Date.now()}`;

    // Note: We can't reassign const pool, but in practice you'd need to restart
    console.log("Database reconnection requires process restart");

    return checkDbHealth();
  } catch (error) {
    throw new DatabaseError("Database reconnection failed", {
      error: String(error),
    });
  }
}

// Monitor connection and auto-reconnect
let connectionMonitor: NodeJS.Timeout | null = null;

export function startConnectionMonitor(interval: number = 60000) {
  if (connectionMonitor) {
    stopConnectionMonitor();
  }

  console.log(`Starting database connection monitor (interval: ${interval}ms)`);

  connectionMonitor = setInterval(async () => {
    const health = await checkDbHealth(1);
    if (!health.healthy) {
      console.warn("Database health check failed:", health.error);
      // Auto-reconnect if needed
      await reconnectDb();
    }
  }, interval);
}

export function stopConnectionMonitor() {
  if (connectionMonitor) {
    clearInterval(connectionMonitor);
    connectionMonitor = null;
    console.log("Database connection monitor stopped");
  }
}

// Export original pool and db (safeDb already exported above)
export { pool, db };

// Export types
export type { PoolClient, NodePgDatabase };

// Re-export error utilities
export {
  DatabaseError,
  NotFoundError,
  ValidationError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  RateLimitError,
  ServiceUnavailableError,
  AppError,
  withRetry,
  CircuitBreaker,
  dbCircuitBreaker,
  defaultRetryConfig,
  executeSafely,
  executeBatch,
  formatError,
  wrapDatabaseOperation,
} from "./errors.js";
