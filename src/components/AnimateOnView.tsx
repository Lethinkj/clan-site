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
  // Default to visible so server-rendered markup remains readable if
  // client-side JS/hydration runs late. IntersectionObserver will still
  // control animations on the client after mount.
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
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
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, once])

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
