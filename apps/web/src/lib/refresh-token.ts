import { prisma } from './prisma'
import crypto from 'crypto'

const REFRESH_TOKEN_EXPIRY_DAYS = 7

/**
 * Generate a secure random refresh token
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Create a refresh token for a user
 * @param userId - User ID to create token for
 * @returns The created refresh token
 */
export async function createRefreshToken(userId: string): Promise<string> {
  const token = generateRefreshToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS)

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  })

  return token
}

/**
 * Validate and retrieve a refresh token
 * @param token - Refresh token to validate
 * @returns User ID if token is valid, null otherwise
 */
export async function validateRefreshToken(
  token: string
): Promise<string | null> {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!refreshToken) {
    return null
  }

  // Check if token is expired
  if (refreshToken.expiresAt < new Date()) {
    // Delete expired token
    await prisma.refreshToken.delete({
      where: { id: refreshToken.id },
    })
    return null
  }

  // Check if token is revoked
  if (refreshToken.revokedAt) {
    return null
  }

  return refreshToken.userId
}

/**
 * Revoke a refresh token (token rotation)
 * @param token - Refresh token to revoke
 */
export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: { token },
    data: { revokedAt: new Date() },
  })
}

/**
 * Revoke all refresh tokens for a user
 * @param userId - User ID to revoke tokens for
 */
export async function revokeAllUserRefreshTokens(userId: string): Promise<void> {
  await prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: { revokedAt: new Date() },
  })
}

/**
 * Clean up expired refresh tokens (should be run periodically)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const result = await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })

  return result.count
}

