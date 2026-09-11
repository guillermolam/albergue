/**
 * Swup options mirrored for documentation / manual init.
 * Production wiring uses `@swup/astro` in `astro.config.shared.mjs` — no CDN loads.
 */

export const swupAstroOptions = {
  theme: 'fade' as const,
  animationClass: 'transition-',
  containers: ['#main-content'],
  cache: true,
  preload: {
    hover: true,
    visible: true,
  },
  accessibility: true,
  forms: true,
  parallel: false,
  progress: true,
  routes: false,
  smoothScrolling: true,
  updateBodyClass: true,
  updateHead: true,
  reloadScripts: true,
  debug: import.meta.env.DEV,
  loadOnIdle: true,
  globalInstance: true,
};

/**
 * Legacy helper kept for callers that expect a plugin loader.
 * Plugins are provided by `@swup/astro`; this is intentionally a no-op.
 */
export async function loadSwupPlugins(): Promise<unknown[]> {
  return [];
}

/**
 * Prefer the instance created by `@swup/astro` (`globalInstance: true`).
 * Does not load remote CDNs or create a second Swup instance.
 */
export async function initSwup() {
  if (typeof window === 'undefined') return null;
  return window.swup ?? null;
}
