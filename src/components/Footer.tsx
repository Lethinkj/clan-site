import React from 'react'
import { Sparkles, Gem } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function Footer() {
  const { theme } = useTheme()
  const isDark = theme === 'dark' // We default to dark/fantasy now predominantly

  return (
    <footer
      className="relative z-10 mt-auto"
      style={{
        background: 'linear-gradient(to top, #020105, #08040d)',
        borderTop: '1px solid rgba(245, 158, 11, 0.15)', // Amber border instead of purple
        boxShadow: '0 -10px 40px rgba(0,0,0,0.6)'
      }}
    >
      {/* Decorative rune line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>

      <div
        className="
          container mx-auto px-4 py-10
          flex flex-col md:flex-row items-center justify-between
          gap-6 md:gap-4
        "
      >
        <div className="flex items-center gap-2">
          <Gem className="text-amber-500 size-4" />
          <p className="text-xs text-amber-100/60 font-cinzel tracking-wider">
            © 2026 CLAN AURA-7F. ESTABLISHED IN THE VOID.
          </p>
        </div>

        <p
          className="flex text-xs items-center gap-1.5 text-amber-100/40 font-cinzel tracking-wide"
        >
          Forged with
          <Sparkles
            size={10}
            className="text-amber-400 animate-pulse"
          />
          by the High Council
        </p>
      </div>
    </footer>
  )
}
