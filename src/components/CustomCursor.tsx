import React, { useEffect, useState, useRef } from 'react'

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  lifetime: number
}

interface ClickEffect {
  id: number
  x: number
  y: number
  type: 'ripple' | 'burst'
  angle?: number
  distance?: number
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -1000, y: -1000 })
  const [isVisible, setIsVisible] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const sparkleIdRef = useRef(0)
  const clickEffectIdRef = useRef(0)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<number>()

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Don't render cursor on mobile
  useEffect(() => {
    if (isMobile) {
      setIsVisible(false)
      return
    }
  }, [isMobile])

  useEffect(() => {
    if (isMobile) return // Skip all cursor logic on mobile
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
      // No sparkles on mouse move - only on click
    }
    
    const handleScroll = () => {
      isScrollingRef.current = true
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false
      }, 150)
    }

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true)
      
      // Create multiple click effects
      const effects: ClickEffect[] = []
      
      // Ripple effect
      effects.push({
        id: clickEffectIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        type: 'ripple'
      })
      
      // Burst particles in multiple directions (reduced from 8 to 6)
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6
        effects.push({
          id: clickEffectIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          type: 'burst',
          angle,
          distance: 35 + Math.random() * 15
        })
      }
      
      // Extra sparkles on click - increased for more dramatic effect
      for (let i = 0; i < 8; i++) {
        const sparkle: Sparkle = {
          id: sparkleIdRef.current++,
          x: e.clientX + (Math.random() - 0.5) * 50,
          y: e.clientY + (Math.random() - 0.5) * 50,
          size: Math.random() * 8 + 3,
          lifetime: Date.now()
        }
        setSparkles(prev => [...prev, sparkle])
      }
      
      setClickEffects(prev => [...prev, ...effects])
    }

    const handleMouseUp = () => setIsClicking(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleScroll, { passive: true })

    // Clean up old sparkles - faster cleanup
    const sparkleInterval = setInterval(() => {
      const now = Date.now()
      setSparkles(prev => prev.filter(s => now - s.lifetime < 800))
    }, 50)

    // Clean up click effects quickly to prevent lag
    const effectInterval = setInterval(() => {
      setClickEffects(prev => prev.slice(-10)) // Keep only recent effects
    }, 200)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleScroll)
      clearInterval(sparkleInterval)
      clearInterval(effectInterval)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isMobile])

  // Don't render anything on mobile
  if (isMobile) return null

  return (
    <>
      {/* Custom cursor - only show when visible */}
      {isVisible && (
        <>
          {/* Hexagonal cursor with animated corner accents */}
          <svg
            className={`cursor-hexagon ${isClicking ? 'clicking' : ''}`}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              transform: `translate(-50%, -50%) scale(${isClicking ? 0.85 : 1})`,
            }}
            width="40"
            height="40"
            viewBox="0 0 40 40"
          >
            <defs>
              <filter id="golden-glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(250, 204, 21, 1)" />
                <stop offset="50%" stopColor="rgba(251, 191, 36, 1)" />
                <stop offset="100%" stopColor="rgba(245, 158, 11, 1)" />
              </linearGradient>
            </defs>
            
            {/* Main hexagon */}
            <polygon
              points="20,5 32,12.5 32,27.5 20,35 8,27.5 8,12.5"
              fill="none"
              stroke="url(#gold-gradient)"
              strokeWidth="2"
              filter="url(#golden-glow)"
              className="hex-main"
            />
            
            {/* Animated corner accents - Top Left */}
            <g className="hex-accent hex-accent-1">
              <line x1="8" y1="12.5" x2="4" y2="10.5" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="2.5" strokeLinecap="round" filter="url(#golden-glow)" />
              <line x1="8" y1="12.5" x2="6" y2="16.5" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="2.5" strokeLinecap="round" filter="url(#golden-glow)" />
            </g>
            
            {/* Animated corner accents - Top Right */}
            <g className="hex-accent hex-accent-2">
              <line x1="32" y1="12.5" x2="36" y2="10.5" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="2.5" strokeLinecap="round" filter="url(#golden-glow)" />
              <line x1="32" y1="12.5" x2="34" y2="16.5" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="2.5" strokeLinecap="round" filter="url(#golden-glow)" />
            </g>
            
            {/* Animated corner accents - Bottom Left */}
            <g className="hex-accent hex-accent-3">
              <line x1="8" y1="27.5" x2="4" y2="29.5" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="2.5" strokeLinecap="round" filter="url(#golden-glow)" />
              <line x1="8" y1="27.5" x2="6" y2="23.5" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="2.5" strokeLinecap="round" filter="url(#golden-glow)" />
            </g>
            
            {/* Animated corner accents - Bottom Right */}
            <g className="hex-accent hex-accent-4">
              <line x1="32" y1="27.5" x2="36" y2="29.5" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="2.5" strokeLinecap="round" filter="url(#golden-glow)" />
              <line x1="32" y1="27.5" x2="34" y2="23.5" stroke="rgba(251, 191, 36, 0.9)" strokeWidth="2.5" strokeLinecap="round" filter="url(#golden-glow)" />
            </g>
          </svg>
          
          {/* Inner dot */}
          <div
            className="cursor-dot"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              transform: `translate(-50%, -50%) scale(${isClicking ? 1.3 : 1})`,
            }}
          />
          
          {/* Orbiting particles */}
          <div
            className="cursor-orbit-particle cursor-orbit-1"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          />
          <div
            className="cursor-orbit-particle cursor-orbit-2"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          />
          <div
            className="cursor-orbit-particle cursor-orbit-3"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          />
        </>
      )}
      
      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
          }}
        />
      ))}

      {/* Click effects */}
      {clickEffects.map(effect => {
        if (effect.type === 'ripple') {
          return (
            <svg
              key={effect.id}
              className="click-ripple-hex"
              style={{
                left: `${effect.x}px`,
                top: `${effect.y}px`,
              }}
              width="100"
              height="100"
              viewBox="0 0 100 100"
            >
              <defs>
                <filter id={`ripple-glow-${effect.id}`}>
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <polygon
                points="50,10 80,30 80,70 50,90 20,70 20,30"
                fill="none"
                stroke="rgba(250, 204, 21, 0.9)"
                strokeWidth="3"
                filter={`url(#ripple-glow-${effect.id})`}
              />
            </svg>
          )
        } else {
          const offsetX = Math.cos(effect.angle!) * effect.distance!
          const offsetY = Math.sin(effect.angle!) * effect.distance!
          return (
            <div
              key={effect.id}
              className="click-burst"
              style={{
                left: `${effect.x}px`,
                top: `${effect.y}px`,
                transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`,
              }}
            />
          )
        }
      })}
    </>
  )
}
