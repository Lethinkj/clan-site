import React, { useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'

export interface AuraParticlesProps {
    className?: string
    particleCount?: number
    lineDistance?: number
    particleColor?: string
    lineColor?: string
}

interface Point {
    x: number
    y: number
    vx: number
    vy: number
    size: number
}

export function AuraParticles({
    className,
    particleCount = 500,
    lineDistance = 140,
    particleColor = "rgba(245, 158, 11, 0.45)", // Amber/Gold
    lineColor = "rgba(173, 20, 255, 0.08)"
}: AuraParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const mouseRef = useRef({ x: -1000, y: -1000 })

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = container.offsetWidth
        let height = container.offsetHeight
        let animationId: number

        const particles: Point[] = []
        const dustParticles: Point[] = []

        const initParticles = () => {
            particles.length = 0
            dustParticles.length = 0

            // Main plexus particles
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    size: 1 + Math.random() * 2
                })
            }

            // Secondary ambient dust
            for (let i = 0; i < 40; i++) {
                dustParticles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                    size: 0.5 + Math.random() * 1
                })
            }
        }

        const resize = () => {
            width = container.offsetWidth
            height = container.offsetHeight
            const dpr = window.devicePixelRatio || 1
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.scale(dpr, dpr)
            initParticles()
        }

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect()
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            }
        }

        window.addEventListener('resize', resize)
        window.addEventListener('mousemove', handleMouseMove)
        resize()

        const draw = () => {
            ctx.clearRect(0, 0, width, height)

            // Draw ambient dust
            dustParticles.forEach(p => {
                p.x += p.vx
                p.y += p.vy
                if (p.x < 0) p.x = width
                if (p.x > width) p.x = 0
                if (p.y < 0) p.y = height
                if (p.y > height) p.y = 0

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
                ctx.fill()
            })

            // Update and draw main particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]

                p.x += p.vx
                p.y += p.vy

                // Wrap around edges
                if (p.x < 0) p.x = width
                if (p.x > width) p.x = 0
                if (p.y < 0) p.y = height
                if (p.y > height) p.y = 0

                // Mouse influence
                const dxMouse = mouseRef.current.x - p.x
                const dyMouse = mouseRef.current.y - p.y
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
                if (distMouse < 180) {
                    p.x -= dxMouse * 0.005
                    p.y -= dyMouse * 0.005
                }

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = particleColor
                ctx.fill()

                // Lines
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j]
                    const dx = p.x - p2.x
                    const dy = p.y - p2.y
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist < lineDistance) {
                        ctx.beginPath()
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.strokeStyle = lineColor
                        ctx.lineWidth = 0.5 * (1 - dist / lineDistance)
                        ctx.stroke()
                    }
                }
            }

            animationId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationId)
        }
    }, [particleCount, lineDistance, particleColor, lineColor])

    return (
        <div ref={containerRef} className={cn("fixed inset-0 -z-10 h-full w-full bg-[#030712]", className)}>
            {/* Soft Ambient Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60" />

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
        </div>
    )
}
