/**
 * Availability Form Component
 * 
 * Form row for editing a single day's availability.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AvailabilityFormProps {
  dayOfWeek: number
  dayName: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

export default function AvailabilityForm({
  dayOfWeek,
  dayName,
  startTime: initialStart,
  endTime: initialEnd,
  isAvailable: initialAvailable,
}: AvailabilityFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isAvailable, setIsAvailable] = useState(initialAvailable)
  const [startTime, setStartTime] = useState(initialStart)
  const [endTime, setEndTime] = useState(initialEnd)
  const [changed, setChanged] = useState(false)

  async function handleSave() {
    setLoading(true)
    try {
      await fetch('/api/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek,
          startTime,
          endTime,
          isAvailable,
        }),
      })
      setChanged(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to update:', error)
    }
    setLoading(false)
  }

  function handleChange() {
    setChanged(true)
  }

  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg border ${
      isAvailable ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'
    }`}>
      {/* Day Name */}
      <div className="w-24 text-black font-medium">{dayName}</div>

      {/* Toggle */}
      <button
        onClick={() => { setIsAvailable(!isAvailable); handleChange(); }}
        className={`w-12 h-6 rounded-full transition-colors ${
          isAvailable ? 'bg-black' : 'bg-gray-300'
        }`}
      >
        <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
          isAvailable ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>

      {/* Time Inputs */}
      {isAvailable && (
        <>
          <input
            type="time"
            value={startTime}
            onChange={(e) => { setStartTime(e.target.value); handleChange(); }}
            className="bg-white border border-gray-300 rounded px-2 py-1 text-black text-sm focus:outline-none focus:border-black"
          />
          <span className="text-gray-400">til</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => { setEndTime(e.target.value); handleChange(); }}
            className="bg-white border border-gray-300 rounded px-2 py-1 text-black text-sm focus:outline-none focus:border-black"
          />
        </>
      )}

      {/* Save Button */}
      {changed && (
        <button
          onClick={handleSave}
          disabled={loading}
          className="ml-auto px-3 py-1 bg-black text-white rounded text-sm hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? '...' : 'Gem'}
        </button>
      )}
    </div>
  )
}
