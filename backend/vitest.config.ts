import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@albergue/domain-model': path.resolve(__dirname, '../domain_model/schema.ts'),
      '@albergue/api-contract': path.resolve(__dirname, '../packages/api-contract/src/index.ts'),
    },
  },
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
