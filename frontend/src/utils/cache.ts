/**
 * Caching utilities for SSR pages
 */

const cache = new Map<string, { data: any; expires: number }>();

export function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data as T;
  }
  return null;
}

export function setCached<T>(key: string, data: T, ttl: number = 60000): void {
  cache.set(key, { data, expires: Date.now() + ttl });
}

export function clearCache(): void {
  cache.clear();
}

export function getCacheStats(): { size: number; maxSize: number } {
  return {
    size: cache.size,
    maxSize: 100,
  };
}
