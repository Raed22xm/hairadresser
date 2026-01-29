/**
 * Admin Login Page
 * 
 * Simple password-based admin authentication.
 * 
 * @module app/admin/login/page
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ScissorsIcon } from '@/components/Icons'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Invalid password')
        setLoading(false)
        return
      }

      // Redirect to admin dashboard
      router.push('/admin')
      router.refresh()
    } catch {
      setError('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#0f0f0f] flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center gap-3 mb-6 group">
             <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37] rounded-full group-hover:bg-[#D4AF37] transition-all duration-300">
                <ScissorsIcon className="w-6 h-6 fill-[#D4AF37] text-[#D4AF37] group-hover:text-black group-hover:fill-black transition-colors" />
             </div>
             <span className="text-2xl font-bold font-serif tracking-widest uppercase text-white group-hover:text-[#D4AF37] transition-colors">
               Frisør Glostrup
             </span>
          </Link>
          <h1 className="text-3xl font-serif text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400 text-sm font-light tracking-wide">Indtast dine oplysninger for at tilgå kontrolpanelet</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-[#121212] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] opacity-5 rounded-full blur-[60px]"></div>
          
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3 relative z-10">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="mb-8 relative z-10">
            <label className="block text-xs font-bold text-[#D4AF37] uppercase tracking-widest mb-3">Admin Adgangskode</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              placeholder="Indtast adgangskode"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-4 bg-[#D4AF37] text-black rounded-xl font-bold uppercase tracking-widest hover:bg-[#b5952f] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] relative z-10"
          >
            {loading ? 'Logger ind...' : 'Log ind'}
          </button>

          <p className="text-center text-gray-500 text-xs mt-8 relative z-10">
            Standard adgangskode: <code className="bg-white/10 px-2 py-1 rounded text-[#D4AF37] font-mono ml-1">admin123</code>
          </p>
        </form>
        
        <p className="text-center mt-8">
            <Link href="/" className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-4 block">
              ← Tilbage til Forsiden
            </Link>
        </p>
      </div>
    </div>
  )
}
