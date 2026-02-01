/**
 * Single Booking API Routes
 * 
 * Handles operations on a specific booking by ID.
 * 
 * @route GET /api/bookings/[id] - Get booking by ID
 * @route PUT /api/bookings/[id] - Update booking (cancel)
 * @route DELETE /api/bookings/[id] - Cancel booking
 * 
 * @module api/bookings/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { differenceInHours } from 'date-fns'
import { updateBookingStatusSchema } from '@/lib/validators'
import { parseBody } from '@/lib/api-utils'

type RouteParams = { params: Promise<{ id: string }> }

/**
 * GET /api/bookings/[id]
 * 
 * Fetches a single booking by its ID or cancel token.
 */
export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params

        // Try to find by ID or cancel token
        const booking = await prisma.booking.findFirst({
            where: {
                OR: [
                    { id },
                    { cancelToken: id },
                ],
            },
            include: {
                service: { select: { name: true, price: true, durationMinutes: true } },
                hairdresser: { select: { salonName: true, address: true, phone: true } },
            },
        })

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        return NextResponse.json(booking)
    } catch (error) {
        console.error('Error fetching booking:', error)
        return NextResponse.json(
            { error: 'Failed to fetch booking' },
            { status: 500 }
        )
    }
}

/**
 * PUT /api/bookings/[id]
 * 
 * Updates a booking status (e.g., cancel).
 */
export async function PUT(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params
        const body = await request.json()
        const result = parseBody(updateBookingStatusSchema, body)
        if (!result.success) return result.response
        const { status } = result.data

        // Find booking
        const booking = await prisma.booking.findFirst({
            where: {
                OR: [{ id }, { cancelToken: id }],
            },
        })

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
        }

        // Check 24-hour cancellation policy (only for cancellations, not completions)
        if (status === 'cancelled') {
            const bookingDateTime = new Date(booking.date)
            const [hours, minutes] = booking.startTime.split(':').map(Number)
            bookingDateTime.setHours(hours, minutes)

            const hoursUntilBooking = differenceInHours(bookingDateTime, new Date())

            if (hoursUntilBooking < 24 && hoursUntilBooking > 0) {
                return NextResponse.json(
                    { error: 'Cancellation not allowed within 24 hours of appointment' },
                    { status: 400 }
                )
            }
        }

        // Update booking status
        const updated = await prisma.booking.update({
            where: { id: booking.id },
            data: { status },
        })

        return NextResponse.json({
            success: true,
            message: `Booking ${status} successfully`,
            booking: updated,
        })
    } catch (error) {
        console.error('Error updating booking:', error)
        return NextResponse.json(
            { error: 'Failed to update booking' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/bookings/[id]
 * 
 * Cancels a booking (admin action, no time restriction).
 */
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params

        const booking = await prisma.booking.update({
            where: { id },
            data: { status: 'cancelled' },
        })

        return NextResponse.json({
            success: true,
            message: 'Booking cancelled by admin',
            booking,
        })
    } catch (error) {
        console.error('Error deleting booking:', error)
        return NextResponse.json(
            { error: 'Failed to cancel booking' },
            { status: 500 }
        )
    }
}
