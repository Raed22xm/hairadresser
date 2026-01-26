/**
 * Admin Availability Page
 * 
 * Manage opening hours and blocked times.
 * 
 * @module app/admin/availability/page
 */

import { prisma } from '@/lib/db'
import AvailabilityForm from './AvailabilityForm'
import BlockedSlotForm from './BlockedSlotForm'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * Get availability and blocked slots
 */
async function getData() {
  const hairdresser = await prisma.hairdresser.findFirst()
  if (!hairdresser) {
    return { availability: [], blockedSlots: [] }
  }

  const [availability, blockedSlots] = await Promise.all([
    prisma.availability.findMany({
      where: { hairdresserId: hairdresser.id },
      orderBy: { dayOfWeek: 'asc' },
    }),
    prisma.blockedSlot.findMany({
      where: { 
        hairdresserId: hairdresser.id,
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
      take: 20,
    }),
  ])

  return { availability, blockedSlots }
}

export default async function AdminAvailabilityPage() {
  const { availability, blockedSlots } = await getData()

  // Create a map for easier lookup
  const availabilityMap = new Map(
    availability.map(a => [a.dayOfWeek, a])
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Availability</h1>
        <p className="text-slate-400 mt-1">
          Set your opening hours and block specific dates
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Schedule */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Weekly Schedule</h2>
          
          <div className="space-y-3">
            {DAYS.map((day, index) => {
              const dayData = availabilityMap.get(index)
              return (
                <AvailabilityForm
                  key={index}
                  dayOfWeek={index}
                  dayName={day}
                  startTime={dayData?.startTime || '09:00'}
                  endTime={dayData?.endTime || '17:00'}
                  isAvailable={dayData?.isAvailable ?? (index !== 0)}
                />
              )
            })}
          </div>
        </div>

        {/* Block Dates */}
        <div className="space-y-6">
          {/* Add Block */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Block a Date</h2>
            <p className="text-slate-400 text-sm mb-4">
              Block specific dates for vacation, holidays, or other closures.
            </p>
            <BlockedSlotForm />
          </div>

          {/* Blocked Dates List */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Blocked Dates</h2>
            
            {blockedSlots.length > 0 ? (
              <div className="space-y-2">
                {blockedSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg"
                  >
                    <div>
                      <p className="text-white">
                        {new Date(slot.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {slot.startTime && slot.endTime
                          ? `${slot.startTime} - ${slot.endTime}`
                          : 'All day'}
                        {slot.reason && ` • ${slot.reason}`}
                      </p>
                    </div>
                    <form action={`/api/blocked-slots/${slot.id}`} method="DELETE">
                      <button
                        type="submit"
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">
                No blocked dates
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
