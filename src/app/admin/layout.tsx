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
    <div className="min-h-screen bg-[#0f0f0f] flex text-white font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#121212] border-r border-white/15 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/15 flex items-center justify-center">
          <Link href="/admin" className="flex items-center justify-center group">
             <div className="w-20 h-20 overflow-hidden rounded-full" style={{clipPath: 'circle(50%)'}}>
               <img
                 src="https://cdn.builder.io/api/v1/image/assets%2Fc8f5d9724b844104aeadb496288cf7ee%2F13c607cd1aa04d4289048d776c9e6395?format=webp&width=800&height=1200"
                 alt="Frisør Glostrup Logo"
                 className="w-20 h-20 object-cover object-center transition-transform group-hover:scale-105"
               />
             </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all group"
          >
            <BarChartIcon className="w-5 h-5 group-hover:text-[#D4AF37] transition-colors" />
            <span className="font-medium text-sm">Oversigt</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all group"
          >
            <CalendarIcon className="w-5 h-5 group-hover:text-[#D4AF37] transition-colors" />
            <span className="font-medium text-sm">Bookinger</span>
          </Link>
          <Link
            href="/admin/services"
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all group"
          >
            <ScissorsBarIcon className="w-5 h-5 group-hover:text-[#D4AF37] transition-colors" />
            <span className="font-medium text-sm">Behandlinger</span>
          </Link>
          <Link
            href="/admin/availability"
            className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-all group"
          >
            <ClockIcon className="w-5 h-5 group-hover:text-[#D4AF37] transition-colors" />
            <span className="font-medium text-sm">Åbningstider</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-white/15 bg-black/40">
          <Link
            href="/"
            className="flex items-center gap-3 px-2 py-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4"
          >
            ← Tilbage til Hjemmesiden
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-900/20 text-red-400 border border-red-900/30 rounded-xl hover:bg-red-900/40 hover:text-red-300 transition-all text-sm font-bold"
            >
              <LogoutIcon className="w-4 h-4" />
              Log ud
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#0f0f0f]">
        {children}
      </main>
    </div>
  )
}
