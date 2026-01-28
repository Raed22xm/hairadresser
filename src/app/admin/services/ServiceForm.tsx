/**
 * Service Form Component
 * 
 * Form for adding new services.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ServiceForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    durationMinutes: '30',
    price: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        setForm({ name: '', description: '', durationMinutes: '30', price: '' })
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to create service:', error)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2 text-sm font-bold">Behandlingsnavn *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
          placeholder="f.eks. Herreklip"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2 text-sm font-bold">Beskrivelse</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
          placeholder="Kort beskrivelse..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-2 text-sm font-bold">Varighed (min) *</label>
          <select
            value={form.durationMinutes}
            onChange={(e) => setForm(prev => ({ ...prev, durationMinutes: e.target.value }))}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
          >
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="45">45 min</option>
            <option value="60">60 min</option>
            <option value="90">90 min</option>
            <option value="120">120 min</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 text-sm font-bold">Pris (kr) *</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            placeholder="250"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !form.name || !form.price}
        className="w-full py-3 bg-black rounded-lg text-white font-semibold disabled:opacity-50 transition-all hover:bg-gray-800 shadow-sm hover:shadow-md"
      >
        {loading ? 'Tilføjer...' : 'Tilføj Behandling'}
      </button>
    </form>
  )
}
