import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, BookOpen, Crown, Zap, Target, Sparkles, Star, Calendar, ChevronRight, ChevronLeft, Play, Clock, History } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import AnimateOnView from '../components/AnimateOnView'
import FantasyNavbar from '../components/FantasyNavbar'

// Principles data from Home
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
    description: 'Always upgrading — troops, buildings, and skills — because standing still means falling behind.'
  },
  {
    icon: <Target className="size-6 text-red-400" />,
    title: 'Precision',
    subtitle: 'Smart Strikes',
    description: 'Planning every attack down to the second, so no resource or war star goes to waste.'
  }
]

// Milestones data (Chronicles)
const milestones = [
  {
    date: 'CB Shaniya',
    title: 'Valor Stone',
    description: 'Clan members collectively win a set number of battles or challenges. Shainya stands as the first basher to conquer Sapphire, Ruby, and Emerald leagues.',
    icon: <Zap className="text-purple-400" />,
    category: 'Valor'
  },
  {
    date: 'December 14, 2025',
    title: 'Honor Stone',
    description: 'Clan achieves a high rank in a leaderboard or external competition.',
    icon: <Shield className="text-amber-400" />,
    category: 'Honor'
  },
]

// Chronicles timeline extracted from About page
const chronicles = [
  {
    year: 'Age of Origin',
    title: 'The Awakening',
    description: 'Emerging from the Byte Bash Blitz realm, a fellowship of developers united by a vision of greatness.',
    icon: '✨',
  },
  {
    year: 'Era of Identity',
    title: 'Naming the Star',
    description: 'We discovered our true name: Aura-7F. A guiding light with maximum hexadecimal potential.',
    icon: '🔭',
  },
  {
    year: 'The Expansion',
    title: 'Gathering the Guild',
    description: 'New wizards and warriors joined our ranks, each adding their unique magic to our collective power.',
    icon: '🚀',
  },
  {
    year: 'Current Era',
    title: 'Eternal Quest',
    description: 'We continue to forge legends in the digital void, spreading our light to every corner of the web.',
    icon: '🌟',
  },
];

const sparkPhaseItems = [
  {
    id: 3,
    image: 'https://i.postimg.cc/FF0XswXt/Screenshot-(383).png',
    date: 'September 08, 2025',
    title: 'The First Spark',
    description: 'Aura-7F become master clan of Byte Bash Blitz.'
  },
  {
    id: 2,
    image: 'https://i.postimg.cc/Gh9Pjn38/Whats-App-Image-2026-01-30-at-10-30-11-PM.jpg',
    date: 'October 06, 2025',
    title: 'Halfway to a Thousand',
    description: 'Proof of unity, effort, and momentum. The climb continues toward the thousand.'
  },
  {
    id: 1,
    image: 'https://i.postimg.cc/W3Y4SKS5/Whats-App-Image-2026-01-30-at-10-32-42-PM.jpg',
    date: '',
    title: 'Pointzilla',
    description: '100+ already crushed under its claws, Pointzilla reigns supreme at the top — loud, unstoppable, and hilariously hungry for more!'
  },
  {
    id: 4,
    image: 'https://i.postimg.cc/NF6HsXXp/Whats-App-Image-2026-01-31-at-1-26-35-AM.jpg',
    date: 'November 25, 2025',
    title: '1000 Echoes of Victory',
    description: 'This is more than a milestone; it\'s the mark of legends'
  },
]

const LEGACY_START_DATE = new Date('2025-09-08T00:00:00')

// Component for time display in Legacy Stone
const TimeUnit = React.memo(({ value, label, blink }: { value: number, label: string, blink?: boolean }) => (
  <div className="flex flex-col items-center p-3 md:p-4">
    {blink ? (
      <motion.div
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        className="text-3xl md:text-5xl lg:text-6xl font-black font-cinzel tracking-tighter text-amber-500 tabular-nums"
      >
        {value.toString().padStart(2, '0')}
      </motion.div>
    ) : (
      <div className="text-3xl md:text-5xl lg:text-6xl font-black font-cinzel tracking-tighter text-white tabular-nums">
        {value.toString().padStart(2, '0')}
      </div>
    )}
    <div className="text-[8px] md:text-[10px] text-amber-500/60 uppercase font-black tracking-[0.2em] md:tracking-[0.3em] mt-2 whitespace-nowrap">{label}</div>
  </div>
));

