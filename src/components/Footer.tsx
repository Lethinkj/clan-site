import React from 'react'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="relative z-10 mt-auto"
      style={{
        background: 'rgba(3, 7, 18, 0.95)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(34, 211, 238, 0.12)',
        boxShadow: '0 -1px 6px rgba(0, 0, 0, 0.14)',
        height: '24px',
        overflow: 'hidden'
      }}
    >
      <div className="container mx-auto px-2 h-full flex items-center sm:justify-between justify-center">
        <p className="text-[9px] leading-none text-slate-400">© 2026 Aura-7F. All rights reserved</p>
        <p className="hidden sm:flex text-[9px] leading-none text-slate-400 flex items-center gap-1">
          Made with <Heart size={9} className="text-cyan-400 fill-cyan-400" /> by Aura-7F
        </p>
      </div>
    </footer>
  )
}
