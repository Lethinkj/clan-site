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

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const containerRect = container.getBoundingClientRect()
            const elRect = el.getBoundingClientRect()
            // compute top relative to container
            const top = elRect.top - containerRect.top + elRect.height / 2
            setBeeTop(top)
            // compute left so on mobile the bee sits to the left of the dot, on desktop keep center line
            if (window.innerWidth < 768) {
              // place bee slightly left of the dot
              const left = Math.max(16, elRect.left - containerRect.left - 36)
              setBeeLeft(left)
            } else {
              // center
              setBeeLeft(containerRect.width / 2)
            }
            setBeeVisible(true)
          }
        })
      },
      { threshold: 0.35 }
    )

    dots.forEach((d) => obs.observe(d))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        <h2 className="text-5xl font-extrabold text-yellow-300 a-pop">Aura-7F</h2>

  <div className="flex items-center justify-center gap-6 max-w-4xl mx-auto px-4 sm:px-0">
          <div
            className="inline-block aura-card bg-black/60 border border-yellow-300/20 p-8 rounded-lg shadow-md text-center"
          >
            <h3 className="text-2xl font-bold text-yellow-300 mb-2">Aura</h3>
          <p className="text-aura">Resembles a Star<br />A radiant energy that illuminates</p>
          </div>

          <div className="text-4xl font-extrabold text-yellow-300">+</div>

          <div
            className="inline-block aura-card bg-black/60 border border-yellow-300/20 p-8 rounded-lg shadow-md text-center"
          >
            <h3 className="text-2xl font-bold text-yellow-300 mb-2">7F</h3>
          <p className="text-aura">Hexadecimal's highest positive number<br />Maximum positive energy</p>
          </div>

          <div className="text-4xl font-extrabold text-yellow-300">=</div>

          <div className="text-4xl text-yellow-300">∞</div>
        </div>

        <div
          className="mx-auto max-w-4xl mt-6 p-6 sm:p-8 rounded-xl border border-yellow-300/20 aura-card text-center px-4"
        >
          <h3 className="text-3xl font-bold text-yellow-300 mb-4">"A Star Shines in a High Place with Full of Positive Energy"</h3>
            <p className="text-aura">This is the essence of our clan — reaching the highest potential while spreading positivity and illumination to all we touch.</p>
        </div>
      </div>

      <div className="mt-6">
  <h3 className="text-3xl font-bold text-yellow-300 mb-4 text-center a-fade-up">Our Philosophy</h3>
  <p className="text-aura max-w-4xl mx-auto text-center a-fade-up px-4 sm:px-0">Like a star that burns brightest in the vast cosmos, Aura-7F represents the pinnacle of positive energy in the digital universe. We believe that true innovation happens when brilliant minds unite under a shared constellation of values.
    Our name embodies our commitment to reaching the highest levels of excellence (7F in hexadecimal) while maintaining the radiant, inspiring presence of a guiding star (Aura) for others in the tech community.</p>
      </div>

      <div className="space-y-6">
  <h3 className="text-3xl font-bold text-yellow-300 mb-4 a-fade-up">Seven Fundamental Values</h3>
  <p className="text-lg text-aura mb-6 px-4 sm:px-0">The 7F that defines our highest positive energy</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 a-stagger">
          {values.map((value, i) => (
            <div
              key={i}
              className="bg-black/50 border border-yellow-300/20 p-5 rounded-lg shadow-md a-fade-up aura-card"
            >
              <h4 className="text-xl font-bold text-yellow-300 mb-2">{value.title}</h4>
                <p className="text-aura">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 relative">
        <h3 className="text-3xl font-bold text-yellow-400 mb-8 a-fade-up">Our Stellar Journey</h3>

  <div className="relative" ref={timelineRef}>
          {/* central vertical line (visible on md+) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-6 bottom-0 w-1 bg-yellow-800/30" />

          {/* animated bee that moves to each visible timeline dot */}
          <div
            className="timeline-bee z-50"
            style={{ top: beeTop ? `${beeTop}px` : '-48px', left: beeLeft != null ? `${beeLeft}px` : '50%', opacity: beeVisible ? 1 : 0, transform: beeLeft != null ? 'translate(-50%, -50%)' : undefined }}
            aria-hidden
          >
            <svg width="28" height="28" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
              <g>
                <ellipse cx="28" cy="30" rx="8" ry="10" fill="#f1b011" />
                <ellipse cx="18" cy="18" rx="6" ry="4" fill="#fff3cc" opacity="0.95" />
                <ellipse cx="38" cy="18" rx="6" ry="4" fill="#fff3cc" opacity="0.95" />
              </g>
            </svg>
          </div>
          {/* small bee accent centered on the timeline */}
          <div className="absolute left-1/2 transform -translate-x-1/2 mt-6 z-30">
            <svg width="36" height="36" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
              <g>
                <ellipse cx="28" cy="30" rx="8" ry="10" fill="#f1b011" />
                <ellipse cx="18" cy="18" rx="8" ry="5" fill="#fff3cc" opacity="0.95" />
                <ellipse cx="38" cy="18" rx="8" ry="5" fill="#fff3cc" opacity="0.95" />
              </g>
            </svg>
          </div>

          <div className="space-y-10 mt-8" ref={timeline => { /* timeline items container */ }}>
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
                  <div key={idx} className="md:grid md:grid-cols-2 items-center flex flex-col md:flex-row gap-4">
                  {/* left column */}
                    <div className={`${isLeft ? 'md:pr-8 md:text-right' : 'md:order-2 md:pl-8'}`}>
                    {isLeft && (
                      <AnimateOnView animation="a-fade-up" threshold={0.2} once style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="inline-block bg-black/50 border border-yellow-300/20 p-6 rounded-lg shadow-md aura-card">
                          <h4 className="text-lg font-bold text-yellow-300 mb-2">{evt.title}</h4>
                    <p className="text-aura">{evt.body}</p>
                        </div>
                      </AnimateOnView>
                    )}
                  </div>

                  {/* center icon (bee dot) */}
                  <div className="relative flex justify-center md:contents">
                    <AnimateOnView animation="a-pop" threshold={0.2} once style={{ animationDelay: `${idx * 140}ms` }}>
                      <div
                        className="timeline-dot mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white z-40 shadow-md"
                        aria-hidden
                        data-idx={idx}
                      >
                        {evt.icon}
                      </div>
                    </AnimateOnView>
                  </div>

                  {/* right column */}
                  <div className={`${isLeft ? 'md:order-2 md:pl-8' : 'md:pr-8 md:text-left'}`}>
                    {!isLeft && (
                      <AnimateOnView animation="a-fade-up" threshold={0.2} once style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="inline-block bg-black/50 border border-yellow-300/20 p-6 rounded-lg shadow-md aura-card">
                          <h4 className="text-lg font-bold text-yellow-300 mb-2">{evt.title}</h4>
                    <p className="text-aura">{evt.body}</p>
                        </div>
                      </AnimateOnView>
                    )}
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
