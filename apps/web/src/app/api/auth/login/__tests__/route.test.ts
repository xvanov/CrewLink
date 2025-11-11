import { POST } from '../route'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'
import { createRefreshToken } from '@/lib/refresh-token'

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('@/lib/password', () => ({
  verifyPassword: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  signIn: jest.fn(),
}))

jest.mock('@/lib/refresh-token', () => ({
  createRefreshToken: jest.fn(),
}))

// Mock NextRequest
const createMockRequest = (body: any) => {
  return {
    json: async () => body,
  } as any
}

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 if email or password is missing', async () => {
    const request = createMockRequest({ email: 'test@example.com' })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('MISSING_CREDENTIALS')
  })

  it('should return 400 if email format is invalid', async () => {
    const request = createMockRequest({ email: 'invalid-email', password: 'password123' })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('INVALID_EMAIL')
  })

  it('should return 401 if user does not exist', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

    const request = createMockRequest({ email: 'test@example.com', password: 'password123' })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('INVALID_CREDENTIALS')
  })

  it('should return 401 if password is incorrect', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      passwordHash: 'hashed_password',
    }

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
    ;(verifyPassword as jest.Mock).mockResolvedValue(false)

    const request = createMockRequest({ email: 'test@example.com', password: 'wrongpassword' })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('INVALID_CREDENTIALS')
  })

  it('should return 200 and user data on successful login', async () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'ADMIN',
      passwordHash: 'hashed_password',
    }

    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
    ;(verifyPassword as jest.Mock).mockResolvedValue(true)
    ;(createRefreshToken as jest.Mock).mockResolvedValue('refresh-token-123')

    const request = createMockRequest({ email: 'test@example.com', password: 'password123' })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.success).toBe(true)
    expect(json.data.user.email).toBe('test@example.com')
    expect(json.data.user).not.toHaveProperty('passwordHash')
    expect(json.data).toHaveProperty('refreshToken')
  })
})

