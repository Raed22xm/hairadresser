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
    if (!confirm('Are you sure you want to cancel this booking?')) return
    
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
    return <span className="text-slate-500 text-sm">-</span>
  }

  return (
    <div className="flex gap-2 justify-end">
      <button
        onClick={handleComplete}
        disabled={loading}
        className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm hover:bg-green-500/30 disabled:opacity-50"
      >
        ✓ Complete
      </button>
      <button
        onClick={handleCancel}
        disabled={loading}
        className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30 disabled:opacity-50"
      >
        ✕ Cancel
      </button>
    </div>
  )
}
