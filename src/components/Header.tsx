import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NavLink, Link } from 'react-router-dom'
import { Home, Users, Calendar, Info, Menu, X } from 'lucide-react'

const navItems = [
  { to: '/home', icon: Home, label: 'Home', scrollId: 'home-title' },
  { to: '/about', icon: Info, label: 'About', scrollId: 'about-title' },
  { to: '/members', icon: Users, label: 'Members', scrollId: 'members-title' },
  { to: '/events', icon: Calendar, label: 'Events', scrollId: 'events-title' }
]

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [hideHeader, setHideHeader] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const lastScrollY = useRef(0)

  const handleNavClick = (e: React.MouseEvent, to: string, scrollId: string) => {
    e.preventDefault()
    
    // If already on the page, just scroll
    if (location.pathname === to) {
      const element = document.getElementById(scrollId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
      // Navigate to the page first, then scroll
      navigate(to)
      setTimeout(() => {
        const element = document.getElementById(scrollId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  useEffect(() => {
    // Hide entire header when scrolling down, show when scrolling up or near top
    function onScroll() {
      const currentScrollY = window.scrollY || window.pageYOffset
      
      // Near the top - always show
      if (currentScrollY < 50) {
        setHideHeader(false)
      } 
      // Scrolling down - hide
      else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHideHeader(true)
      } 
      // Scrolling up - show
      else if (currentScrollY < lastScrollY.current) {
        setHideHeader(false)
      }
      
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Reset header visibility when the route changes
  useEffect(() => {
    setHideHeader(false)
    lastScrollY.current = 0
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!mobileMenuOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false)
      }
    }
    
    const timer = setTimeout(() => {
      document.addEventListener('click', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [mobileMenuOpen])

  return (
    <>
    <header className={`fixed top-0 left-0 right-0 transition-transform duration-300 ${hideHeader ? '-translate-y-full' : 'translate-y-0'}`}
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.9))',
        borderBottom: '1px solid rgba(250, 204, 21, 0.2)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
        zIndex: 100
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between relative">
          {/* Logo - Left */}
          <Link to="/home" aria-label="Home" className="flex items-center gap-2 z-10">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-yellow-800/10 flex items-center justify-center">
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
            <span className="text-sm font-extrabold text-yellow-300 neon-text leading-tight">AURA-7F</span>
          </Link>

          {/* Desktop Navigation - Center (absolute positioning) */}
          <nav className="hidden sm:flex items-center bg-[#061a28]/90 text-aura rounded-full px-3 py-1 shadow-lg gap-1 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map(({ to, icon: Icon, label, scrollId }) => (
              <NavLink
                key={to}
                to={to}
                onClick={(e) => handleNavClick(e, to, scrollId)}
                className={({ isActive }) => `inline-flex items-center gap-2 transition-all ${isActive ? 'bg-yellow-400 text-[#07192b] px-4 py-2 rounded-full font-semibold' : 'text-aura opacity-90 px-4 py-2 rounded-full hover:text-yellow-300'}`}
              >
                <Icon size={14} className="opacity-90" />
                <span className="text-sm">{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Empty right spacer for balance */}
          <div className="w-10 hidden sm:block"></div>
        </div>
      </div>

      {/* Mobile menu toggle button - Fixed to Top Right Corner */}
      <div className="sm:hidden">
        <button 
          onClick={(e) => {
            e.stopPropagation()
            setMobileMenuOpen(!mobileMenuOpen)
          }}
          className="mobile-menu-button fixed top-2 right-2 p-2 text-yellow-300 hover:text-yellow-400 transition-colors rounded-md border border-yellow-300/20"
          aria-label="Toggle menu"
          style={{ 
            position: 'fixed',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.9))',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            zIndex: 110
          }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Mobile dropdown menu - positioned below toggle button */}
        <div 
          className={`mobile-menu-container fixed top-14 right-2 w-48 rounded-lg shadow-2xl border border-yellow-300/30 overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-95'}`}
          style={{
            position: 'fixed',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.9))',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
            transformOrigin: 'top right',
            zIndex: 105
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="flex flex-col py-2">
            {navItems.map(({ to, icon: Icon, label, scrollId }) => (
              <NavLink
                key={to + '-mobile'}
                to={to}
                onClick={(e) => {
                  handleNavClick(e, to, scrollId)
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

      {/* Backdrop overlay for mobile menu - blurs ONLY page content, NOT header */}
      {mobileMenuOpen && (
        <div 
          className="sm:hidden fixed bg-black/50 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          style={{ 
            top: '64px',
            left: 0, 
            right: 0, 
            bottom: 0,
            position: 'fixed',
            zIndex: 10,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        />
      )}
    </header>
    </>
  )
}
