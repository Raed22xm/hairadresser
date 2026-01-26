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
  return services
}

export default async function AdminServicesPage() {
  const services = await getServices()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Services</h1>
        <p className="text-slate-400 mt-1">
          Manage your salon services
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add New Service */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Add New Service</h2>
          <ServiceForm />
        </div>

        {/* Existing Services */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Current Services</h2>
          <ServiceList services={services} />
        </div>
      </div>
    </div>
  )
}
