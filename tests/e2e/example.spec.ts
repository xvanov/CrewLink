/**
 * Example Test Suite
 * 
 * This file demonstrates:
 * - Basic page navigation and assertions
 * - Using fixtures (userFactory) for test data
 * - API-first setup pattern (fast, parallel-safe)
 * - Selector strategy (data-testid attributes)
 * 
 * Reference: .bmad/bmm/testarch/knowledge/test-quality.md
 */

import { test, expect } from '../support/fixtures';

test.describe('Example Test Suite', () => {
  // TODO: Enable these tests when UI is implemented (Story 1.3+)
  // Currently skipped because Story 1.2 (Database Schema) doesn't implement UI
  test.skip('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CrewLink/i);
  });

  test.skip('should create user and login', async ({ page, userFactory }) => {
    // Create test user via API (fast, parallel-safe)
    const user = await userFactory.seedUser({
      email: 'test@example.com',
      password: 'TestPassword123!',
    });

    // Test UI login flow
    await page.goto('/login');
    await page.fill('[data-testid="email-input"]', user.email);
    await page.fill('[data-testid="password-input"]', user.password);
    await page.click('[data-testid="login-button"]');

    // Assert login success
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    
    // Note: userFactory.cleanup() is called automatically by fixture teardown
  });
});

