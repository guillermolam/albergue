import { defineConfig } from "drizzle-kit";

/**
 * Same schema/migrations as backend/drizzle.config.ts.
 * Paths are relative to domain_model/ for local runs from this package.
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./schema.ts",
  out: "./migrations",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      process.env.NEON_DATABASE_URL ||
      "postgresql://localhost:5432/albergue",
  },
  verbose: process.env.LOG_LEVEL === "debug",
  strict: true,
});
