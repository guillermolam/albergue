import { expect, test } from '@playwright/test';

test('home page loads and links to booking', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Albergue Municipal Carrascalejo/);
  await expect(
    page.getByRole('heading', { name: /Bienvenido al Albergue Municipal Carrascalejo/ })
  ).toBeVisible();

  const cta = page
    .getByRole('link', { name: 'Reservar Ahora' })
    .or(page.getByRole('button', { name: 'Reservar Ahora' }));
  await cta.first().click();
  await expect(page).toHaveURL(/\/(book|booking)\/?$/);
});

for (const route of ['/info', '/book']) {
  test(`${route} renders its current route`, async ({ page }) => {
    const response = await page.goto(route);

    expect(response?.status()).toBe(200);
    await expect(page.locator('main').first()).toBeVisible();
  });
}

// Phase 1 security posture: /admin is closed until Phase 5 session auth (AUTH-*).
test('/admin is forbidden until server-verified auth lands', async ({ page }) => {
  const response = await page.goto('/admin');

  expect(response?.status()).toBe(403);
});

test('unknown routes render the 404 page', async ({ page }) => {
  const response = await page.goto('/phase-0-smoke-missing');

  expect(response?.status()).toBe(404);
  await expect(page.locator('body')).toContainText(/404|no encontrada|not found/i);
});
