import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'line' : 'html',
  // Small safety margin over the 30s default: backend calls run in-process
  // now (see frontend/src/lib/backend-api.ts), so a route with several of
  // them can take a bit longer to settle than the old instant-fail-on-
  // missing-BACKEND_API_URL behavior did, even with the fast-failing
  // DATABASE_URL below.
  timeout: 45000,
  use: {
    baseURL: process.env.FRONTEND_URL || 'http://localhost:4322',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: process.env.FRONTEND_URL
    ? undefined
    : {
        command: 'pnpm exec astro dev --ignore-lock --port 4322',
        url: 'http://localhost:4322',
        reuseExistingServer: false,
        env: {
          PUBLIC_API_MODE: 'local',
          // Deliberately unroutable (not "localhost", which some CI
          // resolvers add real DNS latency to) so a missing real
          // DATABASE_URL fails each connection attempt as fast and
          // consistently as possible, rather than falling through to
          // db.ts's own ambiguous "postgresql://localhost:5432/albergue"
          // default.
          DATABASE_URL: 'postgresql://invalid:invalid@127.0.0.1:1/invalid',
        },
      },
});
