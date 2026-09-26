// Screenshot catalog: every route at desktop and mobile widths, light and dark.
// It asserts nothing about pixels; it's for before/after review in PRs.
//   yarn e2e:catalog                       -> e2e/screenshots/
//   CATALOG_DIR=/tmp/before yarn e2e:catalog
//   CATALOG_ONLY=songs,song-detail yarn e2e:catalog
/// <reference lib="dom" />
import path from 'node:path';
import { test } from '@playwright/test';
import type { Browser, BrowserContextOptions, Page } from '@playwright/test';
import { api } from './api.mts';
import {
  PUBLIC_ROUTES,
  AUTHED_ROUTES,
  VARIANTS,
  resolveRoutes,
} from './routes.mts';
import type { Ids, Route } from './routes.mts';

type StorageState = BrowserContextOptions['storageState'];

const OUT_DIR =
  process.env.CATALOG_DIR || path.join(import.meta.dirname, 'screenshots');
const ONLY = process.env.CATALOG_ONLY?.split(',');

// browser.newContext() inherits the project's storageState, so opt out explicitly.
const SIGNED_OUT = { cookies: [], origins: [] };
const HIDE_DEV_OVERLAYS =
  'aside[aria-label="React Query Devtools"] { display: none !important; }';
const selected = (routes: Route[]) =>
  ONLY ? routes.filter(r => ONLY.includes(r.name)) : routes;

// One ID of each kind from the test team (auth.setup.mts seeds a set and binder).
async function discoverIds(
  browser: Browser,
  storageState: StorageState
): Promise<Ids> {
  const context = await browser.newContext({ storageState });
  const page = await context.newPage();
  await page.goto('/songs');
  // pick gets the response (null if the request failed) and returns the list.
  const firstId = async <T,>(
    path: string,
    pick: (data: T | null) => unknown = data => data
  ): Promise<string | number | null> => {
    const list = pick(await api<T>(page, 'GET', path).catch(() => null));
    return Array.isArray(list) && list.length ? list[0].id : null;
  };

  const team = await page.evaluate(() => localStorage.getItem('teamId'));
  const ids = {
    song: await firstId('/songs'),
    set: await firstId('/setlists'),
    binder: await firstId('/binders'),
    event: await firstId('/events'),
    member: await firstId<{ members?: unknown }>(
      `/teams/${team}`,
      data => data?.members
    ),
    role: await firstId('/roles'),
  };
  await context.close();
  return ids;
}

// The dev server and third-party SDKs keep connections open, so 'networkidle'
// never fires. Instead wait until no loading indicator (an infinite CSS
// animation: spinners, pulse skeletons) is running, then a beat for layout.
async function settle(page: Page) {
  await page.waitForTimeout(500);
  await page
    .waitForFunction(
      () =>
        !document
          .getAnimations()
          .some(a => a.effect?.getTiming().iterations === Infinity),
      null,
      { timeout: 10_000 }
    )
    .catch(() => {});
  await page.waitForTimeout(500);
}

async function shoot(
  browser: Browser,
  route: Route,
  { storageState }: { storageState: StorageState }
) {
  for (const variant of VARIANTS) {
    const context = await browser.newContext({
      storageState,
      viewport: variant.viewport,
    });
    await context.addInitScript(
      theme => localStorage.setItem('theme', theme),
      variant.theme
    );
    const page = await context.newPage();
    await page.goto(route.path);
    await settle(page);
    await page.addStyleTag({ content: HIDE_DEV_OVERLAYS });
    // fullPage screenshots draw fixed bars (bottom nav) mid-page, so grow the
    // viewport to the content height instead.
    const height = await page.evaluate(
      () => document.documentElement.scrollHeight
    );
    if (height > variant.viewport.height)
      await page.setViewportSize({ ...variant.viewport, height });
    await page.screenshot({
      path: path.join(OUT_DIR, `${route.name}__${variant.name}.png`),
    });
    await context.close();
  }
}

test.describe('public routes', () => {
  for (const route of selected(PUBLIC_ROUTES)) {
    test(route.name, async ({ browser }) =>
      shoot(browser, route, { storageState: SIGNED_OUT })
    );
  }
});

test.describe('signed-in routes', () => {
  let routes: Route[];

  test.beforeAll(async ({ browser }, testInfo) => {
    routes = resolveRoutes(
      AUTHED_ROUTES,
      await discoverIds(browser, testInfo.project.use.storageState)
    );
  });

  for (const { name } of selected(AUTHED_ROUTES)) {
    test(name, async ({ browser }, testInfo) => {
      // Every name comes from AUTHED_ROUTES, and resolveRoutes keeps them all.
      const route = routes.find(r => r.name === name)!;
      test.skip(!!route.skip, route.skip);
      await shoot(browser, route, {
        storageState: testInfo.project.use.storageState,
      });
    });
  }
});
