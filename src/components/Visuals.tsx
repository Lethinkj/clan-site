import React from 'react'
import DotGrid from './DotGrid'

const Visuals: React.FC = () => {
  return (
    <DotGrid 
      dotSize={4}
      gap={16}
      baseColor="#0c4a6e"
      activeColor="#22d3ee"
      proximity={100}
      shockRadius={180}
    />
  )
}

export default Visuals
