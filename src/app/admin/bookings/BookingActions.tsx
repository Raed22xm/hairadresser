/**
 * Booking Actions Component
 * 
 * Client component for booking action buttons.
 */

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface BookingActionsProps {
  bookingId: string
  status: string
}

export default function BookingActions({ bookingId, status }: BookingActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleCancel() {
    if (!confirm('Er du sikker på, at du vil aflyse denne booking?')) return
    
    setLoading(true)
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      })
      router.refresh()
    } catch (error) {
      console.error('Failed to cancel:', error)
    }
    setLoading(false)
  }

  async function handleComplete() {
    setLoading(true)
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      })
      router.refresh()
    } catch (error) {
      console.error('Failed to complete:', error)
    }
    setLoading(false)
  }

  if (status !== 'confirmed') {
    return <span className="text-gray-400 text-sm">-</span>
  }

  return (
    <div className="flex gap-2 justify-end">
      <button
        onClick={handleComplete}
        disabled={loading}
        className="px-3 py-1 bg-green-100 text-green-600 rounded text-sm hover:bg-green-200 disabled:opacity-50 font-medium transition-colors"
      >
        ✓ Afslut
      </button>
      <button
        onClick={handleCancel}
        disabled={loading}
        className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100 disabled:opacity-50 font-medium transition-colors"
      >
        ✕ Aflys
      </button>
    </div>
  )
}
