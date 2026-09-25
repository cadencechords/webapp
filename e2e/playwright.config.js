// Playwright config for the screenshot catalog and smoke flows. See e2e/README.md.
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { defineConfig } = require('@playwright/test');

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';
const AUTH_FILE = path.join(__dirname, '.auth/user.json');

// Claude Code cloud sandboxes re-sign HTTPS through a proxy whose CA Chromium
// doesn't trust. Trust that one CA key only; no-op everywhere else.
function proxyCaArgs() {
  const ca = '/root/.ccr/agent-proxy-ca.crt';
  if (!fs.existsSync(ca)) return [];
  const der = new crypto.X509Certificate(fs.readFileSync(ca)).publicKey.export({ type: 'spki', format: 'der' });
  return [`--ignore-certificate-errors-spki-list=${crypto.createHash('sha256').update(der).digest('base64')}`];
}

module.exports = defineConfig({
  testDir: __dirname,
  outputDir: path.join(__dirname, '.results'),
  timeout: 120_000,
  expect: { timeout: 15_000 },
  workers: process.env.CI ? 2 : 4,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    launchOptions: { args: proxyCaArgs() },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'yarn start',
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 240_000,
    cwd: path.join(__dirname, '..'),
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.js/ },
    {
      name: 'catalog',
      testMatch: /catalog\.spec\.js/,
      fullyParallel: true,
      dependencies: ['setup'],
      use: { storageState: AUTH_FILE },
    },
    {
      name: 'smoke',
      testMatch: /smoke\/.*\.spec\.js/,
      dependencies: ['setup'],
      fullyParallel: false,
      use: { storageState: AUTH_FILE, viewport: { width: 1280, height: 800 } },
    },
  ],
});

module.exports.AUTH_FILE = AUTH_FILE;
