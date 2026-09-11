import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/lib/**/*.ts', 'src/commands/**/*.ts', 'src/queries/**/*.ts'],
      exclude: ['src/index.ts', 'src/routes/**/*.ts', 'src/**/*.config.ts'],
    },
    // Setup for database tests
    setupFiles: ['./src/tests/setup.ts'],
    // Timeout for tests that may need to wait
    testTimeout: 10000,
  },
});
