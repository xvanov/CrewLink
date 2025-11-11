import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for CrewLink
 * 
 * This configuration follows TEA (Test Architect) best practices:
 * - Standardized timeouts (action 15s, navigation 30s, test 60s)
 * - Failure-only artifact capture (screenshots, videos, traces)
 * - HTML + JUnit reporters for CI integration
 * - Multi-browser support (chromium, firefox, webkit)
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Parallel execution
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Timeout standards (TEA best practices)
  timeout: 60 * 1000, // Test timeout: 60s
  expect: {
    timeout: 15 * 1000, // Assertion timeout: 15s
  },

  // Global test configuration
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15 * 1000, // Action timeout: 15s
    navigationTimeout: 30 * 1000, // Navigation timeout: 30s
  },

  // Output directory for test artifacts
  outputDir: './test-results',

  // Reporters
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],

  // Web server configuration - auto-start Next.js dev server
  // Note: Disabled for now since Story 1.2 doesn't implement UI yet
  // Uncomment when UI is ready (Story 1.3+)
  // webServer: {
  //   command: 'cd apps/web && npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000, // 2 minutes for initial startup
  //   stdout: 'pipe', // Show output for debugging
  //   stderr: 'pipe', // Show errors
  // },

  // Browser projects
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

