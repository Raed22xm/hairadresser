/**
 * Availability API Routes
 * 
 * Handles operations for salon availability and time slots.
 * 
 * @route GET /api/availability - Get weekly availability
 * @route GET /api/availability?date=YYYY-MM-DD - Get available slots for a date
 * @route PUT /api/availability - Update weekly schedule
 * 
 * @module api/availability
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { addMinutes, format, parse, isAfter, isBefore, addHours } from 'date-fns'

/**
 * GET /api/availability
 * 
 * If date query param provided: Returns available time slots for that date
 * If no date: Returns weekly availability schedule
 * 
 * @param {NextRequest} request - Request with optional date query
 * @returns {Promise<NextResponse>} Available slots or weekly schedule
 * 
 * @example
 * // GET /api/availability?date=2024-01-26&serviceId=xxx
 * // Response: { date: "2024-01-26", slots: ["09:00", "09:30", "10:00", ...] }
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const dateParam = searchParams.get('date')
        const serviceId = searchParams.get('serviceId')

        // Get hairdresser
        const hairdresser = await prisma.hairdresser.findFirst()
        if (!hairdresser) {
            return NextResponse.json({ error: 'No hairdresser found' }, { status: 404 })
        }

        // If date is provided, return available slots for that date
        if (dateParam) {
            const slots = await getAvailableSlotsForDate(
                hairdresser.id,
                dateParam,
                serviceId
            )
            return NextResponse.json(slots)
        }

        // Otherwise return weekly schedule
        const availability = await prisma.availability.findMany({
            where: { hairdresserId: hairdresser.id },
            orderBy: { dayOfWeek: 'asc' },
            select: {
                id: true,
                dayOfWeek: true,
                startTime: true,
                endTime: true,
                isAvailable: true,
            },
        })

        return NextResponse.json(availability)
    } catch (error) {
        console.error('Error fetching availability:', error)
        return NextResponse.json(
            { error: 'Failed to fetch availability' },
            { status: 500 }
        )
    }
}

/**
 * PUT /api/availability
 * 
 * Updates the weekly availability schedule.
 * 
 * @param {NextRequest} request - Request with availability data
 * @returns {Promise<NextResponse>} Updated availability
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { dayOfWeek, startTime, endTime, isAvailable } = body

        const hairdresser = await prisma.hairdresser.findFirst()
        if (!hairdresser) {
            return NextResponse.json({ error: 'No hairdresser found' }, { status: 404 })
        }

        const availability = await prisma.availability.upsert({
            where: {
                hairdresserId_dayOfWeek: {
                    hairdresserId: hairdresser.id,
                    dayOfWeek: Number(dayOfWeek),
                },
            },
            update: {
                startTime,
                endTime,
                isAvailable,
            },
            create: {
                hairdresserId: hairdresser.id,
                dayOfWeek: Number(dayOfWeek),
                startTime,
                endTime,
                isAvailable,
            },
        })

        return NextResponse.json(availability)
    } catch (error) {
        console.error('Error updating availability:', error)
        return NextResponse.json(
            { error: 'Failed to update availability' },
            { status: 500 }
        )
    }
}

/**
 * Helper function to get available time slots for a specific date
 * 
 * @param {string} hairdresserId - The hairdresser's ID
 * @param {string} dateStr - Date in YYYY-MM-DD format
 * @param {string | null} serviceId - Optional service ID for duration
 * @returns {Promise<object>} Object with date and available slots
 */
async function getAvailableSlotsForDate(
    hairdresserId: string,
    dateStr: string,
    serviceId: string | null
) {
    const date = new Date(dateStr)
    const dayOfWeek = date.getDay()

    // Get service duration (default 30 min)
    let slotDuration = 30
    if (serviceId) {
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
            select: { durationMinutes: true },
        })
        if (service) slotDuration = service.durationMinutes
    }

    // Check if salon is open on this day
    const dayAvailability = await prisma.availability.findUnique({
        where: {
            hairdresserId_dayOfWeek: { hairdresserId, dayOfWeek },
        },
    })

    if (!dayAvailability || !dayAvailability.isAvailable) {
        return { date: dateStr, slots: [], message: 'Salon is closed on this day' }
    }

    // Get blocked slots for this date
    const blockedSlots = await prisma.blockedSlot.findMany({
        where: {
            hairdresserId,
            date: date,
        },
    })

    // Get existing bookings for this date
    const bookings = await prisma.booking.findMany({
        where: {
            hairdresserId,
            date: date,
            status: 'confirmed',
        },
        select: { startTime: true, endTime: true },
    })

    // Generate all possible slots
    const slots: string[] = []
    const startTime = parse(dayAvailability.startTime, 'HH:mm', date)
    const endTime = parse(dayAvailability.endTime, 'HH:mm', date)

    // Minimum booking time: 2 hours from now
    const now = new Date()
    const minBookingTime = addHours(now, 2)

    let currentSlot = startTime
    while (isBefore(addMinutes(currentSlot, slotDuration), endTime) ||
        format(addMinutes(currentSlot, slotDuration), 'HH:mm') === dayAvailability.endTime) {
        const slotStr = format(currentSlot, 'HH:mm')
        const slotEndStr = format(addMinutes(currentSlot, slotDuration), 'HH:mm')

        // Check if slot is in the past (for today)
        const slotDateTime = parse(slotStr, 'HH:mm', date)
        if (dateStr === format(now, 'yyyy-MM-dd') && isBefore(slotDateTime, minBookingTime)) {
            currentSlot = addMinutes(currentSlot, 30)
            continue
        }

        // Check if slot is blocked
        const isBlocked = blockedSlots.some((blocked) => {
            if (!blocked.startTime || !blocked.endTime) return true // Whole day blocked
            return slotStr >= blocked.startTime && slotStr < blocked.endTime
        })

        // Check if slot overlaps with existing booking
        const isBooked = bookings.some((booking) => {
            return (
                (slotStr >= booking.startTime && slotStr < booking.endTime) ||
                (slotEndStr > booking.startTime && slotEndStr <= booking.endTime) ||
                (slotStr <= booking.startTime && slotEndStr >= booking.endTime)
            )
        })

        if (!isBlocked && !isBooked) {
            slots.push(slotStr)
        }

        currentSlot = addMinutes(currentSlot, 30)
    }

    return { date: dateStr, slots }
}
