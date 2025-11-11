import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import type { UserRole } from '@prisma/client'

/**
 * Middleware to require authentication for API routes
 * Returns the authenticated user or throws an error response
 */
export async function requireAuth(request: NextRequest) {
  const session = await auth()

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      },
      { status: 401 }
    )
  }

  return session.user
}

/**
 * Middleware to require specific roles for API routes
 * @param allowedRoles - Array of roles that are allowed to access the route
 * @returns Middleware function that checks user role
 */
export function requireRole(allowedRoles: UserRole[]) {
  return async (request: NextRequest) => {
    const user = await requireAuth(request)

    // If requireAuth returned a Response (error), return it
    if (user instanceof NextResponse) {
      return user
    }

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Insufficient permissions',
          },
        },
        { status: 403 }
      )
    }

    return user
  }
}

