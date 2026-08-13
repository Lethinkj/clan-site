import React from 'react'
import { Sword, Scroll, Sparkles, Crown, Shield, BookOpen, Zap, Target, Rocket, Code, Server, Brain, ArrowRight, Quote } from 'lucide-react'
import FantasyNavbar from '../components/FantasyNavbar'

export default function NewHome() {
  const features = [
    {
      icon: <Code className="size-5 text-amber-400" />,
      title: 'Write a ton of code',
      description: 'Skip tutorial hell. We craft legendary software artifacts through real, hands-on projects from day one.'
    },
    {
      icon: <Sparkles className="size-5 text-purple-400" />,
      title: 'Stay motivated',
      description: 'A game-like guild curriculum keeps you leveling up with quests, XP, and achievements.'
    },
    {
      icon: <Sword className="size-5 text-red-400" />,
      title: 'Prove your skills',
      description: 'Build portfolio relics that show recruiters exactly what you can forge.'
    },
    {
      icon: <BookOpen className="size-5 text-cyan-400" />,
      title: 'Go deeper',
      description: 'Foundational concepts, not surface-level tutorials. Understand the arcane inner workings.'
    },
    {
      icon: <Server className="size-5 text-emerald-400" />,
      title: 'Learn flexibly',
      description: 'Online and self-paced, without interrupting your life or your raid schedule.'
    },
    {
      icon: <Shield className="size-5 text-amber-500" />,
      title: 'For a fraction of the cost',
      description: 'Minimize financial risk. World-class guild training for 1% of a college degree.'
    }
  ]

  const paths = [
    {
      icon: <Server className="size-6 text-amber-400" />,
      title: 'Frontend Path',
      description: 'Master crafting pixel-perfect interfaces with React, design systems, and performance.'
    },
    {
      icon: <Crown className="size-6 text-purple-400" />,
      title: 'Backend Path',
      description: 'Learn APIs, authentication, databases, and CDNs — the engine room of the realm.'
    },
    {
      icon: <Rocket className="size-6 text-cyan-400" />,
      title: 'DevOps Path',
      description: 'Command Linux, Docker, CI/CD, cloud deployments, and Kubernetes like a battle-mage.'
    }
  ]

  const stats = [
    { value: '50K+', label: 'lessons completed' },
    { value: '800+', label: 'courses completed' },
    { value: '1.2M', label: 'xp earned' },
    { value: '50+', label: 'guild members' }
  ]

  const testimonials = [
    {
      quote: 'This guild taught me more in 3 months than 2 years of tutorials. The quests actually make you write real code.',
      name: 'Alex H.',
      role: 'Frontend Dev @ a startup',
      rating: 5
    },
    {
      quote: 'The gamified curriculum kept me coming back every day. Leveling up never felt so rewarding.',
      name: 'Mira K.',
      role: 'Backend Engineer',
      rating: 5
    },
    {
      quote: 'Finally, a learning path that goes deep into the fundamentals. I actually understand how things work now.',
      name: 'Devon S.',
      role: 'Fullstack Developer',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen pb-12 relative overflow-hidden bg-[#0d1117]">

      <FantasyNavbar />

      {/* Custom Background Image (Dark Edition) */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: 'url("https://www.boot.dev/img/bg-blue-gray.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      ></div>

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <section id="home-title" className="relative text-center px-4 pt-48 sm:pt-60 md:pt-72 lg:pt-[360px] pb-20 z-10 mt-10 md:mt-16">
        <div className="max-w-5xl mx-auto space-y-8 relative z-10">

          {/* Main Top Logo */}
          <div className="inline-flex items-center justify-center mb-6 animate-fade-in-up">
            <div className="relative">
              <img
                src="/logonew.png"
                alt="Aura-7F Logo"
                className="relative w-[320px] h-auto sm:w-[650px] md:w-[650px] lg:w-[750px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-cinzel font-bold leading-tight text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            Forge your skills,
            <span className="block mt-2 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(245,158,11,0.4)]">
              but for real.
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-slate-300 font-lato font-light tracking-wide">
            Welcome to the most captivating, finger-flying, addictive way to master career-forging skills.
          </p>

          <div className="flex flex-wrap justify-center gap-6 pt-8">
            <a
              href="/members"
              className="group relative px-8 py-4 bg-amber-600/20 rounded-lg overflow-hidden border border-amber-500/50 transition-all hover:scale-105 hover:bg-amber-600/30 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent -translate-x-full group-hover:animate-shine"></div>
              <span className="relative flex items-center gap-2 font-cinzel font-bold text-amber-300 tracking-wider">
                <Sword size={20} />
                Demo the Learning Path
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

          {/* Social Proof */}
          <div className="pt-8 space-y-3">
            <p className="text-sm text-slate-500 font-lato">
              Join <span className="text-amber-400 font-semibold">1,200,000+ students</span> learning to code with the guild
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <span className="font-cinzel text-lg text-slate-400 tracking-widest">GOOGLE</span>
              <span className="font-cinzel text-lg text-slate-400 tracking-widest">STRIPE</span>
              <span className="font-cinzel text-lg text-slate-400 tracking-widest">NETFLIX</span>
              <span className="font-cinzel text-lg text-slate-400 tracking-widest">MICROSOFT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-500/80 font-cinzel">Why Aura-7F</p>
            <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-white drop-shadow-lg">
              Mediocrity doesn't cut it anymore
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_25px_rgba(126,34,206,0.15)] hover:border-purple-500/30 hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
                <div className="w-12 h-12 flex items-center justify-center rounded-xl border border-white/10 bg-black/50 mb-6 transition-transform group-hover:scale-110 shadow-inner">
                  {item.icon}
                </div>
                <h3 className="text-lg font-cinzel font-bold mb-2 text-slate-200 group-hover:text-amber-400 transition-colors">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pick a Path Section */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-500/80 font-cinzel">Choose your questline</p>
            <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-white drop-shadow-lg">
              Pick a <span className="text-amber-500">Learning Path</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg font-lato">
              Roadmaps designed to take you from beginner to job-ready
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paths.map((path, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-2xl border border-white/5 bg-gradient-to-b from-slate-900/60 to-black/40 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] hover:border-amber-500/30 hover:-translate-y-2 overflow-hidden flex flex-col"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-xl border border-amber-500/20 bg-amber-900/20 mb-6 transition-transform group-hover:scale-110 shadow-inner">
                  {path.icon}
                </div>
                <h3 className="text-xl font-cinzel font-bold mb-3 text-slate-200 group-hover:text-amber-400 transition-colors">{path.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400 mb-6 flex-1">{path.description}</p>
                <a href="/projects" className="inline-flex items-center gap-2 text-amber-400 font-cinzel text-sm tracking-wider group-hover:text-amber-300 transition-colors">
                  Explore the roadmap <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="px-4 py-16">
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

      {/* Testimonials */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p className="text-sm font-bold uppercase tracking-widest text-amber-500/80 font-cinzel">Guild reviews</p>
            <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-white drop-shadow-lg">
              Loved by <span className="text-amber-500">1.2M</span> learners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm transition-all duration-500 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
              >
                <Quote className="size-8 text-amber-500/40 mb-4" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Sparkles key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-slate-300 mb-6">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center font-cinzel font-bold text-white text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-200">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
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
                Ready to level up?
              </h2>
              <p className="max-w-2xl mx-auto text-slate-300 text-lg">
                Join the guild and start forging real skills today. Cancel anytime — no risk, only XP.
              </p>
              <a
                href="/about"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-cinzel font-bold tracking-wider rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all transform hover:scale-105"
              >
                Start Learning Today
                <Zap size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
