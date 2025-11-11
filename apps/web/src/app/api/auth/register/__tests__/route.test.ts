import { POST } from '../route'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { UserRole } from '@prisma/client'

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('@/lib/password', () => ({
  hashPassword: jest.fn(),
}))

jest.mock('@/lib/middleware/rbac', () => ({
  requireRole: jest.fn(() => async () => ({
    id: 'admin-1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: UserRole.ADMIN,
  })),
}))

// Mock NextRequest
const createMockRequest = (body: any) => {
  return {
    json: async () => body,
  } as any
}

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 400 if required fields are missing', async () => {
    const request = createMockRequest({ email: 'test@example.com' })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('MISSING_FIELDS')
  })

  it('should return 400 if email format is invalid', async () => {
    const request = createMockRequest({
      email: 'invalid-email',
      password: 'password123',
      name: 'Test User',
      role: UserRole.CREW_MEMBER,
    })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('INVALID_EMAIL')
  })

  it('should return 400 if password is too weak', async () => {
    const request = createMockRequest({
      email: 'test@example.com',
      password: 'short',
      name: 'Test User',
      role: UserRole.CREW_MEMBER,
    })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('WEAK_PASSWORD')
  })

  it('should return 409 if user already exists', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
    })

    const request = createMockRequest({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: UserRole.CREW_MEMBER,
    })
    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(409)
    expect(json.success).toBe(false)
    expect(json.error.code).toBe('USER_EXISTS')
  })

  it('should return 201 and create user on successful registration', async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(hashPassword as jest.Mock).mockResolvedValue('hashed_password')
    ;(prisma.user.create as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.CREW_MEMBER,
      createdAt: new Date(),
    })

    const request = createMockRequest({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: UserRole.CREW_MEMBER,
    })

    const response = await POST(request)
    const json = await response.json()

    expect(response.status).toBe(201)
    expect(json.success).toBe(true)
    expect(json.data.email).toBe('test@example.com')
    expect(json.data).not.toHaveProperty('passwordHash')
    expect(hashPassword).toHaveBeenCalledWith('password123')
  })
})

