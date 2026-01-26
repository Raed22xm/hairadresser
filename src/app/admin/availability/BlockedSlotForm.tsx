/**
 * Blocked Slot Form Component
 * 
 * Form for blocking specific dates.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BlockedSlotForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
    reason: '',
    allDay: true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await fetch('/api/blocked-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: form.date,
          startTime: form.allDay ? null : form.startTime,
          endTime: form.allDay ? null : form.endTime,
          reason: form.reason || null,
        }),
      })
      setForm({ date: '', startTime: '', endTime: '', reason: '', allDay: true })
      router.refresh()
    } catch (error) {
      console.error('Failed to block date:', error)
    }
    setLoading(false)
  }

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2 text-sm font-medium">Date *</label>
        <input
          type="date"
          value={form.date}
          min={today}
          onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
          required
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={form.allDay}
            onChange={(e) => setForm(prev => ({ ...prev, allDay: e.target.checked }))}
            className="rounded border-gray-300 text-black focus:ring-black"
          />
          <span className="text-sm">Block entire day</span>
        </label>
      </div>

      {!form.allDay && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Start Time</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm(prev => ({ ...prev, startTime: e.target.value }))}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">End Time</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm(prev => ({ ...prev, endTime: e.target.value }))}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}

      <div>
        <label className="block text-gray-700 mb-2 text-sm font-medium">Reason (optional)</label>
        <input
          type="text"
          value={form.reason}
          onChange={(e) => setForm(prev => ({ ...prev, reason: e.target.value }))}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
          placeholder="e.g. Holiday, Vacation"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !form.date}
        className="w-full py-3 bg-red-50 border border-red-200 text-red-600 rounded-lg font-semibold disabled:opacity-50 transition-all hover:bg-red-100"
      >
        {loading ? 'Blocking...' : 'Block Date'}
      </button>
    </form>
  )
}
