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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Behandlinger</h1>
        <p className="text-gray-500 mt-1">
          Administrer dine behandlinger
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add New Service */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-black mb-4">Tilføj Ny Behandling</h2>
          <ServiceForm />
        </div>

        {/* Existing Services */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-black mb-4">Nuværende Behandlinger</h2>
          <ServiceList services={services} />
        </div>
      </div>
    </div>
  )
}
