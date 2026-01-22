import React from 'react'

export default function Home() {
  const principles = [
    { 
      icon: '🤝', 
      title: 'Collaboration', 
      subtitle: 'Unity Builders',
      description: 'Fostering seamless teamwork and cross-functional collaboration across all projects'
    },
    { 
      icon: '📚', 
      title: 'Learning', 
      subtitle: 'Knowledge Sharers',
      description: 'Promoting continuous learning and open knowledge sharing within the team'
    },
    { 
      icon: '🏆', 
      title: 'Excellence', 
      subtitle: 'Quality Champions',
      description: 'Committed to delivering high-quality solutions that exceed expectations'
    },
    { 
      icon: '💡', 
      title: 'Innovation', 
      subtitle: 'Creative Thinkers',
      description: 'Pushing boundaries with creative solutions and cutting-edge technologies'
    },
    { 
      icon: '🚀', 
      title: 'Growth', 
      subtitle: 'Rising Stars',
      description: 'Continuously evolving skills and expanding our technical horizons'
    },
    { 
      icon: '⚡', 
      title: 'Efficiency', 
      subtitle: 'Smart Workers',
      description: 'Optimizing workflows and delivering impactful results efficiently'
    }
  ]

  const stats = [
    { value: '12+', label: 'Team Members' },
    { value: '10+', label: 'Projects Delivered' },
    { value: '99.9%', label: 'Collaboration Rate' },
    { value: '∞', label: 'Growth Potential' }
  ]

  return (
    <div className="space-y-16 sm:space-y-24 pb-8">
      {/* Hero Section */}
      <section className="relative text-center px-4 pt-8 sm:pt-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            Byte Bash Blitz • Clan Aura-7F
          </div>
          
          <h1 id="home-title" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight a-fade-up scroll-mt-24">
            Building Tomorrow's
            <span className="block gradient-text">Digital Solutions</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed a-fade-up">
            A passionate team of developers united by innovation, driven by excellence. 
            We craft exceptional software through collaboration and cutting-edge technology.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4 a-fade-up">
            <a 
              href="#members" 
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25"
            >
              Meet the Team
            </a>
            <a 
              href="#events" 
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg border border-slate-700 transition-all"
            >
              View Events
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="group relative p-6 rounded-2xl bg-slate-900/80 border border-slate-700/50 hover:border-cyan-400/40 transition-all duration-300 text-center backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Our Core <span className="text-cyan-400">Principles</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              The foundations that guide our work and define our culture
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((item, i) => (
              <div 
                key={i} 
                className="group p-6 rounded-2xl bg-slate-900/80 border border-slate-700/50 hover:border-cyan-400/40 transition-all duration-300 backdrop-blur-sm hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-2xl mb-4 group-hover:scale-110 group-hover:border-cyan-500/30 transition-all">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                <p className="text-sm text-cyan-400/80 font-medium mb-3">{item.subtitle}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-700/50 backdrop-blur-sm overflow-hidden hover:border-cyan-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative text-center space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Ready to Collaborate?
              </h2>
              <p className="text-slate-400 max-w-lg mx-auto">
                Join us in building innovative solutions and be part of a community that values growth, 
                collaboration, and excellence.
              </p>
              <a 
                href="#about" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/25"
              >
                Learn More About Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
