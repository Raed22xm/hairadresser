import { addMinutes, addHours, format, parse, isBefore } from 'date-fns'

export interface TimeRange {
  startTime: string
  endTime: string
}

export interface BlockedSlot {
  startTime: string | null
  endTime: string | null
}

/**
 * Converts "HH:mm" string to total minutes since midnight.
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Calculates end time given a start time and duration in minutes.
 * Returns "HH:mm" formatted string.
 */
export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const ref = new Date(2000, 0, 1)
  const start = parse(startTime, 'HH:mm', ref)
  return format(addMinutes(start, durationMinutes), 'HH:mm')
}

/**
 * Checks if two time ranges overlap.
 * Ranges are [start, end) — inclusive start, exclusive end.
 */
export function doTimeSlotsOverlap(slotA: TimeRange, slotB: TimeRange): boolean {
  return (
    (slotA.startTime >= slotB.startTime && slotA.startTime < slotB.endTime) ||
    (slotA.endTime > slotB.startTime && slotA.endTime <= slotB.endTime) ||
    (slotA.startTime <= slotB.startTime && slotA.endTime >= slotB.endTime)
  )
}

/**
 * Checks if a given time slot start falls within any blocked slot.
 * Null start/end on a blocked slot means the whole day is blocked.
 */
export function isSlotBlocked(slotStart: string, blockedSlots: BlockedSlot[]): boolean {
  return blockedSlots.some((blocked) => {
    if (!blocked.startTime || !blocked.endTime) return true
    return slotStart >= blocked.startTime && slotStart < blocked.endTime
  })
}

/**
 * Validates that a booking time is at least 2 hours in the future.
 * Returns true if the booking is far enough ahead.
 */
export function isAdvanceBookingValid(
  bookingDate: Date,
  startTime: string,
  now: Date = new Date()
): boolean {
  const slotDateTime = parse(startTime, 'HH:mm', bookingDate)
  const minBookingTime = addHours(now, 2)
  return !isBefore(slotDateTime, minBookingTime)
}

/**
 * Validates that a slot fits within working hours.
 * Returns true if [slotStart, slotEnd] is within [workStart, workEnd].
 */
export function isWithinWorkingHours(
  slotStart: string,
  slotEnd: string,
  workStart: string,
  workEnd: string
): boolean {
  return slotStart >= workStart && slotEnd <= workEnd
}
