import React, { useEffect, useRef } from "react"
import { cn } from "../../lib/utils"

export const title = "React Shockwaves Background"

export interface ShockwavesBackgroundProps {
    className?: string
    children?: React.ReactNode
    /** Number of waves */
    count?: number
    /** Base color */
    color?: string
    /** Animation speed */
    speed?: number
    /** Max radius in pixels */
    maxRadius?: number
}

interface Wave {
    id: number
    radius: number
    opacity: number
    color: { r: number, g: number, b: number }
    speed: number
    width: number
}

export function ShockwavesBackground({
    className,
    children,
    count = 8,
    color = "#dc2626", // Red base
    speed = 1,
    maxRadius = 1000
}: ShockwavesBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let width = container.offsetWidth
        let height = container.offsetHeight

        const dpr = window.devicePixelRatio || 1
        canvas.width = width * dpr
        canvas.height = height * dpr
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        ctx.scale(dpr, dpr)

        let animationId: number
        let waves: Wave[] = []

        // Fantasy colors: Gold, Red, Purple
        const colors = [
            { r: 251, g: 191, b: 36 }, // Gold
            { r: 220, g: 38, b: 38 },  // Red
            { r: 147, g: 51, b: 234 }  // Purple
        ]

        const createWave = (initialRadius = 0): Wave => {
            const color = colors[Math.floor(Math.random() * colors.length)]
            return {
                id: Math.random(),
                radius: initialRadius,
                opacity: 1,
                color,
                speed: (0.5 + Math.random() * 1.5) * speed,
                width: 1 + Math.random() * 3
            }
        }

        // Initialize waves spread out
        for (let i = 0; i < count; i++) {
            waves.push(createWave((i / count) * Math.max(width, height) * 0.8))
        }

        const handleResize = () => {
            width = container.offsetWidth
            height = container.offsetHeight
            canvas.width = width * dpr
            canvas.height = height * dpr
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`
            ctx.scale(dpr, dpr)
        }

        window.addEventListener('resize', handleResize)

        const animate = () => {
            ctx.clearRect(0, 0, width, height)

            // Background dark void
            ctx.fillStyle = "#02040a"
            ctx.fillRect(0, 0, width, height)

            const cx = width / 2
            const cy = height / 2
            const maxDist = Math.max(width, height) * 0.8 // slightly smaller than full corner to avoid huge empty rings

            waves.forEach((wave, index) => {
                wave.radius += wave.speed

                // Fade out as it expands
                wave.opacity = 1 - (wave.radius / maxDist)
                if (wave.opacity < 0) {
                    // Reset wave
                    waves[index] = createWave(0)
                    return
                }

                ctx.beginPath()
                ctx.arc(cx, cy, wave.radius, 0, Math.PI * 2)

                // Gradient stroke
                const gradientInnerRadius = Math.max(0, wave.radius - wave.width)
                const gradientOuterRadius = Math.max(0, wave.radius + wave.width)

                const gradient = ctx.createRadialGradient(cx, cy, gradientInnerRadius, cx, cy, gradientOuterRadius)
                gradient.addColorStop(0, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, 0)`)
                gradient.addColorStop(0.5, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, ${wave.opacity * 0.8})`)
                gradient.addColorStop(1, `rgba(${wave.color.r}, ${wave.color.g}, ${wave.color.b}, 0)`)

                ctx.strokeStyle = gradient
                ctx.lineWidth = wave.width * 20 // thick glowing rings
                ctx.stroke()

                // Thin inner wireframe
                ctx.beginPath()
                ctx.arc(cx, cy, wave.radius, 0, Math.PI * 2)
                ctx.strokeStyle = `rgba(255, 255, 255, ${wave.opacity * 0.3})`
                ctx.lineWidth = 1
                ctx.stroke()
            })

            animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', handleResize)
        }
    }, [count, speed])

    return (
        <div ref={containerRef} className={cn("fixed inset-0 overflow-hidden bg-slate-950", className)}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
            {children}
        </div>
    )
}
