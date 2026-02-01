import { z } from 'zod'

// Reusable patterns
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

// --- Service Schemas ---

export const createServiceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  durationMinutes: z.number().min(1, 'Duration must be at least 1 minute'),
  price: z.number().min(0, 'Price must be non-negative'),
  description: z.string().optional(),
  imageUrl: z.string().url('Must be a valid URL').optional(),
})

export const updateServiceSchema = z.object({
  name: z.string().min(1).optional(),
  durationMinutes: z.number().min(1).optional(),
  price: z.number().min(0).optional(),
  description: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  isActive: z.boolean().optional(),
})

// --- Availability Schema ---

export const updateAvailabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(TIME_REGEX, 'Must be HH:mm format'),
  endTime: z.string().regex(TIME_REGEX, 'Must be HH:mm format'),
  isAvailable: z.boolean(),
})

// --- Blocked Slot Schema ---

export const createBlockedSlotSchema = z.object({
  date: z.string().regex(DATE_REGEX, 'Must be YYYY-MM-DD format'),
  startTime: z.string().regex(TIME_REGEX, 'Must be HH:mm format').optional(),
  endTime: z.string().regex(TIME_REGEX, 'Must be HH:mm format').optional(),
  reason: z.string().optional(),
})

// --- Booking Schemas ---

export const createBookingSchema = z.object({
  serviceId: z.string().uuid('Must be a valid service ID'),
  date: z.string().regex(DATE_REGEX, 'Must be YYYY-MM-DD format'),
  startTime: z.string().regex(TIME_REGEX, 'Must be HH:mm format'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Must be a valid email'),
  customerPhone: z.string().optional(),
})

export const updateBookingStatusSchema = z.object({
  status: z.enum(['cancelled', 'completed']),
})

// --- Auth Schemas ---

export const registerCustomerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export const adminLoginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

// --- Inferred Types ---

export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>
export type CreateBlockedSlotInput = z.infer<typeof createBlockedSlotSchema>
export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>
export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type AdminLoginInput = z.infer<typeof adminLoginSchema>
