import React from 'react';
import AnimateOnView from '../components/AnimateOnView';
import { Boxes } from '../components/ui/background-boxes';
import { Code, ExternalLink, Github, Layout, Server, Database, Globe } from 'lucide-react';

const projects = [
    {
        title: 'Bash Ballot',
        description: 'Platform for voting and managing elections for all the bash clans.',
        tags: ['React', 'Python', 'MYSQL'],
        icon: <Globe className="text-amber-400" />,
        link: '',
        github: 'https://github.com/Byte-Bash-Blitz/Bash-Ballot'
    },
    {
        title: 'Social x',
        description: 'Social media platform with stories and posts features.',
        tags: ['React', 'Python', 'MYSQL'],
        icon: <Globe className="text-amber-400" />,
        link: '',
        github: 'https://github.com/lifnanshijo/socialix'
    },
    {
        title: 'Beelert',
        description: 'A custom bot for discord that work like an ai, reminder and track the members time spending in the server.',
        tags: ['Node.js', 'Supabase'],
        icon: <Layout className="text-purple-400" />,
        link: '#',
        github: 'https://github.com/Lethinkj/BeeLert'
    },
    {
        title: 'Eventify',
        description: 'A website for a event registration and tracking system.',
        tags: ['React', 'Node.js', 'Supabase'],
        icon: <Server className="text-cyan-400" />,
        link: '#',
        github: 'https://github.com/shaniya-v/church-registration'
    },
    {
        title: 'Aura Chat',
        description: 'Website for socializing with friends and chill with spotify and mimick youtube shorts.',
        tags: ['React', 'Python', 'MYSQL', 'Tailwind CSS', 'APIs'],
        icon: <Globe className="text-amber-400" />,
        link: '#',
        github: 'https://github.com/AnitusA/Aurachat'
    },
    {
        title: 'Bash x Code',
        description: 'A coding platform for learning and practicing coding.',
        tags: ['React', 'Node.js', 'Supabase'],
        icon: <Layout className="text-purple-400" />,
        link: '#',
        github: 'https://github.com/Lethinkj/BashXCode'
    },
];

import { AuraParticles } from '../components/ui/aura-particles';
import { motion } from 'framer-motion';

export default function Projects() {
    return (
        <div id="projects-title" className="relative space-y-24 pb-8 overflow-hidden min-h-screen">

            {/* Aesthetic Animated Background */}
            <AuraParticles />

            {/* Hero Section */}
            <section className="text-center px-4 pt-16 relative z-10">
                <div className="max-w-4xl mx-auto space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-md text-amber-300 text-xs font-cinzel font-bold tracking-widest uppercase"
                    >
                        <Code size={14} className="animate-pulse" />
                        Quest Archives
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl sm:text-6xl md:text-7xl font-cinzel font-bold leading-tight text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                    >
                        Clan <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Projects</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-300 max-w-2xl mx-auto font-lato leading-relaxed drop-shadow-md"
                    >
                        Witness the artifacts forged in our digital fire. Each entry represents a saga completed and a legend etched into the grand ledger.
                    </motion.p>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="px-4 relative z-10 pb-32">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {projects.map((project, i) => (
                        <AnimateOnView key={i} animation="a-fade-up" style={{ transitionDelay: `${i * 100}ms` }}>
                            <div className="group relative h-full flex flex-col p-[1px] rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-transparent hover:from-amber-500/30 transition-all duration-500">
                                <div className="flex-grow p-8 rounded-[23px] bg-slate-950/80 backdrop-blur-xl flex flex-col items-start gap-4">
                                    <div className="w-16 h-16 flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 mb-2 group-hover:scale-110 group-hover:bg-amber-500/10 transition-all duration-500 shadow-xl group-hover:shadow-amber-500/20">
                                        <div className="scale-125">{project.icon}</div>
                                    </div>

                                    <h3 className="text-2xl font-cinzel font-bold text-white group-hover:text-amber-400 transition-colors">
                                        {project.title}
                                    </h3>

                                    <p className="text-slate-400 font-lato text-[0.95rem] leading-relaxed line-clamp-3">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {project.tags.map(tag => (
                                            <span key={tag} className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md bg-white/5 text-amber-200/60 border border-white/10">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Project Footer with GitHub Link in Bottom Right */}
                                    <div className="absolute bottom-6 right-6 z-20">
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-amber-500/20 hover:border-amber-500/50 transition-all duration-300 group/github shadow-lg backdrop-blur-md"
                                            title="View Source on GitHub"
                                        >
                                            <Github size={20} className="group-hover/github:scale-110 transition-transform" />
                                        </a>
                                    </div>
                                </div>

                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 z-[-1] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_var(--mouse-x)_var(--mouse-y),rgba(245,158,11,0.15),transparent_40%)]"
                                    style={{
                                        // @ts-ignore
                                        '--mouse-x': '50%',
                                        '--mouse-y': '50%'
                                    }}
                                />
                            </div>
                        </AnimateOnView>
                    ))}
                </div>
            </section>
        </div>
    );
}
