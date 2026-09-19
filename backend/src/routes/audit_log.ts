/**
 * Audit Log Routes
 */
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import {
  getAllAuditLogs,
  getAuditLogById,
  getAuditLogsByTable,
  getAuditLogsByAction,
  getAuditLogStats,
  getRecentAuditLogs,
} from "../queries/audit_log.js";
import type {
  AuditLog,
  ApiResponse,
  PaginatedResponse,
} from "../types/index.js";

const auditLog = new Hono();

auditLog.get("/", async (c: Context) => {
  try {
    const { page, pageSize } = c.req.query();
    const result = await getAllAuditLogs({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
    return c.json<ApiResponse<PaginatedResponse<AuditLog>>>({
      success: true,
      data: result,
      message: "Audit logs retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get audit logs: ${String(error)}`,
    });
  }
});

auditLog.get("/:id", async (c: Context) => {
  try {
    const id = Number(c.req.param("id"));
    if (isNaN(id))
      throw new HTTPException(400, { message: "Invalid audit log ID" });
    const log = await getAuditLogById(id);
    if (!log) throw new HTTPException(404, { message: "Audit log not found" });
    return c.json<ApiResponse<AuditLog>>({
      success: true,
      data: log,
      message: "Audit log retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, {
      message: `Failed to get audit log: ${String(error)}`,
    });
  }
});

auditLog.get("/table/:tableName", async (c: Context) => {
  try {
    const tableName = c.req.param("tableName");
    if (!tableName) {
      throw new HTTPException(400, { message: "tableName is required" });
    }
    const logs = await getAuditLogsByTable(tableName);
    return c.json<ApiResponse<AuditLog[]>>({
      success: true,
      data: logs,
      message: "Audit logs by table retrieved",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get audit logs by table: ${String(error)}`,
    });
  }
});

auditLog.get("/action/:action", async (c: Context) => {
  try {
    const action = c.req.param("action");
    if (!action) {
      throw new HTTPException(400, { message: "action is required" });
    }
    const logs = await getAuditLogsByAction(action);
    return c.json<ApiResponse<AuditLog[]>>({
      success: true,
      data: logs,
      message: "Audit logs by action retrieved",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get audit logs by action: ${String(error)}`,
    });
  }
});

auditLog.get("/stats", async (c: Context) => {
  try {
    const stats = await getAuditLogStats();
    return c.json<ApiResponse<any>>({
      success: true,
      data: stats,
      message: "Audit log statistics retrieved",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(500, {
      message: `Failed to get audit log statistics: ${String(error)}`,
    });
  }
});

export default auditLog;
