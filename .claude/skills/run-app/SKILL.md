---
name: run-app
description: Start the Cadence Chords web app dev server and sign in with the test account (TEST_USER_EMAIL / TEST_USER_PASSWORD) in headless Chromium, then screenshot any page. Use when asked to run, start, sign in to, or screenshot the app, or to check a UI change in the real app.
---

# Run the app and sign in

The app is a React app built with Vite. It talks to the API at `REACT_APP_API_URL`
(currently the live backend, `https://chords-api.herokuapp.com`). Env vars
(`REACT_APP_*`, `TEST_USER_EMAIL`, `TEST_USER_PASSWORD`) come from the
environment config; there is no `.env` file in the repo.

## 1. Install dependencies

```bash
cd /home/user/webapp
[ -d node_modules ] || CYPRESS_INSTALL_BINARY=0 yarn install --frozen-lockfile --ignore-engines
```

Set `CYPRESS_INSTALL_BINARY=0` because the sandbox network policy blocks
`download.cypress.io`, and a plain `yarn install` fails with ECONNRESET.

## 2. Start the dev server (background)

```bash
cd /home/user/webapp
curl -s -o /dev/null localhost:3000 || (nohup yarn start > /tmp/webapp-dev.log 2>&1 &)
for i in $(seq 1 30); do curl -s -o /dev/null localhost:3000 && break; sleep 1; done
tail -5 /tmp/webapp-dev.log   # expect "VITE ... ready" and http://localhost:3000/
```

Don't stop the server with `pkill -f vite`: that pattern also matches the
shell running the command. Kill it by PID instead.

## 3. Sign in and screenshot

```bash
node /home/user/webapp/.claude/skills/run-app/login.js <out-dir> ["Claude Team"] [/path/to/open]
```

- The script logs in, picks the team (default "Claude Team"), optionally
  opens a path such as `/songs`, and saves `<out-dir>/after-login.png`.
  Read the screenshot to check the result.
- Success output includes `sign_in 200` and a `URL` that isn't under `/login`.
- It uses the global Playwright install with the preinstalled Chromium.

To test something the script doesn't cover, copy it and add steps after the
team selection. Keep these two workarounds:

- **Proxy CA.** Headless Chromium doesn't trust the sandbox's HTTPS proxy CA,
  so every API call fails with `ERR_CERT_AUTHORITY_INVALID` and login does
  nothing. The script passes `--ignore-certificate-errors-spki-list` with the
  hash of `/root/.ccr/agent-proxy-ca.crt`. This trusts only that CA; don't
  switch it to `ignoreHTTPSErrors`.
- **Typing timing.** If you `fill()` the fields right after the page loads,
  the values get wiped and the Login button stays disabled. Wait about
  1.5 seconds, then use `pressSequentially`.

Login flow: `/login`, then `/login/teams` (team picker), then `/` (dashboard).

For screenshots of every route, or to check that flows still work, use the
Playwright suite instead: `yarn e2e:catalog` and `yarn e2e:smoke` (see
`e2e/README.md`). It applies the same proxy-CA and typing workarounds.
