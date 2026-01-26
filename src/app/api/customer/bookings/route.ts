/**
 * Customer Bookings API
 * 
 * @route GET /api/customer/bookings
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
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Verify customer exists
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    })

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    // Get customer's bookings
    const bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { customerId },
          { customerEmail: customer.email },
        ],
      },
      include: {
        service: {
          select: { name: true, price: true, durationMinutes: true },
        },
        hairdresser: {
          select: { salonName: true, address: true },
        },
      },
      orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
    })

    // Separate upcoming and past
    const now = new Date()
    now.setHours(0, 0, 0, 0)

    const upcoming = bookings.filter(b => 
      new Date(b.date) >= now && b.status === 'confirmed'
    )
    const past = bookings.filter(b => 
      new Date(b.date) < now || b.status !== 'confirmed'
    )

    return NextResponse.json({ upcoming, past })
  } catch (error) {
    console.error('Error fetching customer bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
