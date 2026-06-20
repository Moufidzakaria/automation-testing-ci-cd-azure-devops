import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

export default defineConfig({
  testDir: './tests',

  testMatch: /.*\.spec\.ts/,

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  outputDir: 'test-results',

  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],

  use: {
    baseURL: 'https://automationexercise.com',

    headless: true,

    // 🟢 Modifié de 'only-on-failure' à 'on' pour avoir des screenshots à chaque test
    screenshot: 'on',

    // 🟢 Modifié de 'retain-on-failure' à 'on' pour capturer les vidéos de chaque session
    video: 'on',

    // 🟢 Modifié de 'retain-on-failure' à 'on' pour générer les rapports de trace complets
    trace: 'on',

    actionTimeout: 10000,
    
    testIdAttribute: 'data-qa',

    navigationTimeout: 30000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
  ],
});