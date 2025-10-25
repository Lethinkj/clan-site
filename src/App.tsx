import React, { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import { Footer, Visuals } from './components/index'
import { Home, About, Members, Events } from './pages/index'

export default function App() {
  const location = useLocation()

  // Scroll to top on route change to ensure mobile navigations land at the top
  useEffect(() => {
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
