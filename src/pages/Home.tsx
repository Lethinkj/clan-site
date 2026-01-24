import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function Home() {
  const { theme } = useTheme()
  
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
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4
            ${theme === 'dark' 
              ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400' 
              : 'bg-cyan-600/10 border border-cyan-600/20 text-cyan-600'
            }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${theme === 'dark' ? 'bg-cyan-400' : 'bg-cyan-600'}`}></span>
            Byte Bash Blitz • Clan Aura-7F
          </div>
          
          <h1 id="home-title" className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight a-fade-up scroll-mt-24
            ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            Building Tomorrow's
            <span className="block gradient-text">Digital Solutions</span>
          </h1>
          
          <p className={`text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed a-fade-up
            ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            A passionate team of developers united by innovation, driven by excellence. 
            We craft exceptional software through collaboration and cutting-edge technology.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4 a-fade-up">
            <a 
              href="#members" 
              className={`px-6 py-3 font-semibold rounded-lg transition-all hover:shadow-lg
                ${theme === 'dark'
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 hover:shadow-cyan-500/25'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white hover:shadow-cyan-600/25'
                }`}
            >
              Meet the Team
            </a>
            <a 
              href="#events" 
              className={`px-6 py-3 font-semibold rounded-lg border transition-all
                ${theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                }`}
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
                className={`group relative p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 text-center hover:shadow-xl hover:-translate-y-1
                  ${theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-700/50 hover:border-cyan-400/40 hover:shadow-cyan-500/10'
                    : 'bg-white/80 border-slate-200 hover:border-cyan-500/40 hover:shadow-cyan-600/10'
                  }`}
              >
                <div className={`text-3xl sm:text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>{stat.value}</div>
                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              Our Core <span className={theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}>Principles</span>
            </h2>
            <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}>
              The foundations that guide our work and define our culture
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((item, i) => (
              <div 
                key={i} 
                className={`group p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                  ${theme === 'dark'
                    ? 'bg-slate-900/80 border-slate-700/50 hover:border-cyan-400/40 hover:shadow-cyan-500/10'
                    : 'bg-white/80 border-slate-200 hover:border-cyan-500/40 hover:shadow-cyan-600/10'
                  }`}
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl border text-2xl mb-4 transition-all group-hover:scale-110
                  ${theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 group-hover:border-cyan-500/30'
                    : 'bg-slate-50 border-slate-200 group-hover:border-cyan-500/30'
                  }`}>
                  {item.icon}
                </div>
                <h3 className={`text-lg font-bold mb-1 transition-colors
                  ${theme === 'dark' 
                    ? 'text-white group-hover:text-cyan-400' 
                    : 'text-slate-800 group-hover:text-cyan-600'
                  }`}>{item.title}</h3>
                <p className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-cyan-400/80' : 'text-cyan-600/80'}`}>{item.subtitle}</p>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`relative p-8 sm:p-12 rounded-3xl border backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-xl
            ${theme === 'dark'
              ? 'bg-slate-900/80 border-slate-700/50 hover:border-cyan-400/40 hover:shadow-cyan-500/10'
              : 'bg-white/80 border-slate-200 hover:border-cyan-500/40 hover:shadow-cyan-600/10'
            }`}>
            <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl ${theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-500/5'}`}></div>
            <div className={`absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl ${theme === 'dark' ? 'bg-cyan-500/5' : 'bg-cyan-500/3'}`}></div>
            
            <div className="relative text-center space-y-6">
              <h2 className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                Ready to Collaborate?
              </h2>
              <p className={`max-w-lg mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Join us in building innovative solutions and be part of a community that values growth, 
                collaboration, and excellence.
              </p>
              <a 
                href="#about" 
                className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-all hover:shadow-lg
                  ${theme === 'dark'
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-900 hover:shadow-cyan-500/25'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white hover:shadow-cyan-600/25'
                  }`}
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
