# CrewLink Test Suite

This directory contains the end-to-end test suite for CrewLink, built with Playwright following TEA (Test Architect) best practices.

## Setup Instructions

### Prerequisites

- Node.js 20.11.0 (see `.nvmrc`)
- npm or yarn package manager

### Installation

1. **Install dependencies** (when package.json is available):
   ```bash
   npm install
   ```

2. **Install Playwright browsers**:
   ```bash
   npx playwright install --with-deps
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your test environment values
   ```

### Running Tests

**Run all tests:**
```bash
npm run test:e2e
```

**Run tests in UI mode (interactive):**
```bash
npx playwright test --ui
```

**Run tests in headed mode (see browser):**
```bash
npx playwright test --headed
```

**Run specific test file:**
```bash
npx playwright test tests/e2e/example.spec.ts
```

**Run tests in debug mode:**
```bash
npx playwright test --debug
```

**Run tests for specific browser:**
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**View test report:**
```bash
npx playwright show-report
```

## Architecture Overview

### Directory Structure

```
tests/
├── e2e/                      # Test files (organize as needed: e2e/, api/, integration/)
├── support/                  # Framework infrastructure (key pattern)
│   ├── fixtures/             # Test fixtures (data, mocks)
│   │   ├── factories/        # Data factories (faker-based)
│   │   └── index.ts          # Composable fixture exports
│   ├── helpers/              # Utility functions
│   └── page-objects/         # Page object models (optional)
└── README.md                 # This file
```

### Fixture Pattern

Tests use composable fixtures that provide:
- **Pure functions** wrapped in framework fixtures
- **Auto-cleanup** to prevent test pollution
- **API-first setup** for fast, parallel-safe test data

Example:
```typescript
import { test, expect } from '../support/fixtures';

test('example', async ({ page, userFactory }) => {
  // userFactory automatically cleans up after test
  const user = await userFactory.createUser();
  // ... test logic
});
```

### Data Factories

Data factories use the **override pattern** for explicit test intent:

```typescript
// Default user
const user = userFactory.createUser();

// Admin user (explicit override shows intent)
const admin = userFactory.createUser({ role: 'admin' });
```

Factories are:
- **Parallel-safe**: UUIDs and timestamps prevent collisions
- **Schema-adaptive**: Defaults adapt to schema changes
- **Fast**: API seeding is 10-50x faster than UI setup

### Selector Strategy

**Always use `data-testid` attributes** for UI elements:

```typescript
// ✅ GOOD
await page.click('[data-testid="login-button"]');
await page.fill('[data-testid="email-input"]', email);

// ❌ BAD (brittle CSS selectors)
await page.click('.btn-primary');
await page.fill('#email', email);
```

## Best Practices

### Test Isolation

- Each test is independent and can run in parallel
- Fixtures handle cleanup automatically
- No shared state between tests

### Deterministic Tests

- Use event-based waits (Playwright's built-in waits)
- Avoid hard waits (`page.waitForTimeout()`)
- Standardized timeouts: action 15s, navigation 30s, test 60s

### API-First Setup

- Seed test data via API (fast, reliable)
- UI is for validation only, not setup
- Example: Create user via API, then test login UI

### Failure Artifacts

Tests automatically capture on failure:
- **Screenshots**: `test-results/` (only on failure)
- **Videos**: `test-results/` (retain on failure)
- **Traces**: `test-results/` (retain on failure)

View traces with:
```bash
npx playwright show-trace test-results/path-to-trace.zip
```

## CI Integration

Tests run in CI with:
- **Retries**: 2 retries on failure
- **Artifacts**: Uploaded on failure (screenshots, videos, traces)
- **JUnit XML**: `test-results/junit.xml` for CI reporting
- **HTML Report**: `test-results/html/` for visual debugging

## Knowledge Base References

This test suite follows TEA (Test Architect) best practices. Key references:

- **Fixture Architecture**: `.bmad/bmm/testarch/knowledge/fixture-architecture.md`
- **Data Factories**: `.bmad/bmm/testarch/knowledge/data-factories.md`
- **Playwright Config**: `.bmad/bmm/testarch/knowledge/playwright-config.md`
- **Test Quality**: `.bmad/bmm/testarch/knowledge/test-quality.md`
- **Network-First**: `.bmad/bmm/testarch/knowledge/network-first.md`

## Troubleshooting

### Tests fail with "Browser not found"
```bash
npx playwright install --with-deps
```

### Tests timeout
- Check `BASE_URL` in `.env` matches your running application
- Verify application is running: `curl http://localhost:3000`
- Review timeout settings in `playwright.config.ts`

### Parallel test failures
- Ensure tests are isolated (no shared state)
- Check for race conditions in test setup
- Use `test.describe.configure({ mode: 'serial' })` for dependent tests

### Cleanup failures
- Verify API endpoints for cleanup exist
- Check network connectivity to API
- Review fixture cleanup logic in `tests/support/fixtures/`

## Next Steps

1. **Add more test files** in `tests/e2e/` organized by feature
2. **Extend fixtures** in `tests/support/fixtures/` for auth, network, API helpers
3. **Create data factories** in `tests/support/fixtures/factories/` for other entities
4. **Set up CI/CD** to run tests on every push/PR

For questions or issues, refer to the TEA knowledge base or consult the Test Architect agent.

