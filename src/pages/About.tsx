import React from 'react'
import AnimateOnView from '../components/AnimateOnView'
import { useTheme } from '../contexts/ThemeContext'
import { BookOpen, Sparkles, Scroll, Star, Target, Shield, Zap, Award, Users } from 'lucide-react'
import { Boxes } from '../components/ui/background-boxes'

export default function About() {
  const { theme } = useTheme() // Kept for context

  const values = [
    { title: 'Sorcery', desc: "Weaving innovation from the void", icon: <Sparkles className="text-amber-400" /> },
    { title: 'Mastery', desc: 'Pursuing the highest tier of craft', icon: <Award className="text-purple-400" /> },
    { title: 'Alliance', desc: 'United in our quest for glory', icon: <Users className="text-blue-400" /> },
    { title: 'Ascension', desc: 'Continuously leveling up our skills', icon: <Zap className="text-yellow-400" /> },
    { title: 'Honor', desc: 'Transparent and true to the code', icon: <Shield className="text-green-400" /> },
    { title: 'Legend', desc: 'Creating artifacts that stand the test of time', icon: <Star className="text-red-400" /> },
  ]

  const timeline = [
    {
      year: 'Age of Origin',
      title: 'The Awakening',
      description: 'Emerging from the Byte Bash Blitz realm, a fellowship of developers united by a vision of greatness.',
      icon: '✨'
    },
    {
      year: 'Era of Identity',
      title: 'Naming the Star',
      description: 'We discovered our true name: Aura-7F. A guiding light with maximum hexadecimal potential.',
      icon: '🔭'
    },
    {
      year: 'The Expansion',
      title: 'Gathering the Guild',
      description: 'New wizards and warriors joined our ranks, each adding their unique magic to our collective power.',
      icon: '🚀'
    },
    {
      year: 'Current Era',
      title: 'Eternal Quest',
      description: 'We continue to forge legends in the digital void, spreading our light to every corner of the web.',
      icon: '🌟'
    }
  ]

  return (
    <div id="about-title" className="relative space-y-24 pb-8 overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Boxes />
      </div>

      {/* Hero Section */}
      <section className="px-4 pt-20 md:pt-32 pb-16 relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

            {/* Left Column: Logo Showcase */}
            <AnimateOnView animation="a-slide-right">
              <div className="relative flex justify-center md:justify-end">
                <div className="relative group">
                  {/* Outer Glows - Pulse removed per user request */}
                  <div className="absolute inset-0 bg-amber-500 blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000 rounded-full"></div>
                  <div className="absolute -inset-10 bg-purple-500 blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity duration-1000 rounded-full" style={{ animationDelay: '1s' }}></div>

                  {/* Floating Logo Container */}
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center rounded-full border border-white/10 p-4 bg-black/40 backdrop-blur-md shadow-[0_0_60px_rgba(245,158,11,0.1)] overflow-hidden animate-float">
                    <img
                      src="/Aura-7f.png"
                      alt="Aura-7F Core"
                      className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    />

                    {/* Decorative Orbitals */}
                    <div className="absolute inset-0 border border-white/5 rounded-full animate-[spin_20s_linear_infinite]"></div>
                    <div className="absolute inset-4 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                  </div>
                </div>
              </div>
            </AnimateOnView>

            {/* Right Column: Definitions */}
            <div className="space-y-10">
              <div className="space-y-4">
                <AnimateOnView animation="a-fade-down">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/5 backdrop-blur text-purple-300 text-xs font-cinzel font-bold tracking-widest uppercase">
                    <BookOpen size={14} />
                    Clan Origins
                  </div>
                </AnimateOnView>

                <AnimateOnView animation="a-fade-up" style={{ transitionDelay: '200ms' }}>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-cinzel font-bold leading-tight text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                    The Essence of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">Aura-7F</span>
                  </h1>
                </AnimateOnView>

                <AnimateOnView animation="a-fade-up" style={{ transitionDelay: '400ms' }}>
                  <p className="text-lg text-slate-300 font-lato leading-relaxed max-w-xl">
                    Forged in the fires of competition and united by a shared vision, we are more than a clan. We are a digital constellation.
                  </p>
                </AnimateOnView>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
                <AnimateOnView animation="a-fade-up" style={{ transitionDelay: '600ms' }}>
                  <div className="p-6 rounded-2xl border border-amber-500/20 bg-slate-900/60 backdrop-blur-xl group hover:border-amber-500/50 transition-all duration-500">
                    <div className="mb-4 inline-flex p-3 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                      <Star size={24} />
                    </div>
                    <h3 className="text-2xl font-cinzel font-bold mb-2 text-white">Aura</h3>
                    <p className="text-sm text-slate-400 font-lato leading-relaxed">The radiant energy that emanates from our collective mastery, illuminating the digital void.</p>
                  </div>
                </AnimateOnView>

                <AnimateOnView animation="a-fade-up" style={{ transitionDelay: '800ms' }}>
                  <div className="p-6 rounded-2xl border border-purple-500/20 bg-slate-900/60 backdrop-blur-xl group hover:border-purple-500/50 transition-all duration-500">
                    <div className="mb-4 inline-flex p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                      <Zap size={24} />
                    </div>
                    <h3 className="text-2xl font-cinzel font-bold mb-2 text-white">7F</h3>
                    <p className="text-sm text-slate-400 font-lato leading-relaxed">The pinnacle of hexadecimal energy. A symbol of reaching the absolute limit of positive potential.</p>
                  </div>
                </AnimateOnView>
              </div>

              <AnimateOnView animation="a-fade-up" style={{ transitionDelay: '1000ms' }}>
                <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-amber-500/5 to-purple-500/5 backdrop-blur-sm">
                  <blockquote className="text-xl font-cinzel italic text-amber-200">
                    "A Star Shines in a High Place with Full of Positive Energy"
                  </blockquote>
                </div>
              </AnimateOnView>
            </div>

          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-cinzel font-bold mb-4 text-white">
              The <span className="text-purple-400">Creed</span>
            </h2>
            <div className="h-0.5 w-16 bg-purple-500/50 mx-auto rounded-full"></div>
          </div>
          <div className="p-8 sm:p-10 rounded-2xl border border-white/5 bg-black/20 backdrop-blur-sm shadow-2xl relative hover:border-purple-500/30 transition-colors duration-500">
            <div className="absolute -left-2 -top-2 w-4 h-4 border-l-2 border-t-2 border-amber-500"></div>
            <div className="absolute -right-2 -bottom-2 w-4 h-4 border-r-2 border-b-2 border-amber-500"></div>

            <p className="leading-relaxed text-center text-lg text-slate-300 font-lato italic">
              "Like a celestial body that burns brightest in the vast cosmos, Aura-7F represents the pinnacle of energy in the digital universe. We believe that true magic happens when brilliant minds unite under a shared constellation. Our name is our bond: to reach the limit (7F) and shine eternally (Aura)."
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-cinzel font-bold mb-2 text-white">
              Virtues of the <span className="text-amber-500">Order</span>
            </h2>
            <p className="text-slate-400 font-lato">The ancient laws that bind our fellowship</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, i) => (
              <AnimateOnView key={i} animation="a-fade-up" threshold={0.1} style={{ transitionDelay: `${i * 100}ms` }}>
                <div
                  className="group p-6 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm hover:bg-slate-900/60 transition-all duration-300 hover:-translate-y-2 hover:border-amber-500/30 h-full"
                >
                  <div className="flex items-start gap-4 h-full">
                    <span className="text-2xl p-3 rounded-lg bg-black/40 border border-white/5 group-hover:border-amber-500/50 transition-colors shadow-inner group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                      {value.icon}
                    </span>
                    <div>
                      <h4 className="font-cinzel font-bold mb-1 text-white group-hover:text-amber-400 transition-colors">
                        {value.title}
                      </h4>
                      <p className="text-sm text-slate-400 font-lato leading-snug">{value.desc}</p>
                    </div>
                  </div>
                </div>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <AnimateOnView animation="a-fade-up" threshold={0.1}>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-cinzel font-bold mb-2 text-white">
                The <span className="text-cyan-400">Chronicles</span>
              </h2>
              <p className="text-slate-400 font-lato">From the first spark to the eternal flame</p>
            </div>
          </AnimateOnView>

          <div className="relative">
            {/* Timeline line with animated gradient */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-800 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500 via-purple-500 to-amber-500 animate-slide-down-infinite h-[200%] w-full"></div>
            </div>

            <style>{`
                @keyframes slide-down-infinite {
                    0% { transform: translateY(-50%); }
                    100% { transform: translateY(0%); }
                }
                .animate-slide-down-infinite {
                    animation: slide-down-infinite 4s linear infinite;
                }
            `}</style>

            <div className="space-y-12">
              {timeline.map((item, idx) => (
                <AnimateOnView key={idx} animation="a-slide-left" threshold={0.2} once>
                  <div className="relative flex gap-8 items-start pl-2 group">
                    {/* Node */}
                    <div className="relative z-10 flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full border border-cyan-500/30 bg-black text-xl shadow-[0_0_15px_rgba(8,145,178,0.2)] group-hover:shadow-[0_0_25px_rgba(8,145,178,0.6)] group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300">
                      <div className="absolute inset-0 rounded-full bg-cyan-400/20 opacity-0 group-hover:opacity-100 animate-ping"></div>
                      <span className="relative z-10">{item.icon}</span>
                    </div>

                    {/* Card */}
                    <div className="flex-1 p-6 rounded-2xl border border-white/5 bg-slate-900/30 backdrop-blur-sm transition-all duration-300 hover:bg-slate-900/50 hover:border-cyan-500/40 hover:-translate-x-[-10px] hover:shadow-lg">
                      <span className="text-xs font-bold font-cinzel uppercase tracking-widest text-cyan-400 mb-2 block group-hover:text-cyan-300 transition-colors">{item.year}</span>
                      <h4 className="text-xl font-cinzel font-bold mb-2 text-white group-hover:text-cyan-200 transition-colors">{item.title}</h4>
                      <p className="text-sm text-slate-400 font-lato leading-relaxed group-hover:text-slate-300 transition-colors">{item.description}</p>
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
