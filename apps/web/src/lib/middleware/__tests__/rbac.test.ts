import { NextRequest } from 'next/server'
import { requireAuth, requireRole } from '../rbac'
import { UserRole } from '@prisma/client'

// Mock NextAuth
jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}))

import { auth } from '@/lib/auth'

describe('RBAC Middleware', () => {
  const mockRequest = new NextRequest('http://localhost:3000/api/test')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('requireAuth', () => {
    it('should return user when authenticated', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.ADMIN,
      }

      ;(auth as jest.Mock).mockResolvedValue({
        user: mockUser,
      })

      const result = await requireAuth(mockRequest)

      expect(result).toEqual(mockUser)
    })

    it('should return 401 when not authenticated', async () => {
      ;(auth as jest.Mock).mockResolvedValue(null)

      const result = await requireAuth(mockRequest)

      expect(result).toBeInstanceOf(Response)
      const response = result as Response
      expect(response.status).toBe(401)
      const json = await response.json()
      expect(json.success).toBe(false)
      expect(json.error.code).toBe('UNAUTHORIZED')
    })
  })

  describe('requireRole', () => {
    it('should allow access when user has required role', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.ADMIN,
      }

      ;(auth as jest.Mock).mockResolvedValue({
        user: mockUser,
      })

      const checkRole = requireRole([UserRole.ADMIN])
      const result = await checkRole(mockRequest)

      expect(result).toEqual(mockUser)
    })

    it('should deny access when user does not have required role', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.CREW_MEMBER,
      }

      ;(auth as jest.Mock).mockResolvedValue({
        user: mockUser,
      })

      const checkRole = requireRole([UserRole.ADMIN])
      const result = await checkRole(mockRequest)

      expect(result).toBeInstanceOf(Response)
      const response = result as Response
      expect(response.status).toBe(403)
      const json = await response.json()
      expect(json.success).toBe(false)
      expect(json.error.code).toBe('FORBIDDEN')
    })

    it('should allow access when user has one of multiple allowed roles', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.MANAGER,
      }

      ;(auth as jest.Mock).mockResolvedValue({
        user: mockUser,
      })

      const checkRole = requireRole([UserRole.ADMIN, UserRole.MANAGER])
      const result = await checkRole(mockRequest)

      expect(result).toEqual(mockUser)
    })
  })
})

