import React, { useEffect, useRef, useState } from 'react'
import AnimateOnView from '../components/AnimateOnView'

export default function About() {
  const values = [
    { title: 'Innovation', desc: "Pioneering tomorrow's solutions" },
    { title: 'Excellence', desc: 'Pursuing perfection in every detail' },
    { title: 'Collaboration', desc: 'United we achieve the impossible' },
    { title: 'Growth', desc: 'Continuously evolving and learning' },
    { title: 'Integrity', desc: 'Transparent and honest in all we do' },
    { title: 'Quality', desc: 'Delivering beyond expectations' },
    { title: 'Energy', desc: 'Passionate drive in everything' }
  ]

  const timelineRef = useRef<HTMLDivElement | null>(null)
  const [beeTop, setBeeTop] = useState<number | null>(null)
  const [beeLeft, setBeeLeft] = useState<number | null>(null)
  const [beeVisible, setBeeVisible] = useState(false)

  useEffect(() => {
    const container = timelineRef.current
    if (!container) return
    
    const dots = Array.from(container.querySelectorAll('.timeline-dot')) as HTMLElement[]
    if (!dots.length) return

    const updateBeePosition = () => {
      const containerRect = container.getBoundingClientRect()
      if (window.innerWidth < 768) {
        setBeeLeft(32) // Mobile: left side
      } else {
        setBeeLeft(containerRect.width / 2) // Desktop: center
      }
    }

    updateBeePosition()
    window.addEventListener('resize', updateBeePosition)

    const obs = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        let bestEntry: IntersectionObserverEntry | null = null
        let bestRatio = 0

        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            bestEntry = entry
          }
        }

        if (bestEntry) {
          const element = bestEntry.target as HTMLElement
          const containerRect = container.getBoundingClientRect()
          const elementRect = element.getBoundingClientRect()
          
          // Calculate relative position
          const top = elementRect.top - containerRect.top + elementRect.height / 2
          setBeeTop(top)
          setBeeVisible(true)

          // Add active class to most visible dot
          dots.forEach((dot) => {
            if (dot === element) {
              dot.classList.add('timeline-dot-active')
            } else {
              dot.classList.remove('timeline-dot-active')
            }
          })
        } else {
          const anyVisible = entries.some(entry => entry.isIntersecting)
          if (!anyVisible) {
            setBeeVisible(false)
            dots.forEach((dot) => dot.classList.remove('timeline-dot-active'))
          }
        }
      },
      { 
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-20% 0px'
      }
    )

    dots.forEach((d) => obs.observe(d))
    
    return () => {
      obs.disconnect()
      window.removeEventListener('resize', updateBeePosition)
    }
  }, [])

  return (
    <div className="space-y-8 pb-8">
      <div className="text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yellow-300 a-pop px-4">Aura-7F</h2>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-center gap-4 lg:gap-6 max-w-4xl mx-auto px-4">
          <div className="inline-block aura-card bg-black/60 border border-yellow-300/20 p-6 lg:p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl lg:text-2xl font-bold text-yellow-300 mb-2">Aura</h3>
            <p className="text-sm lg:text-base text-aura">Resembles a Star<br />A radiant energy that illuminates</p>
          </div>

          <div className="text-3xl lg:text-4xl font-extrabold text-yellow-300">+</div>

          <div className="inline-block aura-card bg-black/60 border border-yellow-300/20 p-6 lg:p-8 rounded-lg shadow-md text-center">
            <h3 className="text-xl lg:text-2xl font-bold text-yellow-300 mb-2">7F</h3>
            <p className="text-sm lg:text-base text-aura">Hexadecimal's highest positive number<br />Maximum positive energy</p>
          </div>

          <div className="text-3xl lg:text-4xl font-extrabold text-yellow-300">=</div>

          <div className="text-3xl lg:text-4xl text-yellow-300">∞</div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center gap-4 px-4">
          <div className="w-full aura-card bg-black/60 border border-yellow-300/20 p-5 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-bold text-yellow-300 mb-2">Aura</h3>
            <p className="text-sm text-aura">Resembles a Star<br />A radiant energy that illuminates</p>
          </div>

          <div className="text-2xl font-extrabold text-yellow-300">+</div>

          <div className="w-full aura-card bg-black/60 border border-yellow-300/20 p-5 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-bold text-yellow-300 mb-2">7F</h3>
            <p className="text-sm text-aura">Hexadecimal's highest positive number<br />Maximum positive energy</p>
          </div>

          <div className="text-2xl font-extrabold text-yellow-300">=</div>

          <div className="text-2xl text-yellow-300">∞</div>
        </div>

        <div
          className="mx-auto max-w-4xl mt-6 p-6 sm:p-8 rounded-xl border border-yellow-300/20 aura-card text-center px-4"
        >
          <h3 className="text-3xl font-bold text-yellow-300 mb-4">"A Star Shines in a High Place with Full of Positive Energy"</h3>
            <p className="text-aura">This is the essence of our clan — reaching the highest potential while spreading positivity and illumination to all we touch.</p>
        </div>
      </div>

      <div className="mt-6">
    <h3 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-4 text-center a-fade-up">Our Philosophy</h3>
  <p className="text-aura max-w-4xl mx-auto text-center a-fade-up px-4 sm:px-0">Like a star that burns brightest in the vast cosmos, Aura-7F represents the pinnacle of positive energy in the digital universe. We believe that true innovation happens when brilliant minds unite under a shared constellation of values.
    Our name embodies our commitment to reaching the highest levels of excellence (7F in hexadecimal) while maintaining the radiant, inspiring presence of a guiding star (Aura) for others in the tech community.</p>
      </div>

      <div className="space-y-6 px-4">
        <h3 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-4 a-fade-up text-center">Seven Fundamental Values</h3>
        <p className="text-base sm:text-lg text-aura mb-6 text-center">The 7F that defines our highest positive energy</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 a-stagger max-w-4xl mx-auto">
          {values.map((value, i) => (
            <div
              key={i}
              className="bg-black/50 border border-yellow-300/20 p-4 sm:p-5 rounded-lg shadow-md a-fade-up aura-card"
            >
              <h4 className="text-lg sm:text-xl font-bold text-yellow-300 mb-2">{value.title}</h4>
              <p className="text-sm sm:text-base text-aura">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 px-4">
        <h3 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-8 a-fade-up text-center">Our Stellar Journey</h3>

        <div className="relative max-w-4xl mx-auto" ref={timelineRef}>
          {/* Desktop: central vertical line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-yellow-800/30 z-0" />
          
          {/* Mobile: left vertical line */}
          <div className="md:hidden absolute left-6 top-0 bottom-0 w-1 bg-yellow-800/30 z-0" />

          {/* Animated bee that follows scroll */}
          {beeVisible && (
            <div
              className="timeline-bee absolute z-50 pointer-events-none"
              style={{ 
                top: beeTop ? `${beeTop}px` : '0px', 
                left: beeLeft != null ? `${beeLeft}px` : '50%',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
                opacity: beeVisible ? 1 : 0
              }}
              aria-hidden
            >
              <svg width="32" height="32" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                <g>
                  <ellipse cx="28" cy="30" rx="8" ry="10" fill="#f1b011" />
                  <ellipse cx="18" cy="18" rx="6" ry="4" fill="#fff3cc" opacity="0.95" />
                  <ellipse cx="38" cy="18" rx="6" ry="4" fill="#fff3cc" opacity="0.95" />
                  <circle cx="22" cy="24" r="1.5" fill="#000" />
                  <circle cx="34" cy="24" r="1.5" fill="#000" />
                </g>
              </svg>
            </div>
          )}

          <div className="space-y-8 sm:space-y-12 pt-4">
            {[
              {
                title: 'Genesis - 2024',
                body: 'We began as part of the Byte Bash Blitz community — a group of passionate developers united by a shared vision of reaching the highest potential in software development.',
                icon: '✨'
              },
              {
                title: 'The Aura-7F Name',
                body: 'Our clan (CB Shaniya) discovered an identity that captures both aspiration and energy — a star shining in high places with maximum positive energy, committed to excellence.',
                icon: '🔭'
              },
              {
                title: 'Expanding Horizons',
                body: "We're expanding our constellation with talented individuals — second-year bashers and rising contributors — each bringing unique light to illuminate new possibilities.",
                icon: '🚀'
              },
              {
                title: 'Shining Bright — Present',
                body: 'Today, Aura-7F continues to be a guiding star for innovation, spreading positive energy through every project we touch.',
                icon: '🌟'
              }
            ].map((evt, idx) => {
              const isLeft = idx % 2 === 0
              return (
                <div key={idx} className="relative">
                  {/* Mobile Layout */}
                  <div className="md:hidden flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <AnimateOnView animation="a-pop" threshold={0.2} once style={{ animationDelay: `${idx * 140}ms` }}>
                        <div
                          className="timeline-dot flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white z-40 shadow-lg border-2 border-yellow-300/30"
                          data-idx={idx}
                        >
                          <span className="text-lg">{evt.icon}</span>
                        </div>
                      </AnimateOnView>
                    </div>
                    <div className="flex-1 pt-1">
                      <AnimateOnView animation="a-fade-up" threshold={0.2} once style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="bg-black/50 border border-yellow-300/20 p-4 sm:p-5 rounded-lg shadow-md aura-card">
                          <h4 className="text-base sm:text-lg font-bold text-yellow-300 mb-2">{evt.title}</h4>
                          <p className="text-sm sm:text-base text-aura">{evt.body}</p>
                        </div>
                      </AnimateOnView>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-5 items-center gap-6">
                    {/* Left content */}
                    <div className={`col-span-2 ${isLeft ? 'text-right' : 'order-4 text-left'}`}>
                      {isLeft && (
                        <AnimateOnView animation="a-fade-up" threshold={0.2} once style={{ animationDelay: `${idx * 100}ms` }}>
                          <div className="inline-block bg-black/50 border border-yellow-300/20 p-5 rounded-lg shadow-md aura-card">
                            <h4 className="text-lg font-bold text-yellow-300 mb-2">{evt.title}</h4>
                            <p className="text-aura">{evt.body}</p>
                          </div>
                        </AnimateOnView>
                      )}
                    </div>

                    {/* Center timeline dot */}
                    <div className="col-span-1 flex justify-center order-2">
                      <AnimateOnView animation="a-pop" threshold={0.2} once style={{ animationDelay: `${idx * 140}ms` }}>
                        <div
                          className="timeline-dot flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white z-40 shadow-lg border-2 border-yellow-300/30"
                          data-idx={idx}
                        >
                          <span className="text-xl">{evt.icon}</span>
                        </div>
                      </AnimateOnView>
                    </div>

                    {/* Right content */}
                    <div className={`col-span-2 ${isLeft ? 'order-3 text-left' : 'text-left'}`}>
                      {!isLeft && (
                        <AnimateOnView animation="a-fade-up" threshold={0.2} once style={{ animationDelay: `${idx * 100}ms` }}>
                          <div className="inline-block bg-black/50 border border-yellow-300/20 p-5 rounded-lg shadow-md aura-card">
                            <h4 className="text-lg font-bold text-yellow-300 mb-2">{evt.title}</h4>
                            <p className="text-aura">{evt.body}</p>
                          </div>
                        </AnimateOnView>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
