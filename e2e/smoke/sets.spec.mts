// Create a set, add songs to it, then move between songs in performance mode.
import { test, expect } from '@playwright/test';
import { uniqueName, createSong, cleanup, quickAddButton } from './helpers.mts';

test.afterEach(async ({ page }) => cleanup(page));

test('add songs to a set and move between them in performance mode', async ({
  page,
}) => {
  const first = uniqueName('first');
  const second = uniqueName('second');
  const setName = uniqueName('set');

  await page.goto('/sets');
  await createSong(page, first);
  await createSong(page, second);

  // Create the set
  await expect(page.getByPlaceholder('Search your sets')).toBeVisible();
  await quickAddButton(page).click();
  const createDialog = page.getByRole('dialog');
  await createDialog.getByPlaceholder('Give your set a name').fill(setName);
  await createDialog.locator('#date-picker').fill('2030-01-01');
  // Pro teams also get "Add as calendar event", checked by default. Don't create events.
  const addToCalendar = createDialog.locator('#add-to-calendar');
  if (await addToCalendar.count()) await addToCalendar.uncheck();
  await createDialog.getByRole('button', { name: 'Create' }).click();
  await page.waitForURL(/\/sets\/\d+$/);

  // Add both songs
  await page.getByRole('button', { name: 'Add Songs' }).click();
  const addDialog = page.getByRole('dialog');
  await expect(addDialog.getByText('Add songs to this set')).toBeVisible();
  for (const song of [first, second]) {
    await addDialog.getByPlaceholder('Search').fill(song);
    await addDialog.getByText(song, { exact: true }).click();
  }
  await addDialog.getByRole('button', { name: 'Add 2 songs' }).click();
  await expect(addDialog).toBeHidden();
  await expect(page.getByText(first, { exact: true })).toBeVisible();
  await expect(page.getByText(second, { exact: true })).toBeVisible();

  // Performance mode: the top bar's h1 is the current song; the bottom bar's
  // buttons are labelled with the previous/next song names.
  const setUrl = new URL(page.url()).pathname;
  await page.goto(`${setUrl}/present`);
  const current = page.locator('h1');
  await expect(current).toHaveText(first);
  await expect(page.getByRole('button', { name: 'Beginning' })).toBeDisabled();
  await page.getByRole('button', { name: second, exact: true }).click();
  await expect(current).toHaveText(second);
  await expect(page.getByRole('button', { name: 'End' })).toBeDisabled();
  await page.getByRole('button', { name: first, exact: true }).click();
  await expect(current).toHaveText(first);

  // Bottom sheet: adjustments (icon-only, a direct child of the title row) ->
  // "Auto scroll". The sheet stays in the DOM and slides via bottom-0 / -bottom-full.
  const openSheet = page.locator('div.z-30.fixed.w-full.bottom-0');
  await expect(openSheet).toHaveCount(0);
  await page.locator('h1 + div > button').click();
  await page.getByRole('button', { name: 'Auto scroll' }).click();
  await expect(openSheet).toHaveCount(1);
  await openSheet.locator('button.absolute').first().click();
  await expect(openSheet).toHaveCount(0);

  // Exit back to the set
  await page.locator(`a[href="${setUrl}"]`).first().click();
  await page.waitForURL(`**${setUrl}`);
});
