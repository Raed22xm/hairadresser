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
import { format } from 'date-fns'
import { da } from 'date-fns/locale'

const DAYS = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag']

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
    <div className="p-6 md:p-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-serif font-bold text-white mb-2">Åbningstider</h1>
        <p className="text-gray-300 text-base">
          Indstil dine åbningstider og bloker specifikke datoer (f.eks. ferie)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Schedule */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-black mb-4">Ugentlig Tidsplan</h2>
          
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
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-black mb-4">Bloker en Dato</h2>
            <p className="text-gray-500 text-sm mb-4">
              Bloker specifikke datoer for ferie, helligdage eller andre lukkedage.
            </p>
            <BlockedSlotForm />
          </div>

          {/* Blocked Dates List */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-black mb-4">Blokerede Datoer</h2>
            
            {blockedSlots.length > 0 ? (
              <div className="space-y-2">
                {blockedSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div>
                      <p className="text-black font-medium text-sm capitalize">
                        {format(new Date(slot.date), 'EEEE d. MMMM', { locale: da })}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {slot.startTime && slot.endTime
                          ? `${slot.startTime} - ${slot.endTime}`
                          : 'Hele dagen'}
                        {slot.reason && ` • ${slot.reason}`}
                      </p>
                    </div>
                    <form action={`/api/blocked-slots/${slot.id}`} method="DELETE">
                      <button
                        type="submit"
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        Fjern
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">
                Ingen blokerede datoer
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
