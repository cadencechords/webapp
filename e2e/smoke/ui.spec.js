// Open and close a dialog and a menu, and toggle the theme. Nothing is saved.
const { test, expect } = require('@playwright/test');
const { quickAddButton, optionsMenuButton } = require('./helpers');

test('dialog opens and closes', async ({ page }) => {
  await page.goto('/songs');
  await quickAddButton(page).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Create a new song')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('menu opens and closes', async ({ page }) => {
  await page.goto('/songs');
  await page.locator('main a[href^="/songs/"], a[href^="/songs/"]').first().click();
  await page.waitForURL(/\/songs\/\d+$/);
  await optionsMenuButton(page).click();
  const print = page.getByRole('button', { name: 'Print' });
  await expect(print).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(print).toBeHidden();
});

test('theme toggle switches and persists', async ({ page }) => {
  await page.addInitScript(() => localStorage.getItem('theme') || localStorage.setItem('theme', 'light'));
  await page.goto('/account');
  const html = page.locator('html');
  const toggle = page.getByRole('button', { name: /Dark theme/ });

  await expect(html).not.toHaveClass(/\bdark\b/);
  await toggle.click();
  await expect(html).toHaveClass(/\bdark\b/);
  await page.reload();
  await expect(html).toHaveClass(/\bdark\b/);

  await page.getByRole('button', { name: /Dark theme/ }).click();
  await expect(html).not.toHaveClass(/\bdark\b/);
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
});
