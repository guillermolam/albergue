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
import { waitForSwup } from './wait-for-swup';

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
