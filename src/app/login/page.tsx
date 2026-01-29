/**
 * Customer Login Page
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ScissorsIcon } from '@/components/Icons'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login mislykkedes')
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
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold flex items-center gap-2 group">
            <div className="w-8 h-8 flex items-center justify-center border border-[#D4AF37] rounded-full group-hover:bg-[#D4AF37] transition-all duration-300">
               <ScissorsIcon className="w-4 h-4 fill-[#D4AF37] group-hover:fill-black transition-colors" />
            </div>
            <span className="font-serif tracking-widest uppercase text-sm">Frisør Glostrup</span>
          </Link>
          <Link href="/register" className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:text-white transition-colors">
            Opret Konto
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif text-white mb-3">Velkommen Tilbage</h1>
            <p className="text-gray-400 font-light">Log ind på din konto og book din næste tid</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="bg-[#121212] border border-white/10 rounded-2xl p-8 shadow-2xl">
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-3">Email Adresse</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                placeholder="jens@email.dk"
                required
                autoFocus
              />
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-xs font-bold text-[#D4AF37] uppercase tracking-widest">Adgangskode</label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                placeholder="Indtast din adgangskode"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#D4AF37] text-black rounded-xl font-bold uppercase tracking-widest hover:bg-[#b5952f] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            >
              {loading ? 'Logger ind...' : 'Log Ind'}
            </button>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-gray-500 text-sm">
                Har du ikke en konto?{' '}
                <Link href="/register" className="font-bold text-white hover:text-[#D4AF37] transition-colors">
                  Opret en her
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
