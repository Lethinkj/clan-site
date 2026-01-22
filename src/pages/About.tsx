import React from 'react'
import AnimateOnView from '../components/AnimateOnView'

export default function About() {
  const values = [
    { title: 'Innovation', desc: "Pioneering tomorrow's solutions", icon: '💡' },
    { title: 'Excellence', desc: 'Pursuing perfection in every detail', icon: '⭐' },
    { title: 'Collaboration', desc: 'United we achieve the impossible', icon: '🤝' },
    { title: 'Growth', desc: 'Continuously evolving and learning', icon: '📈' },
    { title: 'Integrity', desc: 'Transparent and honest in all we do', icon: '🎯' },
    { title: 'Quality', desc: 'Delivering beyond expectations', icon: '✅' },
    { title: 'Energy', desc: 'Passionate drive in everything', icon: '⚡' }
  ]

  const timeline = [
    {
      year: '2024',
      title: 'Genesis',
      description: 'Started as part of Byte Bash Blitz community — passionate developers united by a shared vision.',
      icon: '✨'
    },
    {
      year: '2024',
      title: 'Identity',
      description: 'Discovered our identity: Aura-7F — a star shining in high places with maximum positive energy.',
      icon: '🔭'
    },
    {
      year: '2025',
      title: 'Expansion',
      description: 'Growing our constellation with talented individuals, each bringing unique light to new possibilities.',
      icon: '🚀'
    },
    {
      year: 'Now',
      title: 'Present',
      description: 'Continuing as a guiding star for innovation, spreading positive energy through every project.',
      icon: '🌟'
    }
  ]

  return (
    <div className="space-y-16 sm:space-y-24 pb-8">
      {/* Hero Section */}
      <section className="text-center px-4 pt-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 id="about-title" className="text-3xl sm:text-4xl md:text-5xl font-bold text-white a-fade-up scroll-mt-24">
            About <span className="text-cyan-400">Aura-7F</span>
          </h1>
          
          {/* Name Meaning Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/50 hover:border-cyan-400/40 transition-all duration-300 text-center backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/10">
              <h3 className="text-2xl font-bold text-cyan-400 mb-2">Aura</h3>
              <p className="text-sm text-slate-400">Resembles a Star — A radiant energy that illuminates</p>
            </div>
            
            <div className="hidden md:flex items-center justify-center">
              <div className="text-5xl font-bold text-cyan-400">+</div>
            </div>
            
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/50 hover:border-cyan-400/40 transition-all duration-300 text-center backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/10">
              <h3 className="text-2xl font-bold text-cyan-400 mb-2">7F</h3>
              <p className="text-sm text-slate-400">Hexadecimal's highest positive — Maximum energy</p>
            </div>
          </div>

          {/* Tagline */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-sm shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:shadow-[0_0_25px_rgba(34,211,238,0.25)] transition-all">
            <blockquote className="text-lg sm:text-xl md:text-2xl font-medium text-white italic">
              "A Star Shines in a High Place with Full of Positive Energy"
            </blockquote>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              This is the essence of our clan — reaching the highest potential while spreading positivity.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Our <span className="text-cyan-400">Philosophy</span>
            </h2>
          </div>
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-700/50 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
            <p className="text-slate-300 leading-relaxed text-center">
              Like a star that burns brightest in the vast cosmos, Aura-7F represents the pinnacle of positive 
              energy in the digital universe. We believe that true innovation happens when brilliant minds 
              unite under a shared constellation of values. Our name embodies our commitment to reaching 
              the highest levels of excellence (7F in hexadecimal) while maintaining the radiant, inspiring 
              presence of a guiding star (Aura) for others in the tech community.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Seven Fundamental <span className="text-cyan-400">Values</span>
            </h2>
            <p className="text-slate-400">The 7F that defines our highest positive energy</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((value, i) => (
              <div
                key={i}
                className="group p-5 rounded-2xl bg-slate-900/80 border border-slate-700/50 hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl p-2 rounded-lg bg-slate-800 border border-slate-700 group-hover:border-cyan-500/30 transition-colors">{value.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">{value.title}</h4>
                    <p className="text-sm text-slate-400">{value.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Our <span className="text-cyan-400">Journey</span>
            </h2>
            <p className="text-slate-400">From genesis to the stars</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent"></div>

            <div className="space-y-8">
              {timeline.map((item, idx) => (
                <AnimateOnView key={idx} animation="a-slide-left" threshold={0.2} once>
                  <div className="relative flex gap-6 items-start pl-2">
                    <div className="relative z-10 flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 border-2 border-cyan-500/50 text-lg">
                      {item.icon}
                    </div>
                    <div className="flex-1 p-5 rounded-2xl bg-slate-900/80 border border-slate-700/50 hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/10">
                      <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{item.year}</span>
                      <h4 className="font-semibold text-white mt-1 mb-2">{item.title}</h4>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                  </div>
                </AnimateOnView>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
