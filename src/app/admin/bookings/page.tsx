/**
 * Admin Bookings Page
 * 
 * View and manage all bookings.
 * 
 * @module app/admin/bookings/page
 */

import { prisma } from '@/lib/db'
import { format } from 'date-fns'
import { da } from 'date-fns/locale'
import BookingActions from './BookingActions'

/**
 * Get all bookings
 */
async function getBookings() {
  const bookings = await prisma.booking.findMany({
    include: {
      service: { select: { name: true, price: true } },
    },
    orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
    take: 50,
  })
  return bookings
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings()

  // Group by status
  const confirmed = bookings.filter(b => b.status === 'confirmed')
  const cancelled = bookings.filter(b => b.status === 'cancelled')
  const completed = bookings.filter(b => b.status === 'completed')

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Bookinger</h1>
        <p className="text-gray-500 mt-1">
          Administrer alle kundebookinger
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{confirmed.length}</p>
          <p className="text-green-700 text-sm">Bekræftet</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{completed.length}</p>
          <p className="text-blue-700 text-sm">Gennemført</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-red-600">{cancelled.length}</p>
          <p className="text-red-700 text-sm">Aflyst</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left text-gray-500 px-6 py-4 font-medium text-sm">Kunde</th>
              <th className="text-left text-gray-500 px-6 py-4 font-medium text-sm">Behandling</th>
              <th className="text-left text-gray-500 px-6 py-4 font-medium text-sm">Dato & Tid</th>
              <th className="text-left text-gray-500 px-6 py-4 font-medium text-sm">Pris</th>
              <th className="text-left text-gray-500 px-6 py-4 font-medium text-sm">Status</th>
              <th className="text-right text-gray-500 px-6 py-4 font-medium text-sm">Handlinger</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-black font-medium">{booking.customerName}</p>
                  <p className="text-gray-400 text-sm">{booking.customerEmail}</p>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {booking.service.name}
                </td>
                <td className="px-6 py-4">
                  <p className="text-black font-medium text-sm capitalize">{format(new Date(booking.date), 'd. MMM yyyy', { locale: da })}</p>
                  <p className="text-gray-400 text-sm">{booking.startTime} - {booking.endTime}</p>
                </td>
                <td className="px-6 py-4 text-black font-medium">
                  {Number(booking.service.price)} kr.
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-700'
                      : booking.status === 'completed'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {booking.status === 'confirmed' ? 'Bekræftet' : 
                     booking.status === 'completed' ? 'Gennemført' : 'Aflyst'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <BookingActions bookingId={booking.id} status={booking.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="text-center py-12 text-gray-400 border-t border-gray-100">
            Ingen bookinger endnu
          </div>
        )}
      </div>
    </div>
  )
}
