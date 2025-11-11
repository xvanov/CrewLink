import { hashPassword, verifyPassword } from '../password'

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    it('should hash a password with bcrypt', async () => {
      const password = 'testPassword123'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(0)
      // bcryptjs can use $2a$ or $2b$ format
      expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true)
    })

    it('should produce different hashes for the same password', async () => {
      const password = 'testPassword123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)

      expect(hash1).not.toBe(hash2) // Different salts should produce different hashes
    })
  })

  describe('verifyPassword', () => {
    it('should verify a correct password', async () => {
      const password = 'testPassword123'
      const hash = await hashPassword(password)

      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
    })

    it('should reject an incorrect password', async () => {
      const password = 'testPassword123'
      const wrongPassword = 'wrongPassword'
      const hash = await hashPassword(password)

      const isValid = await verifyPassword(wrongPassword, hash)
      expect(isValid).toBe(false)
    })

    it('should use salt rounds ≥ 12', async () => {
      const password = 'testPassword123'
      const hash = await hashPassword(password)

      // Extract salt rounds from bcrypt hash (format: $2a$rounds$...)
      const rounds = parseInt(hash.split('$')[2])
      expect(rounds).toBeGreaterThanOrEqual(12)
    })
  })
})

