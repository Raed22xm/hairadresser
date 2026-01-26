/**
 * Admin Bookings Page
 * 
 * View and manage all bookings.
 * 
 * @module app/admin/bookings/page
 */

import { prisma } from '@/lib/db'
import { format } from 'date-fns'
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
        <h1 className="text-3xl font-bold text-white">Bookings</h1>
        <p className="text-slate-400 mt-1">
          Manage all customer bookings
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{confirmed.length}</p>
          <p className="text-green-300 text-sm">Confirmed</p>
        </div>
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-blue-400">{completed.length}</p>
          <p className="text-blue-300 text-sm">Completed</p>
        </div>
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-red-400">{cancelled.length}</p>
          <p className="text-red-300 text-sm">Cancelled</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left text-slate-300 px-6 py-4 font-medium">Customer</th>
              <th className="text-left text-slate-300 px-6 py-4 font-medium">Service</th>
              <th className="text-left text-slate-300 px-6 py-4 font-medium">Date & Time</th>
              <th className="text-left text-slate-300 px-6 py-4 font-medium">Price</th>
              <th className="text-left text-slate-300 px-6 py-4 font-medium">Status</th>
              <th className="text-right text-slate-300 px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-700/30">
                <td className="px-6 py-4">
                  <p className="text-white font-medium">{booking.customerName}</p>
                  <p className="text-slate-400 text-sm">{booking.customerEmail}</p>
                </td>
                <td className="px-6 py-4 text-slate-300">
                  {booking.service.name}
                </td>
                <td className="px-6 py-4">
                  <p className="text-white">{format(new Date(booking.date), 'MMM d, yyyy')}</p>
                  <p className="text-slate-400 text-sm">{booking.startTime} - {booking.endTime}</p>
                </td>
                <td className="px-6 py-4 text-pink-400 font-medium">
                  {Number(booking.service.price)} kr
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-500/20 text-green-400'
                      : booking.status === 'completed'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {booking.status}
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
          <div className="text-center py-12 text-slate-500">
            No bookings yet
          </div>
        )}
      </div>
    </div>
  )
}
