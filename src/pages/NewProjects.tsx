import React from 'react';
import FantasyNavbar from '../components/FantasyNavbar';
import { Github, Code, Sparkles, Globe, Layout, Server } from 'lucide-react';
import { projects } from './Projects'; // We can safely import the projects data from the old file

export default function NewProjects() {
    return (
        <div className="relative min-h-screen w-full bg-[#0d1117] font-sans overflow-x-hidden selection:bg-amber-400 selection:text-black">
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
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-900/15 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px]"></div>
            </div>

            <FantasyNavbar />

            <div className="relative z-10 w-full max-w-7xl mx-auto pt-44 pb-24 px-4 md:px-8">

                {/* Board / Title */}
                <div className="flex flex-col items-center justify-center mb-16 space-y-4">
                    {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-cinzel text-sm font-bold tracking-widest uppercase">
                        <Sparkles size={16} />
                        <span>Guild Projects</span>
                    </div> */}
                    <h1 className="text-4xl md:text-6xl text-white font-cinzel font-bold tracking-wider text-center drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                        PROJECT <span className="text-amber-500">VAULT</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl text-center font-lato">
                        Witness the artifacts forged in our digital fire. Each entry represents a saga completed and a legend etched into the grand ledger.
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, idx) => (
                        <div
                            key={idx}
                            className="group relative p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-sm transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:border-amber-500/40 hover:-translate-y-2 flex flex-col h-full overflow-hidden"
                        >
                            {/* Ambient glow inside card */}
                            <div className="absolute -left-20 -top-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all duration-500 z-0"></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="w-16 h-16 flex items-center justify-center rounded-2xl border border-white/10 bg-black/50 mb-6 group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all duration-500 shadow-inner group-hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                    <div className="scale-125 opacity-80 group-hover:opacity-100 transition-opacity">
                                        {/* Render icons directly to ensure they work in this context or fallback */}
                                        {project.title.toLowerCase().includes('social') || project.title.toLowerCase().includes('bash ballot') || project.title.toLowerCase().includes('aura chat') ? <Globe className="text-amber-400" /> :
                                            project.title.toLowerCase().includes('bash x code') || project.title.toLowerCase().includes('beelert') ? <Layout className="text-purple-400" /> :
                                                <Server className="text-cyan-400" />}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-cinzel font-bold text-slate-200 group-hover:text-amber-400 mb-4 transition-colors tracking-wide">
                                    {project.title}
                                </h3>

                                <p className="text-slate-400 font-lato text-sm leading-relaxed mb-8 flex-1">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded bg-black/40 text-amber-200/50 border border-white/5 group-hover:border-amber-500/20 group-hover:text-amber-200/80 transition-colors">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-xs font-cinzel text-slate-500 tracking-wider uppercase group-hover:text-amber-500/50 transition-colors">
                                        Status: <span className="text-slate-400 group-hover:text-amber-400">Deployed</span>
                                    </span>

                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-black/50 border border-white/10 text-slate-400 hover:text-black hover:bg-amber-400 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all duration-300 transform hover:scale-105"
                                        title="View Source on GitHub"
                                    >
                                        <Github size={18} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
