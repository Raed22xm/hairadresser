/**
 * Homepage Component
 * 
 * The main landing page for Hairadresser Salon.
 * Displays salon information, services, opening hours, and booking CTAs.
 * 
 * @module app/page
 */

import Link from 'next/link'
import { prisma } from '@/lib/db'

/**
 * Fetches all active services from the database
 * 
 * @returns {Promise<Service[]>} Array of active services sorted by name
 * @example
 * const services = await getServices()
 * // Returns: [{ id: '...', name: 'Haircut', price: 250, ... }, ...]
 */
async function getServices() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
  return services
}

/**
 * Fetches the hairdresser/salon information from the database
 * 
 * @returns {Promise<Hairdresser | null>} Hairdresser data or null if not found
 * @example
 * const hairdresser = await getHairdresser()
 * // Returns: { id: '...', name: 'Maria', salonName: 'Hairadresser Salon', ... }
 */
async function getHairdresser() {
  const hairdresser = await prisma.hairdresser.findFirst()
  return hairdresser
}

/**
 * HomePage Component
 * 
 * Server-side rendered landing page that:
 * - Fetches services and hairdresser data from the database
 * - Displays hero section with salon branding
 * - Shows service cards with prices and booking links
 * - Presents opening hours and contact information
 * - Includes call-to-action sections for bookings
 * 
 * @returns {Promise<JSX.Element>} The rendered homepage
 */
export default async function HomePage() {
  // Fetch data in parallel for better performance
  const [services, hairdresser] = await Promise.all([
    getServices(),
    getHairdresser(),
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* ========================================
          HEADER SECTION
          Navigation bar with logo and booking CTA
          ======================================== */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          {/* Salon Logo/Name */}
          <h1 className="text-2xl font-bold text-white">
            ✂️ {hairdresser?.salonName || 'Hairadresser'}
          </h1>
          {/* Header CTA Button */}
          <Link
            href="/booking"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Book Now
          </Link>
        </div>
      </header>

      {/* ========================================
          HERO SECTION
          Main welcome message and primary CTA
          ======================================== */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        {/* Main Heading with Gradient Text */}
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
            {hairdresser?.salonName || 'Hairadresser'}
          </span>
        </h2>
        {/* Subheading */}
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Your neighborhood hair salon in Copenhagen. Professional styling,
          coloring, and cuts for everyone.
        </p>
        {/* Primary CTA Button */}
        <Link
          href="/booking"
          className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg px-10 py-4 rounded-full font-semibold hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-purple-500/30"
        >
          Book Your Appointment
        </Link>
      </section>

      {/* ========================================
          SERVICES SECTION
          Grid of service cards from database
          ======================================== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-white text-center mb-12">
          Our Services
        </h3>
        {/* Services Grid - 3 columns on desktop */}
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              {/* Service Header: Name and Price */}
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-semibold text-white">
                  {service.name}
                </h4>
                <span className="text-2xl font-bold text-pink-400">
                  {Number(service.price)} kr
                </span>
              </div>
              {/* Service Description */}
              <p className="text-gray-400 mb-4">
                {service.description || 'Professional service'}
              </p>
              {/* Service Footer: Duration and Booking Link */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  ⏱️ {service.durationMinutes} min
                </span>
                <Link
                  href={`/booking?service=${service.id}`}
                  className="text-pink-400 hover:text-pink-300 font-medium"
                >
                  Book →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================
          INFO SECTION
          Opening hours and contact information
          ======================================== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Opening Hours Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              📅 Opening Hours
            </h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="text-white font-medium">09:00 - 17:00</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="text-white font-medium">10:00 - 14:00</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="text-red-400">Closed</span>
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              📍 Contact Us
            </h3>
            <div className="space-y-4 text-gray-300">
              <p>
                <span className="text-gray-500">Address:</span>
                <br />
                <span className="text-white">{hairdresser?.address || 'Copenhagen, Denmark'}</span>
              </p>
              <p>
                <span className="text-gray-500">Phone:</span>
                <br />
                <span className="text-white">{hairdresser?.phone || '+45 12 34 56 78'}</span>
              </p>
              <p>
                <span className="text-gray-500">Email:</span>
                <br />
                <span className="text-white">{hairdresser?.email || 'hello@hairadresser.dk'}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          CTA SECTION
          Final call-to-action before footer
          ======================================== */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-pink-500/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready for a Fresh Look?
          </h3>
          <p className="text-gray-300 mb-8">
            Book your appointment online in less than 2 minutes
          </p>
          <Link
            href="/booking"
            className="inline-block bg-white text-purple-900 text-lg px-10 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Book Now →
          </Link>
        </div>
      </section>

      {/* ========================================
          FOOTER SECTION
          Copyright and legal information
          ======================================== */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
          <p>© 2024 {hairdresser?.salonName || 'Hairadresser'}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
