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
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Today's Bookings */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Today&apos;s Bookings</p>
              <p className="text-3xl font-bold text-black mt-1">{stats.todayBookings}</p>
            </div>
            <CalendarIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        {/* Week's Bookings */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">This Week</p>
              <p className="text-3xl font-bold text-black mt-1">{stats.weekBookings}</p>
            </div>
            <BarChartIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        {/* Weekly Revenue */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Weekly Revenue</p>
              <p className="text-3xl font-bold text-black mt-1">{stats.weeklyRevenue} kr</p>
            </div>
            <DollarIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        {/* Active Services */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Services</p>
              <p className="text-3xl font-bold text-black mt-1">{stats.totalServices}</p>
            </div>
            <ScissorsBarIcon className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Quick Actions & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-black mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/bookings"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-black hover:text-white transition-all group border border-gray-100"
            >
              <ClipboardIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium">View Bookings</span>
            </Link>
            <Link
              href="/admin/services"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-black hover:text-white transition-all group border border-gray-100"
            >
              <EditIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Edit Services</span>
            </Link>
            <Link
              href="/admin/availability"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-black hover:text-white transition-all group border border-gray-100"
            >
              <ClockIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Set Hours</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-black hover:text-white transition-all group border border-gray-100"
            >
              <GlobeIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="font-medium">View Website</span>
            </Link>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Upcoming Bookings</h2>
            <Link href="/admin/bookings" className="text-gray-500 text-sm hover:text-black font-medium hover:underline">
              View all →
            </Link>
          </div>
          
          {stats.upcomingBookings.length > 0 ? (
            <div className="space-y-3">
              {stats.upcomingBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div>
                    <p className="text-black font-medium">{booking.customerName}</p>
                    <p className="text-gray-500 text-sm">{booking.service.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-black font-medium">{format(new Date(booking.date), 'MMM d')}</p>
                    <p className="text-gray-500 text-sm">{booking.startTime}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8 border border-dashed border-gray-200 rounded-lg">No upcoming bookings</p>
          )}
        </div>
      </div>
    </div>
  )
}
