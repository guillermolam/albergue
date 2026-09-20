/**
 * Mérida Cultural Events (proxy)
 * GET / is public -- proxies the Ayuntamiento de Mérida's own public
 * events REST API (The Events Calendar plugin, no auth required) so the
 * frontend never calls a third-party origin directly, and so a short TTL
 * cache absorbs repeat requests.
 */

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import type { ApiResponse } from "../types/index.js";
import { BROWSER_USER_AGENT, decodeHtmlEntities, TimedCache } from "../lib/external_feed.js";

export interface CulturalEvent {
  id: number;
  title: string;
  url: string;
  imageUrl: string | null;
  startDate: string;
  endDate: string;
  allDay: boolean;
  cost: string | null;
  venueName: string | null;
  venueAddress: string | null;
  categories: string[];
}

interface TribeEventRaw {
  id: number;
  title: string;
  url: string;
  image: { url?: string } | false;
  start_date: string;
  end_date: string;
  all_day: boolean;
  cost: string;
  venue?: { venue?: string; address?: string; city?: string };
  categories?: { name: string }[];
}

const MERIDA_EVENTS_API = "https://merida.es/wp-json/tribe/events/v1/events";
const cache = new TimedCache<CulturalEvent[]>(30 * 60 * 1000);

function normalize(raw: TribeEventRaw): CulturalEvent {
  return {
    id: raw.id,
    title: decodeHtmlEntities(raw.title),
    url: raw.url,
    imageUrl: raw.image && raw.image.url ? raw.image.url : null,
    startDate: raw.start_date,
    endDate: raw.end_date,
    allDay: !!raw.all_day,
    cost: raw.cost || null,
    venueName: raw.venue?.venue ? decodeHtmlEntities(raw.venue.venue) : null,
    venueAddress:
      raw.venue?.address && raw.venue?.city
        ? decodeHtmlEntities(`${raw.venue.address}, ${raw.venue.city}`)
        : null,
    categories: (raw.categories ?? []).map((c) => decodeHtmlEntities(c.name)),
  };
}

async function fetchMeridaEvents(): Promise<CulturalEvent[]> {
  const today = new Date().toISOString().split("T")[0];
  const url = `${MERIDA_EVENTS_API}?per_page=24&start_date=${today}`;
  const response = await fetch(url, {
    headers: { "User-Agent": BROWSER_USER_AGENT, Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Mérida events API responded ${response.status}`);
  }
  const body = (await response.json()) as { events?: TribeEventRaw[] };
  return (body.events ?? []).map(normalize);
}

const meridaEvents = new Hono();

meridaEvents.get("/", async (c: Context) => {
  try {
    const data = await cache.get(fetchMeridaEvents);
    return c.json<ApiResponse<CulturalEvent[]>>({
      success: true,
      data,
      message: "Cultural events retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(502, { message: `Failed to fetch cultural events: ${String(error)}` });
  }
});

export default meridaEvents;
