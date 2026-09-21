import { test, expect } from '@playwright/test';

const routes = [
  { path: '/', name: 'Home' },
  { path: '/book', name: 'Booking' },
  { path: '/camino', name: 'Camino' },
  { path: '/camino-dashboard', name: 'Camino Dashboard' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/info', name: 'Info (redirect)' },
  { path: '/auth', name: 'Auth' },
  { path: '/booking-confirmed', name: 'Booking Confirmed' },
  { path: '/demo-booking-confirmed', name: 'Demo Booking Confirmed' },
  { path: '/demo-camino', name: 'Demo Camino' },
  { path: '/hostel/info', name: 'Hostel Info' },
  { path: '/hostel/facilities', name: 'Hostel Facilities' },
  { path: '/hostel/restaurant', name: 'Hostel Restaurant' },
  { path: '/hostel/services', name: 'Hostel Services' },
  { path: '/area/visit', name: 'Area Visit' },
  { path: '/area/eat', name: 'Area Eat' },
  { path: '/area/do', name: 'Area Do' },
  { path: '/contact', name: 'Contact' },
];

test.describe('Route rendering tests', () => {
  for (const route of routes) {
    test(`Route ${route.name} (${route.path}) renders without console errors`, async ({ page }) => {
      const errors: string[] = [];
      const warnings: string[] = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        } else if (msg.type() === 'warning') {
          warnings.push(msg.text());
        }
      });

      page.on('pageerror', (error) => {
        errors.push(error.message);
      });

      await page.goto(route.path, {
        // Not 'networkidle': /camino renders a real MapLibre map that
        // loads external raster tiles from cartocdn.com, and Playwright's
        // own docs call out 'networkidle' as a poor readiness signal for
        // exactly this reason -- any page with ongoing/retrying
        // third-party network activity can leave it waiting well past
        // when the page is actually usable. Confirmed via a live network
        // trace: every tile request itself succeeds, but CI's network
        // conditions for a third-party CDN aren't the same as local, and
        // this test doesn't care about tile-load completion anyway. 'load'
        // still waits for every resource referenced in the initial HTML
        // (unlike 'domcontentloaded'), just not for tiles fetched later,
        // imperatively, after the map component hydrates.
        waitUntil: 'load',
      });

      // Wait on the app's own readiness signal (src/scripts/runtime.ts,
      // set after its bootstrap -- stores bridge, Swup, Lenis -- finishes)
      // rather than an arbitrary fixed sleep, so client-side hydration has
      // actually run and had a chance to surface synchronous console
      // errors before checking for them. Falls back to a short wait if a
      // route never fires it (e.g. /info, which just redirects).
      await page
        .waitForFunction(() => window.__appReady === true, { timeout: 5000 })
        .catch(() => {});

      // Check for specific error patterns
      const criticalErrors = errors.filter(
        (e) =>
          !e.includes('favicon') &&
          !e.includes('404') &&
          !e.includes('net::ERR_FAILED') &&
          !e.includes('Failed to load resource') &&
          !e.includes('Warning:') &&
          !e.includes('Third-party cookie')
      );

      console.log(`\n=== ${route.name} (${route.path}) ===`);
      console.log(`Errors: ${criticalErrors.length}`);
      if (criticalErrors.length > 0) {
        criticalErrors.forEach((e) => console.log(`  - ${e}`));
      }
      console.log(`Warnings: ${warnings.length}`);
      if (warnings.length > 0 && warnings.length < 10) {
        warnings.forEach((w) => console.log(`  - ${w}`));
      } else if (warnings.length >= 10) {
        console.log(`  (showing first 10 of ${warnings.length})`);
        warnings.slice(0, 10).forEach((w) => console.log(`  - ${w}`));
      }

      // Check if page has content. Threshold is a blank/crashed-page smoke
      // check, not a content-density requirement — deliberately minimal
      // pages (e.g. /auth's bare login card, no header/nav/footer) can
      // legitimately sit well under 100 chars of real text.
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
      expect(bodyText!.length).toBeGreaterThan(50);

      // Assert no critical errors
      expect(criticalErrors).toHaveLength(0);
    });
  }
});

test.describe('Visual regression - key pages', () => {
  test('Homepage loads and has hero section', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Check for hero section - use the specific hero title
    await expect(page.getByRole('heading', { name: /Bienvenido/ }).first()).toBeVisible();
    await expect(page.getByText('Albergue Carrascalejo').first()).toBeVisible();
  });

  test('Booking page loads', async ({ page }) => {
    await page.goto('/book', { waitUntil: 'networkidle' });

    // Check for booking form or content
    await expect(page.locator('body')).toBeVisible();
  });

  test('Dashboard page loads', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'networkidle' });

    await expect(page.locator('body')).toBeVisible();
  });

  test('Admin page loads', async ({ page }) => {
    await page.goto('/admin', { waitUntil: 'networkidle' });

    await expect(page.locator('body')).toBeVisible();
  });
});
