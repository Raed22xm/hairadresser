/**
 * Admin Layout
 * 
 * Shared layout for all admin pages with sidebar navigation.
 * 
 * @module app/admin/layout
 */

import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ScissorsIcon, BarChartIcon, CalendarIcon, ScissorsBarIcon, LogoutIcon, ClockIcon } from '@/components/Icons'

/**
 * Check if user is authenticated
 */
async function isAuthenticated() {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get('admin_session')
  return adminSession?.value === 'authenticated'
}

/**
 * AdminLayout Component
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAuthenticated()

  // If not authenticated, just render the children (login page will handle itself)
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/admin" className="text-xl font-bold text-black flex items-center gap-2">
            <div className="w-5 h-5">
              <ScissorsIcon className="w-full h-full" />
            </div>
            Frisør Glostrup
          </Link>
          <p className="text-xs text-gray-400 mt-2">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-black hover:text-white transition-colors"
          >
            <BarChartIcon className="w-5 h-5" />
            Oversigt
          </Link>
          <Link
            href="/admin/bookings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-black hover:text-white transition-colors"
          >
            <CalendarIcon className="w-5 h-5" />
            Bookinger
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-black hover:text-white transition-colors"
          >
            <ScissorsBarIcon className="w-5 h-5" />
            Behandlinger
          </Link>
          <Link
            href="/admin/availability"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-black hover:text-white transition-colors"
          >
            <ClockIcon className="w-5 h-5" />
            Åbningstider
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-black transition-colors text-sm"
          >
            ← Tilbage til Hjemmesiden
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:text-red-600 transition-colors text-sm mt-1"
            >
              <LogoutIcon className="w-5 h-5" />
              Log ud
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
