import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/middleware/rbac'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { UserRole } from '@prisma/client'

export async function POST(request: NextRequest) {
  // Check if user is admin
  const checkRole = requireRole([UserRole.ADMIN])
  const authResult = await checkRole(request)

  // If requireRole returned an error response, return it
  if (authResult instanceof NextResponse) {
    return authResult
  }

  try {
    const body = await request.json()
    const { email, password, name, role } = body

    // Input validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Email, password, name, and role are required',
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

    // Validate password strength (minimum 8 characters)
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'WEAK_PASSWORD',
            message: 'Password must be at least 8 characters long',
          },
        },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = Object.values(UserRole)
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ROLE',
            message: `Role must be one of: ${validRoles.join(', ')}`,
          },
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'User with this email already exists',
          },
        },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create user',
        },
      },
      { status: 500 }
    )
  }
}

