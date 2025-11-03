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



  return (
    <div className="space-y-4 sm:space-y-8 pb-2 sm:pb-8">
      <div className="text-center space-y-3 sm:space-y-6">
        <h2 id="about-title" className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-yellow-300 a-pop px-3 sm:px-4 scroll-mt-24">Aura-7F</h2>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-center gap-3 lg:gap-6 max-w-4xl mx-auto px-4">
          <div className="inline-block aura-card bg-black/60 border border-yellow-300/20 p-5 lg:p-8 rounded-lg shadow-md text-center">
            <h3 className="text-lg lg:text-2xl font-bold text-yellow-300 mb-2">Aura</h3>
            <p className="text-xs lg:text-base text-aura">Resembles a Star<br />A radiant energy that illuminates</p>
          </div>

          <div className="text-2xl lg:text-4xl font-extrabold text-yellow-300">+</div>

          <div className="inline-block aura-card bg-black/60 border border-yellow-300/20 p-5 lg:p-8 rounded-lg shadow-md text-center">
            <h3 className="text-lg lg:text-2xl font-bold text-yellow-300 mb-2">7F</h3>
            <p className="text-xs lg:text-base text-aura">Hexadecimal's highest positive number<br />Maximum positive energy</p>
          </div>

          <div className="text-2xl lg:text-4xl font-extrabold text-yellow-300">=</div>

          <div className="text-2xl lg:text-4xl text-yellow-300">∞</div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center gap-2 px-3">
          <div className="w-full aura-card bg-black/60 border border-yellow-300/20 p-3 rounded-lg shadow-md text-center">
            <h3 className="text-base font-bold text-yellow-300 mb-1">Aura</h3>
            <p className="text-xs text-aura">Resembles a Star<br />A radiant energy that illuminates</p>
          </div>

          <div className="text-lg font-extrabold text-yellow-300">+</div>

          <div className="w-full aura-card bg-black/60 border border-yellow-300/20 p-3 rounded-lg shadow-md text-center">
            <h3 className="text-base font-bold text-yellow-300 mb-1">7F</h3>
            <p className="text-xs text-aura">Hexadecimal's highest positive number<br />Maximum positive energy</p>
          </div>

          <div className="text-lg font-extrabold text-yellow-300">=</div>

          <div className="text-lg text-yellow-300">∞</div>
        </div>

        <div
          className="mx-auto max-w-4xl mt-3 sm:mt-6 p-3 sm:p-8 rounded-xl border border-yellow-300/20 aura-card text-center px-3 sm:px-4"
        >
          <h3 className="text-base sm:text-2xl md:text-3xl font-bold text-yellow-300 mb-2 sm:mb-4">"A Star Shines in a High Place with Full of Positive Energy"</h3>
            <p className="text-xs sm:text-base text-aura">This is the essence of our clan — reaching the highest potential while spreading positivity and illumination to all we touch.</p>
        </div>
      </div>

      <div className="mt-3 sm:mt-6">
        <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-yellow-300 mb-2 sm:mb-4 text-center a-fade-up px-3 sm:px-4">Our Philosophy</h3>
        <p className="text-xs sm:text-base text-aura max-w-4xl mx-auto text-center a-fade-up px-3 sm:px-4">Like a star that burns brightest in the vast cosmos, Aura-7F represents the pinnacle of positive energy in the digital universe. We believe that true innovation happens when brilliant minds unite under a shared constellation of values.
          Our name embodies our commitment to reaching the highest levels of excellence (7F in hexadecimal) while maintaining the radiant, inspiring presence of a guiding star (Aura) for others in the tech community.</p>
      </div>

      <div className="space-y-3 sm:space-y-6 px-3 sm:px-4">
        <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-yellow-300 mb-2 sm:mb-4 a-fade-up text-center">Seven Fundamental Values</h3>
        <p className="text-xs sm:text-base md:text-lg text-aura mb-3 sm:mb-6 text-center">The 7F that defines our highest positive energy</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:a-stagger max-w-4xl mx-auto">
          {values.map((value, i) => (
            <div
              key={i}
              className="bg-black/50 border border-yellow-300/20 p-3 sm:p-5 rounded-lg shadow-md md:a-fade-up a-wall-build aura-card"
            >
              <h4 className="text-base sm:text-xl font-bold text-yellow-300 mb-1 sm:mb-2">{value.title}</h4>
              <p className="text-xs sm:text-base text-aura">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 sm:mt-12 px-3 sm:px-4">
        <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-yellow-400 mb-4 sm:mb-8 a-fade-up text-center">Our Stellar Journey</h3>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line on left side for all screens */}
          <div className="absolute left-5 md:left-5 top-0 bottom-0 w-1 bg-yellow-800/30 z-0" />

          <div className="space-y-6 sm:space-y-12 pt-2 sm:pt-4">
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
                <div key={idx} className="relative flex gap-3 items-start">
                  <div className="flex-shrink-0">
                    <AnimateOnView animation="a-slide-left" threshold={0.2} once style={{ animationDelay: `${idx * 100}ms` }}>
                      <div
                        className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white z-40 shadow-lg border-2 border-yellow-300/30"
                      >
                        <span className="text-base md:text-xl">{evt.icon}</span>
                      </div>
                    </AnimateOnView>
                  </div>
                  <div className="flex-1 pt-0">
                    <AnimateOnView animation={isLeft ? "a-slide-left" : "a-slide-right"} threshold={0.2} once style={{ animationDelay: `${idx * 150}ms` }}>
                      <div className="bg-black/50 border border-yellow-300/20 p-3 md:p-5 rounded-lg shadow-md aura-card">
                        <h4 className="text-sm md:text-lg font-bold text-yellow-300 mb-1 md:mb-2">{evt.title}</h4>
                        <p className="text-xs md:text-base text-aura">{evt.body}</p>
                      </div>
                    </AnimateOnView>
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