// Legacy Stone Component
const LegacyStone = () => {
  const [timeLeft, setTimeLeft] = useState({
    years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diff = now.getTime() - LEGACY_START_DATE.getTime();

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const daysTotal = Math.floor(diff / (1000 * 60 * 60 * 24));

      const years = Math.floor(daysTotal / 365);
      const months = Math.floor((daysTotal % 365) / 30);
      const days = Math.floor((daysTotal % 365) % 30);

      setTimeLeft({ years, months, days, hours, minutes, seconds });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="px-4 relative z-10 pt-10">
      <div className="max-w-4xl mx-auto">
        <AnimateOnView animation="a-fade-up">
          <div className="relative group p-1 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-gradient-to-br from-amber-500/10 via-slate-900/40 to-purple-500/10 border border-white/5 backdrop-blur-3xl shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.03),transparent_70%)] group-hover:scale-150 transition-transform duration-1000" />

            <div className="relative z-10 p-8 md:p-16 text-center space-y-8 md:space-y-10">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] md:text-[10px] font-black tracking-widest uppercase">
                  <Clock size={12} className="animate-spin-slow" />
                  The Eternal Pulse
                </div>
                <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-white leading-tight">
                  Legacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Stone</span>
                </h2>
                <p className="text-slate-400 font-lato text-xs md:text-sm tracking-widest uppercase opacity-60">
                  Time elapsed since the ignition of the first spark
                </p>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 justify-center items-center">
                <TimeUnit value={timeLeft.years} label="Years" />
                <TimeUnit value={timeLeft.months} label="Months" />
                <TimeUnit value={timeLeft.days} label="Days" />
                <TimeUnit value={timeLeft.hours} label="Hours" />
                <TimeUnit value={timeLeft.minutes} label="Minutes" />
                <TimeUnit value={timeLeft.seconds} label="Seconds" blink={true} />
              </div>

              <div className="w-full max-w-xs mx-auto h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
            </div>
          </div>
        </AnimateOnView>
      </div>
    </section>
  );
};

