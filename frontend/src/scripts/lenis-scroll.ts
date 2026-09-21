/**
 * Site-wide smooth scroll (lenis.dev). Swup swaps page content without a
 * real navigation, and already resets native scroll to the top itself (its
 * `content:scroll` hook) -- but Lenis tracks its own internal target/animated
 * scroll position decoupled from the browser's, so on the very next
 * animation frame it snaps the page back to wherever Lenis still thinks the
 * position should be. Hooking `content:scroll` directly (not going through
 * swup-plugins.ts's custom `swup:content:replaced` event, which doesn't
 * reliably fire) re-syncs Lenis's own state immediately after Swup's reset.
 */
import Lenis from 'lenis';

declare global {
  interface Window {
    __albergueLenis?: Lenis;
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let rafId: number | null = null;

function raf(time: number) {
  window.__albergueLenis?.raf(time);
  rafId = requestAnimationFrame(raf);
}

function resetLenisForNewPage(): void {
  const lenis = window.__albergueLenis;
  if (!lenis) return;
  lenis.resize();
  lenis.scrollTo(0, { immediate: true });
}

function waitForSwup(timeoutMs = 5000): Promise<NonNullable<Window['swup']> | null> {
  return new Promise((resolve) => {
    if (window.swup) {
      resolve(window.swup);
      return;
    }
    const started = Date.now();
    // setTimeout, not requestAnimationFrame: rAF callbacks are paused
    // entirely by the browser for a hidden/backgrounded tab (e.g. a link
    // opened in a background tab), which would leave this polling loop --
    // and the hook attachment it gates -- stuck until the tab is
    // foregrounded. setTimeout still fires (throttled, but not halted).
    const tick = () => {
      if (window.swup) {
        resolve(window.swup);
        return;
      }
      if (Date.now() - started >= timeoutMs) {
        resolve(null);
        return;
      }
      setTimeout(tick, 50);
    };
    tick();
  });
}

/** No-op (native scroll stays) when the visitor prefers reduced motion, or
 * if already initialized -- safe to call more than once. */
export async function initLenis(): Promise<void> {
  if (typeof window === 'undefined' || window.__albergueLenis) return;
  if (prefersReducedMotion()) return;

  window.__albergueLenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
  });

  if (rafId === null) {
    rafId = requestAnimationFrame(raf);
  }

  const swup = await waitForSwup();
  swup?.hooks?.on('content:scroll', resetLenisForNewPage);
}
