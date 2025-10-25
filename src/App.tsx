import React, { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import { Footer, Visuals } from './components/index'
import { Home, About, Members, Events } from './pages/index'

export default function App() {
  const location = useLocation()

  // When navigating, scroll to top. If the user navigated from a scrolled position
  // we briefly disable entrance animations (body.no-entry) so content doesn't
  // visually 'come from bottom' due to our a-fade-up / a-stagger CSS animations.
  const lastScroll = useRef(0)
  useEffect(() => {
    // capture previous scroll before we reset
    const prev = window.scrollY || window.pageYOffset || 0
    lastScroll.current = prev

    if (prev > 80) {
      document.body.classList.add('no-entry')
      // remove after a short time so future animations work
      window.setTimeout(() => document.body.classList.remove('no-entry'), 160)
    }

    // perform immediate scroll-to-top to land at the top of the new page
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])

  return (
  <div className="min-h-screen bg-black text-aura" style={{ cursor: 'none' }}>
      <Visuals />
      <Header />
      <main className="container mx-auto px-6 py-12 min-h-[calc(100vh-180px)]">
        {/* Content now rendered plainly so visuals don't obscure it */}
        <div className="max-w-6xl mx-auto p-0 relative z-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/members" element={<Members />} />
            <Route path="/events" element={<Events />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  )
}
