import React, { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import { Footer, Visuals } from './components/index'
import { Home, About, Members, Events } from './pages/index'
import { Analytics } from "@vercel/analytics/react";

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
      <Analytics />
    </div>
  )
}
