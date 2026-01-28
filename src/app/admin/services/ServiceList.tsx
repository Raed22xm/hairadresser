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
      <p className="text-gray-500 text-center py-8">
        Ingen behandlinger endnu. Tilføj din første behandling!
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {services.map((service) => (
        <div
          key={service.id}
          className={`p-4 rounded-lg border ${
            service.isActive 
              ? 'bg-white border-gray-200' 
              : 'bg-gray-50 border-gray-100 opacity-60'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-black flex items-center gap-2">
                {service.name}
                {!service.isActive && (
                  <span className="text-xs text-red-500 font-semibold">(inaktiv)</span>
                )}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {service.durationMinutes} min • {Number(service.price)} kr
              </p>
              {service.description && (
                <p className="text-gray-400 text-sm mt-1">{service.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggle(service.id, service.isActive)}
                disabled={loading === service.id}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  service.isActive
                    ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                } disabled:opacity-50`}
              >
                {service.isActive ? 'Deaktiver' : 'Aktiver'}
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                disabled={loading === service.id}
                className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 disabled:opacity-50 font-medium"
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
