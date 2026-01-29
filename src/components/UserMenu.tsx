'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { UserIcon } from '@/components/Icons'

export default function UserMenu() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    async function checkAuth() {
        try {
            const res = await fetch('/api/auth/me')
            const data = await res.json()
            if (data.customer) {
                setIsAuthenticated(true)
            }
        } catch (error) {
            console.error('Auth check failed', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return null

    if (isAuthenticated) {
        return (
            <Link href="/account" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors group">
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#D4AF37] transition-colors">
                    <UserIcon className="w-4 h-4" />
                </div>
                <span className="hidden md:inline">Profil</span>
            </Link>
        )
    }

    return (
        <Link 
            href="/login" 
            className="hover:text-[#D4AF37] transition-colors font-medium tracking-wide text-xs uppercase"
        >
            Log ind
        </Link>
    )
}
