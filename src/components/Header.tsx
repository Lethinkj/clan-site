import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { NavLink, Link } from 'react-router-dom'
import { Home, Users, Calendar, Info, Menu, X, LogIn, LogOut, Settings, Sparkles, Scroll, Crown, Sword, Code, Flag } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import ThemeToggle from './ui/ThemeToggle'
import { Navbar, NavBody, MobileNav } from './ui/resizable-navbar'

const navItems = [
  { to: '/home', icon: Home, label: 'Home', scrollId: 'home-title' },
  { to: '/about', icon: Scroll, label: 'Lore', scrollId: 'about-title' },
  { to: '/members', icon: Users, label: 'Clan', scrollId: 'members-title' },
  { to: '/events', icon: Sword, label: 'Quests', scrollId: 'events-title' },
  { to: '/projects', icon: Code, label: 'Projects', scrollId: 'projects-title' },
  { to: '/milestones', icon: Flag, label: 'Milestones', scrollId: 'milestones-title' },
  { to: '/gallery', icon: Sparkles, label: 'Gallery', scrollId: '' }
]

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { theme } = useTheme()
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [hideHeader, setHideHeader] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const lastScrollY = useRef(0)

  const handleNavClick = (e: React.MouseEvent, to: string, scrollId: string) => {
    e.preventDefault()
    if (location.pathname === to) {
      const element = document.getElementById(scrollId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    } else {
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
    function onScroll() {
      const currentScrollY = window.scrollY || window.pageYOffset
      if (currentScrollY < 50) {
        setHideHeader(false)
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHideHeader(true)
      } else if (currentScrollY < lastScrollY.current) {
        setHideHeader(false)
      }
      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setHideHeader(false)
    lastScrollY.current = 0
    window.scrollTo(0, 0)
  }, [location.pathname])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-menu-active')
    } else {
      document.body.classList.remove('mobile-menu-active')
    }
    return () => document.body.classList.remove('mobile-menu-active')
  }, [mobileMenuOpen])

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
      <Navbar>
        <NavBody>
          {/* Logo - Left */}
          <Link to="/home" aria-label="Home" className="flex items-center gap-3 z-10 group mr-4">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border border-amber-500/30 group-hover:border-amber-400 group-hover:scale-105 transition-all duration-300 relative bg-black">
                <img
                  src="/Aura-7f.png"
                  alt="Aura-7F logo"
                  className="w-12 h-12 object-cover opacity-90 group-hover:opacity-100"
                  onLoad={() => setLogoLoaded(true)}
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement
                    if (!img.src.endsWith('.png')) img.src = '/Aura-7f.png'
                  }}
                />
              </div>
            </div>
            <span className="text-lg font-cinzel font-bold tracking-widest text-amber-100 group-hover:text-amber-400 transition-colors duration-300 drop-shadow-md whitespace-nowrap">
              AURA<span className="text-amber-500">-7F</span>
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="flex-1 flex justify-center">
            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map(({ to, icon: Icon, label, scrollId }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={(e) => handleNavClick(e, to, scrollId)}
                  className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-cinzel font-medium tracking-wide relative overflow-hidden group whitespace-nowrap
                    ${isActive
                      ? 'text-amber-400 bg-amber-900/20 shadow-[0_0_15px_rgba(251,191,36,0.1)] border border-amber-500/20'
                      : 'text-slate-400 hover:text-amber-200 hover:bg-white/5'
                    }`}>
                  <Icon size={16} className={`transition-transform duration-300 group-hover:rotate-12 ${location.pathname === to ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-200'}`} />
                  <span>{label}</span>
                  {location.pathname === to && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-70"></div>}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Auth buttons - Right */}
          <div className="hidden lg:flex items-center gap-3 ml-4">
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 p-2 text-amber-100/70 hover:text-amber-300 transition-colors"
                  title="Dashboard"
                >
                  <Settings size={18} />
                </Link>
                <button
                  onClick={() => {
                    signOut()
                    navigate('/home')
                  }}
                  className="flex items-center gap-2 px-5 py-2 bg-red-900/20 border border-red-500/20 text-red-300 rounded-full hover:bg-red-900/40 hover:border-red-500/40 transition-all duration-300 font-cinzel text-xs tracking-wider"
                >
                  <LogOut size={14} />
                  <span>LOGOUT</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-6 py-2 bg-amber-600/10 border border-amber-500/40 text-amber-400 rounded-full font-cinzel font-semibold tracking-wider hover:bg-amber-600/20 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300 group"
              >
                <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />
                <span className="text-xs">LOGIN</span>
              </Link>
            )}
          </div>
        </NavBody>

        <MobileNav className="lg:hidden">
          <div className="flex items-center justify-between w-full px-4">
            {/* Mobile Logo */}
            <Link to="/home" aria-label="Home" className="flex items-center gap-3 z-10 group">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center border border-amber-500/30 bg-black">
                <img src="/Aura-7f.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-base font-cinzel font-bold tracking-widest text-amber-100">
                AURA<span className="text-amber-500">-7F</span>
              </span>
            </Link>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setMobileMenuOpen(!mobileMenuOpen)
              }}
              className="p-2 text-amber-400 hover:text-amber-300 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Dropdown content linked to same state */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-3 mx-4 p-5 rounded-2xl bg-black/60 border border-amber-500/30 backdrop-blur-2xl flex flex-col gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50">
              {navItems.map(({ to, icon: Icon, label, scrollId }) => (
                <NavLink
                  key={to + '-mobile'}
                  to={to}
                  onClick={(e) => {
                    handleNavClick(e, to, scrollId)
                    setMobileMenuOpen(false)
                  }}
                  className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                        ${isActive
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'text-slate-400 hover:bg-white/5 hover:text-amber-200'
                    }`}
                >
                  <Icon size={18} />
                  <span className="font-cinzel font-medium">{label.toUpperCase()}</span>
                </NavLink>
              ))}
              <div className="h-[1px] bg-white/10 my-2"></div>
              {user ? (
                <>
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-amber-200">
                    <Settings size={18} /> <span className="font-cinzel">DASHBOARD</span>
                  </Link>
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); navigate('/home') }} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900/20 rounded-lg w-full text-left">
                    <LogOut size={18} /> <span className="font-cinzel">LOGOUT</span>
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 bg-amber-600/20 border border-amber-500/30 text-amber-400 rounded-lg font-cinzel text-sm font-bold">
                  <LogIn size={16} /> LOGIN
                </Link>
              )}
            </div>
          )}
        </MobileNav>
      </Navbar>
    </>
  )
}
