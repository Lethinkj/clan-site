import React, { useEffect, useLayoutEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Header from './components/Header'
import { Footer, Visuals } from './components/index'
import { Home, About, Members, Events } from './pages/index'
import { Analytics } from "@vercel/analytics/react"

// Wrapper to ensure each route scrolls to top on mount
const ScrollToTop: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useLayoutEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])
  return <>{children}</>
}

export default function App() {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = React.useState(false)

  // Single source of truth: Disable browser's automatic scroll restoration permanently
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
  }, [])

  // Block scroll during transition and force to top
  useLayoutEffect(() => {
    setIsTransitioning(true)
    
    // Prevent any scroll events during transition
    const preventScroll = (e: Event) => {
      e.preventDefault()
      window.scrollTo(0, 0)
    }
    
    // Lock scroll position
    window.addEventListener('scroll', preventScroll, { passive: false })
    
    // Aggressive immediate scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    document.documentElement.style.scrollBehavior = 'auto'
    
    // Force scroll with multiple methods
    const forceScroll = () => {
      window.scrollTo(0, 0)
      window.pageYOffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
    
    forceScroll()
    requestAnimationFrame(forceScroll)
    requestAnimationFrame(() => requestAnimationFrame(forceScroll))
    
    const timers = [
      setTimeout(forceScroll, 0),
      setTimeout(forceScroll, 1),
      setTimeout(forceScroll, 10),
      setTimeout(forceScroll, 50),
      setTimeout(() => {
        forceScroll()
        window.removeEventListener('scroll', preventScroll)
        setIsTransitioning(false)
      }, 100),
    ]

    return () => {
      timers.forEach(t => clearTimeout(t))
      window.removeEventListener('scroll', preventScroll)
      document.documentElement.style.scrollBehavior = ''
    }
  }, [location.pathname])

  // Add page-load and scroll-based animations for text and cards.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // apply 'page-ready' class briefly to allow initial animations on mount
    const root = document.documentElement
    root.classList.add('page-ready')
    // add heading/text glow animation classes
    document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => h.classList.add('heading-glow-anim'))
    document.querySelectorAll('p,li,span,a,small,label').forEach((el) => el.classList.add('text-glow-anim'))

    // IntersectionObserver to animate .aura-card and staggered lists when they enter viewport
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement
          // animate cards
          if (target.classList.contains('aura-card')) {
            target.classList.add('animate-in')
          }
          // animate stagger lists
          if (target.classList.contains('a-stagger')) {
            target.classList.add('animated')
          }
          io.unobserve(target)
        }
      })
    }, { threshold: 0.12 })

    document.querySelectorAll('.aura-card, .a-stagger').forEach((el) => io.observe(el))

    // Some routes/pages may mount their content slightly after this effect runs.
    // Re-run the observation shortly after to catch late-mounted nodes and
    // immediately reveal any elements already within the viewport so they
    // don't remain hidden due to the .a-stagger > * opacity rule.
    const lateCheck = window.setTimeout(() => {
      document.querySelectorAll('.aura-card, .a-stagger').forEach((el) => {
        // if element is already intersecting (quick bounding check), reveal immediately
        try {
          const rect = (el as HTMLElement).getBoundingClientRect()
          if (rect.top < window.innerHeight * 0.9) {
            if ((el as HTMLElement).classList.contains('aura-card')) {
              (el as HTMLElement).classList.add('animate-in')
            }
            if ((el as HTMLElement).classList.contains('a-stagger')) {
              (el as HTMLElement).classList.add('animated')
            }
            io.unobserve(el)
            return
          }
        } catch (e) {
          // ignore
        }
        io.observe(el)
      })
    }, 60)

    const cleanup = () => {
      root.classList.remove('page-ready')
      io.disconnect()
      window.clearTimeout(lateCheck)
    }
    // keep page-ready for a short time so entrance animations happen
    const t = window.setTimeout(cleanup, 900)
    return () => {
      window.clearTimeout(t)
      cleanup()
    }
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-black text-aura" style={{ cursor: 'none' }}>
      <Visuals />
      <Header />
      <main className="container mx-auto px-3 sm:px-6 py-3 sm:py-12 min-h-screen sm:min-h-[calc(100vh-180px)]">
        {/* Content now rendered plainly so visuals don't obscure it */}
        <div key={location.pathname} className="max-w-6xl mx-auto p-0 relative z-20">
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<ScrollToTop><Home /></ScrollToTop>} />
            <Route path="/about" element={<ScrollToTop><About /></ScrollToTop>} />
            <Route path="/members" element={<ScrollToTop><Members /></ScrollToTop>} />
            <Route path="/events" element={<ScrollToTop><Events /></ScrollToTop>} />
          </Routes>
        </div>
      </main>
      <Footer />
      <Analytics />
    </div>
  )
}