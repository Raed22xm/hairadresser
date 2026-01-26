/**
 * Database Client Configuration
 * 
 * This module provides a singleton Prisma client instance for database operations.
 * It uses the PrismaPg adapter for PostgreSQL connections in Prisma v7.
 * 
 * @module lib/db
 */

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

/**
 * Database connection string from environment variables
 * @constant {string}
 */
const connectionString = process.env.DATABASE_URL!

/**
 * PostgreSQL connection pool
 * Manages database connections efficiently for the application
 */
const pool = new pg.Pool({ connectionString })

/**
 * Prisma adapter for PostgreSQL
 * Required for Prisma v7 to connect to the database
 */
const adapter = new PrismaPg(pool)

/**
 * Global type declaration to store Prisma client across hot reloads
 * This prevents creating new connections on every file change in development
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Prisma Client instance
 * 
 * Uses a singleton pattern to prevent multiple database connections:
 * - In development: Reuses existing connection across hot reloads
 * - In production: Creates a single instance
 * 
 * @example
 * import { prisma } from '@/lib/db'
 * 
 * // Fetch all services
 * const services = await prisma.service.findMany()
 * 
 * // Create a booking
 * const booking = await prisma.booking.create({
 *   data: { ... }
 * })
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

// Store Prisma client globally in development to prevent connection issues
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
