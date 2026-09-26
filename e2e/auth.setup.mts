// Signs in once with TEST_USER_EMAIL / TEST_USER_PASSWORD, picks the team and
// saves the session (localStorage tokens) for the catalog and smoke projects.
import { test as setup, expect } from '@playwright/test';
import { AUTH_FILE } from './playwright.config.mts';
import { api } from './api.mts';

const TEAM = process.env.TEST_TEAM_NAME || 'Claude Team';

setup('sign in', async ({ page }) => {
  const { TEST_USER_EMAIL: email, TEST_USER_PASSWORD: password } = process.env;
  if (!email || !password)
    throw new Error('Set TEST_USER_EMAIL and TEST_USER_PASSWORD');

  await page.goto('/login');
  await expect(page.getByPlaceholder('email')).toBeVisible();
  // Values filled right after load get wiped by a re-render, so wait, then type.
  await page.waitForTimeout(1500);
  await page.getByPlaceholder('email').pressSequentially(email);
  await page.getByPlaceholder('password').pressSequentially(password);
  await page.getByRole('button', { name: 'Login' }).click();

  await page.waitForURL('**/login/teams');
  await page.getByText(TEAM, { exact: true }).click();
  await page.waitForURL(url => !url.pathname.startsWith('/login'));
  await expect(page.getByText(/^Hi /)).toBeVisible();

  await page.context().storageState({ path: AUTH_FILE });
});

// The catalog screenshots detail pages using the first set and binder in the
// team. Create a sample of each (kept between runs) if the team has none.
// Events aren't seeded: creating one needs the full calendar wizard payload.
setup('seed sample data', async ({ browser }) => {
  const context = await browser.newContext({ storageState: AUTH_FILE });
  const page = await context.newPage();
  await page.goto('/songs');
  const name = 'Catalog sample';
  const [song] = await api<{ id: number }[]>(page, 'GET', '/songs');

  for (const kind of ['setlists', 'binders']) {
    if ((await api<unknown[]>(page, 'GET', `/${kind}`)).length) continue;
    const extra =
      kind === 'setlists'
        ? { scheduled_date: '2030-01-01' }
        : { color: 'blue' };
    const { id } = await api<{ id: number }>(page, 'POST', `/${kind}`, {
      name,
      ...extra,
    });
    if (song)
      await api(page, 'POST', `/${kind}/${id}/songs`, { song_ids: [song.id] });
  }
  await context.close();
});
