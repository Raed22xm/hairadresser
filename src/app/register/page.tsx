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
      setError('Passwords do not match')
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
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      // Redirect to account page
      router.push('/account')
      router.refresh()
    } catch {
      setError('Something went wrong')
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
            Hairadresser
          </Link>
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-black mb-3">Create Account</h1>
            <p className="text-gray-600">Join us to book your appointment</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-900 mb-2">Full Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-black transition-all"
                placeholder="John Doe"
                required
                autoFocus
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-900 mb-2">Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-black transition-all"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-900 mb-2">Phone Number <span className="font-normal text-gray-500">(Optional)</span></label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-black transition-all"
                placeholder="+45 12 34 56 78"
              />
            </div>

            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-900 mb-2">Password *</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-black transition-all"
                placeholder="Min. 6 characters"
                required
                minLength={6}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-2">Confirm Password *</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-black transition-all"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            <p className="text-center text-gray-600 text-sm mt-6">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-black hover:underline">
                Sign in
              </Link>
            </p>
          </form>

          <p className="text-center mt-6">
            <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
              ← Back to homepage
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
