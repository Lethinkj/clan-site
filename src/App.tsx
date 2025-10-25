import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import { Footer, Visuals } from './components/index'
import { Home, About, Members, Events } from './pages/index'

export default function App() {
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
