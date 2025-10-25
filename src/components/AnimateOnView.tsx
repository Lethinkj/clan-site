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

  return (
    <div ref={ref} style={style} className={`${className} ${visible ? `animated ${animation}` : 'invisible'}`}>
      {children}
    </div>
  )
}

export default AnimateOnView
