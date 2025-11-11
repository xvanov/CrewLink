import { NextRequest, NextResponse } from 'next/server'
import { signIn } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'
import { createRefreshToken } from '@/lib/refresh-token'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_CREDENTIALS',
            message: 'Email and password are required',
          },
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Invalid email format',
          },
        },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        },
        { status: 401 }
      )
    }

    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash)

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        },
        { status: 401 }
      )
    }

    // Sign in with NextAuth
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    // Generate refresh token
    const refreshToken = await createRefreshToken(user.id)

    // Return user data (without password hash) and refresh token
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        refreshToken,
        message: 'Login successful',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to process login',
        },
      },
      { status: 500 }
    )
  }
}

