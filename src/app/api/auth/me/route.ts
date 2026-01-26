/**
 * Get Current Customer API
 * 
 * @route GET /api/auth/me
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const customerId = cookieStore.get('customer_session')?.value

    if (!customerId) {
      return NextResponse.json(
        { customer: null },
        { status: 200 }
      )
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    })

    if (!customer) {
      // Invalid session, clear cookie
      const store = await cookies()
      store.delete('customer_session')
      return NextResponse.json({ customer: null })
    }

    return NextResponse.json({ customer })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Failed to check auth status' },
      { status: 500 }
    )
  }
}
