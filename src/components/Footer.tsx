import React from 'react'
import { Heart } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function Footer() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <footer
      className="relative z-10"
      style={{
        background: isDark
          ? 'rgba(3, 7, 18, 0.95)'
          : 'rgba(248, 250, 252, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderTop: isDark
          ? '1px solid rgba(34, 211, 238, 0.12)'
          : '1px solid rgba(8, 145, 178, 0.15)',
        boxShadow: isDark
          ? '0 -1px 6px rgba(0, 0, 0, 0.14)'
          : '0 -1px 6px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        className="
          container mx-auto px-3 md:px-4
          h-7 md:h-6
          flex items-center justify-center sm:justify-between
        "
      >
        <p
          className={`text-[9px] md:text-[8px] leading-none ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          © 2026 Aura-7F. All rights reserved
        </p>

        <p
          className={`hidden sm:flex text-[9px] md:text-[8px] leading-none items-center gap-1 ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          Made with
          <Heart
            size={8}
            className={
              isDark
                ? 'text-cyan-400 fill-cyan-400'
                : 'text-cyan-600 fill-cyan-600'
            }
          />
          by Aura-7F
        </p>
      </div>
    </footer>
  )
}
