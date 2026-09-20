/**
 * El Carrascalejo Local Notices (proxy)
 * GET / is public -- proxies the Ayuntamiento de El Carrascalejo's own
 * public Atom feeds (agenda, noticias, tablón de anuncios). This is the
 * hostel's own village government, not Mérida's -- real, no auth, no
 * rate limit observed. Only "tablón" has entries at the time of writing;
 * agenda/noticias are fetched too so they appear automatically once the
 * town hall starts publishing to them, with no code change needed.
 */

import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { Context } from "hono";
import { XMLParser } from "fast-xml-parser";
import type { ApiResponse } from "../types/index.js";

export type LocalNoticeCategory = "agenda" | "noticias" | "tablon";

export interface LocalNotice {
  id: string;
  category: LocalNoticeCategory;
  title: string;
  url: string;
  updated: string;
  summary: string | null;
  imageUrl: string | null;
}

const FEEDS: { category: LocalNoticeCategory; url: string }[] = [
  { category: "agenda", url: "https://elcarrascalejo.es/atomagenda.php" },
  { category: "noticias", url: "https://elcarrascalejo.es/atomnoticias.php" },
  { category: "tablon", url: "https://elcarrascalejo.es/atomtablon.php" },
];

const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const CACHE_TTL_MS = 30 * 60 * 1000;

let cache: { data: LocalNotice[]; expiresAt: number } | null = null;

const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  quot: '"',
  apos: "'",
  lt: "<",
  gt: ">",
  nbsp: " ",
  eacute: "é",
  aacute: "á",
  iacute: "í",
  oacute: "ó",
  uacute: "ú",
  ntilde: "ñ",
};

// This town-hall site serves named HTML entities (e.g. "&eacute;") inside
// its Atom <content>, same class of issue as merida.es's numeric entities
// handled in merida_events.ts -- decode both forms rather than one.
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

interface AtomEntryRaw {
  title?: string | { "#text"?: string };
  id?: string;
  updated?: string;
  link?: { "@_rel"?: string; "@_href"?: string } | { "@_rel"?: string; "@_href"?: string }[];
  content?: string | { "#text"?: string };
}

function textOf(value: string | { "#text"?: string } | undefined): string {
  if (!value) return "";
  return typeof value === "string" ? value : (value["#text"] ?? "");
}

function alternateLink(link: AtomEntryRaw["link"]): string | null {
  const links = Array.isArray(link) ? link : link ? [link] : [];
  const alt = links.find((l) => l["@_rel"] === "alternate") ?? links[0];
  return alt?.["@_href"] ?? null;
}

/** The feed's <content> is a snippet of real HTML (a date line + an
 * <img>) -- extract a plain-text summary and the first image URL rather
 * than rendering the HTML directly. */
function parseContent(raw: string): { summary: string | null; imageUrl: string | null } {
  const imgMatch = raw.match(/<img[^>]*src="([^"]+)"/i);
  const summary = decodeHtmlEntities(raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
  return {
    summary: summary.length > 0 ? summary.slice(0, 200) : null,
    imageUrl: imgMatch ? imgMatch[1] : null,
  };
}

function normalizeEntry(category: LocalNoticeCategory, raw: AtomEntryRaw): LocalNotice | null {
  const url = alternateLink(raw.link);
  if (!raw.id || !url) return null;
  const { summary, imageUrl } = parseContent(textOf(raw.content));
  return {
    id: raw.id,
    category,
    title: decodeHtmlEntities(textOf(raw.title)),
    url,
    updated: raw.updated ?? "",
    summary,
    imageUrl,
  };
}

async function fetchFeed(category: LocalNoticeCategory, url: string): Promise<LocalNotice[]> {
  const response = await fetch(url, { headers: { "User-Agent": BROWSER_USER_AGENT } });
  if (!response.ok) {
    throw new Error(`${url} responded ${response.status}`);
  }
  const xml = await response.text();
  const parsed = xmlParser.parse(xml);
  const rawEntries = parsed?.feed?.entry;
  const entries: AtomEntryRaw[] = Array.isArray(rawEntries) ? rawEntries : rawEntries ? [rawEntries] : [];
  return entries
    .map((entry) => normalizeEntry(category, entry))
    .filter((n): n is LocalNotice => n !== null);
}

async function fetchAllNotices(): Promise<LocalNotice[]> {
  const results = await Promise.allSettled(FEEDS.map((f) => fetchFeed(f.category, f.url)));
  const notices = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  return notices.sort((a, b) => b.updated.localeCompare(a.updated));
}

const carrascalejoLocal = new Hono();

carrascalejoLocal.get("/", async (c: Context) => {
  try {
    if (!cache || cache.expiresAt < Date.now()) {
      const data = await fetchAllNotices();
      cache = { data, expiresAt: Date.now() + CACHE_TTL_MS };
    }
    return c.json<ApiResponse<LocalNotice[]>>({
      success: true,
      data: cache.data,
      message: "Local notices retrieved successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new HTTPException(502, { message: `Failed to fetch local notices: ${String(error)}` });
  }
});

export default carrascalejoLocal;
