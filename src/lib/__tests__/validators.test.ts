import { describe, it, expect } from 'vitest'
import {
  createServiceSchema,
  updateServiceSchema,
  updateAvailabilitySchema,
  createBlockedSlotSchema,
  createBookingSchema,
  updateBookingStatusSchema,
  registerCustomerSchema,
  loginSchema,
  adminLoginSchema,
} from '../validators'

describe('createServiceSchema', () => {
  it('accepts valid input with all fields', () => {
    const result = createServiceSchema.safeParse({
      name: 'Haircut',
      durationMinutes: 30,
      price: 250,
      description: 'A fresh cut',
      imageUrl: 'https://example.com/img.jpg',
    })
    expect(result.success).toBe(true)
  })

  it('accepts valid input with only required fields', () => {
    const result = createServiceSchema.safeParse({
      name: 'Haircut',
      durationMinutes: 30,
      price: 250,
    })
    expect(result.success).toBe(true)
  })

  it('allows price of 0', () => {
    const result = createServiceSchema.safeParse({
      name: 'Free consultation',
      durationMinutes: 15,
      price: 0,
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty name', () => {
    const result = createServiceSchema.safeParse({
      name: '',
      durationMinutes: 30,
      price: 250,
    })
    expect(result.success).toBe(false)
  })

  it('rejects zero duration', () => {
    const result = createServiceSchema.safeParse({
      name: 'Haircut',
      durationMinutes: 0,
      price: 250,
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative price', () => {
    const result = createServiceSchema.safeParse({
      name: 'Haircut',
      durationMinutes: 30,
      price: -10,
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid imageUrl', () => {
    const result = createServiceSchema.safeParse({
      name: 'Haircut',
      durationMinutes: 30,
      price: 250,
      imageUrl: 'not-a-url',
    })
    expect(result.success).toBe(false)
  })

  it('rejects missing required fields', () => {
    const result = createServiceSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('updateServiceSchema', () => {
  it('accepts empty object (all fields optional)', () => {
    const result = updateServiceSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('accepts partial updates', () => {
    const result = updateServiceSchema.safeParse({ name: 'New Name' })
    expect(result.success).toBe(true)
  })

  it('accepts isActive toggle', () => {
    const result = updateServiceSchema.safeParse({ isActive: false })
    expect(result.success).toBe(true)
  })

  it('rejects invalid types', () => {
    const result = updateServiceSchema.safeParse({ durationMinutes: 'thirty' })
    expect(result.success).toBe(false)
  })
})

describe('updateAvailabilitySchema', () => {
  it('accepts valid availability', () => {
    const result = updateAvailabilitySchema.safeParse({
      dayOfWeek: 1,
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true,
    })
    expect(result.success).toBe(true)
  })

  it('accepts Sunday (0) and Saturday (6)', () => {
    expect(updateAvailabilitySchema.safeParse({
      dayOfWeek: 0, startTime: '10:00', endTime: '14:00', isAvailable: true,
    }).success).toBe(true)

    expect(updateAvailabilitySchema.safeParse({
      dayOfWeek: 6, startTime: '10:00', endTime: '14:00', isAvailable: true,
    }).success).toBe(true)
  })

  it('rejects dayOfWeek outside 0-6', () => {
    expect(updateAvailabilitySchema.safeParse({
      dayOfWeek: 7, startTime: '09:00', endTime: '17:00', isAvailable: true,
    }).success).toBe(false)

    expect(updateAvailabilitySchema.safeParse({
      dayOfWeek: -1, startTime: '09:00', endTime: '17:00', isAvailable: true,
    }).success).toBe(false)
  })

  it('rejects invalid time format', () => {
    expect(updateAvailabilitySchema.safeParse({
      dayOfWeek: 1, startTime: '9:00', endTime: '17:00', isAvailable: true,
    }).success).toBe(false)

    expect(updateAvailabilitySchema.safeParse({
      dayOfWeek: 1, startTime: '09:00', endTime: '25:00', isAvailable: true,
    }).success).toBe(false)
  })

  it('rejects missing fields', () => {
    expect(updateAvailabilitySchema.safeParse({
      dayOfWeek: 1,
    }).success).toBe(false)
  })
})

describe('createBlockedSlotSchema', () => {
  it('accepts date only (whole day block)', () => {
    const result = createBlockedSlotSchema.safeParse({ date: '2025-01-26' })
    expect(result.success).toBe(true)
  })

  it('accepts date with time range and reason', () => {
    const result = createBlockedSlotSchema.safeParse({
      date: '2025-01-26',
      startTime: '12:00',
      endTime: '13:00',
      reason: 'Lunch break',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid date format', () => {
    expect(createBlockedSlotSchema.safeParse({ date: '26-01-2025' }).success).toBe(false)
    expect(createBlockedSlotSchema.safeParse({ date: 'not-a-date' }).success).toBe(false)
  })

  it('rejects invalid time format', () => {
    expect(createBlockedSlotSchema.safeParse({
      date: '2025-01-26', startTime: '9am',
    }).success).toBe(false)
  })

  it('rejects missing date', () => {
    expect(createBlockedSlotSchema.safeParse({}).success).toBe(false)
  })
})

describe('createBookingSchema', () => {
  const validBooking = {
    serviceId: '550e8400-e29b-41d4-a716-446655440000',
    date: '2025-03-15',
    startTime: '10:00',
    customerName: 'Jens Hansen',
    customerEmail: 'jens@example.com',
  }

  it('accepts valid booking', () => {
    expect(createBookingSchema.safeParse(validBooking).success).toBe(true)
  })

  it('accepts booking with optional phone', () => {
    expect(createBookingSchema.safeParse({
      ...validBooking,
      customerPhone: '+45 12345678',
    }).success).toBe(true)
  })

  it('rejects invalid UUID for serviceId', () => {
    expect(createBookingSchema.safeParse({
      ...validBooking,
      serviceId: 'not-a-uuid',
    }).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(createBookingSchema.safeParse({
      ...validBooking,
      customerEmail: 'not-an-email',
    }).success).toBe(false)
  })

  it('rejects empty customerName', () => {
    expect(createBookingSchema.safeParse({
      ...validBooking,
      customerName: '',
    }).success).toBe(false)
  })

  it('rejects invalid date format', () => {
    expect(createBookingSchema.safeParse({
      ...validBooking,
      date: '15-03-2025',
    }).success).toBe(false)
  })

  it('rejects invalid time format', () => {
    expect(createBookingSchema.safeParse({
      ...validBooking,
      startTime: '10am',
    }).success).toBe(false)
  })
})

describe('updateBookingStatusSchema', () => {
  it('accepts "cancelled"', () => {
    expect(updateBookingStatusSchema.safeParse({ status: 'cancelled' }).success).toBe(true)
  })

  it('accepts "completed"', () => {
    expect(updateBookingStatusSchema.safeParse({ status: 'completed' }).success).toBe(true)
  })

  it('rejects "confirmed"', () => {
    expect(updateBookingStatusSchema.safeParse({ status: 'confirmed' }).success).toBe(false)
  })

  it('rejects arbitrary strings', () => {
    expect(updateBookingStatusSchema.safeParse({ status: 'pending' }).success).toBe(false)
  })
})

describe('registerCustomerSchema', () => {
  it('accepts valid registration', () => {
    expect(registerCustomerSchema.safeParse({
      email: 'test@example.com',
      password: 'secret123',
      name: 'Test User',
    }).success).toBe(true)
  })

  it('accepts registration with phone', () => {
    expect(registerCustomerSchema.safeParse({
      email: 'test@example.com',
      password: 'secret123',
      name: 'Test User',
      phone: '+45 12345678',
    }).success).toBe(true)
  })

  it('rejects password shorter than 6 chars', () => {
    expect(registerCustomerSchema.safeParse({
      email: 'test@example.com',
      password: '12345',
      name: 'Test',
    }).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(registerCustomerSchema.safeParse({
      email: 'bad-email',
      password: 'secret123',
      name: 'Test',
    }).success).toBe(false)
  })

  it('rejects empty name', () => {
    expect(registerCustomerSchema.safeParse({
      email: 'test@example.com',
      password: 'secret123',
      name: '',
    }).success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('accepts valid login', () => {
    expect(loginSchema.safeParse({
      email: 'test@example.com',
      password: 'secret123',
    }).success).toBe(true)
  })

  it('rejects empty password', () => {
    expect(loginSchema.safeParse({
      email: 'test@example.com',
      password: '',
    }).success).toBe(false)
  })

  it('rejects invalid email', () => {
    expect(loginSchema.safeParse({
      email: 'invalid',
      password: 'secret123',
    }).success).toBe(false)
  })
})

describe('adminLoginSchema', () => {
  it('accepts valid password', () => {
    expect(adminLoginSchema.safeParse({ password: 'admin123' }).success).toBe(true)
  })

  it('rejects empty password', () => {
    expect(adminLoginSchema.safeParse({ password: '' }).success).toBe(false)
  })
})
