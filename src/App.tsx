import React, { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Header from './components/Header'
import { Footer, Visuals } from './components/index'
import { BackgroundBeams } from './components/ui/beams'
import { StarfieldBackground } from './components/ui/starfield'
import { OrbitsBackground } from './components/ui/orbits'
import { ShockwavesBackground } from './components/ui/shockwaves'
import { HexagonsBackground } from './components/ui/hexagons'
import { HackerBackground } from './components/ui/hacker-background'
import SplashCursor from './components/SplashCursor'
import ScrollToTop from './components/ScrollToTop'
import { Home, About, Members, Events, Login, Admin, AddMember, Projects, Profile, Milestones } from './pages/index'
const Gallery = React.lazy(() => import('./pages/Gallery'))
import { Analytics } from "@vercel/analytics/react"
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'

function AppContent() {
  const location = useLocation()
  const { theme } = useTheme()

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
    <AuthProvider>
      <ScrollToTop />
      <div className="min-h-screen text-aura relative z-10" style={{ background: 'var(--aura-dark)', color: 'var(--aura-text)' }}>
        {/* Global Splash Cursor Effect */}
        {/* <SplashCursor
          TRANSPARENT={true}
          BACK_COLOR={{ r: 0.02, g: 0.01, b: 0.04 }}
          SPLAT_RADIUS={0.25}
          CURL={5}
          COLOR_UPDATE_SPEED={8}
        /> */}
        {/* Fixed full-viewport background (Hyperspeed on home, Visuals elsewhere) */}
        {location.pathname === '/home' || location.pathname === '/about' || location.pathname === '/milestones' || location.pathname.startsWith('/profile/') ? (
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <StarfieldBackground />
          </div>
        ) : location.pathname === '/events' ? (
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <HexagonsBackground />
          </div>
        ) : location.pathname.startsWith('/admin') || location.pathname === '/moderator' ? (
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <BackgroundBeams />
          </div>
        ) : location.pathname === '/members' ? (
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <HackerBackground color="#776c07" fontSize={16} speed={0.8} />
          </div>
        ) : location.pathname === '/gallery' ? (
          null
        ) : (
          <div className="fixed inset-0 -z-10 pointer-events-none">
            <Visuals />
          </div>
        )}
        <Header />
        <main className={`${location.pathname === '/gallery' ? 'w-full' : 'container mx-auto px-3 sm:px-6'} pt-20 pb-1 md:pb-2 lg:pb-2 min-h-screen overflow-hidden`}>
          <div className={`${location.pathname === '/gallery' ? 'max-w-[95rem]' : 'max-w-6xl'} mx-auto p-0 relative z-20`}>
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/milestones" element={<Milestones />} />
              <Route path="/members" element={<Members />} />
              <Route path="/gallery" element={
                <React.Suspense fallback={<div className="h-screen w-full bg-black flex items-center justify-center text-amber-500 font-cinzel">Loading Resonance...</div>}>
                  <Gallery />
                </React.Suspense>
              } />
              <Route path="/profile/:name" element={<Profile />} />
              <Route path="/events" element={<Events />} />
              <Route path="/login" element={<Login />} />
              <Route path="/add-member" element={<AddMember />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </div>
        </main>
        <Footer />
        <Analytics />
      </div>
    </AuthProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App