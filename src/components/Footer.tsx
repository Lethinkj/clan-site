import React from 'react'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer 
      className="relative z-10 mt-auto"
      style={{
        background: 'rgba(3, 7, 18, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(34, 211, 238, 0.2)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3), 0 0 30px rgba(34, 211, 238, 0.03)',
      }}
    >
      <div className="container mx-auto px-4 py-5">
        <div className="flex flex-row justify-between items-center">
          <p className="text-xs text-slate-400">© 2026 Aura-7F. All rights reserved</p>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            Made with <Heart size={12} className="text-cyan-400 fill-cyan-400 animate-pulse" /> by Aura-7F
          </p>
        </div>
      </div>
    </footer>
  )
}
