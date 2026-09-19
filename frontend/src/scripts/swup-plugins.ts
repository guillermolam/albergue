/**
 * Swup client hooks.
 * Plugins themselves are registered by `@swup/astro` in astro.config — do not load unpkg CDNs.
 */

declare global {
  interface Window {
    swup?: {
      hooks: {
        on: (name: string, handler: (...args: any[]) => void) => void;
      };
    };
    __albergueSwupHooks?: boolean;
  }
}

function waitForSwup(timeoutMs = 5000): Promise<NonNullable<Window["swup"]> | null> {
  return new Promise((resolve) => {
    const existing = window.swup;
    if (existing) {
      resolve(existing);
      return;
    }

    const started = Date.now();
    const tick = () => {
      if (window.swup) {
        resolve(window.swup);
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        resolve(null);
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

/**
 * Attach UX hooks once @swup/astro has created window.swup.
 */
export async function initializeSwupPlugins() {
  if (typeof window === "undefined") return;
  if (window.__albergueSwupHooks) return window.swup;

  const swup = await waitForSwup();
  if (!swup) {
    console.warn(
      "Swup is not initialized. Make sure @swup/astro is configured with globalInstance: true.",
    );
    return;
  }

  if (!swup.hooks || typeof swup.hooks.on !== "function") {
    console.warn("Swup hooks not available. Swup may not be fully initialized.");
    return;
  }

  window.__albergueSwupHooks = true;

  swup.hooks.on("link:click", () => {
    document.body.style.cursor = "wait";
  });

  swup.hooks.on("visit:start", () => {
    document.body.style.cursor = "wait";
  });

  swup.hooks.on("visit:end", () => {
    document.body.style.cursor = "";
    document.querySelectorAll(".loading").forEach((el) => {
      el.classList.remove("loading");
    });
  });

  swup.hooks.on("content:replace", () => {
    window.dispatchEvent(new CustomEvent("swup:content:replaced"));
  });

  return swup;
}
