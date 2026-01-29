/**
 * Admin Dashboard Page
 * 
 * Main admin dashboard showing stats and recent bookings.
 * 
 * @module app/admin/page
 */

import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns'
import { da } from 'date-fns/locale'
import { CalendarIcon, BarChartIcon, DollarIcon, ScissorsBarIcon, ClipboardIcon, EditIcon, ClockIcon, GlobeIcon } from '@/components/Icons'

// Auth check
async function requireAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (session?.value !== 'authenticated') {
    redirect('/admin/login')
  }
}

/**
 * Get dashboard statistics
 */
async function getDashboardStats() {
  const today = new Date()
  const todayStart = startOfDay(today)
  const todayEnd = endOfDay(today)
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })

  const [
    todayBookings,
    weekBookings,
    totalServices,
    upcomingBookings,
  ] = await Promise.all([
    // Today's bookings
    prisma.booking.count({
      where: {
        date: { gte: todayStart, lte: todayEnd },
        status: 'confirmed',
      },
    }),
    // This week's bookings
    prisma.booking.count({
      where: {
        date: { gte: weekStart, lte: weekEnd },
        status: 'confirmed',
      },
    }),
    // Active services
    prisma.service.count({
      where: { isActive: true },
    }),
    // Upcoming bookings (next 5)
    prisma.booking.findMany({
      where: {
        date: { gte: todayStart },
        status: 'confirmed',
      },
      include: {
        service: { select: { name: true } },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      take: 5,
    }),
  ])

  // Calculate weekly revenue
  const weekBookingsWithPrice = await prisma.booking.findMany({
    where: {
      date: { gte: weekStart, lte: weekEnd },
      status: 'confirmed',
    },
    include: {
      service: { select: { price: true } },
    },
  })
  
  const weeklyRevenue = weekBookingsWithPrice.reduce(
    (sum, b) => sum + Number(b.service.price),
    0
  )

  return {
    todayBookings,
    weekBookings,
    weeklyRevenue,
    totalServices,
    upcomingBookings,
  }
}

export default async function AdminDashboard() {
  await requireAuth()
  const stats = await getDashboardStats()

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
           <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2">Admin Kontrolpanel</p>
           <h1 className="text-4xl font-serif text-white">Oversigt</h1>
        </div>
        <div className="text-left md:text-right">
            <p className="text-gray-400 text-sm">Velkommen tilbage</p>
            <p className="text-white font-bold text-lg">{format(new Date(), 'd. MMMM yyyy', { locale: da })}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Today's Bookings */}
        <div className="bg-[#121212] border border-white/15 rounded-lg p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37] opacity-5 rounded-full blur-[40px] group-hover:opacity-10 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <CalendarIcon className="w-6 h-6 text-[#D4AF37]" />
               </div>
               <span className="text-xs font-bold bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded-md">I DAG</span>
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">Dagens Bookinger</p>
            <p className="text-4xl font-bold text-white">{stats.todayBookings}</p>
          </div>
        </div>

        {/* Week's Bookings */}
        <div className="bg-[#121212] border border-white/15 rounded-lg p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-5 rounded-full blur-[40px] group-hover:opacity-10 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <BarChartIcon className="w-6 h-6 text-blue-400" />
               </div>
               <span className="text-xs font-bold bg-blue-500/10 text-blue-400 px-2 py-1 rounded">UGE {format(new Date(), 'w')}</span>
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">Denne Uge</p>
            <p className="text-4xl font-bold text-white">{stats.weekBookings}</p>
          </div>
        </div>

        {/* Weekly Revenue */}
        <div className="bg-[#121212] border border-white/15 rounded-lg p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-5 rounded-full blur-[40px] group-hover:opacity-10 transition-opacity"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <DollarIcon className="w-6 h-6 text-green-400" />
               </div>
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">Ugentlig Omsætning</p>
            <p className="text-4xl font-bold text-white font-mono tracking-tight">{stats.weeklyRevenue} <span className="text-lg text-gray-500 align-top">kr</span></p>
          </div>
        </div>

        {/* Active Services */}
        <div className="bg-[#121212] border border-white/15 rounded-lg p-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 opacity-5 rounded-full blur-[40px] group-hover:opacity-10 transition-opacity"></div>
           <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
               <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                  <ScissorsBarIcon className="w-6 h-6 text-purple-400" />
               </div>
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">Aktive Behandlinger</p>
            <p className="text-4xl font-bold text-white">{stats.totalServices}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-[#121212] border border-white/15 rounded-lg p-8">
          <h2 className="text-xl font-bold text-white mb-6 font-serif">Hurtige Handlinger</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/bookings"
              className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 rounded-lg hover:bg-[#D4AF37] hover:text-black text-gray-300 transition-all group border border-white/10 hover:border-[#D4AF37]"
            >
              <ClipboardIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm uppercase tracking-widest text-center">Se Bookinger</span>
            </Link>
            <Link
              href="/admin/services"
              className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 rounded-lg hover:bg-[#D4AF37] hover:text-black text-gray-300 transition-all group border border-white/10 hover:border-[#D4AF37]"
            >
              <EditIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm uppercase tracking-widest text-center">Rediger</span>
            </Link>
            <Link
              href="/admin/availability"
              className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 rounded-lg hover:bg-[#D4AF37] hover:text-black text-gray-300 transition-all group border border-white/10 hover:border-[#D4AF37]"
            >
              <ClockIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm uppercase tracking-widest text-center">Åbningstider</span>
            </Link>
            <Link
              href="/"
              className="flex flex-col items-center justify-center gap-3 p-6 bg-white/5 rounded-lg hover:bg-[#D4AF37] hover:text-black text-gray-300 transition-all group border border-white/10 hover:border-[#D4AF37]"
            >
              <GlobeIcon className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-sm uppercase tracking-widest text-center">Hjemmeside</span>
            </Link>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-[#121212] border border-white/15 rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white font-serif">Kommende Bookinger</h2>
            <Link href="/admin/bookings" className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
              Se alle →
            </Link>
          </div>

          {stats.upcomingBookings.length > 0 ? (
            <div className="space-y-3">
              {stats.upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-[#D4AF37]/40 hover:bg-white/8 transition-all group"
                >
                  <div>
                    <p className="text-white font-semibold group-hover:text-[#D4AF37] transition-colors">{booking.customerName}</p>
                    <p className="text-gray-400 text-sm mt-1">{booking.service.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-white font-bold text-sm bg-white/5 px-3 py-1.5 rounded border border-white/10 mb-2">{format(new Date(booking.date), 'd. MMM', { locale: da })}</p>
                    <p className="text-[#D4AF37] text-xs font-bold">{booking.startTime}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-lg bg-white/5">
                <p className="text-gray-500 text-center font-medium">Ingen kommende bookinger</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
