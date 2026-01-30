import React from 'react'
import { Shield, BookOpen, Crown, Zap, Target, Scroll, Sparkles, Sword } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function Home() {
  // Theme context kept for compatibility but visual style is overridden to Fantasy

  const principles = [
    {
      icon: <Shield className="size-6 text-amber-400" />,
      title: 'Alliance',
      subtitle: 'Unity Builders',
      description: 'Forging unbreakable bonds and seamless teamwork across all realms.'
    },
    {
      icon: <BookOpen className="size-6 text-purple-400" />,
      title: 'Wisdom',
      subtitle: 'Knowledge Keepers',
      description: 'Sharing ancient scrolls of knowledge to elevate the entire clan.'
    },
    {
      icon: <Crown className="size-6 text-amber-500" />,
      title: 'Glory',
      subtitle: 'Quality Champions',
      description: 'Striving for legendary status in every artifact we create.'
    },
    {
      icon: <Sparkles className="size-6 text-cyan-400" />,
      title: 'Magic',
      subtitle: 'Creative Sorcery',
      description: 'Weaving spells of code to birth innovation from the void.'
    },
    {
      icon: <Zap className="size-6 text-yellow-400" />,
      title: 'Ascension',
      subtitle: 'Rising Stars',
      description: 'Continuously leveling up our skills to reach god-tier potential.'
    },
    {
      icon: <Target className="size-6 text-red-400" />,
      title: 'Precision',
      subtitle: 'Smart Strikes',
      description: 'Executing quests with lethal efficiency and maximum impact.'
    }
  ]

  const stats = [
    { value: '12+', label: 'Guild Members' },
    { value: '10+', label: 'Relics Forged' },
    { value: '100%', label: 'Loyalty Rate' },
    { value: '∞', label: 'Mana Pool' }
  ]

  return (
    <div className="min-h-screen pb-12 relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <section id="home-title" className="relative text-center px-4 pt-20 sm:pt-32 pb-20">
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">

          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-amber-500/30 bg-black/40 backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.1)] mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span className="text-amber-200 text-sm font-cinzel font-bold tracking-widest uppercase">Realm of Aura-7F</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-cinzel font-bold leading-tight text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            Forging Legends in the
            <span className="block mt-2 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(245,158,11,0.4)]">
              Digital Void
            </span>
          </h1>

          <p className="text-lg sm:text-x md:text-2xl max-w-3xl mx-auto leading-relaxed text-slate-300 font-lato font-light tracking-wide">
            A fellowship of code-wizards and digital architects. We craft legendary software artifacts through unity and forbidden technologies.
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-8">
            <a
              href="/members"
              className="group relative px-8 py-4 bg-amber-600/20 rounded-lg overflow-hidden border border-amber-500/50 transition-all hover:scale-105 hover:bg-amber-600/30 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent -translate-x-full group-hover:animate-shine"></div>
              <span className="relative flex items-center gap-2 font-cinzel font-bold text-amber-300 tracking-wider">
                <Sword size={20} />
                Enter the Guild
              </span>
            </a>
            <a
              href="/events"
              className="px-8 py-4 bg-purple-900/20 rounded-lg border border-purple-500/30 text-purple-200 font-cinzel font-bold tracking-wider hover:bg-purple-900/40 hover:border-purple-400 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] flex items-center gap-2"
            >
              <Scroll size={20} />
              View Quests
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md text-center transition-all duration-300 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                <div className="relative text-3xl sm:text-5xl font-cinzel font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 group-hover:to-amber-200">{stat.value}</div>
                <div className="relative text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 group-hover:text-amber-500/80 transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-white drop-shadow-lg">
              The <span className="text-amber-500">Code</span> of Aura
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg font-lato">
              The ancient laws that bind our fellowship and guide our craft
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((item, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_25px_rgba(126,34,206,0.15)] hover:border-purple-500/30 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>

                <div className="w-14 h-14 flex items-center justify-center rounded-xl border border-white/10 bg-black/50 mb-6 transition-transform group-hover:scale-110 shadow-inner">
                  {item.icon}
                </div>
                <h3 className="text-xl font-cinzel font-bold mb-2 text-slate-200 group-hover:text-amber-400 transition-colors">{item.title}</h3>
                <p className="text-sm font-bold text-purple-400/80 mb-3 tracking-wider uppercase text-xs">{item.subtitle}</p>
                <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative p-10 sm:p-20 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-slate-900/90 to-black/90 backdrop-blur-xl overflow-hidden text-center shadow-2xl">

            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] bg-amber-600/10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[80px] bg-purple-600/10"></div>

            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-white">
                Heed the Call to Adventure
              </h2>
              <p className="max-w-2xl mx-auto text-slate-300 text-lg">
                The portal is open. Join our ranks to forge new realities and attain eternal glory in the archives of the web.
              </p>
              <a
                href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-cinzel font-bold tracking-wider rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all transform hover:scale-105"
              >
                Let the Journey Begin
                <Sparkles size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
