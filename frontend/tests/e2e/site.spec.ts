import { expect, test } from '@playwright/test';

test('home page loads and links to booking', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/AlbergueCarrascalejo/);
  await expect(page.getByRole('heading', { name: '¡Bienvenido!' })).toBeVisible();

  await page.getByRole('link', { name: 'Reservar Ahora' }).click();
  await expect(page).toHaveURL(/\/book\/?$/);
});

test('Solid dashboard controls update progress and daily goal', async ({ page }) => {
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