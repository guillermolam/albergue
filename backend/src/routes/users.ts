/**
 * User Routes
 */
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import {
  getAllUsers,
  getUserById,
  getUserByUsername,
  searchUsers,
  getUserStats,
} from "../queries/users.js";
import { createUser } from "../commands/users.js";
import type { User, ApiResponse, PaginatedResponse } from "../types/index.js";

const users = new Hono();

users.get("/", async (c: Context) => {
  try {
    const { page, pageSize } = c.req.query();
    const result = await getAllUsers({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    return c.json<ApiResponse<PaginatedResponse<User>>>({
      success: true,
      data: result,
      message: "Users retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get users: ${String(error)}`,
    });
  }
});

users.get("/:id", async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) throw new HTTPException(400, { message: "Invalid user ID" });
    const user = await getUserById(id);
    if (!user) throw new HTTPException(404, { message: "User not found" });
    return c.json<ApiResponse<User>>({
      success: true,
      data: user,
      message: "User retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: `Failed to get user: ${String(error)}`,
    });
  }
});

users.get("/username/:username", async (c: Context) => {
  try {
    const username = c.req.param("username");
    if (!username) {
      throw new HTTPException(400, { message: "username is required" });
    }
    const user = await getUserByUsername(username);
    if (!user) throw new HTTPException(404, { message: "User not found" });
    return c.json<ApiResponse<User>>({
      success: true,
      data: user,
      message: "User retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: `Failed to get user: ${String(error)}`,
    });
  }
});

users.get("/stats", async (c: Context) => {
  try {
    const stats = await getUserStats();
    return c.json<ApiResponse<any>>({
      success: true,
      data: stats,
      message: "User statistics retrieved",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get user statistics: ${String(error)}`,
    });
  }
});

users.post("/", async (c: Context) => {
  try {
    const body = await c.req.json();
    const user = await createUser(body);
    return c.json<ApiResponse<User>>(
      {
        success: true,
        data: user,
        message: "User created successfully",
        timestamp: new Date().toISOString(),
      },
      201,
    );
  } catch (error) {
    throw new HTTPException(400, {
      message: `Failed to create user: ${String(error)}`,
    });
  }
});

export default users;
