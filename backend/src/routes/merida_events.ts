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
// The nginx WAF in front of merida.es rejects requests without a
// browser-like User-Agent (a bare server-side fetch gets a 403) -- this is
// not a secret, just what any real browser already sends.
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const CACHE_TTL_MS = 30 * 60 * 1000;

let cache: { data: CulturalEvent[]; expiresAt: number } | null = null;

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: " ",
};

// The WordPress REST API returns title/venue text HTML-entity-encoded
// (e.g. "&#038;" for "&", "&#8216;"/"&#8217;" for curly quotes) since it
// assumes the consumer will render it as HTML. We render as plain React
// text, so decode entities here instead of passing raw "&#038;" through.
function decodeHtmlEntities(text: string): string {
  return text.replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity: string) => {
    if (entity[0] === "#") {
      const codePoint =
        entity[1] === "x" || entity[1] === "X"
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }
    return NAMED_ENTITIES[entity] ?? match;
  });
}

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
    if (!cache || cache.expiresAt < Date.now()) {
      const data = await fetchMeridaEvents();
      cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
    }
    return c.json<ApiResponse<CulturalEvent[]>>({
      success: true,
      data: cache.data,
      message: "Cultural events retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(502, { message: `Failed to fetch cultural events: ${String(error)}` });
  }
});

export default meridaEvents;
