/**
 * Test Setup
 * Global test setup and teardown
 */

import { beforeAll, afterAll, vi } from "vitest";

// Mock global objects for tests
beforeAll(() => {
  // Mock console methods to prevent test output noise
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation((...args) => {
    // Still output errors to help with debugging
    process.stderr.write(args.join(" ") + "\n");
  });

  // Set environment variables for tests
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL = "postgresql://localhost:5432/albergue_test";
});

afterAll(() => {
  // Restore all mocks
  vi.restoreAllMocks();
});

// Export for use in tests
export const testDatabaseUrl = "postgresql://localhost:5432/albergue_test";