export default function NewHome() {
  const [sparkIndex, setSparkIndex] = useState<number | null>(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // Spark phase auto-play
  useEffect(() => {
    let timer: any;
    if (isPlaying && sparkIndex !== null) {
      if (sparkIndex < sparkPhaseItems.length - 1) {
        timer = setTimeout(() => {
          setSparkIndex(sparkIndex + 1);
        }, 4000);
      } else {
        timer = setTimeout(() => {
          setIsPlaying(false);
          setSparkIndex(null);
        }, 4000);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, sparkIndex]);

  const startSparkPhase = () => {
    setSparkIndex(0);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen pb-12 relative overflow-hidden bg-slate-950">

      {/* Navigation Bar - Fixed Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/80 border-b border-white/5">
        <FantasyNavbar />
      </header>

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* ========================================
          1. HERO SECTION
          ======================================== */}
      <section
        id="home-title"
        className="relative flex min-h-screen items-center justify-center px-4 py-20 text-center"
      >
        <div className="relative z-10 mx-auto max-w-5xl space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-cinzel text-4xl font-bold leading-tight text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] sm:text-5xl md:text-7xl"
          >
            Clashing Our Way to Glory
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mx-auto max-w-3xl font-lato text-lg font-light leading-relaxed tracking-wide text-slate-300 sm:text-xl md:text-2xl"
          >
            A clan of dedicated raiders and strategists. We climb the leaderboards
            together, one war win at a time.
          </motion.p>
        </div>
      </section>

      {/* ========================================
          2. TRUST STATS BAR
          ======================================== */}
      <section className="px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '12+', label: 'Guild Members' },
              { value: '10+', label: 'Wars Won' },
              { value: '100%', label: 'Loyalty Rate' },
              { value: '∞', label: 'Team Spirit' }
            ].map((stat, i) => (
              <AnimateOnView key={i} animation="a-fade-up">
                <div
                  className="group relative p-8 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md text-center transition-all duration-300 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                  <div className="relative text-3xl sm:text-5xl font-cinzel font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 group-hover:to-amber-200">{stat.value}</div>
                  <div className="relative text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 group-hover:text-amber-500/80 transition-colors">{stat.label}</div>
                </div>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="max-w-6xl mx-auto px-4 mb-4">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
      </div>

      {/* ========================================
          3. CLAN IDENTITY - Aura & 7F Cards
          ======================================== */}
      <section className="px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <AnimateOnView animation="a-fade-up">
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

            <AnimateOnView animation="a-fade-up">
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

      {/* Section Divider */}
      <div className="max-w-6xl mx-auto px-4 mb-4">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
      </div>

      {/* ========================================
          4. CLAN VALUES (6-card grid)
          ======================================== */}
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
              <AnimateOnView key={i} animation="a-fade-up" style={{ transitionDelay: `${i * 100}ms` }}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_25px_rgba(126,34,206,0.15)] hover:border-purple-500/30 relative overflow-hidden"
                >
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 flex items-center justify-center rounded-xl border border-white/10 bg-black/50 mb-6 transition-transform shadow-inner">
                    {item.icon}
                  </motion.div>
                  <h3 className="text-xl font-cinzel font-bold mb-2 text-slate-200 group-hover:text-amber-400 transition-colors">{item.title}</h3>
                  <p className="text-sm font-bold text-purple-400/80 mb-3 tracking-wider uppercase text-xs">{item.subtitle}</p>
                  <p className="text-sm leading-relaxed text-slate-400 group-hover:text-slate-300">{item.description}</p>
                </motion.div>
              </AnimateOnView>
            ))}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="max-w-6xl mx-auto px-4 mb-4 mt-16">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
      </div>

      {/* ========================================
          5. CHRONICLES & PROOF BLOCK
          ======================================== */}
      <div id="milestones-title" className="relative space-y-32 pb-32 pt-20">
        {/* Hero Section */}
        <section className="text-center px-4 relative z-10 mt-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-md text-amber-300 text-xs font-cinzel font-bold tracking-widest uppercase"
            >
              <History size={14} className="animate-pulse" />
              Chronicles of Aura
            </motion.div>


            {/* Chronicles Section (full from About page) */}
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
                    {chronicles.map((item, idx) => (
                      <AnimateOnView key={idx} animation={idx % 2 === 0 ? "a-slide-left" : "a-slide-right"} threshold={0.2} once>
                        <div className={`relative flex items-center md:justify-between group ${idx % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                          {/* Node */}
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
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl sm:text-7xl font-cinzel font-bold leading-tight text-white"
            >
              Clan <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Milestones</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-300 max-w-2xl mx-auto font-lato leading-relaxed"
            >
              Retracing the steps of our legend. From the first spark to the grand expansion, every moment is a beacon in our digital saga.
            </motion.p>
          </div>
        </section>

        {/* Legacy Stone Section */}
        <LegacyStone />

        {/* Timeline Section */}
        <section className="px-4 relative z-10">
          <div className="max-w-5xl mx-auto space-y-16">
            {milestones.map((milestone, i) => (
              <AnimateOnView key={i} animation={i % 2 === 0 ? "a-slide-right" : "a-slide-left"}>
                <div className={`flex flex-col md:flex-row gap-8 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Date Bubble */}
                  <div className="flex-shrink-0 w-32 h-32 rounded-full border-2 border-white/10 bg-slate-900/50 backdrop-blur-xl flex flex-col items-center justify-center text-center p-4 relative group">
                    <div className="absolute inset-0 bg-amber-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                    <span className="text-[10px] uppercase font-black text-amber-500 tracking-[0.2em] mb-1">{milestone.category}</span>
                    <span className="text-xs font-cinzel font-bold text-white leading-tight">{milestone.date}</span>
                  </div>

                  {/* Content Card */}
                  <div className="flex-grow p-8 rounded-[2rem] border border-white/10 bg-slate-950/40 backdrop-blur-2xl hover:border-amber-500/30 transition-all duration-500 relative group overflow-hidden flex flex-col gap-6">
                    {(milestone as any).image && (
                      <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden border border-white/5 relative">
                        <img
                          src={(milestone as any).image}
                          alt={milestone.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all duration-500">
                          {milestone.icon}
                        </div>
                        <h3 className="text-2xl font-cinzel font-bold text-white group-hover:text-amber-400 transition-colors">
                          {milestone.title}
                        </h3>
                      </div>
                      <p className="text-slate-400 font-lato leading-relaxed max-w-xl">
                        {milestone.description}
                      </p>
                    </div>

                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                      {React.cloneElement(milestone.icon as React.ReactElement, { size: 100 })}
                    </div>
                  </div>
                </div>
              </AnimateOnView>
            ))}
          </div>
        </section>

        {/* Spark Phase Section */}
        <section className="px-4 relative z-10 py-20 border-t border-white/5">
          <div className="max-w-6xl mx-auto text-center space-y-12">
            <AnimateOnView animation="a-fade-up">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-cinzel font-bold text-white">
                  The Spark Phase <span className="text-amber-500">of Aura</span>
                </h2>
                <p className="text-slate-400 font-lato max-w-2xl mx-auto uppercase tracking-widest text-xs font-bold">
                  Witness the ignition of our digital legacy through the sacred archives.
                </p>
              </div>
            </AnimateOnView>

            {/* Interactive Frame */}
            <div className="relative aspect-[4/5] md:aspect-[21/9] w-full max-w-5xl mx-auto rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-slate-900 shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 group">
              <AnimatePresence mode="wait">
                {sparkIndex !== null ? (
                  <motion.div
                    key={sparkPhaseItems[sparkIndex].id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col md:block"
                  >
                    <div className="h-[40%] md:h-full w-full relative overflow-hidden">
                      <img
                        src={sparkPhaseItems[sparkIndex].image}
                        className="w-full h-full object-cover opacity-90 md:opacity-60 transition-transform duration-[20s] ease-linear"
                        alt={sparkPhaseItems[sparkIndex].title}
                        style={{ transform: isPlaying ? 'scale(1.2)' : 'scale(1)' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-t md:from-black md:via-transparent md:to-transparent" />
                    </div>

                    <div className="flex-grow md:absolute md:inset-x-0 md:bottom-0 p-6 md:p-12 text-left flex flex-col justify-center space-y-3 md:space-y-4 bg-slate-900/80 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-t border-white/5 md:border-none">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-3 text-amber-500 text-[10px] md:text-xs font-black tracking-[0.3em] md:tracking-[0.4em] uppercase"
                      >
                        <Calendar size={12} />
                        {sparkPhaseItems[sparkIndex].date}
                      </motion.div>
                      <motion.h3
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl md:text-5xl lg:text-6xl font-black text-white font-cinzel leading-tight md:leading-none"
                      >
                        {sparkPhaseItems[sparkIndex].title}
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-slate-300 text-sm md:text-lg max-w-xl font-light line-clamp-4 md:line-clamp-none leading-relaxed"
                      >
                        {sparkPhaseItems[sparkIndex].description}
                      </motion.p>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 h-1 md:h-1.5 bg-amber-500/10 w-full overflow-hidden">
                      <motion.div
                        key={sparkIndex}
                        initial={{ width: "0%" }}
                        animate={{ width: isPlaying ? "100%" : "0%" }}
                        transition={{ duration: isPlaying ? 4 : 0, ease: "linear" }}
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_20px_rgba(245,158,11,1)]"
                      />
                    </div>

                    {/* Manual Navigation Buttons */}
                    <div className="absolute top-[20%] md:inset-y-0 left-0 flex items-center pl-2 md:pl-6 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSparkIndex(prev => prev !== null ? (prev > 0 ? prev - 1 : sparkPhaseItems.length - 1) : 0);
                          setIsPlaying(false);
                        }}
                        className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/60 border border-white/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-amber-500/30 hover:border-amber-500/50 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 transform active:scale-90 shadow-2xl"
                        title="Previous Milestone"
                      >
                        <ChevronLeft size={20} className="md:w-7 md:h-7" />
                      </button>
                    </div>
                    <div className="absolute top-[20%] md:inset-y-0 right-0 flex items-center pr-2 md:pr-6 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSparkIndex(prev => prev !== null ? (prev < sparkPhaseItems.length - 1 ? prev + 1 : 0) : 0);
                          setIsPlaying(false);
                        }}
                        className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-black/60 border border-white/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-amber-500/30 hover:border-amber-500/50 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 transform active:scale-90 shadow-2xl"
                        title="Next Milestone"
                      >
                        <ChevronRight size={20} className="md:w-7 md:h-7" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center space-y-6 md:space-y-8 bg-slate-950/80 backdrop-blur-xl"
                  >
                    <div className="relative group/btn">
                      <div className="absolute -inset-10 bg-amber-500/20 blur-3xl rounded-full animate-pulse group-hover/btn:bg-amber-500/30 transition-colors" />
                      <button
                        onClick={startSparkPhase}
                        className="relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-500 hover:scale-110 hover:bg-amber-500/20 hover:border-amber-500 transition-all duration-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                      >
                        <Play size={28} fill="currentColor" className="ml-1 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                    <div className="space-y-3 px-6 text-center">
                      <span className="block text-xl md:text-2xl font-cinzel font-bold text-white tracking-tight">Initialize Archive Link</span>
                      <span className="block text-amber-500/50 text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase font-black">Decrypting Aura Origins</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="max-w-6xl mx-auto px-4 my-16">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
        </div>

        {/* ========================================
          6. CLOSING CTA SECTION
          ======================================== */}
        <section className="px-4 py-20">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative p-10 sm:p-20 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-slate-900/90 to-black/90 backdrop-blur-xl overflow-hidden text-center shadow-2xl">

              <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[100px] bg-amber-600/10 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[80px] bg-purple-600/10"></div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative z-10 space-y-8">
                <h2 className="text-3xl sm:text-5xl font-cinzel font-bold text-white">
                  Heed the Call to Adventure
                </h2>
                <p className="max-w-2xl mx-auto text-slate-300 text-lg">
                  The portal is open. Join our ranks to forge new realities and attain eternal glory in the archives of the web.
                </p>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/about"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-cinzel font-bold tracking-wider rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all">
                  Let the Journey Begin
                  <Sparkles size={18} />
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}