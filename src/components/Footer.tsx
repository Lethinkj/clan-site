import React from 'react'
import { Github, Mail, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative z-10 bg-black/80 backdrop-blur-md border-t border-yellow-300/20 mt-auto">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Desktop Footer */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-yellow-300 mb-2">Aura-7F</h2>
              <p className="text-aura text-sm leading-relaxed">
                A star shining in high places with full of positive energy
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-yellow-300 mb-3">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <a href="/" className="text-aura hover:text-yellow-300 transition-colors text-sm">Home</a>
                <a href="/about" className="text-aura hover:text-yellow-300 transition-colors text-sm">About</a>
                <a href="/members" className="text-aura hover:text-yellow-300 transition-colors text-sm">Members</a>
                <a href="/events" className="text-aura hover:text-yellow-300 transition-colors text-sm">Events</a>
              </div>
            </div>

            {/* Connect Section */}
            <div className="text-center md:text-right">
              <h3 className="text-lg font-semibold text-yellow-300 mb-3">Connect</h3>
              <div className="flex justify-center md:justify-end gap-4 mb-3">
                <a href="#" className="text-aura hover:text-yellow-300 transition-colors" aria-label="GitHub">
                  <Github size={20} />
                </a>
                <a href="#" className="text-aura hover:text-yellow-300 transition-colors" aria-label="Email">
                  <Mail size={20} />
                </a>
              </div>
              <p className="text-aura text-sm">Part of Byte Bash Blitz</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-yellow-300/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-sm text-aura">© 2025 Aura-7F. All rights reserved.</p>
            <p className="text-sm text-aura flex items-center gap-2">
              Made with <Heart size={14} className="text-yellow-300 fill-yellow-300" /> by Aura-7F Team
            </p>
          </div>
        </div>

        {/* Mobile Footer - Compact */}
        <div className="sm:hidden text-center compact-footer">
          <h2 className="text-lg font-semibold text-yellow-300 mb-1">Aura-7F</h2>
          <p className="text-xs text-aura mb-2">© 2025 Aura-7F. Stronger Together.</p>
        </div>
      </div>
    </footer>
  )
}
