/**
 * Waits for `window.swup` (set by @swup/astro once it initializes) to
 * appear. Polls via setTimeout rather than requestAnimationFrame -- rAF is
 * paused entirely by the browser for a hidden/backgrounded tab (e.g. a link
 * opened in a background tab), which would otherwise leave this stuck until
 * the tab is foregrounded (confirmed live: a real Chrome tab under
 * automation reports `document.hidden`, and an rAF-based version of this
 * poll never progressed past 6+ seconds).
 *
 * The deadline only counts time while the document is actually visible, so
 * a page that loads (and stays) in a background tab for any length of time
 * still gets a fair `timeoutMs` of real visible time to find Swup once the
 * user actually looks at the tab, instead of the deadline silently
 * expiring while hidden and never retrying after foregrounding.
 */
export function waitForSwup(timeoutMs = 5000): Promise<NonNullable<Window['swup']> | null> {
  return new Promise((resolve) => {
    if (window.swup) {
      resolve(window.swup);
      return;
    }

    let visibleElapsed = 0;
    let lastTick = Date.now();

    const tick = () => {
      if (window.swup) {
        resolve(window.swup);
        return;
      }
      const now = Date.now();
      if (document.visibilityState === 'visible') {
        visibleElapsed += now - lastTick;
      }
      lastTick = now;
      if (visibleElapsed >= timeoutMs) {
        resolve(null);
        return;
      }
      setTimeout(tick, 50);
    };
    tick();
  });
}
