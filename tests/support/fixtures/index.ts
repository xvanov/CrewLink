/**
 * Test Fixtures - Composable Fixture Architecture
 * 
 * This file follows the TEA fixture pattern:
 * - Pure functions wrapped in fixtures
 * - Composable via mergeTests (when multiple fixtures needed)
 * - Auto-cleanup in fixture teardown
 * 
 * Reference: .bmad/bmm/testarch/knowledge/fixture-architecture.md
 */

import { test as base } from '@playwright/test';
import { UserFactory } from './factories/user-factory';

/**
 * Extended test fixtures
 * Add new fixtures here as needed (auth, network, API, etc.)
 */
type TestFixtures = {
  userFactory: UserFactory;
};

export const test = base.extend<TestFixtures>({
  userFactory: async ({}, use) => {
    const factory = new UserFactory();
    await use(factory);
    // Auto-cleanup after test completes
    await factory.cleanup();
  },
});

export { expect } from '@playwright/test';

