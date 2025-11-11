import { test, expect } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Authentication Flow', () => {
  test('Full authentication flow: login → access protected route with session cookies', async ({
    request,
  }) => {
    // Step 1: Login with a pre-existing user (from seed data)
    const testEmail = 'test@example.com'
    const testPassword = 'testPassword123'

    const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: testEmail,
        password: testPassword,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    expect(loginResponse.ok()).toBe(true)
    const loginData = await loginResponse.json()
    expect(loginData.success).toBe(true)
    expect(loginData.data.user).toHaveProperty('email')
    expect(loginData.data.user).toHaveProperty('role')
    expect(loginData.data).toHaveProperty('refreshToken')

    // Step 2: Extract session cookies from login response
    const cookies = loginResponse.headers()['set-cookie'] || []
    const cookieHeader = cookies.join('; ')

    // Step 3: Access protected route with session cookies
    const protectedResponse = await request.get(`${BASE_URL}/api/protected`, {
      headers: {
        Cookie: cookieHeader,
      },
    })

    // Should succeed with authentication
    expect(protectedResponse.ok()).toBe(true)
    const protectedData = await protectedResponse.json()
    expect(protectedData.success).toBe(true)
    expect(protectedData.data.user).toHaveProperty('email')
    expect(protectedData.data.user.email).toBe(testEmail)
  })

  test('Role-based access: admin can access admin route, non-admin cannot', async ({
    request,
  }) => {
    // Test 1: Admin user can access admin route
    const adminEmail = 'admin@example.com'
    const adminPassword = 'adminPassword123'

    const adminLoginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: adminEmail,
        password: adminPassword,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (adminLoginResponse.ok()) {
      const adminCookies = adminLoginResponse.headers()['set-cookie'] || []
      const adminCookieHeader = adminCookies.join('; ')

      const adminRouteResponse = await request.get(`${BASE_URL}/api/admin`, {
        headers: {
          Cookie: adminCookieHeader,
        },
      })

      // Admin should be able to access admin route
      expect(adminRouteResponse.ok()).toBe(true)
      const adminData = await adminRouteResponse.json()
      expect(adminData.success).toBe(true)
      expect(adminData.data.user.role).toBe('ADMIN')
    }

    // Test 2: Non-admin user cannot access admin route
    const userEmail = 'user@example.com'
    const userPassword = 'userPassword123'

    const userLoginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: userEmail,
        password: userPassword,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (userLoginResponse.ok()) {
      const userCookies = userLoginResponse.headers()['set-cookie'] || []
      const userCookieHeader = userCookies.join('; ')

      const adminRouteResponse = await request.get(`${BASE_URL}/api/admin`, {
        headers: {
          Cookie: userCookieHeader,
        },
      })

      // Non-admin should receive 403 Forbidden
      expect(adminRouteResponse.status()).toBe(403)
      const errorData = await adminRouteResponse.json()
      expect(errorData.success).toBe(false)
      expect(errorData.error.code).toBe('FORBIDDEN')
    }
  })

  test('Refresh token rotation: old token revoked, new token issued', async ({
    request,
  }) => {
    // Step 1: Login to get initial refresh token
    const loginResponse = await request.post(`${BASE_URL}/api/auth/login`, {
      data: {
        email: 'test@example.com',
        password: 'testPassword123',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    expect(loginResponse.ok()).toBe(true)
    const loginData = await loginResponse.json()
    const firstRefreshToken = loginData.data.refreshToken

    // Step 2: Use refresh token to get new tokens
    const refreshResponse = await request.post(`${BASE_URL}/api/auth/refresh`, {
      data: {
        refreshToken: firstRefreshToken,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    expect(refreshResponse.ok()).toBe(true)
    const refreshData = await refreshResponse.json()
    expect(refreshData.success).toBe(true)
    const secondRefreshToken = refreshData.data.refreshToken

    // Step 3: Verify old token is revoked (should fail)
    const oldTokenResponse = await request.post(`${BASE_URL}/api/auth/refresh`, {
      data: {
        refreshToken: firstRefreshToken,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    expect(oldTokenResponse.status()).toBe(401)
    const errorData = await oldTokenResponse.json()
    expect(errorData.error.code).toBe('INVALID_REFRESH_TOKEN')

    // Step 4: Verify new token works
    const newTokenResponse = await request.post(`${BASE_URL}/api/auth/refresh`, {
      data: {
        refreshToken: secondRefreshToken,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    expect(newTokenResponse.ok()).toBe(true)
  })
})

