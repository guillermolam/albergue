import { defineConfig } from "drizzle-kit";

/**
 * Config is consumed from the backend package cwd
 * (`pnpm --filter albergue-backend db:*`), so paths are relative to backend/.
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "../domain_model/schema.ts",
  out: "../domain_model/migrations",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      process.env.NEON_DATABASE_URL ||
      "postgresql://localhost:5432/albergue",
  },
  verbose: process.env.LOG_LEVEL === "debug",
  strict: true,
});
