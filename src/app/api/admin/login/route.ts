/**
 * Admin Login API
 * 
 * Handles admin authentication.
 * 
 * @route POST /api/admin/login
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { adminLoginSchema } from '@/lib/validators'
import { parseBody } from '@/lib/api-utils'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = parseBody(adminLoginSchema, body)
    if (!result.success) return result.response
    const { password } = result.data

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
