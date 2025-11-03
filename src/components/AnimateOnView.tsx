import React, { useEffect, useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  animation?: string
  threshold?: number
  once?: boolean
  style?: React.CSSProperties
}

const AnimateOnView: React.FC<Props> = ({ children, className = '', animation = 'a-fade-up', threshold = 0.15, once = true, style }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el || !mounted) return
    
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once && obs) obs.disconnect()
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { 
        threshold,
        rootMargin: '50px' // Trigger slightly before element enters viewport
      }
    )
    obs.observe(el)
    
    // Force initial check
    const checkVisibility = () => {
      const rect = el.getBoundingClientRect()
      const isInView = rect.top < window.innerHeight && rect.bottom > 0
      if (isInView && !visible) {
        setVisible(true)
        if (once && obs) obs.disconnect()
      }
    }
    
    // Check on mount and scroll
    checkVisibility()
    window.addEventListener('scroll', checkVisibility, { passive: true })
    
    return () => {
      obs.disconnect()
      window.removeEventListener('scroll', checkVisibility)
    }
  }, [threshold, once, mounted, visible])

  // When an element becomes visible, ensure any inner .aura-card elements
  // animate in as well (they have their own .aura-card styles that start hidden).
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (visible) {
      const cards = el.querySelectorAll('.aura-card')
      cards.forEach((c) => c.classList.add('animate-in'))
    } else if (!once) {
      const cards = el.querySelectorAll('.aura-card')
      cards.forEach((c) => c.classList.remove('animate-in'))
    }
  }, [visible, once])

  return (
    <div ref={ref} style={style} className={`${className} ${visible ? `animated ${animation}` : 'invisible'}`}>
      {children}
    </div>
  )
}

export default AnimateOnView
