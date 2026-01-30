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

      {/* Hero Section - Centered Redesign */}
      <section className="px-4 pt-32 pb-16 relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-16">

          {/* Top: Floating Logo (No Border) */}
          <AnimateOnView animation="a-fade-up">
            <div className="relative group">
              {/* Subtle Back Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 bg-amber-500/20 blur-[80px] group-hover:bg-amber-500/30 transition-all duration-1000 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-purple-500/10 blur-[100px] group-hover:bg-purple-500/20 transition-all duration-1000 rounded-full mix-blend-screen" style={{ animationDelay: '1s' }}></div>

              {/* Logo Itself */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center animate-float">
                <img
                  src="/Aura-7f.png"
                  alt="Aura-7F Core"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(245,158,11,0.15)] group-hover:drop-shadow-[0_0_50px_rgba(245,158,11,0.3)] transition-all duration-700"
                />
              </div>
            </div>
          </AnimateOnView>

          {/* Middle: Title & Intro */}
          <div className="space-y-6 max-w-3xl mx-auto">
            <AnimateOnView animation="a-fade-up" style={{ transitionDelay: '200ms' }}>
              <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-purple-500/30 bg-purple-500/5 backdrop-blur text-purple-300 text-xs font-cinzel font-bold tracking-[0.2em] uppercase mb-4">
                <BookOpen size={14} className="text-purple-400" />
                Clan Origins
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-cinzel font-bold leading-tight text-white mb-6">
                The Essence of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600 block md:inline mt-2 md:mt-0">Aura-7F</span>
              </h1>
            </AnimateOnView>

            <AnimateOnView animation="a-fade-up" style={{ transitionDelay: '400ms' }}>
              <p className="text-lg md:text-xl text-slate-300 font-lato leading-relaxed max-w-2xl mx-auto">
                Forged in the fires of competition and united by a shared vision, we are more than a clan. We are a digital constellation.
              </p>
            </AnimateOnView>
          </div>

          {/* Bottom: Definitions Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-8">
            <AnimateOnView animation="a-fade-up" style={{ transitionDelay: '600ms' }}>
              <div className="p-8 rounded-[2rem] border border-amber-500/10 bg-slate-950/40 backdrop-blur-xl group hover:border-amber-500/40 transition-all duration-500 hover:-translate-y-2 shadow-2xl h-full text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Star size={120} className="text-amber-500 rotate-12" />
                </div>
                <div className="relative z-10">
                  <div className="mb-6 inline-flex p-4 rounded-2xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                    <Star size={28} />
                  </div>
                  <h3 className="text-3xl font-cinzel font-bold mb-3 text-white">Aura</h3>
                  <p className="text-base text-slate-400 font-lato leading-relaxed">The radiant energy that emanates from our collective mastery, illuminating the digital void with maximum positive energy.</p>
                </div>
              </div>
            </AnimateOnView>

            <AnimateOnView animation="a-fade-up" style={{ transitionDelay: '800ms' }}>
              <div className="p-8 rounded-[2rem] border border-purple-500/10 bg-slate-950/40 backdrop-blur-xl group hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-2 shadow-2xl h-full text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap size={120} className="text-purple-500 -rotate-12" />
                </div>
                <div className="relative z-10">
                  <div className="mb-6 inline-flex p-4 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                    <Zap size={28} />
                  </div>
                  <h3 className="text-3xl font-cinzel font-bold mb-3 text-white">7F</h3>
                  <p className="text-base text-slate-400 font-lato leading-relaxed">The pinnacle of hexadecimal energy. A sacred symbol representing the absolute limit of positive potential and craft.</p>
                </div>
              </div>
            </AnimateOnView>
          </div>

        </div>
      </section>

      {/* Philosophy Section - The Creed */}
      <section className="px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimateOnView animation="a-fade-up">
            <div className="relative p-10 md:p-16 rounded-[2.5rem] border border-white/5 bg-slate-950/40 backdrop-blur-xl overflow-hidden group">
              {/* Animated Corner Accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-amber-500/30 rounded-tl-[2.5rem] group-hover:border-amber-500 transition-colors duration-700"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-amber-500/30 rounded-br-[2.5rem] group-hover:border-amber-500 transition-colors duration-700"></div>

              <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                <div className="p-4 rounded-full bg-amber-500/5 border border-amber-500/20">
                  <Shield size={32} className="text-amber-500 animate-pulse" />
                </div>

                <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-white tracking-widest">
                  THE <span className="text-amber-500">CREED</span>
                </h2>

                <p className="text-xl md:text-2xl text-slate-200 font-cinzel italic leading-relaxed max-w-3xl">
                  "Like a celestial body that burns brightest in the vast cosmos, <span className="text-amber-400">Aura-7F</span> represents the pinnacle of energy in the digital universe."
                </p>

                <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>

                <p className="text-slate-400 font-lato text-base md:text-lg leading-loose max-w-2xl">
                  We believe that true magic happens when brilliant minds unite under a shared constellation. Our name is our bond: to reach the limit (7F) and shine eternally (Aura).
                </p>
              </div>

              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-amber-500/5 blur-[120px] rounded-full"></div>
            </div>
          </AnimateOnView>
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
                  className="group p-8 rounded-[2rem] border border-white/5 bg-slate-950/20 backdrop-blur-md hover:bg-slate-900/50 transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/20 h-full flex flex-col items-center text-center space-y-4"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-colors"></div>
                    <span className="relative z-10 text-3xl p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-center group-hover:border-amber-500/50 group-hover:text-amber-400 transition-all duration-500 shadow-xl group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                      {value.icon}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-cinzel text-xl font-black mb-2 text-white group-hover:text-amber-500 transition-colors uppercase tracking-tight">
                      {value.title}
                    </h4>
                    <p className="text-sm text-slate-400 font-lato leading-relaxed group-hover:text-slate-300 transition-colors">{value.desc}</p>
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

          <div className="relative px-2">
            {/* Timeline line with animated gradient */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[1px] bg-slate-800/50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500 via-amber-500 to-purple-500 animate-slide-down-infinite h-[200%] w-full"></div>
            </div>

            <style>{`
                @keyframes slide-down-infinite {
                    0% { transform: translateY(-50%); }
                    100% { transform: translateY(0%); }
                }
                .animate-slide-down-infinite {
                    animation: slide-down-infinite 6s linear infinite;
                }
            `}</style>

            <div className="space-y-16">
              {timeline.map((item, idx) => (
                <AnimateOnView key={idx} animation={idx % 2 === 0 ? "a-slide-left" : "a-slide-right"} threshold={0.2} once>
                  <div className={`relative flex items-center md:justify-between group ${idx % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>

                    {/* Node - Centered on desktop, left on mobile */}
                    <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full border border-white/20 bg-slate-950 text-xl shadow-2xl group-hover:border-amber-500 group-hover:scale-110 transition-all duration-500">
                      <div className="absolute inset-0 rounded-full bg-amber-500/20 opacity-0 group-hover:opacity-100 animate-pulse"></div>
                      <span className="relative z-10 filter grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                    </div>

                    {/* Content Card */}
                    <div className={`w-full md:w-[45%] pl-16 md:pl-0 pt-2 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="p-8 rounded-[2rem] border border-white/5 bg-slate-900/40 backdrop-blur-xl group-hover:bg-slate-900/60 group-hover:border-white/10 transition-all duration-500 hover:shadow-2xl">
                        <span className="text-[10px] font-black font-cinzel tracking-[0.4em] uppercase text-amber-500/60 mb-3 block group-hover:text-amber-500 transition-colors">{item.year}</span>
                        <h4 className="text-2xl font-cinzel font-bold mb-3 text-white">{item.title}</h4>
                        <p className="text-sm text-slate-400 font-lato leading-relaxed group-hover:text-slate-300 transition-colors">{item.description}</p>
                      </div>
                    </div>

                    {/* Empty space for balance */}
                    <div className="hidden md:block md:w-[45%]"></div>
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
