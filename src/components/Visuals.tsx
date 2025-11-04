import React, { useEffect, useRef, useState } from 'react'

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

const Visuals: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [beePos, setBeePos] = useState({ x: 0, y: 0 })
  const [beeRotation, setBeeRotation] = useState(0)
  const [beePosMobile, setBeePosMobile] = useState({ x: 60, y: 160 })
  const sweepRef = useRef<HTMLDivElement | null>(null)
  const [particleCount, setParticleCount] = useState(20)
  const [particles, setParticles] = useState(() => []) as any
  const [prefersReduced, setPrefersReduced] = useState(false)

  // Initialize particles and respond to resize to change density
  useEffect(() => {
    const updateCount = () => {
      const w = window.innerWidth
      // fewer particles on small screens
      const count = w < 640 ? 6 : w < 1024 ? 14 : 28
      setParticleCount(count)
    }
    updateCount()
    window.addEventListener('resize', updateCount)
    return () => window.removeEventListener('resize', updateCount)
  }, [])

  useEffect(() => {
    const list = Array.from({ length: particleCount }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3
    }))
    setParticles(list)
  }, [particleCount])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(media.matches)
    const onChange = () => setPrefersReduced(media.matches)
    media.addEventListener?.('change', onChange)
    return () => media.removeEventListener?.('change', onChange)
  }, [])

  // Track mouse position for bee following on desktop
  useEffect(() => {
    if (prefersReduced) return
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [prefersReduced])

  // Initialize bee position to center on mount
  useEffect(() => {
    setBeePos({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
    setBeePosMobile({ x: Math.max(40, window.innerWidth * 0.2), y: Math.max(120, window.innerHeight * 0.25) })
  }, [])

  // Desktop bee: smoothly follows cursor with easing
  useEffect(() => {
    if (prefersReduced) return
    let raf = 0
    const follow = () => {
      setBeePos((prev) => {
        const dx = mousePos.x - prev.x
        const dy = mousePos.y - prev.y
        const dist = Math.hypot(dx, dy)
        const speed = clamp(0.06 + dist / 2000, 0.04, 0.18)
        const angle = Math.atan2(dy, dx) * (180 / Math.PI)
        setBeeRotation(angle)
        return {
          x: prev.x + dx * speed,
          y: prev.y + dy * speed
        }
      })
      raf = requestAnimationFrame(follow)
    }
    raf = requestAnimationFrame(follow)
    return () => cancelAnimationFrame(raf)
  }, [mousePos, prefersReduced])

  // Mobile bee: gentle random movement
  useEffect(() => {
    if (prefersReduced) return
    
    const moveBee = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const targetX = Math.floor(24 + Math.random() * (w - 48))
      const targetY = Math.floor(80 + Math.random() * (h - 160))
      setBeePosMobile({ x: targetX, y: targetY })
    }
    
    // Initialize and run every 2.6-4.2s
    moveBee()
    const interval = setInterval(moveBee, 2600 + Math.random() * 1600)
    return () => clearInterval(interval)
  }, [prefersReduced])

  // Parallax offset for hexagon pattern — disabled (no mouse tracking)
  const hexRef = useRef<SVGRectElement | null>(null)
  const hexWrapRef = useRef<HTMLDivElement | null>(null)

  const hexParallax = { transform: `translate(0px, 0px) scale(1.0)` }

  // simplified flash sequence: only two mild effects
  // - gentle fade (hex-flash-fade) applied to the hex overlay rect
  // - slow sweeping line (hex-sweep active) rendered by an overlay div
  useEffect(() => {
    if (!hexRef.current) return
    let mounted = true

    const patterns = [
      { type: 'fade', weight: 9, waitMin: 1000, waitMax: 2200 },
      { type: 'sweep', weight: 2, waitMin: 2200, waitMax: 4200 }
    ]

    const totalWeight = patterns.reduce((s, p) => s + p.weight, 0)
    const pickWeighted = () => {
      let r = Math.random() * totalWeight
      for (let i = 0; i < patterns.length; i++) {
        r -= patterns[i].weight
        if (r <= 0) return patterns[i]
      }
      return patterns[patterns.length - 1]
    }

    const nextDelay = (p: any) => Math.floor(p.waitMin + Math.random() * (p.waitMax - p.waitMin))

    const triggerLoop = () => {
      if (!mounted || !hexRef.current) return
      const el = hexRef.current
      const chosen = pickWeighted()

      // clear any fade class
      el.classList.remove('hex-flash-fade')

      if (chosen.type === 'fade') {
        el.classList.add('hex-flash-fade')
        window.setTimeout(() => el.classList.remove('hex-flash-fade'), 1100)
      } else if (chosen.type === 'sweep') {
        if (sweepRef.current) {
          const s = sweepRef.current
          s.classList.remove('active')
          void s.offsetWidth
          s.classList.add('active')
          window.setTimeout(() => s.classList.remove('active'), 1400)
        }
      }

      const delay = nextDelay(chosen)
      window.setTimeout(triggerLoop, delay)
    }

    const starter = window.setTimeout(triggerLoop, 700 + Math.random() * 800)
    return () => {
      mounted = false
      window.clearTimeout(starter)
    }
  }, [hexRef])

  return (
    <>
      {/* Animated Honeycomb Background with Blue Flashing */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 will-change-transform hex-wrap" style={hexParallax}>
          <svg className="hex-svg" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagons" width="100" height="87" patternUnits="userSpaceOnUse" patternTransform="translate(0,0) scale(1.5)">
                <polygon points="25,0 75,0 100,43.5 75,87 25,87 0,43.5" fill="none" stroke="#9a6b00" strokeWidth="2">
                    <animate attributeName="stroke-opacity" values="0.06;0.28;0.06" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="stroke" values="#c89a3aff;#b07a00;#9a6b00" dur="8s" repeatCount="indefinite" />
                  </polygon>
                  <polygon points="25,0 75,0 100,43.5 75,87 25,87 0,43.5" fill="none" stroke="#8a5a00" strokeWidth="1" transform="translate(50,0)">
                    <animate attributeName="stroke-opacity" values="0.04;0.24;0.04" dur="4.5s" repeatCount="indefinite" begin="0.6s" />
                    <animate attributeName="stroke" values="#c89a3aff;#b07a00;#8a5a00" dur="9s" repeatCount="indefinite" />
                  </polygon>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
            {/* overlay layer for subtle glow */}
            <rect ref={hexRef} className="hex-overlay" width="100%" height="100%" fill="url(#hexagons)" opacity="0.04" />
          </svg>
          {/* sweep overlay (mild line sweep) */}
          <div ref={sweepRef} className="hex-sweep pointer-events-none" aria-hidden />
        </div>
      </div>

      {/* Floating Particles */}
      {!prefersReduced && (
        <>
          {particles.map((p: any, i: number) => (
            <div
              key={i}
              className="absolute bg-yellow-300 rounded-full pointer-events-none particle"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: window.innerWidth < 640 ? 4 : 6,
                height: window.innerWidth < 640 ? 4 : 6,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                zIndex: 0
              }}
            />
          ))}
        </>
      )}

  

      {/* Flying Bee (desktop) */}
      {!prefersReduced && (
        <div
          className="fixed pointer-events-none hidden sm:block bee-wrap"
          style={{
            left: `${beePos.x}px`,
            top: `${beePos.y}px`,
            transform: `translate(-50%, -50%) rotate(${beeRotation}deg)`,
            transition: 'transform 0.12s cubic-bezier(.2,.9,.2,1)',
            zIndex: 99999
          }}
        >
          <svg className="bee-svg" width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
            {/* left wing */}
            <g className="wing left-wing">
              <ellipse cx="16" cy="18" rx="12" ry="8" fill="#fff3cc" opacity="0.7" />
            </g>
            {/* right wing */}
            <g className="wing right-wing">
              <ellipse cx="40" cy="18" rx="12" ry="8" fill="#fff3cc" opacity="0.7" />
            </g>
            {/* body */}
            <g className="bee-body">
              <ellipse cx="28" cy="30" rx="10" ry="14" fill="#f1b011" />
              <rect x="22" y="26" width="12" height="2" fill="#000" />
              <rect x="22" y="32" width="12" height="2" fill="#000" />
              <circle cx="28" cy="22" r="4" fill="#000" />
              <circle cx="26.5" cy="21" r="1" fill="#fff" />
              <circle cx="29.5" cy="21" r="1" fill="#fff" />
            </g>
          </svg>
        </div>
      )}

      {/* Mobile bee: visible on small screens and moves randomly */}
      {!prefersReduced && (
        <div
          className="fixed pointer-events-none sm:hidden bee-wrap-mobile"
          style={{
            left: `${beePosMobile.x}px`,
            top: `${beePosMobile.y}px`,
            transform: `translate(-50%, -50%)`,
            transition: 'left 1000ms ease, top 1000ms ease',
            zIndex: 30
          }}
        >
          <svg width="44" height="44" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
            {/* left wing */}
            <g className="wing left-wing">
              <ellipse cx="16" cy="18" rx="12" ry="8" fill="#fff3cc" opacity="0.7" />
            </g>
            {/* right wing */}
            <g className="wing right-wing">
              <ellipse cx="40" cy="18" rx="12" ry="8" fill="#fff3cc" opacity="0.7" />
            </g>
            {/* body */}
            <g className="bee-body">
              <ellipse cx="28" cy="30" rx="10" ry="14" fill="#f1b011" />
              <rect x="22" y="26" width="12" height="2" fill="#000" />
              <rect x="22" y="32" width="12" height="2" fill="#000" />
              <circle cx="28" cy="22" r="4" fill="#000" />
              <circle cx="26.5" cy="21" r="1" fill="#fff" />
              <circle cx="29.5" cy="21" r="1" fill="#fff" />
            </g>
          </svg>
        </div>
      )}
    </>
  )
}

export default Visuals
