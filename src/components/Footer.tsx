import React from 'react'
import { Github, Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer 
      className="relative z-10 mt-auto flex items-center"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.9))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(250, 204, 21, 0.2)',
        boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.5)',
        minHeight: '48px'
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-row justify-between items-center">
          <p className="text-xs text-aura flex items-center h-full">© 2025 Aura-7F. All rights reserved</p>
          <p className="text-xs text-aura flex items-center gap-1.5 h-full">
            Made with <Heart size={12} className="text-yellow-300 fill-yellow-300" /> by Aura-7F
          </p>
        </div>
      </div>
    </footer>
  )
}
