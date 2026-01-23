declare module './components/Hyperspeed' {
  import * as React from 'react'
  const Hyperspeed: React.FC<any>
  export default Hyperspeed
}

// fallback for any .jsx components without type declarations
declare module '*.jsx' {
  import * as React from 'react'
  const Component: React.ComponentType<any>
  export default Component
}
