import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Star, Trophy, Target, Sparkles, Calendar, ChevronRight, ChevronLeft, Play, FastForward, History, X, Shield, Zap, Clock } from 'lucide-react';
import AnimateOnView from '../components/AnimateOnView';

const milestones = [
    // {
    //     date: 'September 08, 2025',
    //     title: 'The First Spark',
    //     description: 'Aura-7F become master clan of Byte Bash Blitz.',
    //     image: 'https://i.postimg.cc/FF0XswXt/Screenshot-(383).png',
    //     icon: <Target className="text-amber-400" />,
    //     category: 'Origin'
    // },
    // {
    //     date: 'October 06, 2025',
    //     title: 'Halfway to a Thousand',
    //     description: 'A proof of unity, effort, and momentum. The climb continues toward the thousand.',
    //     image: 'https://i.postimg.cc/Gh9Pjn38/Whats-App-Image-2026-01-30-at-10-30-11-PM.jpg',
    //     icon: <Star className="text-blue-400" />,
    //     category: 'Growth'
    // },
    // {
    //     date: 'October 2025',
    //     title: 'Pointzilla',
    //     description: 'With 100+ already crushed under its claws, Pointzilla reigns supreme at the top — loud, unstoppable, and hilariously hungry for more!.',
    //     image: 'https://i.postimg.cc/W3Y4SKS5/Whats-App-Image-2026-01-30-at-10-32-42-PM.jpg',
    //     icon: <Sparkles className="text-purple-400" />,
    //     category: 'Achievement'
    // },
    // {
    //     date: 'November 25, 2025',
    //     title: 'Thousand Echoes of Victory',
    //     description: 'This is more than a milestone; it’s the mark of legends.',
    //     image: 'https://i.postimg.cc/dt8WCK5s/Whats-App-Image-2026-01-30-at-10-34-35-PM.jpg',
    //     icon: <Trophy className="text-cyan-400" />,
    //     category: 'Legacy'
    // },
    // {
    //     date: 'Aura 7F',
    //     title: 'Honor Stone',
    //     description: 'Clan achieves a high rank in a leaderboard or external competition.',
    //     icon: <Shield className="text-amber-400" />,
    //     category: 'Honor'
    // },
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
        description: 'This is more than a milestone; it’s the mark of legends'
    },
    // {
    //     id: 5,
    //     date: 'December 14, 2025',
    //     title: 'Honor Stone',
    //     description: 'Clan achieves a high rank in a leaderboard or external competition.'
    // },
    // {
    //     id: 6,
    //     date: 'December 20, 2025',
    //     title: 'Valor Stone',
    //     description: 'Clan members collectively win a set number of battles or challenges. Shainya stands as the first basher to conquer Sapphire, Ruby, and Emerald leagues.'
    // }
];

const LEGACY_START_DATE = new Date('2025-09-08T00:00:00');

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
                        {/* Energy Background */}
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

export default function Milestones() {
    const [sparkIndex, setSparkIndex] = useState<number | null>(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const startSparkPhase = () => {
        setSparkIndex(0);
        setIsPlaying(true);
    };

    useEffect(() => {
        let timer: any;
        if (isPlaying && sparkIndex !== null) {
            if (sparkIndex < sparkPhaseItems.length - 1) {
                timer = setTimeout(() => {
                    setSparkIndex(sparkIndex + 1);
                }, 4000); // 4 seconds per slide
            } else {
                timer = setTimeout(() => {
                    setIsPlaying(false);
                    setSparkIndex(null);
                }, 4000);
            }
        }
        return () => clearTimeout(timer);
    }, [isPlaying, sparkIndex]);

    return (
        <div id="milestones-title" className="relative space-y-32 pb-32 pt-20">
            {/* Hero Section */}
            <section className="text-center px-4 relative z-10">
                <div className="max-w-4xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-md text-amber-300 text-xs font-cinzel font-bold tracking-widest uppercase"
                    >
                        <History size={14} className="animate-pulse" />
                        Chronicles of Aura
                    </motion.div>

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

            {/* Spark Phase of Aura - Special Interactive Section */}
            <section className="px-4 relative z-10 pt-20 border-t border-white/5">
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

                                    {/* Manual Navigation Buttons - repositioned for stacked layout visibility */}
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

                    {/* Manual Controls - visible while sequence is active */}
                    {/* {sparkIndex !== null && (
                        <div className="flex flex-col items-center gap-6 pt-6">
                            <div className="flex items-center justify-center gap-8 px-8 py-3 rounded-full bg-slate-900/50 border border-white/5 backdrop-blur-md shadow-2xl">
                                <button
                                    onClick={() => {
                                        setIsPlaying(false);
                                        setSparkIndex(null);
                                    }}
                                    className="text-slate-500 hover:text-red-500 transition-colors group flex items-center gap-2"
                                    title="Stop Archive"
                                >
                                    <X size={18} />
                                    <span className="text-[10px] font-black tracking-widest uppercase">Terminate</span>
                                </button>

                                <div className="w-[1px] h-4 bg-white/10" />

                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="flex items-center gap-3 text-amber-500 hover:text-amber-400 transition-all transform hover:scale-105"
                                >
                                    {isPlaying ? (
                                        <>
                                            <div className="w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/5">
                                                <div className="flex gap-1">
                                                    <div className="w-1 h-3 bg-amber-500 rounded-full" />
                                                    <div className="w-1 h-3 bg-amber-500 rounded-full" />
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black tracking-widest uppercase">Pause Archive</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-8 h-8 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/5">
                                                <Play size={14} fill="currentColor" className="ml-0.5" />
                                            </div>
                                            <span className="text-[10px] font-black tracking-widest uppercase">Resume Archive</span>
                                        </>
                                    )}
                                </button>

                                <div className="w-[1px] h-4 bg-white/10" />

                                <div className="flex gap-2">
                                    {sparkPhaseItems.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setSparkIndex(i);
                                                setIsPlaying(false); // Pause when manually selecting
                                            }}
                                            className={`w-2 h-2 rounded-full transition-all duration-500 ${sparkIndex === i ? 'bg-amber-500 w-6' : 'bg-white/10 hover:bg-white/20'}`}
                                        />
                                    ))}
                                </div>
                            </div> */}

                    {/* {!isPlaying && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[10px] text-amber-500/50 font-black tracking-[0.3em] uppercase animate-pulse"
                                >
                                    Archive Suspended - Manual Control Active
                                </motion.p> */}

                    {/* </div> */}
                    {/* )} */}
                </div>
            </section>
        </div>
    );
}
