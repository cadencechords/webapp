// Shared helpers for the smoke flows. Everything they create is named with
// PREFIX so cleanup() can also sweep leftovers from earlier failed runs.
import type { Page } from '@playwright/test';
import { api } from '../api.mts';

export { api };

export const PREFIX = 'e2e-smoke';

export const uniqueName = (label: string) =>
  `${PREFIX} ${label} ${Date.now().toString(36)}`;
export const createSong = (page: Page, name: string) =>
  api(page, 'POST', '/songs', { name });

export async function cleanup(page: Page) {
  for (const [list, item] of [
    ['/setlists', '/setlists'],
    ['/songs', '/songs'],
  ]) {
    const all =
      (await api<{ id: number; name?: string }[] | null>(
        page,
        'GET',
        list
      ).catch(() => [])) || [];
    for (const { id, name } of all) {
      if (name?.startsWith(PREFIX))
        await api(page, 'DELETE', `${item}/${id}`).catch(() => {});
    }
  }
}

// The floating "+" (QuickAdd) has no accessible name.
export const quickAddButton = (page: Page) =>
  page
    .locator('div.fixed button')
    .filter({ has: page.locator('svg') })
    .last();

// The "⋮" options menu trigger in a detail page's title row (icon-only too).
export const optionsMenuButton = (page: Page) =>
  page
    .locator('div.flex-between')
    .filter({ has: page.locator('input') })
    .first()
    .locator('button[aria-expanded]');
