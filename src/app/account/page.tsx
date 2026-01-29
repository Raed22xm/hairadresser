/**
 * Customer Account Page
 * 
 * Shows profile and booking history.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { da } from 'date-fns/locale'
import { ScissorsIcon, CalendarIcon, UserIcon } from '@/components/Icons'

interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
}

interface Booking {
  id: string
  date: string
  startTime: string
  endTime: string
  status: string
  service: {
    name: string
    price: string
    durationMinutes: number
  }
  hairdresser: {
    salonName: string
    address: string | null
  }
}

export default function AccountPage() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [pastBookings, setPastBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      // Fetch customer info
      const authRes = await fetch('/api/auth/me')
      const authData = await authRes.json()

      if (!authData.customer) {
        router.push('/login')
        return
      }

      setCustomer(authData.customer)

      // Fetch bookings
      const bookingsRes = await fetch('/api/customer/bookings')
      const bookingsData = await bookingsRes.json()

      if (bookingsData.upcoming) {
        setUpcomingBookings(bookingsData.upcoming)
      }
      if (bookingsData.past) {
        setPastBookings(bookingsData.past)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
    setLoading(false)
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      {/* Header */}
      <nav className="bg-[#0f0f0f]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold flex items-center gap-2 group">
             <div className="w-8 h-8 flex items-center justify-center border border-[#D4AF37] rounded-full group-hover:bg-[#D4AF37] transition-all duration-300">
                <ScissorsIcon className="w-4 h-4 fill-[#D4AF37] group-hover:fill-black transition-colors" />
             </div>
             <span className="font-serif tracking-widest uppercase text-sm">Frisør Glostrup</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            Log ud
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Profile Card */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 mb-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37] opacity-5 rounded-full blur-[100px] group-hover:opacity-10 transition-opacity"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                <UserIcon className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-serif text-white mb-2">{customer?.name}</h1>
                <p className="text-gray-400 text-lg">{customer?.email}</p>
                {customer?.phone && (
                  <p className="text-[#D4AF37] mt-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                    <span>📞</span> {customer.phone}
                  </p>
                )}
              </div>
            </div>
            
            <Link
              href="/"
              className="px-8 py-4 bg-[#D4AF37] text-black rounded-xl font-bold uppercase tracking-widest hover:bg-[#b5952f] transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            >
              Book Ny Tid
            </Link>
          </div>
        </div>

        {/* Appointments Section */}
        <h2 className="text-xl font-serif text-white mb-8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
             <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
          </div>
          Dine Tider
        </h2>

        {/* Upcoming */}
        <div className="space-y-4 mb-16">
            {upcomingBookings.length > 0 ? (
                upcomingBookings.map(booking => (
                    <div key={booking.id} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 flex justify-between items-center group hover:border-[#D4AF37]/50 transition-colors">
                        <div>
                            <h3 className="font-serif text-xl text-white mb-1 group-hover:text-[#D4AF37] transition-colors">{booking.service.name}</h3>
                            <p className="text-gray-400 capitalize text-sm">
                                {new Date(booking.date).toLocaleDateString('da-DK', { weekday: 'long', month: 'long', day: 'numeric' })}
                                <span className="mx-2 text-[#D4AF37]">•</span>
                                <span className="text-white font-mono">{booking.startTime}</span>
                            </p>
                        </div>
                        <div className="text-right">
                             <p className="font-bold text-lg text-[#D4AF37] font-mono">{booking.service.price} kr.</p>
                             <span className="inline-block bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mt-2">
                                Bekræftet
                             </span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="bg-white/5 border border-dashed border-white/10 rounded-xl p-16 text-center">
                    <p className="text-gray-500 mb-6 font-serif text-lg">Ingen kommende tider</p>
                    <Link href="/" className="text-[#D4AF37] hover:text-white font-bold uppercase tracking-widest text-xs border-b border-[#D4AF37] pb-1 hover:border-white transition-all">Book en tid nu</Link>
                </div>
            )}
        </div>

        {/* Past */}
        {pastBookings.length > 0 && (
            <div className="opacity-60 hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 pl-1">Tidligere Tider</h3>
                <div className="space-y-4">
                    {pastBookings.map(booking => (
                        <div key={booking.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-gray-300">{booking.service.name}</h4>
                                <p className="text-sm text-gray-500 capitalize">
                                    {new Date(booking.date).toLocaleDateString('da-DK', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </p>
                            </div>
                            <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border ${
                                booking.status === 'completed' ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-red-900/20 text-red-400 border-red-900/30'
                            }`}>
                                {booking.status === 'completed' ? 'Gennemført' : 'Aflyst'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </main>
    </div>
  )
}
