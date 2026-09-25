// Shared helpers for the smoke flows. Everything they create is named with
// PREFIX so cleanup() can also sweep leftovers from earlier failed runs.
const { api } = require('../api');

const PREFIX = 'e2e-smoke';

const uniqueName = label => `${PREFIX} ${label} ${Date.now().toString(36)}`;
const createSong = (page, name) => api(page, 'POST', '/songs', { name });

async function cleanup(page) {
  for (const [list, item] of [
    ['/setlists', '/setlists'],
    ['/songs', '/songs'],
  ]) {
    const all = (await api(page, 'GET', list).catch(() => [])) || [];
    for (const { id, name } of all) {
      if (name?.startsWith(PREFIX))
        await api(page, 'DELETE', `${item}/${id}`).catch(() => {});
    }
  }
}

// The floating "+" (QuickAdd) has no accessible name.
const quickAddButton = page =>
  page
    .locator('div.fixed button')
    .filter({ has: page.locator('svg') })
    .last();

// The "⋮" options menu trigger in a detail page's title row (icon-only too).
const optionsMenuButton = page =>
  page
    .locator('div.flex-between')
    .filter({ has: page.locator('input') })
    .first()
    .locator('button[aria-expanded]');

module.exports = {
  PREFIX,
  uniqueName,
  api,
  createSong,
  cleanup,
  quickAddButton,
  optionsMenuButton,
};
