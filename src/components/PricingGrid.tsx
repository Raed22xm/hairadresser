/**
 * Pricing Grid Component
 * 
 * Displays all services in a compact 4-column grid with images and prices.
 */

import Link from 'next/link'
import { prisma } from '@/lib/db'

interface Service {
  id: string
  name: string
  price: string
  imageUrl: string | null
}

async function getServices(): Promise<Service[]> {
  try {
    const hairdresser = await prisma.hairdresser.findFirst()
    if (!hairdresser) return []

    const services = await prisma.service.findMany({
      where: {
        hairdresserId: hairdresser.id,
        isActive: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return services.map(service => ({
      id: service.id,
      name: service.name,
      price: service.price.toString(),
      imageUrl: service.imageUrl,
    }))
  } catch {
    return []
  }
}

export default async function PricingGrid() {
  const services = await getServices()

  if (services.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-gradient-to-br from-black via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-primary, #D4AF37)' }}>Gennemskuelige Priser</p>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-2">
            Eksklusive Behandlinger
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-white/70">
            til Skarpe Priser
          </h3>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/?service=${service.id}`}
              className="group"
            >
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/30 hover:shadow-xl transition-all duration-300 hover:bg-white/10">
                {/* Service Image */}
                <div className="relative h-32 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Service Info */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-white mb-2 group-hover:underline line-clamp-2">
                    {service.name}
                  </h3>
                  <p className="text-base font-bold" style={{ color: 'var(--color-primary, #D4AF37)' }}>
                    {service.price} kr
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>


      </div>
    </section>
  )
}
