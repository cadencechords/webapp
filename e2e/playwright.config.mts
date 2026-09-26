// Playwright config for the screenshot catalog and smoke flows. See e2e/README.md.
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { defineConfig } from '@playwright/test';

const BASE_URL = process.env.APP_URL || 'http://localhost:3000';
export const AUTH_FILE = path.join(import.meta.dirname, '.auth/user.json');

// Claude Code cloud sandboxes re-sign HTTPS through a proxy whose CA Chromium
// doesn't trust. Trust that one CA key only; no-op everywhere else.
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

export default defineConfig({
  testDir: import.meta.dirname,
  outputDir: path.join(import.meta.dirname, '.results'),
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
    cwd: path.join(import.meta.dirname, '..'),
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.mts/ },
    {
      name: 'catalog',
      testMatch: /catalog\.spec\.mts/,
      fullyParallel: true,
      dependencies: ['setup'],
      use: { storageState: AUTH_FILE },
    },
    {
      name: 'smoke',
      testMatch: /smoke\/.*\.spec\.mts/,
      dependencies: ['setup'],
      fullyParallel: false,
      use: { storageState: AUTH_FILE, viewport: { width: 1280, height: 800 } },
    },
  ],
});
