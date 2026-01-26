/**
 * Bookings API Routes
 * 
 * Handles booking creation and listing.
 * 
 * @route GET /api/bookings - Get all bookings (admin)
 * @route POST /api/bookings - Create a new booking
 * 
 * @module api/bookings
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendBookingConfirmation } from '@/lib/email'
import { addMinutes, format, parse, addHours, isBefore } from 'date-fns'
import { cookies } from 'next/headers'
import crypto from 'crypto'

/**
 * GET /api/bookings
 * 
 * Fetches all bookings. Used by admin dashboard.
 * Supports filtering by date and status.
 * 
 * @param {NextRequest} request - Request with optional query params
 * @returns {Promise<NextResponse>} Array of bookings
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const dateParam = searchParams.get('date')
        const status = searchParams.get('status')

        const hairdresser = await prisma.hairdresser.findFirst()
        if (!hairdresser) {
            return NextResponse.json({ error: 'No hairdresser found' }, { status: 404 })
        }

        const where: Record<string, unknown> = { hairdresserId: hairdresser.id }

        if (dateParam) {
            where.date = new Date(dateParam)
        }
        if (status) {
            where.status = status
        }

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                service: {
                    select: { name: true, durationMinutes: true, price: true },
                },
            },
            orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
        })

        return NextResponse.json(bookings)
    } catch (error) {
        console.error('Error fetching bookings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/bookings
 * 
 * Creates a new booking.
 * Validates: time slot availability, service exists, required fields.
 * Sends confirmation email after successful booking.
 * 
 * @param {NextRequest} request - Request with booking data
 * @returns {Promise<NextResponse>} Created booking or error
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { serviceId, date, startTime, customerName, customerEmail, customerPhone } = body

        // Validate required fields
        if (!serviceId || !date || !startTime || !customerName || !customerEmail) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Get hairdresser
        const hairdresser = await prisma.hairdresser.findFirst()
        if (!hairdresser) {
            return NextResponse.json({ error: 'No hairdresser found' }, { status: 404 })
        }

        // Get service
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
        })
        if (!service || !service.isActive) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 })
        }

        // Calculate end time
        const bookingDate = new Date(date)
        const startDateTime = parse(startTime, 'HH:mm', bookingDate)
        const endDateTime = addMinutes(startDateTime, service.durationMinutes)
        const endTime = format(endDateTime, 'HH:mm')

        // Validate: Not in the past
        const now = new Date()
        const minBookingTime = addHours(now, 2)
        if (isBefore(startDateTime, minBookingTime)) {
            return NextResponse.json(
                { error: 'Booking must be at least 2 hours in advance' },
                { status: 400 }
            )
        }

        // Validate: Day is available
        const dayOfWeek = bookingDate.getDay()
        const dayAvailability = await prisma.availability.findUnique({
            where: {
                hairdresserId_dayOfWeek: { hairdresserId: hairdresser.id, dayOfWeek },
            },
        })

        if (!dayAvailability || !dayAvailability.isAvailable) {
            return NextResponse.json(
                { error: 'Salon is closed on this day' },
                { status: 400 }
            )
        }

        // Validate: Within working hours
        if (startTime < dayAvailability.startTime || endTime > dayAvailability.endTime) {
            return NextResponse.json(
                { error: 'Booking is outside working hours' },
                { status: 400 }
            )
        }

        // Validate: Not blocked
        const blockedSlots = await prisma.blockedSlot.findMany({
            where: {
                hairdresserId: hairdresser.id,
                date: bookingDate,
            },
        })

        const isBlocked = blockedSlots.some((blocked) => {
            if (!blocked.startTime || !blocked.endTime) return true
            return startTime >= blocked.startTime && startTime < blocked.endTime
        })

        if (isBlocked) {
            return NextResponse.json(
                { error: 'This time slot is blocked' },
                { status: 400 }
            )
        }

        // Validate: No overlapping bookings
        const existingBookings = await prisma.booking.findMany({
            where: {
                hairdresserId: hairdresser.id,
                date: bookingDate,
                status: 'confirmed',
            },
        })

        const hasConflict = existingBookings.some((booking) => {
            return (
                (startTime >= booking.startTime && startTime < booking.endTime) ||
                (endTime > booking.startTime && endTime <= booking.endTime) ||
                (startTime <= booking.startTime && endTime >= booking.endTime)
            )
        })

        if (hasConflict) {
            return NextResponse.json(
                { error: 'This time slot is already booked' },
                { status: 400 }
            )
        }

        // Generate cancel token for email
        const cancelToken = crypto.randomBytes(32).toString('hex')

        // Check if customer is logged in
        const cookieStore = await cookies()
        const customerId = cookieStore.get('customer_session')?.value || null

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                hairdresserId: hairdresser.id,
                serviceId,
                customerId,
                customerName,
                customerEmail,
                customerPhone: customerPhone || null,
                date: bookingDate,
                startTime,
                endTime,
                status: 'confirmed',
                cancelToken,
            },
            include: {
                service: { select: { name: true, price: true } },
            },
        })

        // Send confirmation email (async, don't block response)
        sendBookingConfirmation({
            customerName,
            customerEmail,
            serviceName: service.name,
            servicePrice: service.price.toString(),
            date: bookingDate,
            startTime,
            endTime,
            salonName: hairdresser.salonName,
            salonAddress: hairdresser.address,
            salonPhone: hairdresser.phone,
            bookingId: booking.id,
            cancelToken,
        }).catch(err => console.error('Email error:', err))

        return NextResponse.json(booking, { status: 201 })
    } catch (error) {
        console.error('Error creating booking:', error)
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        )
    }
}
