import React from 'react'

interface AnimationConfig {
  stiffness?: number
  damping?: number
}

interface StackProps {
  cards: React.ReactElement[]
  randomRotation?: boolean
  sensitivity?: number
  animationConfig?: AnimationConfig
  sendToBackOnClick?: boolean
  autoplay?: boolean
  autoplayDelay?: number
  pauseOnHover?: boolean
  mobileClickOnly?: boolean
  mobileBreakpoint?: number
}

declare const Stack: React.FC<StackProps>

export default Stack
