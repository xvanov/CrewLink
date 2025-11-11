// Mock all dependencies before importing
jest.mock('next-auth', () => {
  const mockNextAuth = jest.fn(() => ({
    handlers: {
      GET: jest.fn(),
      POST: jest.fn(),
    },
    signIn: jest.fn(),
    signOut: jest.fn(),
    auth: jest.fn(),
  }))
  return {
    __esModule: true,
    default: mockNextAuth,
  }
})

jest.mock('next-auth/providers/credentials', () => {
  const mockCredentials = jest.fn((config: any) => ({
    id: 'credentials',
    name: config?.name || 'Credentials',
    type: 'credentials',
  }))
  return {
    __esModule: true,
    default: mockCredentials,
  }
})

jest.mock('../prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('../password', () => ({
  verifyPassword: jest.fn(),
}))

// Import after mocks are set up
import { auth } from '../auth'

describe('NextAuth Configuration', () => {
  it('should export auth configuration', () => {
    // Test that the module exports auth without errors
    expect(auth).toBeDefined()
  })

  it('should have auth function available', () => {
    // Verify auth is configured (this test ensures the module loads without errors)
    expect(typeof auth).toBe('function')
  })
})

