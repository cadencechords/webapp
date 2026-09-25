# E2E: screenshot catalog and smoke flows

Playwright tooling that backs the "looks different, works the same" promise of
the Material 3 redesign:

- **Screenshot catalog.** Visits every route at desktop (1280px) and mobile
  (390px) widths, in light and dark, and saves a screenshot of each. It
  doesn't compare pixels; use it for before/after review in PRs.
- **Smoke flows.** Exercise the main interactions: create, edit and delete a
  song; add songs to a set; move between songs in performance mode; open and
  close a dialog and a menu; toggle the theme.

Both run against the dev server and the API in `REACT_APP_API_URL`, signed in
as the test account.

## Setup

```bash
yarn install
export TEST_USER_EMAIL=... TEST_USER_PASSWORD=...   # test account
export TEST_TEAM_NAME="Claude Team"                 # optional, this is the default
npx playwright install chromium                     # skip if Chromium is preinstalled
```

The dev server starts automatically if nothing is listening on :3000. Set
`APP_URL` to test a different server.

## Commands

| Command            | What it does                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `yarn e2e:catalog` | Screenshots every route into `e2e/screenshots/` as `<route>__<desktop\|mobile>-<light\|dark>.png` |
| `yarn e2e:smoke`   | Runs the smoke flows                                                                              |
| `yarn e2e:unit`    | Unit tests for the route list (no browser)                                                        |

Catalog options:

- `CATALOG_DIR=/tmp/before yarn e2e:catalog` writes screenshots to another folder.
  Run it once on `master` and once on your branch, then compare the two folders.
- `CATALOG_ONLY=songs,song-detail yarn e2e:catalog` limits the run to the named
  routes. Route names are listed in `e2e/routes.js`.

## Notes

- **Test data.** Routes with an ID (`/songs/:song`, `/sets/:set`, …) use the
  first item of that kind in the test team. The setup step creates a "Catalog
  sample" set and binder if the team has none, and keeps them between runs.
  Calendar events aren't seeded, so `calendar-edit` is reported as skipped
  until the team has an event. The smoke flows create their own data, named
  `e2e-smoke …`, and delete it afterwards, including leftovers from failed runs.
- **Network idle doesn't work here.** The dev server and third-party SDKs keep
  connections open, so pages never go network-idle. The catalog waits until no
  infinite CSS animation (spinner, pulse skeleton) is running instead.
- **New routes.** Add them to `e2e/routes.js`.
- **Cypress.** The older Cypress specs in `cypress/` still exist. The new
  flows use Playwright so that the catalog and the smoke flows share one tool
  and one login.
