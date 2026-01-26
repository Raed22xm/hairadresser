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
    if (!confirm('Are you sure you want to delete this service?')) return
    
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
      <p className="text-slate-500 text-center py-8">
        No services yet. Add your first service!
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
              ? 'bg-slate-700/50 border-slate-600' 
              : 'bg-slate-800/50 border-slate-700 opacity-60'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-white flex items-center gap-2">
                {service.name}
                {!service.isActive && (
                  <span className="text-xs text-red-400">(inactive)</span>
                )}
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                {service.durationMinutes} min • {Number(service.price)} kr
              </p>
              {service.description && (
                <p className="text-slate-500 text-sm mt-1">{service.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggle(service.id, service.isActive)}
                disabled={loading === service.id}
                className={`px-3 py-1 rounded text-sm ${
                  service.isActive
                    ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                } disabled:opacity-50`}
              >
                {service.isActive ? 'Disable' : 'Enable'}
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                disabled={loading === service.id}
                className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
