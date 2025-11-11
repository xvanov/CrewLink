import { POST } from '../route'
import { prisma } from '@/lib/prisma'
import {
  validateRefreshToken,
  revokeRefreshToken,
  createRefreshToken,
} from '@/lib/refresh-token'

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('@/lib/refresh-token', () => ({
  validateRefreshToken: jest.fn(),
  revokeRefreshToken: jest.fn(),
  createRefreshToken: jest.fn(),
}))

// Mock NextRequest
const createMockRequest = (body: any) => {
  return {
    json: async () => body,
  } as any
}

describe('POST /api/auth/refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 if refresh token is missing', async () => {
    const request = createMockRequest({})

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('MISSING_REFRESH_TOKEN')
  })

  it('should return 401 if refresh token is invalid', async () => {
    ;(validateRefreshToken as jest.Mock).mockResolvedValue(null)

    const request = createMockRequest({ refreshToken: 'invalid-token' })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('INVALID_REFRESH_TOKEN')
  })

  it('should return 401 if refresh token is expired', async () => {
    ;(validateRefreshToken as jest.Mock).mockResolvedValue(null)

    const request = createMockRequest({ refreshToken: 'expired-token' })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('INVALID_REFRESH_TOKEN')
  })

  it('should return 404 if user not found', async () => {
    ;(validateRefreshToken as jest.Mock).mockResolvedValue('user-1')
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const request = createMockRequest({ refreshToken: 'valid-token' })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(404)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('USER_NOT_FOUND')
  })

  it('should rotate refresh token and return new token', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'ADMIN',
    }

    ;(validateRefreshToken as jest.Mock).mockResolvedValue('user-1')
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
    ;(revokeRefreshToken as jest.Mock).mockResolvedValue(undefined)
    ;(createRefreshToken as jest.Mock).mockResolvedValue('new-refresh-token')

    const request = createMockRequest({ refreshToken: 'old-refresh-token' })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.refreshToken).toBe('new-refresh-token')
    expect(json.data.message).toBe('Token refreshed successfully')

    // Verify token rotation occurred
    expect(revokeRefreshToken).toHaveBeenCalledWith('old-refresh-token')
    expect(createRefreshToken).toHaveBeenCalledWith('user-1')
  })

  it('should reject revoked refresh tokens', async () => {
    ;(validateRefreshToken as jest.Mock).mockResolvedValue(null)

    const request = createMockRequest({ refreshToken: 'revoked-token' })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('INVALID_REFRESH_TOKEN')
  })
})

