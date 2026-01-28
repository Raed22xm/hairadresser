/**
 * Services Showcase Component
 * 
 * Displays available services in a grid layout with images and descriptions.
 */

import Link from 'next/link'
import { prisma } from '@/lib/db'

interface Service {
  id: string
  name: string
  description: string | null
  price: string
  durationMinutes: number
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
      take: 3,
    })

    return services.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      durationMinutes: service.durationMinutes,
      imageUrl: service.imageUrl,
    }))
  } catch {
    return []
  }
}

export default async function ServicesShowcase() {
  const services = await getServices()

  if (services.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Premium hair care and styling services tailored to your unique style
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/?service=${service.id}`}
              className="group cursor-pointer"
            >
              <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-black hover:shadow-xl transition-all duration-300">
                {/* Service Image */}
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg
                        className="w-24 h-24"
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
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-2 group-hover:underline">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {service.description || 'Professional service for all hair types'}
                  </p>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-sm text-gray-500">Price</div>
                      <div className="text-lg font-bold text-black">
                        {service.price} kr
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="text-lg font-bold text-black">
                        {service.durationMinutes} min
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        {services.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/?service=all"
              className="inline-block px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
            >
              View All Services & Book Now
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
