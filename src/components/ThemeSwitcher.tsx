'use client'

import { useTheme, type ThemeColor } from '@/context/ThemeContext'

const themes: { id: ThemeColor; name: string; color: string }[] = [
  { id: 'gold', name: 'Gold', color: '#D4AF37' },
  { id: 'silver', name: 'Silver', color: '#C0C0C0' },
  { id: 'bronze', name: 'Bronze', color: '#CD7F32' },
]

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-full shadow-2xl p-4 flex gap-3">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`w-11 h-11 rounded-full transition-all transform hover:scale-110 cursor-pointer ${
              theme === t.id ? 'ring-2 ring-offset-2 scale-110' : ''
            }`}
            style={{
              backgroundColor: t.color,
              boxShadow: theme === t.id ? `0 0 0 2px white` : '0 4px 12px rgba(0,0,0,0.3)',
            }}
            title={`${t.name} Theme`}
          />
        ))}
      </div>
    </div>
  )
}
