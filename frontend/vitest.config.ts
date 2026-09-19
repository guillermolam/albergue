import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", ".astro"],
    environmentMatchGlobs: [
      ["tests/**/*.server.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}", "node"],
      ["tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}", "jsdom"],
    ],
    // SSR mode configuration for Astro
    server: {
      deps: {
        inline: ["astro"],
      },
    },
  },
});
