/**
 * Customer Registration Page
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ScissorsIcon } from '@/components/Icons'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate passwords match
    if (form.password !== form.confirmPassword) {
      setError('Adgangskoderne matcher ikke')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Oprettelse mislykkedes')
        setLoading(false)
        return
      }

      // Redirect to account page
      router.push('/account')
      router.refresh()
    } catch {
      setError('Noget gik galt')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col font-sans">
      {/* Header */}
      <nav className="bg-[#0f0f0f]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-5 md:px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold flex items-center gap-2 group">
             <div className="w-10 h-10 overflow-hidden rounded-full bg-black flex items-center justify-center border border-white/10">
                <img
                  src="/logo.png"
                  alt="Frisør Glostrup Logo"
                  className="w-full h-full object-cover"
                />
             </div>
             <span className="font-serif tracking-widest uppercase text-sm">Frisør Glostrup</span>
          </Link>
          <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors">
            Log Ind
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-5 py-12">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif text-white mb-3">Opret Konto</h1>
            <p className="text-gray-300 font-light text-base">Bliv medlem af gentlemen&#39;s club</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="bg-[#121212] border border-white/15 rounded-lg p-8 shadow-2xl">
            {error && (
              <div className="bg-red-900/20 border border-red-600/50 text-red-200 px-4 py-4 rounded-lg mb-6 text-sm font-medium flex items-center gap-3">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Fulde Navn *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#050505] border border-white/15 rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                placeholder="Jens Hansen"
                required
                autoFocus
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Adresse *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-[#050505] border border-white/15 rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                placeholder="jens@email.dk"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Telefonnummer <span className="font-normal text-gray-600 normal-case tracking-normal">(Valgfrit)</span></label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-[#050505] border border-white/15 rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                placeholder="+45 12 34 56 78"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Adgangskode *</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full bg-[#050505] border border-white/15 rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                placeholder="Min. 6 tegn"
                required
                minLength={6}
              />
            </div>

            <div className="mb-8">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bekræft Adgangskode *</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full bg-[#050505] border border-white/15 rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                placeholder="Gentag din adgangskode"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#D4AF37] text-black rounded-lg font-bold uppercase tracking-widest hover:bg-[#c5a024] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
            >
              {loading ? 'Opretter konto...' : 'Opret Konto'}
            </button>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-gray-500 text-sm">
                Har du allerede en konto?{' '}
                <Link href="/login" className="font-bold text-white hover:text-[#D4AF37] transition-colors">
                  Log ind
                </Link>
              </p>
            </div>
          </form>

          <p className="text-center mt-8">
            <Link href="/" className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
              ← Tilbage til forsiden
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
