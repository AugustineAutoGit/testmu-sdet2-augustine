// @ts-check
import { defineConfig } from '@playwright/test';

import dotenvExtended from 'dotenv-extended';
import os from 'os';

dotenvExtended.load({ path: 'tests/config/goal.test.env', silent: true });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  expect: {
    timeout: 5000,
  },
  testDir: './tests/specs',
  fullyParallel: process.env.PARALLEL_EXECUTION === 'true',
  forbidOnly: !!process.env.CI,
  outputDir: 'test-results',
  reporter: [['allure-playwright',
    {
      resultsDir: 'test-results',
      suiteTitle: true,
      detail: false,
      environmentInfo: {
        os_platform: os.platform(),
        os_release: os.release(),
        os_version: os.version(),
        node_version: process.version,
      },
    }],
  ],
  retries: process.env.CI ? 0 : Number(process.env.RETRY_COUNT),
  timeout: Number(process.env.TIMEOUT),
  use: {
    actionTimeout: 30000,
    acceptDownloads: true,
    baseURL: process.env.APP_URL,
    headless: process.env.CI ? true : false,
    navigationTimeout: 120000,
    screenshot: 'only-on-failure',
    testIdAttribute: 'data-test-id',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  workers: process.env.CI ? 5 : Number(process.env.WORKERS_COUNT),

  /* Configure projects for major browsers */
  projects: [
    {
      name: process.env.BROWSER || 'chrome',
      use: {
        browserName:
          process.env.BROWSER === 'firefox' ? 'firefox' :
            process.env.BROWSER === 'safari' ? 'webkit' :
              'chromium',
        ...(process.env.BROWSER === 'chrome' ? { channel: 'chrome' } :
          process.env.BROWSER === 'msedge' ? { channel: 'msedge' } : {}),
        launchOptions: {
          args:
            process.env.BROWSER === 'firefox'
              ? ['-kiosk']
              : [
                ...(process.env.CI ? [] : ['--start-maximized']),
                '-disable-popup-blocking',
                '-disable-notifications',
                '--disable-blink-features=AutomationControlled',
              ],
        },
        // CI: Fixed port, Local: maximized
        viewport: process.env.CI ? { width: 1280, height: 720 } : null,
      },
    },
  ],
});

