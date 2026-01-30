import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Star, Trophy, Target, Sparkles, Calendar, ChevronRight, Play, FastForward, History } from 'lucide-react';
import AnimateOnView from '../components/AnimateOnView';

const milestones = [
    {
        date: 'October 2024',
        title: 'The Foundation',
        description: 'Aura-7F was born from a vision to unite the most creative minds in the digital space.',
        icon: <Target className="text-amber-400" />,
        category: 'Origin'
    },
    {
        date: 'December 2024',
        title: 'First 10 Members',
        description: 'The fellowship grew as we recruited our first wave of talented developers and designers.',
        icon: <Star className="text-blue-400" />,
        category: 'Growth'
    },
    {
        date: 'January 2025',
        title: 'Major Project Launch',
        description: 'Launch of our first collaborative platform, setting the stage for future chronicles.',
        icon: <Trophy className="text-purple-400" />,
        category: 'Legacy'
    },
    {
        date: 'February 2025',
        title: 'Nexus Expansion',
        description: 'Expansion beyond local borders, connecting with the wider digital ecosystem.',
        icon: <Sparkles className="text-cyan-400" />,
        category: 'Growth'
    }
];

const sparkPhaseItems = [
    {
        id: 1,
        image: 'https://i.postimg.cc/qR7FQbv1/Whats-App-Image-2026-01-30-at-3-26-06-PM.jpg',
        date: 'Nov 12, 2024',
        title: 'The First Spark',
        description: 'The initial meeting where the concept of Aura was first ignited.'
    },
    {
        id: 2,
        image: 'https://i.postimg.cc/FsPVVrLz/Whats-App-Image-2026-01-30-at-3-27-21-PM.jpg',
        date: 'Nov 25, 2024',
        title: 'Gathering the Core',
        description: 'The core team members joined forces to build the foundation.'
    },
    {
        id: 3,
        image: 'https://i.postimg.cc/Kz682gwZ/Whats-App-Image-2026-01-30-at-3-23-33-PM.jpg',
        date: 'Dec 05, 2024',
        title: 'Drafting the Lore',
        description: 'Defining our values, mission, and the legendary path ahead.'
    },
    {
        id: 4,
        image: 'https://i.postimg.cc/sXLv2gHx/Whats-App-Image-2026-01-30-at-3-25-43-PM.jpg',
        date: 'Dec 15, 2024',
        title: 'System Ignition',
        description: 'The first successful deployment of our collaborative infrastructure.'
    }
];

export default function Milestones() {
    const [sparkIndex, setSparkIndex] = useState<number | null>(null);
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
                                <div className="flex-grow p-8 rounded-[2rem] border border-white/10 bg-slate-950/40 backdrop-blur-2xl hover:border-amber-500/30 transition-all duration-500 relative group overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        {React.cloneElement(milestone.icon as React.ReactElement, { size: 100 })}
                                    </div>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
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
                    <div className="relative aspect-[21/9] w-full max-w-5xl mx-auto rounded-[3rem] overflow-hidden bg-slate-900 shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 group">
                        <AnimatePresence mode="wait">
                            {sparkIndex !== null ? (
                                <motion.div
                                    key={sparkPhaseItems[sparkIndex].id}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 1, ease: "easeInOut" }}
                                    className="absolute inset-0"
                                >
                                    <img
                                        src={sparkPhaseItems[sparkIndex].image}
                                        className="w-full h-full object-cover opacity-60"
                                        alt={sparkPhaseItems[sparkIndex].title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                                    <div className="absolute bottom-12 left-12 right-12 text-left space-y-4">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="flex items-center gap-3 text-amber-500 text-xs font-black tracking-[0.4em] uppercase"
                                        >
                                            <Calendar size={14} />
                                            {sparkPhaseItems[sparkIndex].date}
                                        </motion.div>
                                        <motion.h3
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className="text-4xl md:text-6xl font-black text-white font-cinzel leading-none"
                                        >
                                            {sparkPhaseItems[sparkIndex].title}
                                        </motion.h3>
                                        <motion.p
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.7 }}
                                            className="text-slate-300 text-lg max-w-xl font-light"
                                        >
                                            {sparkPhaseItems[sparkIndex].description}
                                        </motion.p>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="absolute bottom-0 left-0 h-1 bg-amber-500/30 w-full overflow-hidden">
                                        <motion.div
                                            key={sparkIndex}
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 4, ease: "linear" }}
                                            className="h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]"
                                        />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center space-y-8 bg-black/40 backdrop-blur-sm"
                                >
                                    <div className="relative">
                                        <div className="absolute -inset-8 bg-amber-500/20 blur-3xl rounded-full animate-pulse" />
                                        <button
                                            onClick={startSparkPhase}
                                            className="relative z-10 w-24 h-24 rounded-full border-2 border-amber-500/50 bg-amber-500/10 flex items-center justify-center text-amber-500 hover:scale-110 hover:bg-amber-500/20 hover:border-amber-500 transition-all duration-500 group"
                                        >
                                            <Play size={32} fill="currentColor" className="ml-1 group-hover:scale-110 transition-transform" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="block text-2xl font-cinzel font-bold text-white">Initialize Archive Link</span>
                                        <span className="block text-slate-500 text-[10px] tracking-[0.4em] uppercase font-black">Decrypting Aura Origins</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Manual Controls - visible while sequence is active */}
                    {sparkIndex !== null && (
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
                            </div>

                            {!isPlaying && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[10px] text-amber-500/50 font-black tracking-[0.3em] uppercase animate-pulse"
                                >
                                    Archive Suspended - Manual Control Active
                                </motion.p>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
