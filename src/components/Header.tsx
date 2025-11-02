import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { NavLink, Link } from 'react-router-dom'
import { Home, Users, Calendar, Info, Menu, X } from 'lucide-react'

const navItems = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/about', icon: Info, label: 'About' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/events', icon: Calendar, label: 'Events' }
]

export default function Header() {
  const location = useLocation()
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [hideLogo, setHideLogo] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    setMobileMenuOpen(false)
    lastY.current = 0
  }, [location.pathname])

  // Close menu when clicking outside
  useEffect(() => {
    if (!mobileMenuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false)
      }
    }
    
    // Small delay to prevent immediate closing when opening
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [mobileMenuOpen])



  return (
    <header className="sticky top-0 z-[100] bg-transparent">
      <div className="container mx-auto px-4 py-2 sm:py-3 relative z-[102]">
        {/* Logo - Top Left Corner (hides on scroll) */}
        <div className={`transition-all duration-300 ${hideLogo ? 'opacity-0 -translate-y-8 pointer-events-none h-0' : 'opacity-100 translate-y-0'}`}>
          <Link 
            to="/home" 
            aria-label="Home" 
            className="flex flex-col items-start"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-yellow-800/10 flex items-center justify-center">
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
            <span className="text-xs sm:text-sm font-extrabold text-yellow-300 neon-text mt-1">AURA-7F</span>
          </Link>
        </div>

        {/* Desktop center pill-style nav (shows when logo is hidden) */}
        <div className={`hidden sm:flex justify-center transition-all duration-300 ${hideLogo ? 'mt-0' : 'mt-4'}`}>
          <nav className="flex items-center bg-[#061a28]/90 text-aura rounded-full px-3 py-1 shadow-lg gap-1 nav-pill">
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
      </div>

      {/* Mobile menu toggle button - Fixed to Top Right Corner */}
      <div className="sm:hidden">
        <button 
          onClick={(e) => {
            e.stopPropagation()
            setMobileMenuOpen(!mobileMenuOpen)
          }}
          className="mobile-menu-button fixed top-2 right-2 z-[103] p-2 text-yellow-300 hover:text-yellow-400 transition-colors bg-black/30 backdrop-blur-md rounded-md border border-yellow-300/20"
          aria-label="Toggle menu"
          style={{ position: 'fixed' }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Mobile dropdown menu - positioned below toggle button */}
        <div 
          className={`fixed top-14 right-2 z-[101] w-48 bg-black/30 backdrop-blur-xl rounded-lg shadow-2xl border border-yellow-300/30 overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-95'}`}
          style={{
            position: 'fixed',
            background: 'linear-gradient(135deg, rgba(6, 26, 40, 0.90), rgba(7, 25, 43, 0.95))',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
            transformOrigin: 'top right'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col py-2">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to + '-mobile'}
                to={to}
                onClick={() => {
                  setMobileMenuOpen(false)
                }}
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 transition-all border-r-4 ${isActive ? 'border-yellow-400 bg-yellow-400/10 text-yellow-300 font-semibold' : 'border-transparent text-aura/80 hover:bg-yellow-300/10 hover:text-yellow-300 hover:border-yellow-300/50'}`}
              >
                <Icon size={20} strokeWidth={2.5} />
                <span className="text-base font-medium">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Backdrop overlay for mobile menu */}
      <div 
        className={`sm:hidden fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 z-[99] ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      />
    </header>
  )
}
