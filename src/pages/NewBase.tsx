import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { projects } from './Projects';
import ProfileModal from '../components/ProfileModal';
import SettingsModal from '../components/SettingsModal';
import DiscordLoginModal from '../components/DiscordLoginModal';

export default function NewBase() {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showDiscordLogin, setShowDiscordLogin] = useState(false);

    // Background Video Audio State (Must start at 0 to pass browser autoplay policies)
    const [volume, setVolume] = useState(0);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
            videoRef.current.muted = volume === 0;

            // Force play promise recovery in case the browser paused it when re-rendering
            videoRef.current.play().catch(() => { });
        }
    }, [volume]);

    return (
        <>
            <div className="relative font-sans select-none overflow-hidden w-screen h-[100dvh] portrait:w-[100dvh] portrait:h-[100dvw] portrait:origin-top-left portrait:rotate-90 portrait:translate-x-[100dvw]">
                {/* Background Video */}
                <div className="absolute inset-0 w-full h-full -z-10 bg-black">
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted // starts muted for autoplay policy, will be unmuted explicitly on slider change
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/Barbarian_king_statue_medieval_v…_202608151654.mp4" type="video/mp4" />
                    </video>
                </div>

                {/* Top Left Action Button - Profile */}
                <div className="absolute -top-[110px] -left-[15px] z-50 w-[300px] h-[300px] flex items-center justify-center pointer-events-none scale-[0.6] sm:scale-[0.75] md:scale-90 lg:scale-100 origin-top-left transition-transform">
                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="relative w-[160px] h-[160px] rounded-full pointer-events-auto flex items-center justify-center group"
                    >
                        {/* Ambient glow ring - always visible */}
                        <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl scale-125 group-hover:bg-amber-400/50 group-hover:scale-150 transition-all duration-500" />
                        {/* Outer golden ring pulse on hover */}
                        <div className="absolute inset-[-6px] rounded-full border-[3px] border-amber-400/0 group-hover:border-amber-400/70 group-hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] transition-all duration-300" />
                        <img src="/profile.png" alt="Profile"
                            className="absolute w-[300px] h-[300px] max-w-none object-contain pointer-events-none drop-shadow-2xl
                                   transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_30px_rgba(251,191,36,0.7)] group-active:scale-95 group-active:translate-y-2" />
                    </button>
                </div>

                {/* Left Side Action Buttons - Events */}
                <div className="absolute -bottom-[70px] -left-[80px] z-50 w-[300px] h-[300px] flex items-center justify-center pointer-events-none scale-[0.6] sm:scale-[0.75] md:scale-90 lg:scale-100 origin-bottom-left transition-transform">
                    <Link
                        to="/events"
                        className="relative w-[160px] h-[160px] rounded-full pointer-events-auto inline-flex items-center justify-center group"
                    >
                        {/* Ambient glow ring */}
                        <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl scale-125 group-hover:bg-blue-400/50 group-hover:scale-150 transition-all duration-500" />
                        <div className="absolute inset-[-6px] rounded-full border-[3px] border-blue-400/0 group-hover:border-blue-400/70 group-hover:shadow-[0_0_25px_rgba(96,165,250,0.6)] transition-all duration-300" />
                        <img src="/events.png" alt="Events"
                            className="absolute w-[300px] h-[300px] max-w-none object-contain pointer-events-none drop-shadow-2xl
                                   transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_30px_rgba(96,165,250,0.7)] group-active:scale-95 group-active:translate-y-2" />
                    </Link>
                </div>

                {/* Top Right Action Button - Projects */}
                <div className="absolute -top-[80px] -right-[80px] z-50 w-[300px] h-[300px] flex items-center justify-center pointer-events-none scale-[0.6] sm:scale-[0.75] md:scale-90 lg:scale-100 origin-top-right transition-transform">
                    <button
                        onClick={() => setIsProjectsOpen(true)}
                        className="relative w-[160px] h-[160px] rounded-full pointer-events-auto flex items-center justify-center group"
                    >
                        {/* Amber glow ring */}
                        <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl scale-125 group-hover:bg-amber-500/50 group-hover:scale-150 transition-all duration-500" />
                        <div className="absolute inset-[-6px] rounded-full border-[3px] border-amber-500/0 group-hover:border-amber-500/70 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all duration-300" />
                        <img src="/projects.png" alt="Projects"
                            className="absolute w-[300px] h-[300px] max-w-none object-contain pointer-events-none drop-shadow-2xl
                                   transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_30px_rgba(245,158,11,0.7)] group-active:scale-95 group-active:translate-y-2" />
                    </button>
                </div>

                {/* Settings Button */}
                <div className="absolute bottom-[30px] -right-[50px] z-50 w-[300px] h-[300px] flex items-center justify-center pointer-events-none scale-[0.5] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.8] origin-right transition-transform">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="relative w-[160px] h-[160px] rounded-full pointer-events-auto flex items-center justify-center group"
                    >
                        {/* Subtle gray glow */}
                        <div className="absolute inset-0 rounded-full bg-slate-400/10 blur-xl scale-125 group-hover:bg-slate-300/30 group-hover:scale-150 transition-all duration-500" />
                        <div className="absolute inset-[-6px] rounded-full border-[3px] border-slate-300/0 group-hover:border-slate-300/60 group-hover:shadow-[0_0_20px_rgba(200,200,200,0.4)] transition-all duration-300" />
                        <img src="/settings.png" alt="Settings"
                            className="absolute w-[300px] h-[300px] max-w-none object-contain pointer-events-none drop-shadow-2xl
                                   transition-all duration-300 group-hover:scale-105 group-hover:rotate-12 group-hover:drop-shadow-[0_0_20px_rgba(200,200,200,0.5)] group-active:scale-95 group-active:translate-y-2" />
                    </button>
                </div>

                {/* Right Side Action Buttons - Gallery */}
                <div className="absolute -bottom-[70px] -right-[80px] z-50 w-[300px] h-[300px] flex items-center justify-center pointer-events-none scale-[0.6] sm:scale-[0.75] md:scale-90 lg:scale-100 origin-bottom-right transition-transform">
                    <button
                        onClick={() => setIsGalleryOpen(true)}
                        className="relative w-[160px] h-[160px] rounded-full pointer-events-auto flex items-center justify-center group"
                    >
                        {/* Purple/gem glow ring */}
                        <div className="absolute inset-0 rounded-full bg-purple-400/20 blur-xl scale-125 group-hover:bg-purple-400/50 group-hover:scale-150 transition-all duration-500" />
                        <div className="absolute inset-[-6px] rounded-full border-[3px] border-purple-400/0 group-hover:border-purple-400/70 group-hover:shadow-[0_0_25px_rgba(192,132,252,0.6)] transition-all duration-300" />
                        <img src="/gallerybutton.png" alt="Gallery"
                            className="absolute w-[300px] h-[300px] max-w-none object-contain pointer-events-none drop-shadow-2xl
                                   transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_30px_rgba(192,132,252,0.7)] group-active:scale-95 group-active:translate-y-2" />
                    </button>
                </div>

                {/* Gallery Popup Modal */}
                {isGalleryOpen && (
                    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4 font-sans">

                        {/* The CoC Info Style rounded beige panel */}
                        <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-gradient-to-b from-[#f2efcd] via-[#e8e4c1] to-[#d6d1ab] border-[4px] border-[#362f28] rounded-2xl shadow-[inset_0_4px_0_rgba(255,255,255,0.8),inset_0_-4px_0_rgba(0,0,0,0.1),0_20px_40px_rgba(0,0,0,0.8)] pt-3 pb-6 px-4 sm:px-6">

                            {/* Top Header Buttons & Title */}
                            <div className="relative flex justify-center items-center w-full mb-4 shrink-0">

                                {/* Left Green Back Button */}
                                <button
                                    onClick={() => setIsGalleryOpen(false)}
                                    className="absolute left-0 top-0 w-[60px] h-[50px] bg-gradient-to-b from-[#a4f542] via-[#7ae000] to-[#468200] border-[3px] border-[#1f4a00] rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center active:translate-y-1 active:shadow-none transition-all group overflow-hidden z-50"
                                >
                                    {/* Glossy top overlay matching the CoC aesthetic */}
                                    <div className="absolute top-[1.5px] left-[3px] right-[3px] h-[38%] bg-gradient-to-b from-white/70 to-white/10 rounded-t-lg rounded-b-xl pointer-events-none group-active:opacity-80 transition-opacity"></div>

                                    {/* Custom Solid Block Arrow SVG */}
                                    <svg className="relative z-10 w-8 h-8 text-white mt-0.5 pr-0.5" style={{ filter: 'drop-shadow(0px 2px 1px rgba(0,0,0,0.6))' }} viewBox="0 0 24 24" fill="white" stroke="#103000" strokeWidth="2" strokeLinejoin="round">
                                        <path d="M11 5 L3 12 L11 19 V15 H20 V9 H11 Z" />
                                    </svg>
                                </button>

                                {/* Center Title */}
                                <h2 className="text-xl sm:text-3xl text-white tracking-widest mt-1"
                                    style={{ fontFamily: '"Titan One", sans-serif', WebkitTextStroke: '2px #000', textShadow: '0 3px 0 #1b120c, 0 4px 6px rgba(0,0,0,0.8)' }}>
                                    Gallery Vault
                                </h2>

                                {/* Right Red Close Button */}
                                <button
                                    onClick={() => setIsGalleryOpen(false)}
                                    className="absolute right-0 top-0 w-12 h-12 bg-gradient-to-b from-[#ff6b6b] via-[#cc0000] to-[#8a0000] border-[2.5px] border-[#4a0000] rounded-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center active:translate-y-1 active:shadow-none transition-all group overflow-hidden z-50"
                                >
                                    {/* Glossy top overlay (the classic Supercell highlight) */}
                                    <div className="absolute top-[1.5px] left-[3px] right-[3px] h-[38%] bg-gradient-to-b from-white/80 to-white/10 rounded-t-[6px] rounded-b-xl pointer-events-none group-active:opacity-80 transition-opacity"></div>

                                    {/* The X character */}
                                    <span
                                        className="relative z-10 text-white text-3xl leading-none mt-1"
                                        style={{ fontFamily: '"Titan One", sans-serif', WebkitTextStroke: '1.5px #3a0000', textShadow: '0 2px 1px rgba(0,0,0,0.6)' }}
                                    >
                                        X
                                    </span>
                                </button>
                            </div>

                            {/* Thin dark separator line */}
                            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#8a8069] to-transparent mb-5 shrink-0 opacity-50"></div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto w-full px-2">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                        <div key={i} className="w-full aspect-square bg-[#362f28]/10 border-[3px] border-[#362f28]/20 rounded-xl flex flex-col items-center justify-center shadow-[inset_0_3px_5px_rgba(0,0,0,0.1)] hover:bg-[#362f28]/15 transition-all cursor-pointer">
                                            <svg className="w-10 h-10 text-[#362f28]/30 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
                                            <span className="text-[#362f28] font-black opacity-40 text-sm font-sans uppercase">Artifact {i}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* Projects Popup Modal */}
                {isProjectsOpen && (
                    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4 font-sans">

                        {/* The CoC Info Style rounded beige panel */}
                        <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-gradient-to-b from-[#f2efcd] via-[#e8e4c1] to-[#d6d1ab] border-[4px] border-[#362f28] rounded-2xl shadow-[inset_0_4px_0_rgba(255,255,255,0.8),inset_0_-4px_0_rgba(0,0,0,0.1),0_20px_40px_rgba(0,0,0,0.8)] pt-3 pb-6 px-4 sm:px-6">

                            {/* Top Header Buttons & Title */}
                            <div className="relative flex justify-center items-center w-full mb-4 shrink-0">

                                {/* Left Green Back Button */}
                                <button
                                    onClick={() => setIsProjectsOpen(false)}
                                    className="absolute left-0 top-0 w-[60px] h-[50px] bg-gradient-to-b from-[#a4f542] via-[#7ae000] to-[#468200] border-[3px] border-[#1f4a00] rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center active:translate-y-1 active:shadow-none transition-all group overflow-hidden z-50"
                                >
                                    {/* Glossy top overlay matching the CoC aesthetic */}
                                    <div className="absolute top-[1.5px] left-[3px] right-[3px] h-[38%] bg-gradient-to-b from-white/70 to-white/10 rounded-t-lg rounded-b-xl pointer-events-none group-active:opacity-80 transition-opacity"></div>

                                    {/* Custom Solid Block Arrow SVG */}
                                    <svg className="relative z-10 w-8 h-8 text-white mt-0.5 pr-0.5" style={{ filter: 'drop-shadow(0px 2px 1px rgba(0,0,0,0.6))' }} viewBox="0 0 24 24" fill="white" stroke="#103000" strokeWidth="2" strokeLinejoin="round">
                                        <path d="M11 5 L3 12 L11 19 V15 H20 V9 H11 Z" />
                                    </svg>
                                </button>

                                {/* Center Title */}
                                <h2 className="text-xl sm:text-3xl text-white tracking-widest mt-1"
                                    style={{ fontFamily: '"Titan One", sans-serif', WebkitTextStroke: '2px #000', textShadow: '0 3px 0 #1b120c, 0 4px 6px rgba(0,0,0,0.8)' }}>
                                    Project Vault
                                </h2>

                                {/* Right Red Close Button */}
                                <button
                                    onClick={() => setIsProjectsOpen(false)}
                                    className="absolute right-0 top-0 w-12 h-12 bg-gradient-to-b from-[#ff6b6b] via-[#cc0000] to-[#8a0000] border-[2.5px] border-[#4a0000] rounded-[10px] shadow-[0_2px_4px_rgba(0,0,0,0.6)] flex items-center justify-center active:translate-y-1 active:shadow-none transition-all group overflow-hidden z-50"
                                >
                                    {/* Glossy top overlay (the classic Supercell highlight) */}
                                    <div className="absolute top-[1.5px] left-[3px] right-[3px] h-[38%] bg-gradient-to-b from-white/80 to-white/10 rounded-t-[6px] rounded-b-xl pointer-events-none group-active:opacity-80 transition-opacity"></div>

                                    {/* The X character */}
                                    <span
                                        className="relative z-10 text-white text-3xl leading-none mt-1"
                                        style={{ fontFamily: '"Titan One", sans-serif', WebkitTextStroke: '1.5px #3a0000', textShadow: '0 2px 1px rgba(0,0,0,0.6)' }}
                                    >
                                        X
                                    </span>
                                </button>
                            </div>

                            {/* Thin dark separator line */}
                            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#8a8069] to-transparent mb-5 shrink-0 opacity-50"></div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-y-auto w-full px-2 custom-scrollbar">
                                <div className="flex flex-col gap-4">
                                    {projects.map((project, i) => (
                                        <div key={i} className="w-full bg-[#362f28]/10 border-[3px] border-[#362f28]/20 rounded-xl p-4 flex flex-col md:flex-row gap-4 shadow-[inset_0_3px_5px_rgba(0,0,0,0.1)] hover:bg-[#362f28]/15 transition-all outline-none">

                                            {/* Project Info */}
                                            <div className="flex-1">
                                                <h4 className="font-black text-[#362f28] text-xl uppercase leading-tight mb-1" style={{ fontFamily: '"Titan One", sans-serif' }}>
                                                    {project.title}
                                                </h4>
                                                <p className="text-[#4a4237] font-bold text-sm leading-snug mb-3">
                                                    {project.description}
                                                </p>

                                                {/* Tags like CoC stats */}
                                                <div className="flex flex-wrap gap-2">
                                                    {project.tags.map(tag => (
                                                        <span key={tag} className="text-[10px] font-black uppercase tracking-wider px-2 py-1 bg-gradient-to-b from-[#a4f542] via-[#7ae000] to-[#468200] text-white rounded border-2 border-[#1f4a00] shadow-[0_2px_0_rgba(0,0,0,0.4)]" style={{ WebkitTextStroke: '0.5px #1f4a00' }}>
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="flex items-center justify-end md:items-end p-1">
                                                <a href={project.github} target="_blank" rel="noopener noreferrer"
                                                    className="bg-gradient-to-b from-[#3aafff] via-[#0088ff] to-[#0055a6] border-[2.5px] border-[#00224a] rounded-[10px] px-5 py-2.5 font-black text-white text-sm uppercase shadow-[0_3px_0_#00224a] active:translate-y-[3px] active:shadow-none transition-all group relative overflow-hidden"
                                                    style={{ fontFamily: '"Titan One", sans-serif', WebkitTextStroke: '1px #00224a', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.4))' }}>
                                                    {/* Glossy overlay */}
                                                    <div className="absolute top-[1.5px] left-[3px] right-[3px] h-[35%] bg-gradient-to-b from-white/70 to-white/10 rounded-t-[6px] rounded-b-xl pointer-events-none"></div>
                                                    <span className="relative z-10">Repo</span>
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* Profile Popup Modal */}
                {isProfileOpen && <ProfileModal onClose={() => setIsProfileOpen(false)} />}

                {/* Settings Popup Modal */}
                {isSettingsOpen && <SettingsModal
                    onClose={() => setIsSettingsOpen(false)}
                    volume={volume}
                    onVolumeChange={setVolume}
                    onLoginClick={() => setShowDiscordLogin(true)}
                />}

                {/* Discord Login Modal from Settings */}
                <DiscordLoginModal
                    isOpen={showDiscordLogin}
                    onClose={() => setShowDiscordLogin(false)}
                    onLoginSuccess={() => {
                        setShowDiscordLogin(false);
                        setIsSettingsOpen(false);
                    }}
                    title="Guild Authentication"
                    subtitle="Login to access all features"
                />
            </div>
        </>
    );
}
