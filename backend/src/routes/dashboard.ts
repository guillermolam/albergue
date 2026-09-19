/**
 * Dashboard Routes
 * Aggregate read endpoint for the admin dashboard overview.
 */

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import { getDashboardMetrics } from "../queries/dashboard.js";
import type { ApiResponse, DashboardMetrics } from "../types/index.js";

const dashboard = new Hono();

/**
 * GET /dashboard/metrics - Get aggregate bookings/pilgrims/beds/recent-activity
 */
dashboard.get("/metrics", async (c: Context) => {
  try {
    const data = await getDashboardMetrics();
    return c.json<ApiResponse<DashboardMetrics>>({
      success: true,
      data,
      message: "Dashboard metrics retrieved",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get dashboard metrics: ${String(error)}` });
  }
});

export default dashboard;
