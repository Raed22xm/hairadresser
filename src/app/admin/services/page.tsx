/**
 * Admin Services Page
 * 
 * Manage salon services.
 * 
 * @module app/admin/services/page
 */

import { prisma } from '@/lib/db'
import ServiceForm from './ServiceForm'
import ServiceList from './ServiceList'

/**
 * Get all services
 */
async function getServices() {
  const services = await prisma.service.findMany({
    orderBy: { name: 'asc' },
  })
  // Convert Decimal to number/string to match Service type
  return services.map(service => ({
    ...service,
    price: Number(service.price)
  }))
}

export default async function AdminServicesPage() {
  const services = await getServices()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-black mb-2">Behandlinger</h1>
        <p className="text-gray-600 text-lg">
          Administrer og organiser dine salon behandlinger
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Service - Larger form section */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-black to-gray-900 rounded-2xl p-8 shadow-lg sticky top-8">
            <h2 className="text-xl font-bold text-white mb-6">Ny Behandling</h2>
            <div className="text-white/70 text-sm mb-6">
              Tilføj en ny behandling til dit salon menu
            </div>
            <ServiceForm />
          </div>
        </div>

        {/* Existing Services Grid */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black">
              {services.length} {services.length === 1 ? 'Behandling' : 'Behandlinger'}
            </h2>
            <p className="text-gray-600 mt-1">Administrer dine eksisterende behandlinger</p>
          </div>
          <ServiceList services={services} />
        </div>
      </div>
    </div>
  )
}
