/**
 * Server-only Hono client. Used by Actions and on-demand pages.
 * Never imported from client islands.
 */
import { BACKEND_API_URL } from "astro:env/server";
import type { ApiResponse } from "@albergue/api-contract";

export class BackendUnavailableError extends Error {
  constructor(message = "Backend API is not configured (BACKEND_API_URL).") {
    super(message);
    this.name = "BackendUnavailableError";
  }
}

export function requireBackendUrl(): string {
  if (!BACKEND_API_URL) {
    throw new BackendUnavailableError();
  }
  return BACKEND_API_URL.replace(/\/$/, "");
}

export async function backendJson<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ ok: true; status: number; data: T } | { ok: false; status: number; message: string }> {
  let base: string;
  try {
    base = requireBackendUrl();
  } catch (error) {
    return { ok: false, status: 503, message: (error as Error).message };
  }

  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...init.headers,
    },
  });

  const envelope = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  if (!response.ok || !envelope?.success || envelope.data === undefined) {
    return {
      ok: false,
      status: response.status,
      message: envelope?.message ?? envelope?.error ?? `Backend ${response.status}`,
    };
  }

  return { ok: true, status: response.status, data: envelope.data };
}
