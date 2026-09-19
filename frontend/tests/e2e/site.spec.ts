import { expect, test } from '@playwright/test';

test('home page loads and links to booking', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  await expect(page).toHaveTitle(/Albergue Municipal Carrascalejo/);
  await expect(page.getByRole('heading', { name: /Bienvenido/ }).first()).toBeVisible();

  const cta = page
    .getByRole('link', { name: 'Reservar Ahora' })
    .or(page.getByRole('button', { name: 'Reservar Ahora' }));
  // The CTA has a perpetual attention-drawing wobble by design (Figma source),
  // so Playwright's stability check never settles -- force is the standard
  // pattern for clicking a continuously-animated element.
  await cta.first().click({ force: true });
  await expect(page).toHaveURL(/\/(book|booking)\/?$/);
});

for (const route of ['/book']) {
  test(`${route} renders its current route`, async ({ page }) => {
    const response = await page.goto(route);

    expect(response?.status()).toBe(200);
    await expect(page.locator('main').first()).toBeVisible();
  });
}

// The old /info page was split into /hostel/info, /hostel/facilities and
// /hostel/services -- /info now redirects rather than serving a dead page.
test('/info redirects to /hostel/info', async ({ page }) => {
  const response = await page.goto('/info');

  expect(response?.status()).toBe(200);
  await expect(page).toHaveURL(/\/hostel\/info\/?$/);
});

// AUTH-004: /admin requires an authenticated admin; guests redirect to /auth.
test('/admin redirects unauthenticated visitors to /auth', async ({ page }) => {
  await page.goto('/admin');

  await expect(page).toHaveURL(/\/auth\/?$/);
});

test('booking wizard starts on the dates step', async ({ page }) => {
  const response = await page.goto('/booking');

  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: 'Reservar' })).toBeVisible();
  await expect(page.getByLabel('Llegada')).toBeVisible();
  await expect(page.getByLabel('Salida')).toBeVisible();
});

test('unknown routes render the 404 page', async ({ page }) => {
  const response = await page.goto('/phase-0-smoke-missing');

  expect(response?.status()).toBe(404);
  await expect(page.locator('body')).toContainText(/404|no encontrada|not found/i);
});

test('desktop nav dropdown opens, shows sub-links, and navigates', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  // Scoped to the header nav landmark -- the footer also links to /hostel/info
  // labeled "El Albergue", so an unscoped role query is ambiguous.
  const trigger = page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('button', { name: 'El Albergue', exact: true });
  await trigger.click();

  const content = page.locator('[data-slot="navigation-menu-content"]');
  await expect(content.locator('a[href="/hostel/facilities"]')).toBeVisible();

  await content.locator('a[href="/hostel/facilities"]').click();
  await expect(page).toHaveURL(/\/hostel\/facilities\/?$/);
});

test('mobile nav accordion expands and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });

  const nav = page.getByRole('navigation', { name: 'Main navigation' });
  await nav.getByRole('button', { name: /Abrir menú/ }).click();
  // Scoped to the nav -- the footer also links to /area/visit labeled "La Zona".
  await nav.getByRole('button', { name: 'La Zona', exact: true }).click();

  const link = page.locator('a[href="/area/eat"]');
  await expect(link).toBeVisible();
  await link.click();

  await expect(page).toHaveURL(/\/area\/eat\/?$/);
});

test('contact form submits and shows a result', async ({ page }) => {
  await page.goto('/contact', { waitUntil: 'networkidle' });

  await page.getByLabel('Nombre').fill('Playwright Test');
  await page.getByLabel('Email', { exact: true }).fill('playwright-test@example.com');
  await page.getByLabel('Mensaje').fill('This is an automated end-to-end test submission.');
  await page.getByRole('button', { name: /Enviar Mensaje|Enviando/ }).click();

  // This CI job runs the frontend against no live backend, so a graceful
  // "service unavailable" error is the expected outcome here, not a false
  // signal — this test verifies the form/Action wiring itself doesn't
  // crash, not that a backend happens to be reachable in this environment.
  const outcome = page.getByRole('status').or(page.getByRole('alert'));
  await expect(outcome).toBeVisible({ timeout: 10000 });
});
