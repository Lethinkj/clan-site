import React, { useEffect, useRef } from 'react'
import { cn } from '../../lib/utils'

export const title = "Hexagon Grid Background"

export interface HexagonsBackgroundProps {
    className?: string
    children?: React.ReactNode
    /** Main hex color */
    color?: string
    /** Background color */
    backgroundColor?: string
}

interface Hex {
    x: number
    y: number
    size: number
    opacity: number
    targetOpacity: number
    pulseSpeed: number
}

export function HexagonsBackground({
    className,
    children,
    color = "#d97706", // Amber-600 default
    backgroundColor = "transparent"
}: HexagonsBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = container.offsetWidth
        let height = container.offsetHeight
        let animationId: number

        // Hexagon math
        const a = 2 * Math.PI / 6
        const r = 15 // radius
        const hexWidth = r * 2
        const hexHeight = Math.sqrt(3) * r

        // Grid alignment
        const xDist = hexWidth * 0.75
        const yDist = hexHeight

        // Hex fantasy colors: White and Gold
        const activeColors = [
            { r: 255, g: 255, b: 255 }, // White
            { r: 245, g: 158, b: 11 }   // Gold (Amber)
        ]

        let hexs: Hex[] = []

        const initHexs = () => {
            hexs = []
            const cols = Math.ceil(width / xDist) + 2
            const rows = Math.ceil(height / yDist) + 2

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * xDist
                    const y = j * yDist + (i % 2 === 1 ? yDist / 2 : 0)
                    hexs.push({
                        x,
                        y,
                        size: r,
                        opacity: Math.random() * 0.1, // start dim
                        targetOpacity: Math.random() * 0.1,
                        pulseSpeed: 0.005 + Math.random() * 0.01
                    })
                }
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
            initHexs()
        }

        window.addEventListener('resize', resize)
        resize()

        const drawHex = (x: number, y: number, r: number, opacity: number, colorOverride?: { r: number, g: number, b: number }) => {
            ctx.beginPath()
            for (let i = 0; i < 6; i++) {
                ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i))
            }
            ctx.closePath()

            if (colorOverride) {
                ctx.fillStyle = `rgba(${colorOverride.r}, ${colorOverride.g}, ${colorOverride.b}, ${opacity})`
                ctx.fill()
                ctx.strokeStyle = `rgba(${colorOverride.r}, ${colorOverride.g}, ${colorOverride.b}, ${opacity * 1.5})`
            } else {
                ctx.strokeStyle = `rgba(245, 158, 11, ${opacity})` // Amber stroke default
            }
            ctx.stroke()
        }

        const mouse = { x: -1000, y: -1000 }
        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect()
            mouse.x = e.clientX - rect.left
            mouse.y = e.clientY - rect.top
        }
        const handleMouseLeave = () => {
            mouse.x = -1000
            mouse.y = -1000
        }

        window.addEventListener('mousemove', handleMouseMove)
        container.addEventListener('mouseleave', handleMouseLeave)

        const animate = () => {
            ctx.clearRect(0, 0, width, height)

            let closestHexIndex = -1
            let minDist = Infinity

            // Find closest hex to mouse
            if (mouse.x > -500) {
                hexs.forEach((h, i) => {
                    const dx = mouse.x - h.x
                    const dy = mouse.y - h.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < minDist) {
                        minDist = dist
                        closestHexIndex = i
                    }
                })
            }

            hexs.forEach((h, i) => {
                const isClosest = i === closestHexIndex && minDist < 100

                // Mouse interaction boost for only the closest hex
                if (isClosest) {
                    h.targetOpacity = 0.7
                    h.pulseSpeed = 0.08
                } else {
                    h.targetOpacity = 0.05 // steady base
                    h.pulseSpeed = 0.005 + Math.random() * 0.01
                }

                // Pulse logic
                if (h.opacity < h.targetOpacity) h.opacity += h.pulseSpeed
                else h.opacity -= h.pulseSpeed

                // Constrain
                h.opacity = Math.max(0, Math.min(0.8, h.opacity))

                // Draw
                let color = undefined
                if (h.opacity > 0.25 || isClosest) {
                    color = activeColors[Math.floor(h.x % activeColors.length)]
                }

                drawHex(h.x, h.y, h.size, h.opacity, color)
            })

            animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouseMove)
            container.removeEventListener('mouseleave', handleMouseLeave)
            cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <div ref={containerRef} className={cn("fixed inset-0 -z-10 h-full w-full bg-slate-950", className)}>
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.8)_85%)] pointer-events-none"></div>
            {children}
        </div>
    )
}
