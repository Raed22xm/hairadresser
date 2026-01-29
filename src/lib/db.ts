/**
 * Database Client Configuration
 * 
 * This module provides a singleton Prisma client instance for database operations.
 * Configured for Supabase PostgreSQL with Prisma v7.
 * 
 * @module lib/db
 */

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

/**
 * Database connection string from environment variables
 */
const connectionString = process.env.DATABASE_URL

/**
 * Global type declaration to store Prisma client across hot reloads
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Creates a new Prisma client instance
 */
function createPrismaClient(): PrismaClient {
  if (!connectionString) {
    console.error('DATABASE_URL is not set')
    // Return a client that will fail gracefully
    return new PrismaClient()
  }

  try {
    // Create PostgreSQL connection pool
    const pool = new pg.Pool({ 
      connectionString,
      // Supabase connection pool settings
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })

    // Create Prisma adapter
    const adapter = new PrismaPg(pool)

    // Return Prisma client with adapter
    return new PrismaClient({ adapter })
  } catch (error) {
    console.error('Failed to create database connection:', error)
    return new PrismaClient()
  }
}

/**
 * Prisma Client instance
 * 
 * Uses a singleton pattern to prevent multiple database connections:
 * - In development: Reuses existing connection across hot reloads
 * - In production: Creates a single instance
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Store Prisma client globally in development to prevent connection issues
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
