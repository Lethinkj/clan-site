import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { NavLink, Link } from 'react-router-dom'
import { Home, Users, Calendar, Info } from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/about', icon: Info, label: 'About' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/events', icon: Calendar, label: 'Events' }
]

export default function Header() {
  const location = useLocation()
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [hideLogo, setHideLogo] = useState(false)
  const lastY = useRef<number>(0)
  const ticking = useRef(false)

  useEffect(() => {
    // Hide logo when scrolling down, show when scrolling up or near top
    function onScroll() {
      if (ticking.current) return
      ticking.current = true
      window.requestAnimationFrame(() => {
        const currentY = window.scrollY || window.pageYOffset
        const delta = currentY - lastY.current
        // if scrolled down and past threshold, hide
        if (delta > 10 && currentY > 80) {
          setHideLogo(true)
        } else if (delta < -10 || currentY <= 20) {
          // scrolled up or near top -> show
          setHideLogo(false)
        }
        lastY.current = currentY
        ticking.current = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Reset header visibility when the route changes so the logo doesn't animate in from bottom
  useEffect(() => {
    setHideLogo(false)
    lastY.current = 0
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <div className={`flex items-center gap-3 transition-all duration-300 ${hideLogo ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
          {/* logo - clickable to home; title next to logo is clickable on all sizes */}
          <Link to="/" aria-label="Home" className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-yellow-800/10 flex items-center justify-center">
              <img
                src="/Aura-7f.jpeg"
                alt="Aura-7F logo"
                className="w-full h-full object-cover"
                onLoad={() => setLogoLoaded(true)}
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement
                  if (!img.src.endsWith('.png')) img.src = '/Aura-7f.png'
                  else setLogoLoaded(false)
                }}
              />
            </div>
            <span className="text-sm font-extrabold text-yellow-300 neon-text leading-tight mt-1">AURA-7F</span>
          </Link>
        </div>

        {/* center pill-style nav (desktop) */}
        <div className="flex-1 flex justify-center">
          <nav className="hidden sm:flex items-center bg-[#061a28]/90 text-aura rounded-full px-3 py-1 shadow-lg gap-1 nav-pill">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `inline-flex items-center gap-2 transition-all ${isActive ? 'bg-yellow-400 text-[#07192b] px-4 py-2 rounded-full font-semibold' : 'text-aura opacity-90 px-4 py-2 rounded-full hover:text-yellow-300'}`}
              >
                <Icon size={14} className={"opacity-90"} />
                <span className="text-sm">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* right area is intentionally empty on desktop; mobile nav is rendered separately at bottom */}
        <div className="flex items-center gap-4" />

      </div>

      {/* mobile bottom nav: centered pill at bottom */}
  <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 sm:hidden bg-[#061a28]/95 text-aura rounded-full px-2 py-2 shadow-xl flex gap-1 z-50 mobile-bottom-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to + '-mobile'}
            to={to}
            className={({ isActive }) => `inline-flex items-center gap-2 transition-all ${isActive ? 'bg-yellow-400 text-[#07192b] px-3 py-2 rounded-full font-semibold' : 'text-aura opacity-90 px-3 py-2 rounded-full hover:text-yellow-300'}`}
          >
            <Icon size={14} />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
