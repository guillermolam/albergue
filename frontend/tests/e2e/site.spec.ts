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

test('dashboard controls update progress and daily goal', async ({ page }) => {
  await page.goto('/camino-dashboard');
  await expect(page.locator('[data-hydrated="true"]')).toBeVisible();

  const currentStage = page.getByRole('region', { name: 'Etapa Actual' });
  await expect(currentStage).toContainText('68%');
  await currentStage.getByRole('button', { name: '+5%' }).click();
  await expect(currentStage).toContainText('73%');

  const dailyPlanning = page.getByRole('region', { name: 'Planificación Diaria' });
  await expect(dailyPlanning).toContainText('25 km');
  await dailyPlanning.getByRole('button', { name: '+' }).click();
  await expect(dailyPlanning).toContainText('26 km');
});
