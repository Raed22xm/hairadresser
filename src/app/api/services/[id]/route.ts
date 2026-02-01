/**
 * Single Service API Routes
 * 
 * Handles operations on a specific service by ID.
 * 
 * @route GET /api/services/[id] - Get service by ID
 * @route PUT /api/services/[id] - Update service
 * @route DELETE /api/services/[id] - Deactivate service
 * 
 * @module api/services/[id]
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { updateServiceSchema } from '@/lib/validators'
import { parseBody } from '@/lib/api-utils'

type RouteParams = { params: Promise<{ id: string }> }

/**
 * GET /api/services/[id]
 * 
 * Fetches a single service by its ID.
 * 
 * @param {NextRequest} request - The request object
 * @param {RouteParams} params - Route parameters containing service ID
 * @returns {Promise<NextResponse>} The service or 404 error
 */
export async function GET(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params

        const service = await prisma.service.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                durationMinutes: true,
                price: true,
                isActive: true,
            },
        })

        if (!service) {
            return NextResponse.json(
                { error: 'Service not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(service)
    } catch (error) {
        console.error('Error fetching service:', error)
        return NextResponse.json(
            { error: 'Failed to fetch service' },
            { status: 500 }
        )
    }
}

/**
 * PUT /api/services/[id]
 * 
 * Updates an existing service.
 * 
 * @param {NextRequest} request - Request with updated service data
 * @param {RouteParams} params - Route parameters containing service ID
 * @returns {Promise<NextResponse>} Updated service or error
 */
export async function PUT(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params
        const body = await request.json()

        const result = parseBody(updateServiceSchema, body)
        if (!result.success) return result.response
        const { name, description, durationMinutes, price, isActive } = result.data

        const service = await prisma.service.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(description !== undefined && { description }),
                ...(durationMinutes !== undefined && { durationMinutes }),
                ...(price !== undefined && { price }),
                ...(isActive !== undefined && { isActive }),
            },
        })

        return NextResponse.json(service)
    } catch (error) {
        console.error('Error updating service:', error)
        return NextResponse.json(
            { error: 'Failed to update service' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/services/[id]
 * 
 * Deactivates a service (soft delete).
 * Services are not actually deleted to preserve booking history.
 * 
 * @param {NextRequest} request - The request object
 * @param {RouteParams} params - Route parameters containing service ID
 * @returns {Promise<NextResponse>} Success message or error
 */
export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
) {
    try {
        const { id } = await params

        // Soft delete - just mark as inactive
        await prisma.service.update({
            where: { id },
            data: { isActive: false },
        })

        return NextResponse.json({ success: true, message: 'Service deactivated' })
    } catch (error) {
        console.error('Error deleting service:', error)
        return NextResponse.json(
            { error: 'Failed to delete service' },
            { status: 500 }
        )
    }
}
