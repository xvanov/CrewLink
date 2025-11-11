import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/middleware/rbac'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  const checkRole = requireRole([UserRole.ADMIN])
  const authResult = await checkRole(request)

  // If requireRole returned an error response, return it
  if (authResult instanceof NextResponse) {
    return authResult
  }

  // User is authenticated and has ADMIN role
  return NextResponse.json({
    success: true,
    data: {
      message: 'This is an admin-only route',
      user: {
        id: authResult.id,
        email: authResult.email,
        name: authResult.name,
        role: authResult.role,
      },
    },
  })
}

