import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  validateRefreshToken,
  revokeRefreshToken,
  createRefreshToken,
} from '@/lib/refresh-token'
import { signIn } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refreshToken } = body

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_REFRESH_TOKEN',
            message: 'Refresh token is required',
          },
        },
        { status: 400 }
      )
    }

    // Validate the refresh token
    const userId = await validateRefreshToken(refreshToken)

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REFRESH_TOKEN',
            message: 'Invalid or expired refresh token',
          },
        },
        { status: 401 }
      )
    }

    // Verify the user still exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        },
        { status: 404 }
      )
    }

    // Revoke the old refresh token (token rotation)
    await revokeRefreshToken(refreshToken)

    // Generate a new refresh token
    const newRefreshToken = await createRefreshToken(userId)

    // Return success with new refresh token
    // Note: The access token (JWT) is managed by NextAuth via session cookies
    // Clients should call GET /api/auth/session to get the updated access token
    // after receiving the new refresh token
    return NextResponse.json({
      success: true,
      data: {
        message: 'Token refreshed successfully',
        refreshToken: newRefreshToken,
        // Access token is provided via NextAuth session cookie
        // Client should call /api/auth/session to get updated session
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to refresh token',
        },
      },
      { status: 500 }
    )
  }
}

