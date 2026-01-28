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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <div className="w-5 h-5">
              <ScissorsIcon className="w-full h-full" />
            </div>
            Frisør Glostrup
          </Link>
          <Link href="/register" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Opret Konto
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-black mb-3">Velkommen Tilbage</h1>
            <p className="text-gray-600">Log ind på din konto</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-900 mb-2">Email Adresse</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-black transition-all"
                placeholder="jens@email.dk"
                required
                autoFocus
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-2">Adgangskode</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-black transition-all"
                placeholder="Indtast din adgangskode"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? 'Logger ind...' : 'Log Ind'}
            </button>

            <p className="text-center text-gray-600 text-sm mt-6">
              Har du ikke en konto?{' '}
              <Link href="/register" className="font-semibold text-black hover:underline">
                Opret en her
              </Link>
            </p>
          </form>

          <p className="text-center mt-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
              ← Tilbage til forsiden
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
