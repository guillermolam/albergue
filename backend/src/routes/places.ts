/**
 * Place Routes
 * GET / and GET /:slug are public (gallery pages). POST/PUT/DELETE are
 * admin-only, gated per-route like beds.ts / contact_messages.ts.
 */

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import { authMiddleware } from "../lib/middleware.js";
import { getAllPlaces, getPlaceBySlug } from "../queries/places.js";
import { createPlace, updatePlace, deletePlace } from "../commands/places.js";
import type { ApiResponse, Place, PlaceWithDetails, InsertPlace } from "../types/index.js";

const places = new Hono();

/**
 * GET / - List places, optionally filtered by ?category=
 */
places.get("/", async (c: Context) => {
  try {
    const { category } = c.req.query();
    const result = await getAllPlaces({ category });

    return c.json<ApiResponse<PlaceWithDetails[]>>({
      success: true,
      data: result,
      message: "Places retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, { message: `Failed to get places: ${String(error)}` });
  }
});

/**
 * GET /:slug - Get a single place with full detail
 */
places.get("/:slug", async (c: Context) => {
  try {
    const slug = c.req.param("slug");
    if (!slug) throw new HTTPException(400, { message: "Missing place slug" });
    const result = await getPlaceBySlug(slug);
    if (!result) throw new HTTPException(404, { message: "Place not found" });

    return c.json<ApiResponse<PlaceWithDetails>>({
      success: true,
      data: result,
      message: "Place retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: `Failed to get place: ${String(error)}` });
  }
});

/**
 * POST / - Create a place (admin)
 */
places.post("/", authMiddleware({ roles: ["admin"] }), async (c: Context) => {
  try {
    const body = await c.req.json<InsertPlace>();
    const result = await createPlace(body);
    return c.json<ApiResponse<Place>>(
      {
        success: true,
        data: result,
        message: "Place created successfully",
        timestamp: new Date().toISOString(),
      },
      201,
    );
  } catch (error) {
    throw new HTTPException(400, { message: `Failed to create place: ${String(error)}` });
  }
});

/**
 * PUT /:id - Update a place (admin)
 */
places.put("/:id", authMiddleware({ roles: ["admin"] }), async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) throw new HTTPException(400, { message: "Invalid place ID" });

    const body = await c.req.json<Partial<InsertPlace>>();
    const result = await updatePlace(id, body);
    if (!result) throw new HTTPException(404, { message: "Place not found" });

    return c.json<ApiResponse<Place>>({
      success: true,
      data: result,
      message: "Place updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, { message: `Failed to update place: ${String(error)}` });
  }
});

/**
 * DELETE /:id - Delete a place (admin)
 */
places.delete("/:id", authMiddleware({ roles: ["admin"] }), async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) throw new HTTPException(400, { message: "Invalid place ID" });

    const success = await deletePlace(id);
    if (!success) throw new HTTPException(404, { message: "Place not found" });

    return c.json<ApiResponse<null>>({
      success: true,
      message: "Place deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(400, { message: `Failed to delete place: ${String(error)}` });
  }
});

export default places;
