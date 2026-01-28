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
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <div className="w-5 h-5">
              <ScissorsIcon className="w-full h-full" />
            </div>
            Frisør Glostrup
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
          >
            Log ud
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 text-gray-400">
                <UserIcon className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{customer?.name}</h1>
                <p className="text-gray-500 text-lg">{customer?.email}</p>
                {customer?.phone && (
                  <p className="text-gray-400 mt-1 flex items-center gap-1">
                    <span>📞</span> {customer.phone}
                  </p>
                )}
              </div>
            </div>
            
            <Link
              href="/"
              className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
            >
              Book Ny Tid
            </Link>
          </div>
        </div>

        {/* Appointments Section */}
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          Dine Tider
        </h2>

        {/* Upcoming */}
        <div className="space-y-4 mb-12">
            {upcomingBookings.length > 0 ? (
                upcomingBookings.map(booking => (
                    <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-6 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                        <div>
                            <h3 className="font-bold text-lg">{booking.service.name}</h3>
                            <p className="text-gray-500 capitalize">
                                {new Date(booking.date).toLocaleDateString('da-DK', { weekday: 'long', month: 'long', day: 'numeric' })}
                                <span className="mx-2">•</span>
                                {booking.startTime}
                            </p>
                        </div>
                        <div className="text-right">
                             <p className="font-bold text-lg text-black">{booking.service.price} kr.</p>
                             <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium mt-1">
                                Bekræftet
                             </span>
                        </div>
                    </div>
                ))
            ) : (
                <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
                    <p className="text-gray-500 mb-4">Ingen kommende tider</p>
                    <Link href="/" className="text-black font-semibold hover:underline">Book en tid nu</Link>
                </div>
            )}
        </div>

        {/* Past */}
        {pastBookings.length > 0 && (
            <div className="opacity-60 hover:opacity-100 transition-opacity">
                <h3 className="text-lg font-bold mb-4 text-gray-500">Tidligere Tider</h3>
                <div className="space-y-4">
                    {pastBookings.map(booking => (
                        <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">{booking.service.name}</h4>
                                <p className="text-sm text-gray-500 capitalize">
                                    {new Date(booking.date).toLocaleDateString('da-DK', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                booking.status === 'completed' ? 'bg-gray-100 text-gray-600' : 'bg-red-50 text-red-500'
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
