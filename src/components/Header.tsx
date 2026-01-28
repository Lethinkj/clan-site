import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NavLink, Link } from 'react-router-dom'
import { Home, Users, Calendar, Info, Menu, X, LogIn, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ui/ThemeToggle'
import Dock from './Dock'

const navItems = [
  { to: '/home', icon: Home, label: 'Home', scrollId: 'home-title' },
  { to: '/about', icon: Info, label: 'About', scrollId: 'about-title' },
  { to: '/members', icon: Users, label: 'Members', scrollId: 'members-title' },
  { to: '/events', icon: Calendar, label: 'Events', scrollId: 'events-title' }
]

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isModerator, signOut } = useAuth()
  const { theme } = useTheme()
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
        background: theme === 'dark' ? 'rgba(3, 7, 18, 0.95)' : 'rgba(248, 250, 252, 0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: theme === 'dark' ? '1px solid rgba(34, 211, 238, 0.15)' : '1px solid rgba(8, 145, 178, 0.2)',
        boxShadow: theme === 'dark' 
          ? '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 30px rgba(34, 211, 238, 0.05)'
          : '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 30px rgba(8, 145, 178, 0.05)',
        zIndex: 100
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between relative">
          {/* Logo - Left */}
          <Link to="/home" aria-label="Home" className="flex items-center gap-2 z-10 group">
            <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shadow-lg transition-all duration-300
              ${theme === 'dark' 
                ? 'bg-slate-800 border border-cyan-500/30 shadow-cyan-500/10 group-hover:border-cyan-400/50 group-hover:shadow-cyan-500/20' 
                : 'bg-white border border-cyan-600/30 shadow-cyan-600/10 group-hover:border-cyan-500/50 group-hover:shadow-cyan-600/20'
              }`}>
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
            <span className={`text-sm font-bold tracking-wide transition-colors duration-300
              ${theme === 'dark' 
                ? 'text-white group-hover:text-cyan-400' 
                : 'text-slate-800 group-hover:text-cyan-600'
              }`}>AURA-7F</span>
          </Link>

          {/* Desktop Navigation - Visible on sm+ */}
          <nav className="hidden sm:flex items-center gap-2">
            {navItems.map(({ to, icon: Icon, label, scrollId }) => (
              <NavLink
                key={to}
                to={to}
                onClick={(e) => handleNavClick(e, to, scrollId)}
                className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-full transition-colors text-sm font-medium
                  ${isActive
                    ? theme === 'dark'
                      ? 'bg-cyan-500/10 text-cyan-400'
                      : 'bg-cyan-600/10 text-cyan-600'
                    : theme === 'dark'
                      ? 'text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-400'
                      : 'text-slate-700 hover:bg-cyan-600/10 hover:text-cyan-600'
                  }`}>
                <Icon size={18} className={location.pathname === to ? 'text-cyan-400' : theme === 'dark' ? 'text-slate-300' : 'text-slate-700'} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Auth buttons - Right */}
          <div className="hidden sm:flex items-center gap-2">
            {/* <ThemeToggle /> */}
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Settings size={16} />
                  <span className="text-sm">Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    navigate('/home')
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full hover:bg-red-500/20 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="text-sm">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-slate-900 rounded-full font-semibold hover:bg-cyan-400 transition-colors"
              >
                <LogIn size={16} />
                <span className="text-sm">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu toggle button - Fixed to Top Right Corner */}
      <div className="sm:hidden">
        <button 
          onClick={(e) => {
            e.stopPropagation()
            setMobileMenuOpen(!mobileMenuOpen)
          }}
          className={`mobile-menu-button fixed top-2 right-2 p-2 transition-colors rounded-md border
            ${theme === 'dark'
              ? 'text-cyan-400 hover:text-cyan-500 border-cyan-400/20'
              : 'text-cyan-600 hover:text-cyan-700 border-cyan-600/20'
            }`}
          aria-label="Toggle menu"
          style={{ 
            position: 'fixed',
            background: theme === 'dark' 
              ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.9))'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.9))',
            boxShadow: theme === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 110
          }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Mobile dropdown menu - positioned below toggle button */}
        <div 
          className={`mobile-menu-container fixed top-14 right-2 w-48 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-95'}
            ${theme === 'dark' ? 'border-cyan-400/30' : 'border-cyan-600/30'}`}
          style={{
            position: 'fixed',
            background: theme === 'dark' 
              ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.9))'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.95))',
            boxShadow: theme === 'dark' ? '0 8px 32px 0 rgba(0, 0, 0, 0.5)' : '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
            transformOrigin: 'top right',
            zIndex: 105,
            border: `1px solid ${theme === 'dark' ? 'rgba(34, 211, 238, 0.3)' : 'rgba(8, 145, 178, 0.3)'}`
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
                className={({ isActive }) => `flex items-center gap-3 px-4 py-3.5 transition-all border-r-4 
                  ${isActive 
                    ? theme === 'dark'
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 font-semibold'
                      : 'border-cyan-600 bg-cyan-600/10 text-cyan-600 font-semibold'
                    : theme === 'dark'
                      ? 'border-transparent text-slate-300 hover:bg-cyan-400/10 hover:text-cyan-400 hover:border-cyan-400/50'
                      : 'border-transparent text-slate-600 hover:bg-cyan-600/10 hover:text-cyan-600 hover:border-cyan-600/50'
                  }`}
              >
                <Icon size={20} strokeWidth={2.5} />
                <span className="text-base font-medium">{label}</span>
              </NavLink>
            ))}
            
            {/* Theme toggle for mobile */}
            <div className={`flex items-center justify-between px-4 py-3.5 border-t mt-2
              ${theme === 'dark' ? 'border-cyan-400/20' : 'border-cyan-600/20'}`}>
              <span className={`text-base font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Theme</span>
              <ThemeToggle />
            </div>
            
            {/* Auth buttons for mobile */}
            <div className={`border-t pt-2 ${theme === 'dark' ? 'border-cyan-400/20' : 'border-cyan-600/20'}`}>
              {user ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 transition-all border-r-4 border-transparent text-aura/80 hover:bg-cyan-400/10 hover:text-cyan-400 hover:border-cyan-400/50"
                  >
                    <Settings size={20} strokeWidth={2.5} />
                    <span className="text-base font-medium">Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setMobileMenuOpen(false)
                      navigate('/home')
                    }}
                    className="flex items-center gap-3 px-4 py-3.5 transition-all border-r-4 border-transparent text-red-400 hover:bg-red-500/10 hover:border-red-500/50 w-full text-left"
                  >
                    <LogOut size={20} strokeWidth={2.5} />
                    <span className="text-base font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 transition-all border-r-4 border-transparent text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/50"
                >
                  <LogIn size={20} strokeWidth={2.5} />
                  <span className="text-base font-medium">Login</span>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Backdrop overlay for mobile menu - blurs ONLY page content, NOT header */}
      {mobileMenuOpen && (
        <div 
          className="sm:hidden fixed bg-aura-overlay transition-opacity duration-300"
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

    {/* Floating Dock Navigation - Desktop Only */}
    <div className="hidden sm:block fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      {/* <Dock
        items={navItems.map(({ to, icon: Icon, label, scrollId }) => ({
          icon: <Icon size={24} className={location.pathname === to ? 'text-cyan-400' : 'text-slate-300'} />,
          label: label,
          onClick: () => {
            if (location.pathname === to) {
              const element = document.getElementById(scrollId)
              if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            } else {
              navigate(to)
              setTimeout(() => {
                const element = document.getElementById(scrollId)
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }, 100)
            }
          },
          className: location.pathname === to ? 'dock-item-active' : ''
        }))}
        magnification={60}
        distance={140}
        panelHeight={56}
        baseItemSize={44}
      /> */}
    </div>
    </>
  )
}
