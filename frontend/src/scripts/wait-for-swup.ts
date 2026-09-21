/**
 * Waits for `window.swup` (set by @swup/astro once it initializes) to
 * appear. Polls via setTimeout rather than requestAnimationFrame -- rAF is
 * paused entirely by the browser for a hidden/backgrounded tab.
 *
 * The deadline only counts time while the document is visible. Hidden time
 * never advances the deadline, and becoming visible resets the tick clock
 * so a long background pause cannot dump a huge delta into visibleElapsed
 * on the first foreground tick.
 */
export function waitForSwup(timeoutMs = 5000): Promise<NonNullable<Window['swup']> | null> {
  return new Promise((resolve) => {
    if (window.swup) {
      resolve(window.swup);
      return;
    }

    let settled = false;
    let visibleElapsed = 0;
    let lastVisibleTick = Date.now();
    let timer: ReturnType<typeof setTimeout> | null = null;

    const finish = (value: NonNullable<Window['swup']> | null) => {
      if (settled) return;
      settled = true;
      if (timer !== null) clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
      resolve(value);
    };

    const schedule = () => {
      if (settled) return;
      timer = setTimeout(tick, 50);
    };

    const tick = () => {
      if (settled) return;
      if (window.swup) {
        finish(window.swup);
        return;
      }
      if (document.visibilityState !== 'visible') {
        // Deadline paused while hidden; visibilitychange will resume.
        return;
      }
      const now = Date.now();
      visibleElapsed += now - lastVisibleTick;
      lastVisibleTick = now;
      if (visibleElapsed >= timeoutMs) {
        finish(null);
        return;
      }
      schedule();
    };

    const onVisibility = () => {
      if (settled) return;
      if (document.visibilityState === 'visible') {
        // Do not attribute hidden wall-clock to the deadline.
        lastVisibleTick = Date.now();
        tick();
      } else if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    if (document.visibilityState === 'visible') {
      tick();
    }
  });
}
