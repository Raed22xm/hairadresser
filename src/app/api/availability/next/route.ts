/**
 * Next Available API Route
 * 
 * Returns the next 5 available time slots for quick booking.
 * 
 * @route GET /api/availability/next - Get next available slots
 * 
 * @module api/availability/next
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { addDays, addMinutes, format, parse, isAfter, isBefore, addHours } from 'date-fns'

/**
 * GET /api/availability/next
 * 
 * Returns the next available time slots across the next 7 days.
 * Used for "Quick Book" feature.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const serviceId = searchParams.get('serviceId')
        const limit = parseInt(searchParams.get('limit') || '5')

        const hairdresser = await prisma.hairdresser.findFirst()
        if (!hairdresser) {
            return NextResponse.json({ error: 'No hairdresser found' }, { status: 404 })
        }

        // Get service duration
        let slotDuration = 30
        if (serviceId) {
            const service = await prisma.service.findUnique({
                where: { id: serviceId },
                select: { durationMinutes: true },
            })
            if (service) slotDuration = service.durationMinutes
        }

        // Get availability for all days
        const availabilities = await prisma.availability.findMany({
            where: { hairdresserId: hairdresser.id, isAvailable: true },
        })

        const availabilityByDay = new Map(
            availabilities.map(a => [a.dayOfWeek, a])
        )

        const nextSlots: { date: string; time: string; dayName: string }[] = []
        const now = new Date()
        const minBookingTime = addHours(now, 2)

        // Check next 14 days
        for (let dayOffset = 0; dayOffset < 14 && nextSlots.length < limit; dayOffset++) {
            const checkDate = addDays(now, dayOffset)
            const dayOfWeek = checkDate.getDay()
            const dateStr = format(checkDate, 'yyyy-MM-dd')
            const dayName = format(checkDate, 'EEE, MMM d')

            const dayAvailability = availabilityByDay.get(dayOfWeek)
            if (!dayAvailability) continue

            // Get blocked slots for this date
            const blockedSlots = await prisma.blockedSlot.findMany({
                where: {
                    hairdresserId: hairdresser.id,
                    date: checkDate,
                },
            })

            // Check if whole day is blocked
            const wholeDayBlocked = blockedSlots.some(b => !b.startTime && !b.endTime)
            if (wholeDayBlocked) continue

            // Get bookings for this date
            const bookings = await prisma.booking.findMany({
                where: {
                    hairdresserId: hairdresser.id,
                    date: checkDate,
                    status: 'confirmed',
                },
                select: { startTime: true, endTime: true },
            })

            // Generate slots
            const startTime = parse(dayAvailability.startTime, 'HH:mm', checkDate)
            const endTime = parse(dayAvailability.endTime, 'HH:mm', checkDate)

            let currentSlot = startTime
            while (
                nextSlots.length < limit &&
                (isBefore(addMinutes(currentSlot, slotDuration), endTime) ||
                    format(addMinutes(currentSlot, slotDuration), 'HH:mm') === dayAvailability.endTime)
            ) {
                const slotStr = format(currentSlot, 'HH:mm')
                const slotEndStr = format(addMinutes(currentSlot, slotDuration), 'HH:mm')
                const slotDateTime = new Date(checkDate)
                const [h, m] = slotStr.split(':').map(Number)
                slotDateTime.setHours(h, m)

                // Skip past slots
                if (isBefore(slotDateTime, minBookingTime)) {
                    currentSlot = addMinutes(currentSlot, 30)
                    continue
                }

                // Check if blocked
                const isBlocked = blockedSlots.some(blocked => {
                    if (!blocked.startTime || !blocked.endTime) return false
                    return slotStr >= blocked.startTime && slotStr < blocked.endTime
                })

                // Check if booked
                const isBooked = bookings.some(booking => {
                    return (
                        (slotStr >= booking.startTime && slotStr < booking.endTime) ||
                        (slotEndStr > booking.startTime && slotEndStr <= booking.endTime) ||
                        (slotStr <= booking.startTime && slotEndStr >= booking.endTime)
                    )
                })

                if (!isBlocked && !isBooked) {
                    nextSlots.push({
                        date: dateStr,
                        time: slotStr,
                        dayName,
                    })
                }

                currentSlot = addMinutes(currentSlot, 30)
            }
        }

        return NextResponse.json({ slots: nextSlots })
    } catch (error) {
        console.error('Error fetching next available slots:', error)
        return NextResponse.json(
            { error: 'Failed to fetch available slots' },
            { status: 500 }
        )
    }
}
