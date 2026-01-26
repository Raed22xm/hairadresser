/**
 * Single Blocked Slot API Routes
 * 
 * @route DELETE /api/blocked-slots/[id] - Remove a blocked slot
 * 
 * @module api/blocked-slots/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

type RouteParams = { params: Promise<{ id: string }> }

/**
 * DELETE /api/blocked-slots/[id]
 * 
 * Removes a blocked slot, making the time available for booking again.
 */
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params

        await prisma.blockedSlot.delete({
            where: { id },
        })

        return NextResponse.json({
            success: true,
            message: 'Blocked slot removed',
        })
    } catch (error) {
        console.error('Error deleting blocked slot:', error)
        return NextResponse.json(
            { error: 'Failed to delete blocked slot' },
            { status: 500 }
        )
    }
}
