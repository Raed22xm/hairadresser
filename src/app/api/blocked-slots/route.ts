/**
 * Blocked Slots API Routes
 * 
 * Handles operations for blocking time slots (vacation, breaks).
 * 
 * @route GET /api/blocked-slots - Get all blocked slots
 * @route POST /api/blocked-slots - Create a blocked slot
 * @route DELETE /api/blocked-slots/[id] - Remove a blocked slot
 * 
 * @module api/blocked-slots
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createBlockedSlotSchema } from '@/lib/validators'
import { parseBody } from '@/lib/api-utils'

/**
 * GET /api/blocked-slots
 * 
 * Fetches all blocked slots. Optionally filter by date range.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const from = searchParams.get('from')
        const to = searchParams.get('to')

        const hairdresser = await prisma.hairdresser.findFirst()
        if (!hairdresser) {
            return NextResponse.json({ error: 'No hairdresser found' }, { status: 404 })
        }

        const where: Record<string, unknown> = { hairdresserId: hairdresser.id }

        if (from && to) {
            where.date = {
                gte: new Date(from),
                lte: new Date(to),
            }
        }

        const blockedSlots = await prisma.blockedSlot.findMany({
            where,
            orderBy: { date: 'asc' },
        })

        return NextResponse.json(blockedSlots)
    } catch (error) {
        console.error('Error fetching blocked slots:', error)
        return NextResponse.json(
            { error: 'Failed to fetch blocked slots' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/blocked-slots
 * 
 * Creates a new blocked slot (vacation, break, etc.).
 * 
 * @example
 * // Block whole day
 * { "date": "2024-01-26", "reason": "Holiday" }
 * 
 * // Block time range
 * { "date": "2024-01-26", "startTime": "12:00", "endTime": "13:00", "reason": "Lunch" }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const result = parseBody(createBlockedSlotSchema, body)
        if (!result.success) return result.response
        const { date, startTime, endTime, reason } = result.data

        const hairdresser = await prisma.hairdresser.findFirst()
        if (!hairdresser) {
            return NextResponse.json({ error: 'No hairdresser found' }, { status: 404 })
        }

        const blockedSlot = await prisma.blockedSlot.create({
            data: {
                hairdresserId: hairdresser.id,
                date: new Date(date),
                startTime: startTime || null,
                endTime: endTime || null,
                reason: reason || null,
            },
        })

        return NextResponse.json(blockedSlot, { status: 201 })
    } catch (error) {
        console.error('Error creating blocked slot:', error)
        return NextResponse.json(
            { error: 'Failed to create blocked slot' },
            { status: 500 }
        )
    }
}
