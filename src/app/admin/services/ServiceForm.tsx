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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-white/90 mb-2 text-sm font-semibold">Behandlingsnavn *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
          placeholder="f.eks. Herreklip"
          required
        />
      </div>

      <div>
        <label className="block text-white/90 mb-2 text-sm font-semibold">Beskrivelse</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all resize-none"
          placeholder="Kort beskrivelse..."
          rows={2}
        />
      </div>

      <div className="space-y-3">
        <label className="block text-white/90 text-sm font-semibold">Varighed *</label>
        <select
          value={form.durationMinutes}
          onChange={(e) => setForm(prev => ({ ...prev, durationMinutes: e.target.value }))}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
        >
          <option value="15">15 minutter</option>
          <option value="30">30 minutter</option>
          <option value="45">45 minutter</option>
          <option value="60">60 minutter</option>
          <option value="90">90 minutter</option>
          <option value="120">120 minutter</option>
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-white/90 text-sm font-semibold">Pris (DKK) *</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
          placeholder="250"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading || !form.name || !form.price}
        className="w-full py-3 bg-white text-black rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-gray-100 shadow-lg hover:shadow-xl"
      >
        {loading ? 'Tilføjer...' : 'Tilføj Behandling'}
      </button>
    </form>
  )
}
