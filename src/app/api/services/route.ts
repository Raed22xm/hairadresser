/**
 * Services API Routes
 * 
 * Handles CRUD operations for salon services.
 * 
 * @route GET /api/services - Get all active services
 * @route POST /api/services - Create a new service (admin only)
 * 
 * @module api/services
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createServiceSchema } from '@/lib/validators'
import { parseBody } from '@/lib/api-utils'

/**
 * GET /api/services
 * 
 * Fetches all active services from the database.
 * Used by the public booking page to display available services.
 * 
 * @returns {Promise<NextResponse>} JSON array of services
 * 
 * @example
 * // Response
 * [
 *   { id: "...", name: "Haircut", durationMinutes: 30, price: 250, ... },
 *   { id: "...", name: "Coloring", durationMinutes: 60, price: 500, ... }
 * ]
 */
export async function GET() {
    try {
        const services = await prisma.service.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                description: true,
                durationMinutes: true,
                price: true,
            },
        })

        return NextResponse.json(services)
    } catch (error) {
        console.error('Error fetching services:', error)
        return NextResponse.json(
            { error: 'Failed to fetch services' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/services
 * 
 * Creates a new service. Requires admin authentication.
 * 
 * @param {NextRequest} request - Request with service data
 * @returns {Promise<NextResponse>} Created service or error
 * 
 * @example
 * // Request body
 * {
 *   "name": "New Style",
 *   "description": "A fresh new look",
 *   "durationMinutes": 45,
 *   "price": 350
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Get the first hairdresser (single salon MVP)
        const hairdresser = await prisma.hairdresser.findFirst()
        if (!hairdresser) {
            return NextResponse.json(
                { error: 'No hairdresser found' },
                { status: 404 }
            )
        }

        const result = parseBody(createServiceSchema, body)
        if (!result.success) return result.response
        const { name, durationMinutes, price, description } = result.data

        // Create the service
        const service = await prisma.service.create({
            data: {
                hairdresserId: hairdresser.id,
                name,
                description: description || null,
                durationMinutes,
                price,
                isActive: true,
            },
        })

        return NextResponse.json(service, { status: 201 })
    } catch (error) {
        console.error('Error creating service:', error)
        return NextResponse.json(
            { error: 'Failed to create service' },
            { status: 500 }
        )
    }
}
