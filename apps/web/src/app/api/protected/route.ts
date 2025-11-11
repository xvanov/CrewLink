import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware/rbac'

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request)

  // If requireAuth returned an error response, return it
  if (authResult instanceof NextResponse) {
    return authResult
  }

  // User is authenticated
  return NextResponse.json({
    success: true,
    data: {
      message: 'This is a protected route',
      user: {
        id: authResult.id,
        email: authResult.email,
        name: authResult.name,
        role: authResult.role,
      },
    },
  })
}

