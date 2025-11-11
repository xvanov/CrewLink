import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('API Authentication Endpoints', () => {
  test('POST /api/auth/login validates input', async ({ request }) => {
    // Test missing credentials
    const missingCredentialsResponse = await request.post(
      `${BASE_URL}/api/auth/login`,
      {
        data: { email: 'test@example.com' },
        headers: { 'Content-Type': 'application/json' },
      }
    )

    expect(missingCredentialsResponse.status()).toBe(400)
    const missingData = await missingCredentialsResponse.json()
    expect(missingData.success).toBe(false)
    expect(missingData.error.code).toBe('MISSING_CREDENTIALS')

    // Test invalid email format
    const invalidEmailResponse = await request.post(
      `${BASE_URL}/api/auth/login`,
      {
        data: { email: 'invalid-email', password: 'password123' },
        headers: { 'Content-Type': 'application/json' },
      }
    )

    expect(invalidEmailResponse.status()).toBe(400)
    const invalidEmailData = await invalidEmailResponse.json()
    expect(invalidEmailData.success).toBe(false)
    expect(invalidEmailData.error.code).toBe('INVALID_EMAIL')
  })

  test('GET /api/protected requires authentication', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/protected`)

    // Should return 401 without authentication
    expect(response.status()).toBe(401)
    const data = await response.json()
    expect(data.success).toBe(false)
    expect(data.error.code).toBe('UNAUTHORIZED')
  })

  test('GET /api/admin requires ADMIN role', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/admin`)

    // Should return 401 without authentication (or 403 if authenticated but not admin)
    expect([401, 403]).toContain(response.status())
    const data = await response.json()
    expect(data.success).toBe(false)
    expect(['UNAUTHORIZED', 'FORBIDDEN']).toContain(data.error.code)
  })
})

