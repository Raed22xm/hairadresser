'use client'

import { useEffect } from 'react'

// Gold color theme (locked)
const GOLD_COLOR = '#D4AF37'
const GOLD_LIGHT = '#F0E68C'
const GOLD_DARK = '#8B7500'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Apply Gold theme colors on mount
    document.documentElement.style.setProperty('--color-primary', GOLD_COLOR)
    document.documentElement.style.setProperty('--color-light', GOLD_LIGHT)
    document.documentElement.style.setProperty('--color-dark', GOLD_DARK)
  }, [])

  return <>{children}</>
}
