/**
 * Shared helpers for backend routes that proxy third-party public
 * feeds/APIs (merida_events.ts, carrascalejo_local.ts, ...): a
 * browser-like User-Agent (several of these origins WAF-block bare
 * server-side fetches), HTML-entity decoding (these feeds encode text
 * assuming an HTML consumer, but we render as plain text), and a simple
 * TTL cache so repeat requests don't re-hit the upstream origin.
 */

export const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";

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

export function decodeHtmlEntities(text: string): string {
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

export class TimedCache<T> {
  private entry: { data: T; expiresAt: number } | null = null;

  constructor(private readonly ttlMs: number) {}

  async get(fetcher: () => Promise<T>): Promise<T> {
    if (!this.entry || this.entry.expiresAt < Date.now()) {
      const data = await fetcher();
      this.entry = { data, expiresAt: Date.now() + this.ttlMs };
    }
    return this.entry.data;
  }
}
