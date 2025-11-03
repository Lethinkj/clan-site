import React, { useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Disable scroll restoration IMMEDIATELY
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual'
}

// Component that scrolls to top on every route change - uses useLayoutEffect to run BEFORE paint
function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    // Scroll to top synchronously before browser paints
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  return null
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ScrollToTop />
    <App />
  </BrowserRouter>
)
