// Signs in to the running dev server with TEST_USER_EMAIL / TEST_USER_PASSWORD,
// picks a team, and screenshots the result.
// Usage: node login.mts <out-dir> [team name, default "Claude Team"] [path to open after login]
import fs from 'node:fs';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import type { BrowserType } from 'playwright';

// CommonJS require(), resolved from this file as before, so the global
// Playwright can be loaded by path when the repo doesn't have it.
const require = createRequire(import.meta.url);

let chromium: BrowserType;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require(
    execSync('npm root -g').toString().trim() + '/playwright'
  ));
}

const BASE = process.env.APP_URL || 'http://localhost:3000';
const [outDir = '.', team = 'Claude Team', afterPath] = process.argv.slice(2);

// In the cloud sandbox, HTTPS goes through a proxy that re-signs certificates.
// Trust only that CA's key; TLS verification stays on for everything else.
function proxyCaArgs() {
  const ca = '/root/.ccr/agent-proxy-ca.crt';
  if (!fs.existsSync(ca)) return [];
  const der = new crypto.X509Certificate(fs.readFileSync(ca)).publicKey.export({
    type: 'spki',
    format: 'der',
  });
  return [
    `--ignore-certificate-errors-spki-list=${crypto.createHash('sha256').update(der).digest('base64')}`,
  ];
}

(async () => {
  const { TEST_USER_EMAIL: email, TEST_USER_PASSWORD: password } = process.env;
  if (!email || !password)
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set');

  const browser = await chromium.launch({ args: proxyCaArgs() });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });
  page.on('requestfailed', r =>
    console.log('REQUEST FAILED', r.url(), r.failure()?.errorText)
  );
  page.on(
    'response',
    r => r.url().includes('/auth/sign_in') && console.log('sign_in', r.status())
  );

  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  // Values filled immediately after load get wiped by a re-render; wait, then type keys.
  await page.waitForTimeout(1500);
  await page.locator('input[placeholder="email"]').pressSequentially(email);
  await page
    .locator('input[placeholder="password"]')
    .pressSequentially(password);
  await page.waitForSelector('button[type="submit"]:not([disabled])', {
    timeout: 5000,
  });
  await page.click('button[type="submit"]');

  // Sign-in lands on the team picker at /login/teams.
  await page.waitForURL('**/login/teams', { timeout: 30000 });
  await page.waitForLoadState('networkidle');
  await page.getByText(team, { exact: true }).click();
  await page.waitForURL(u => !new URL(u).pathname.startsWith('/login'), {
    timeout: 30000,
  });

  if (afterPath) await page.goto(BASE + afterPath);
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(2000);

  const shot = `${outDir}/after-login.png`;
  await page.screenshot({ path: shot });
  console.log('URL', page.url());
  console.log('Screenshot', shot);
  await browser.close();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
