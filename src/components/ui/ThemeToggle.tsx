import React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full transition-all duration-300 
        bg-slate-800/50 dark:bg-slate-800/50 light:bg-white/80
        border border-cyan-500/30 dark:border-cyan-500/30 light:border-cyan-500/40
        hover:border-cyan-400/60 hover:bg-slate-700/50 dark:hover:bg-slate-700/50 light:hover:bg-white
        shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/15
        group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-5 h-5">
        {/* Sun icon - visible in dark mode */}
        <Sun 
          size={20} 
          className={`absolute inset-0 transition-all duration-300 text-cyan-400
            ${theme === 'dark' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 rotate-90 scale-50'
            }`}
        />
        {/* Moon icon - visible in light mode */}
        <Moon 
          size={20} 
          className={`absolute inset-0 transition-all duration-300 text-cyan-600
            ${theme === 'light' 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-50'
            }`}
        />
      </div>
    </button>
  )
}
