import { defineConfig, devices } from '@playwright/test';

if (process.platform === 'darwin' && process.arch === 'arm64') {
  process.env.PLAYWRIGHT_HOST_PLATFORM_OVERRIDE ??= 'mac-arm64';
}

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
