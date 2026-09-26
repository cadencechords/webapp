// Create, edit and delete a song through the UI.
import { test, expect } from '@playwright/test';
import {
  uniqueName,
  cleanup,
  quickAddButton,
  optionsMenuButton,
} from './helpers.mts';

test.afterEach(async ({ page }) => cleanup(page));

test('create, edit and delete a song', async ({ page }) => {
  const name = uniqueName('song');
  const artist = `Artist ${Date.now()}`;

  // Create
  await page.goto('/songs');
  await expect(page.getByPlaceholder('Search your songs')).toBeVisible();
  await quickAddButton(page).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Create a new song')).toBeVisible();
  await dialog.getByPlaceholder('ex: Amazing Grace').fill(name);
  await dialog.getByRole('button', { name: 'Create Song' }).click();
  await page.waitForURL(/\/songs\/\d+$/);
  await expect(page.locator('main input, input').first()).toHaveValue(name);

  // Edit: nothing autosaves; changes show a "Save Changes" button.
  await page.getByPlaceholder('Add an artist').fill(artist);
  const saved = page.waitForResponse(
    res => res.request().method() === 'PUT' && /\/songs\/\d+/.test(res.url())
  );
  await page
    .getByRole('button', { name: 'Save Changes' })
    .locator('visible=true')
    .click();
  expect((await saved).ok()).toBe(true);
  await page.reload();
  await expect(page.getByPlaceholder('Add an artist')).toHaveValue(artist);

  // Delete: "⋮" menu -> Delete -> confirm. It navigates back to the list.
  await page.goto('/songs');
  await page.getByText(name, { exact: true }).click();
  await page.waitForURL(/\/songs\/\d+$/);
  await optionsMenuButton(page).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByText('Are you sure?')).toBeVisible();
  await page.getByRole('button', { name: 'Yes, delete' }).click();
  await page.waitForURL(/\/songs$/);
  await expect(page.getByText(name, { exact: true })).toHaveCount(0);
});
