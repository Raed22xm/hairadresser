/**
 * Service List Component
 * 
 * Displays list of services with edit/delete actions.
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Service {
  id: string
  name: string
  description: string | null
  durationMinutes: number
  price: string | number
  isActive: boolean
}

interface ServiceListProps {
  services: Service[]
}

export default function ServiceList({ services }: ServiceListProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleToggle(id: string, isActive: boolean) {
    setLoading(id)
    try {
      await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      router.refresh()
    } catch (error) {
      console.error('Failed to toggle service:', error)
    }
    setLoading(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Er du sikker på, at du vil slette denne behandling?')) return
    
    setLoading(id)
    try {
      await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      })
      router.refresh()
    } catch (error) {
      console.error('Failed to delete service:', error)
    }
    setLoading(null)
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
        <div className="text-5xl mb-4">✨</div>
        <p className="text-gray-600 text-lg font-medium">Ingen behandlinger endnu</p>
        <p className="text-gray-500 text-sm mt-2">Tilføj din første behandling ved at udfylde formularen til venstre</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {services.map((service) => (
        <div
          key={service.id}
          className={`rounded-2xl border-2 transition-all ${
            service.isActive
              ? 'bg-white border-gray-200 hover:border-black hover:shadow-lg'
              : 'bg-gray-100 border-gray-300 opacity-70'
          }`}
        >
          <div className="p-6">
            {/* Header with Status */}
            <div className="flex justify-between items-start gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-black">
                    {service.name}
                  </h3>
                  {!service.isActive && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                      INAKTIV
                    </span>
                  )}
                  {service.isActive && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      AKTIV
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {service.description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {service.description}
              </p>
            )}

            {/* Service Details */}
            <div className="grid grid-cols-2 gap-4 mb-6 py-4 border-y border-gray-100">
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Varighed</p>
                <p className="text-lg font-bold text-black mt-1">{service.durationMinutes} min</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Pris</p>
                <p className="text-lg font-bold text-black mt-1">{Number(service.price)} kr</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => handleToggle(service.id, service.isActive)}
                disabled={loading === service.id}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  service.isActive
                    ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                    : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {service.isActive ? 'Deaktiver' : 'Aktiver'}
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                disabled={loading === service.id}
                className="px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed font-semibold border border-red-200 transition-all"
              >
                Slet
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
