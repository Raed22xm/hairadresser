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
    <div className="p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex justify-between items-end">
        <div>
           <h1 className="text-4xl font-serif text-white mb-2">Bookinger</h1>
           <p className="text-gray-400 text-sm">Administrer alle kundebookinger</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-5 rounded-full blur-[40px] group-hover:opacity-10 transition-opacity"></div>
          <div className="relative z-10 text-center">
             <p className="text-4xl font-bold text-green-500 mb-1">{confirmed.length}</p>
             <p className="text-green-500/80 text-xs font-bold uppercase tracking-widest">Bekræftet</p>
          </div>
        </div>
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-5 rounded-full blur-[40px] group-hover:opacity-10 transition-opacity"></div>
          <div className="relative z-10 text-center">
             <p className="text-4xl font-bold text-blue-500 mb-1">{completed.length}</p>
             <p className="text-blue-500/80 text-xs font-bold uppercase tracking-widest">Gennemført</p>
          </div>
        </div>
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500 opacity-5 rounded-full blur-[40px] group-hover:opacity-10 transition-opacity"></div>
          <div className="relative z-10 text-center">
             <p className="text-4xl font-bold text-red-500 mb-1">{cancelled.length}</p>
             <p className="text-red-500/80 text-xs font-bold uppercase tracking-widest">Aflyst</p>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
                <tr>
                <th className="text-left text-[#D4AF37] px-6 py-5 font-bold text-xs uppercase tracking-widest">Kunde</th>
                <th className="text-left text-[#D4AF37] px-6 py-5 font-bold text-xs uppercase tracking-widest">Behandling</th>
                <th className="text-left text-[#D4AF37] px-6 py-5 font-bold text-xs uppercase tracking-widest">Dato & Tid</th>
                <th className="text-left text-[#D4AF37] px-6 py-5 font-bold text-xs uppercase tracking-widest">Pris</th>
                <th className="text-left text-[#D4AF37] px-6 py-5 font-bold text-xs uppercase tracking-widest">Status</th>
                <th className="text-right text-[#D4AF37] px-6 py-5 font-bold text-xs uppercase tracking-widest">Handlinger</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 text-xs font-bold">
                            {booking.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm group-hover:text-[#D4AF37] transition-colors">{booking.customerName}</p>
                            <p className="text-gray-500 text-xs">{booking.customerEmail}</p>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-5 text-gray-300 text-sm">
                    {booking.service.name}
                    </td>
                    <td className="px-6 py-5">
                    <p className="text-white font-bold text-sm capitalize">{format(new Date(booking.date), 'd. MMM yyyy', { locale: da })}</p>
                    <p className="text-[#D4AF37] text-xs font-mono mt-0.5">{booking.startTime} - {booking.endTime}</p>
                    </td>
                    <td className="px-6 py-5 text-white font-mono text-sm">
                    {Number(booking.service.price)} kr.
                    </td>
                    <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        booking.status === 'confirmed' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : booking.status === 'completed'
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                        {booking.status === 'confirmed' ? 'Bekræftet' : 
                        booking.status === 'completed' ? 'Gennemført' : 'Aflyst'}
                    </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                    <BookingActions bookingId={booking.id} status={booking.status} />
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {bookings.length === 0 && (
          <div className="text-center py-16 border-t border-white/5">
            <p className="text-gray-500 font-serif text-lg">Ingen bookinger endnu</p>
          </div>
        )}
      </div>
    </div>
  )
}
