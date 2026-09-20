/**
 * Hostel Routes
 * GET / and GET /stats are public (footer, homepage stats, hostel-info
 * pages all read these via SSR). Writes are admin-only, gated per-route.
 */

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import { authMiddleware } from "../lib/middleware.js";
import { getHostelAggregate, getHostelStats } from "../queries/hostel.js";
import {
  updateHostel,
  createHostelService,
  updateHostelService,
  deleteHostelService,
} from "../commands/hostel.js";
import type {
  ApiResponse,
  Hostel,
  HostelAggregate,
  HostelStats,
  HostelService,
  InsertHostel,
  InsertHostelService,
} from "../types/index.js";

const hostel = new Hono();

/**
 * GET / - The full hostel aggregate (info + social/certifications/
 * compliance + services + opening hours + buildings/bedrooms/bunks/beds)
 */
hostel.get("/", async (c: Context) => {
  try {
    const result = await getHostelAggregate();
    if (!result) throw new HTTPException(404, { message: "Hostel not configured" });

    return c.json<ApiResponse<HostelAggregate>>({
      success: true,
      data: result,
      message: "Hostel retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: `Failed to get hostel: ${String(error)}` });
  }
});

/**
 * GET /stats - Derived bedroom/bed/availability/price stats
 */
hostel.get("/stats", async (c: Context) => {
  try {
    const result = await getHostelStats();
    return c.json<ApiResponse<HostelStats>>({
      success: true,
      data: result,
      message: "Hostel stats retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get hostel stats: ${String(error)}` });
  }
});

/**
 * PUT /:id - Update the hostel record (admin)
 */
hostel.put("/:id", authMiddleware({ roles: ["admin"] }), async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) throw new HTTPException(400, { message: "Invalid hostel ID" });

    const body = await c.req.json<Partial<InsertHostel>>();
    const result = await updateHostel(id, body);
    if (!result) throw new HTTPException(404, { message: "Hostel not found" });

    return c.json<ApiResponse<Hostel>>({
      success: true,
      data: result,
      message: "Hostel updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, { message: `Failed to update hostel: ${String(error)}` });
  }
});

/**
 * POST /services - Add a hostel service (admin)
 */
hostel.post("/services", authMiddleware({ roles: ["admin"] }), async (c: Context) => {
  try {
    const body = await c.req.json<InsertHostelService>();
    const result = await createHostelService(body);
    return c.json<ApiResponse<HostelService>>(
      {
        success: true,
        data: result,
        message: "Hostel service created successfully",
        timestamp: new Date().toISOString(),
      },
      201,
    );
  } catch (error) {
    throw new HTTPException(400, { message: `Failed to create hostel service: ${String(error)}` });
  }
});

/**
 * PUT /services/:id - Update a hostel service (admin)
 */
hostel.put("/services/:id", authMiddleware({ roles: ["admin"] }), async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) throw new HTTPException(400, { message: "Invalid service ID" });

    const body = await c.req.json<Partial<InsertHostelService>>();
    const result = await updateHostelService(id, body);
    if (!result) throw new HTTPException(404, { message: "Hostel service not found" });

    return c.json<ApiResponse<HostelService>>({
      success: true,
      data: result,
      message: "Hostel service updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, { message: `Failed to update hostel service: ${String(error)}` });
  }
});

/**
 * DELETE /services/:id - Remove a hostel service (admin)
 */
hostel.delete("/services/:id", authMiddleware({ roles: ["admin"] }), async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) throw new HTTPException(400, { message: "Invalid service ID" });

    const success = await deleteHostelService(id);
    if (!success) throw new HTTPException(404, { message: "Hostel service not found" });

    return c.json<ApiResponse<null>>({
      success: true,
      message: "Hostel service deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, { message: `Failed to delete hostel service: ${String(error)}` });
  }
});

export default hostel;
