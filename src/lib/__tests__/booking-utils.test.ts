import { describe, it, expect } from 'vitest'
import {
  timeToMinutes,
  calculateEndTime,
  doTimeSlotsOverlap,
  isSlotBlocked,
  isAdvanceBookingValid,
  isWithinWorkingHours,
} from '../booking-utils'

describe('timeToMinutes', () => {
  it('converts "00:00" to 0', () => {
    expect(timeToMinutes('00:00')).toBe(0)
  })

  it('converts "09:00" to 540', () => {
    expect(timeToMinutes('09:00')).toBe(540)
  })

  it('converts "12:30" to 750', () => {
    expect(timeToMinutes('12:30')).toBe(750)
  })

  it('converts "23:59" to 1439', () => {
    expect(timeToMinutes('23:59')).toBe(1439)
  })
})

describe('calculateEndTime', () => {
  it('adds 30 minutes to "09:00"', () => {
    expect(calculateEndTime('09:00', 30)).toBe('09:30')
  })

  it('adds 60 minutes to "16:00"', () => {
    expect(calculateEndTime('16:00', 60)).toBe('17:00')
  })

  it('handles crossing hour boundary', () => {
    expect(calculateEndTime('09:45', 30)).toBe('10:15')
  })

  it('handles midnight crossing', () => {
    expect(calculateEndTime('23:30', 60)).toBe('00:30')
  })

  it('adds 90 minutes to "14:00"', () => {
    expect(calculateEndTime('14:00', 90)).toBe('15:30')
  })
})

describe('doTimeSlotsOverlap', () => {
  it('detects full overlap (identical slots)', () => {
    expect(doTimeSlotsOverlap(
      { startTime: '10:00', endTime: '11:00' },
      { startTime: '10:00', endTime: '11:00' }
    )).toBe(true)
  })

  it('detects partial overlap (A starts during B)', () => {
    expect(doTimeSlotsOverlap(
      { startTime: '10:30', endTime: '11:30' },
      { startTime: '10:00', endTime: '11:00' }
    )).toBe(true)
  })

  it('detects partial overlap (A ends during B)', () => {
    expect(doTimeSlotsOverlap(
      { startTime: '09:30', endTime: '10:30' },
      { startTime: '10:00', endTime: '11:00' }
    )).toBe(true)
  })

  it('detects containment (A contains B)', () => {
    expect(doTimeSlotsOverlap(
      { startTime: '09:00', endTime: '12:00' },
      { startTime: '10:00', endTime: '11:00' }
    )).toBe(true)
  })

  it('detects containment (B contains A)', () => {
    expect(doTimeSlotsOverlap(
      { startTime: '10:15', endTime: '10:45' },
      { startTime: '10:00', endTime: '11:00' }
    )).toBe(true)
  })

  it('no overlap for adjacent slots (A right after B)', () => {
    expect(doTimeSlotsOverlap(
      { startTime: '11:00', endTime: '12:00' },
      { startTime: '10:00', endTime: '11:00' }
    )).toBe(false)
  })

  it('no overlap for adjacent slots (B right after A)', () => {
    expect(doTimeSlotsOverlap(
      { startTime: '09:00', endTime: '10:00' },
      { startTime: '10:00', endTime: '11:00' }
    )).toBe(false)
  })

  it('no overlap for non-adjacent slots', () => {
    expect(doTimeSlotsOverlap(
      { startTime: '13:00', endTime: '14:00' },
      { startTime: '10:00', endTime: '11:00' }
    )).toBe(false)
  })
})

describe('isSlotBlocked', () => {
  it('returns true when whole day is blocked (null times)', () => {
    expect(isSlotBlocked('10:00', [{ startTime: null, endTime: null }])).toBe(true)
  })

  it('returns true when slot falls within blocked range', () => {
    expect(isSlotBlocked('12:00', [{ startTime: '12:00', endTime: '13:00' }])).toBe(true)
  })

  it('returns true when slot is mid-block', () => {
    expect(isSlotBlocked('12:30', [{ startTime: '12:00', endTime: '14:00' }])).toBe(true)
  })

  it('returns false when slot is at end of blocked range (exclusive)', () => {
    expect(isSlotBlocked('13:00', [{ startTime: '12:00', endTime: '13:00' }])).toBe(false)
  })

  it('returns false when slot is outside blocked range', () => {
    expect(isSlotBlocked('14:00', [{ startTime: '12:00', endTime: '13:00' }])).toBe(false)
  })

  it('returns false with empty blocked list', () => {
    expect(isSlotBlocked('10:00', [])).toBe(false)
  })

  it('returns true if any block matches', () => {
    expect(isSlotBlocked('15:00', [
      { startTime: '12:00', endTime: '13:00' },
      { startTime: '15:00', endTime: '16:00' },
    ])).toBe(true)
  })
})

describe('isAdvanceBookingValid', () => {
  it('returns true for booking 3 hours from now', () => {
    const now = new Date(2025, 0, 15, 10, 0)
    const bookingDate = new Date(2025, 0, 15)
    expect(isAdvanceBookingValid(bookingDate, '13:00', now)).toBe(true)
  })

  it('returns false for booking 1 hour from now', () => {
    const now = new Date(2025, 0, 15, 10, 0)
    const bookingDate = new Date(2025, 0, 15)
    expect(isAdvanceBookingValid(bookingDate, '11:00', now)).toBe(false)
  })

  it('returns true for booking exactly 2 hours from now', () => {
    const now = new Date(2025, 0, 15, 10, 0)
    const bookingDate = new Date(2025, 0, 15)
    // Exactly 2 hours should be valid (not before minBookingTime)
    expect(isAdvanceBookingValid(bookingDate, '12:00', now)).toBe(true)
  })

  it('returns true for future date booking', () => {
    const now = new Date(2025, 0, 15, 22, 0) // 10 PM
    const bookingDate = new Date(2025, 0, 16) // Next day
    expect(isAdvanceBookingValid(bookingDate, '09:00', now)).toBe(true)
  })

  it('returns false for past booking', () => {
    const now = new Date(2025, 0, 15, 14, 0)
    const bookingDate = new Date(2025, 0, 15)
    expect(isAdvanceBookingValid(bookingDate, '10:00', now)).toBe(false)
  })
})

describe('isWithinWorkingHours', () => {
  it('returns true when fully within hours', () => {
    expect(isWithinWorkingHours('10:00', '11:00', '09:00', '17:00')).toBe(true)
  })

  it('returns true when exactly at boundaries', () => {
    expect(isWithinWorkingHours('09:00', '17:00', '09:00', '17:00')).toBe(true)
  })

  it('returns true when at start boundary', () => {
    expect(isWithinWorkingHours('09:00', '10:00', '09:00', '17:00')).toBe(true)
  })

  it('returns true when at end boundary', () => {
    expect(isWithinWorkingHours('16:00', '17:00', '09:00', '17:00')).toBe(true)
  })

  it('returns false when start is before working hours', () => {
    expect(isWithinWorkingHours('08:00', '09:00', '09:00', '17:00')).toBe(false)
  })

  it('returns false when end is after working hours', () => {
    expect(isWithinWorkingHours('16:00', '18:00', '09:00', '17:00')).toBe(false)
  })

  it('returns false when completely outside working hours', () => {
    expect(isWithinWorkingHours('18:00', '19:00', '09:00', '17:00')).toBe(false)
  })
})
