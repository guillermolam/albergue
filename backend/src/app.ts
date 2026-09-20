/**
 * Albergue Municipal Carrascalejo Backend
 * Hono application definition — shared between the Node entry (src/index.ts)
 * and the Cloudflare Workers entry (src/worker.ts). Kept free of any
 * Node-only imports (like @hono/node-server) so it bundles cleanly for
 * Workers.
 *
 * Built with Hono, Drizzle ORM, PostgreSQL (via Neon's serverless driver)
 * Architecture: CQRS (Commands/Queries pattern)
 *
 * Features:
 * - Request ID tracking
 * - Error handling with structured responses
 * - Rate limiting
 * - Circuit breakers
 * - Health checks
 * - Connection monitoring
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { HTTPException } from "hono/http-exception";
import { checkDbHealth, getConnectionStats } from "./lib/db.js";
import {
  requestContextMiddleware,
  errorHandlerMiddleware,
  rateLimiterMiddleware,
  loggingMiddleware,
  correlationIdMiddleware,
  authMiddleware,
} from "./lib/middleware.js";
import {
  pilgrims,
  bookings,
  beds,
  dashboard,
  payments,
  pricing,
  governmentSubmissions,
  notifications,
  auditLog,
  users,
  auth,
  contactMessages,
  places,
  hostel,
} from "./routes/index.js";

// Create main Hono app
const app = new Hono();

// Middleware setup
app.use("*", cors());
app.use("*", prettyJSON());
app.use("*", requestContextMiddleware());
app.use("*", correlationIdMiddleware());
app.use("*", loggingMiddleware());

// Apply rate limiting (100 requests per minute per IP)
app.use(
  "*",
  rateLimiterMiddleware({
    maxRequests: 100,
    windowMs: 60000,
    keyGenerator: (c) => c.env?.remoteAddress || "global",
  }),
);

// Apply error handler last (to catch errors from other middleware)
app.use("*", errorHandlerMiddleware());

// Health check endpoint
app.get("/", (c) => {
  return c.json({
    success: true,
    message: "Albergue Municipal Carrascalejo API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    endpoints: {
      pilgrims: "/api/pilgrims",
      bookings: "/api/bookings",
      beds: "/api/beds",
      dashboard: "/api/dashboard",
      payments: "/api/payments",
      pricing: "/api/pricing",
      governmentSubmissions: "/api/government-submissions",
      notifications: "/api/notifications",
      auditLog: "/api/audit-log",
      users: "/api/users",
      contactMessages: "/api/contact-messages",
      places: "/api/places",
      hostel: "/api/hostel",
      health: "/health",
    },
  });
});

// Enhanced health check with DB connectivity and connection stats
app.get("/health", async (c) => {
  try {
    const dbHealth = await checkDbHealth(2);
    const connectionStats = getConnectionStats();

    const isHealthy = dbHealth.healthy && connectionStats.isHealthy;

    return c.json({
      success: true,
      status: isHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      database: {
        healthy: dbHealth.healthy,
        error: dbHealth.error,
        timestamp: dbHealth.timestamp,
        connectionState: connectionStats,
      },
      services: {
        api: "up",
        database: dbHealth.healthy ? "up" : "down",
      },
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: String(error),
        database: {
          healthy: false,
          error: String(error),
        },
        services: {
          api: "up",
          database: "down",
        },
      },
      503,
    );
  }
});

// Detailed connection stats
app.get("/health/stats", (c) => {
  try {
    const stats = getConnectionStats();
    return c.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return c.json(
      {
        success: false,
        error: String(error),
        timestamp: new Date().toISOString(),
      },
      500,
    );
  }
});

// API version prefix
const api = new Hono();

// Privileged capabilities require a verified identity. Until Phase 5 wires
// session auth, authMiddleware accepts an ADMIN_API_TOKEN bearer credential
// and fails closed when it is unset or wrong.
api.use("/users/*", authMiddleware({ roles: ["admin"] }));
api.use("/audit-log/*", authMiddleware({ roles: ["admin"] }));
api.use("/government-submissions/*", authMiddleware({ roles: ["admin"] }));
// Neither route group is called by the guest booking flow — every endpoint
// here is an admin read (no create/mutate routes are exposed for either).
api.use("/pricing/*", authMiddleware({ roles: ["admin"] }));
api.use("/notifications/*", authMiddleware({ roles: ["admin"] }));

// Mount all routes
api.route("/auth", auth); // public: credential verification only
api.route("/pilgrims", pilgrims);
api.route("/bookings", bookings);
api.route("/beds", beds);
api.route("/dashboard", dashboard);
api.route("/payments", payments);
api.route("/pricing", pricing);
api.route("/government-submissions", governmentSubmissions);
api.route("/notifications", notifications);
api.route("/audit-log", auditLog);
api.route("/users", users);
// POST is public (website contact form); GET/:id are admin-gated inside the
// route file itself, since this is the one router that mixes both.
api.route("/contact-messages", contactMessages);
api.route("/places", places);
api.route("/hostel", hostel);

// Mount API routes under /api prefix
app.route("/api", api);

// Global error handler
app.onError((err, c) => {
  console.error("Error:", err);

  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        error: err.message,
        status: err.status,
        timestamp: new Date().toISOString(),
      },
      err.status as any,
    );
  }

  return c.json(
    {
      success: false,
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "development" ? String(err) : undefined,
      timestamp: new Date().toISOString(),
    },
    500,
  );
});

// 404 handler
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: "Not Found",
      message: `Route ${c.req.method} ${c.req.path} not found`,
      timestamp: new Date().toISOString(),
    },
    404,
  );
});

export default app;
export { app, api };
