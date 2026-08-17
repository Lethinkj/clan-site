import React, { useState, useEffect } from 'react';
import { RefreshCcw, Music, Volume2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SettingsModalProps {
    onClose: () => void;
    volume: number;
    onVolumeChange: (vol: number) => void;
    onLoginClick?: () => void; // Callback for when login is clicked
}

export default function SettingsModal({ onClose, volume, onVolumeChange, onLoginClick }: SettingsModalProps) {
    const { user, signOut } = useAuth();
    const [musicLevel, setMusicLevel] = React.useState(1);
    const [scale, setScale] = React.useState(1);
    const [discordUserData, setDiscordUserData] = React.useState<{ username: string; avatar: string | null; id: string } | null>(null);

    // Parse discord user from session on mount and on changes
    useEffect(() => {
        const stored = sessionStorage.getItem('discordUser');
        if (stored) {
            try { setDiscordUserData(JSON.parse(stored)); } catch { setDiscordUserData(null); }
        } else {
            setDiscordUserData(null);
        }
    }, []);

    // Check if user is logged in (either regular auth or Discord)
    const isLoggedIn = user !== null || discordUserData !== null;
    const discordAvatarUrl = discordUserData?.avatar && discordUserData?.id
        ? `https://cdn.discordapp.com/avatars/${discordUserData.id}/${discordUserData.avatar}.png?size=64`
        : null;

    // Ensure Discord modal stays closed unless explicitly opened
    React.useEffect(() => {
        const updateScale = () => {
            const isPortrait = window.innerHeight > window.innerWidth;
            const w = isPortrait ? window.innerHeight : window.innerWidth;
            const h = isPortrait ? window.innerWidth : window.innerHeight;

            const scaleW = (w - 80) / 850;
            const scaleH = (h - 80) / 600; // 560 + 40 buffer
            setScale(Math.min(scaleW, scaleH, 1));
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    // Internal slider state mapping (0-100) -> connects to volume (0-1)
    const handleSfxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        onVolumeChange(val / 100);
    };

    // Handle Login/Logout
    const handleLoginLogout = () => {
        if (isLoggedIn) {
            // Logout
            signOut();
            if (discordUserData) {
                sessionStorage.removeItem('discordUser');
                localStorage.removeItem('discordAccessToken');
                setDiscordUserData(null);
            }
            onClose();
        } else {
            // Call parent callback to show Discord login modal
            if (onLoginClick) {
                onLoginClick();
            }
        }
    };

    // Handle button clicks
    const handleButtonClick = (label: string) => {
        switch (label.toLowerCase()) {
            case 'privacy policy':
                window.open('https://example.com/privacy', '_blank');
                break;
            case 'terms of service':
                window.open('https://example.com/terms', '_blank');
                break;
            case 'parent\'s guide':
                window.open('https://example.com/parents', '_blank');
                break;
            case 'manage':
                alert('Account management coming soon!');
                break;
            case 'credits':
                alert('Credits: Built with passion by AURA-7F team!');
                break;
            case 'chest reward\nchances':
                alert('Chest Reward Rates:\n\n⭐ Common: 60%\n🌟 Rare: 30%\n💫 Epic: 9%\n🔥 Legendary: 1%');
                break;
            case 'help and support':
                window.open('https://discord.gg/aura7f', '_blank');
                break;
            case 'more settings':
                alert('Advanced settings panel coming soon!');
                break;
            default:
                break;
        }
    };

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4 font-sans select-none overflow-hidden">

            {/* The Main Settings Frame */}
            <div
                className="relative w-[850px] shrink-0 flex flex-col bg-gradient-to-b from-[#e6e2d6] to-[#c7c3b5] border-[4px] border-[#4b4841] rounded-[24px] shadow-[inset_0_0_20px_rgba(255,255,255,0.5),0_20px_40px_rgba(0,0,0,0.8)] pb-5 animate-in zoom-in-95 duration-200 origin-center"
                style={{ transform: `scale(${scale})` }}
            >

                {/* Header Profile - Dark Gray Bar */}
                <div className="relative h-[64px] bg-gradient-to-b from-[#8f8c85] via-[#66635c] to-[#4d4a45] rounded-t-[20px] border-b-[3px] border-[#2a2825] flex items-center justify-center shadow-inner shrink-0">
                    <h2 className="text-[28px] font-black tracking-widest text-[#f4f4f4] drop-shadow-[0_3px_2px_rgba(0,0,0,0.8)] leading-none mt-1" style={{ fontFamily: '"Clash", "Titan One", sans-serif', WebkitTextStroke: '2px #000', textShadow: '0 4px 0 #1b120c, 0 4px 8px rgba(0,0,0,0.8)' }}>
                        Settings
                    </h2>

                    {/* Close Button - Red right corner */}
                    <button
                        onClick={onClose}
                        className="absolute right-2 top-2 w-[46px] h-[46px] bg-gradient-to-b from-[#ff6b6b] via-[#cc0000] to-[#8a0000] border-[2.5px] border-[#4a0000] rounded-[10px] shadow-[0_4px_0_#4a0000] flex items-center justify-center active:translate-y-1 active:shadow-none transition-all group overflow-hidden z-50"
                    >
                        <div className="absolute top-[1px] left-[2px] right-[2px] h-[40%] bg-gradient-to-b from-white/70 to-white/10 rounded-t-[6px] pointer-events-none group-active:opacity-80 transition-opacity"></div>
                        <span className="relative z-10 text-white font-black text-2xl drop-shadow-[0_2px_1px_rgba(0,0,0,0.6)]" style={{ WebkitTextStroke: '1px #4a0000' }}>X</span>
                    </button>

                    {/* Glossy top edge highlight for the header */}
                    <div className="absolute top-[2px] left-[4px] right-[4px] h-[8px] bg-gradient-to-b from-white/40 to-transparent rounded-t-[20px] pointer-events-none"></div>
                </div>

                {/* CoC-style ID Banner */}
                <div className="w-full bg-gradient-to-b from-[#3aafff] via-[#1d8de8] to-[#0d73d6] border-b-[4px] border-[#0a4a8c] px-5 py-3 flex items-center justify-between gap-3 shadow-[inset_0_4px_10px_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(0,0,0,0.2)] shrink-0 z-10">

                    {/* Left: Logo label like "SUPERCELL ID" => "BYTE BASH ID" */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="bg-white rounded-md px-2 py-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]">
                            <span className="text-[#1d8de8] text-[13px] font-black tracking-tight leading-none" style={{ fontFamily: '"Titan One", sans-serif' }}>BYTE BASH</span>
                            <span className="ml-1 bg-[#1d8de8] text-white text-[11px] font-black px-1.5 py-0.5 rounded" style={{ fontFamily: '"Titan One", sans-serif' }}>ID</span>
                        </div>
                    </div>

                    {/* Center: Avatar + Username (if logged in) */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        {isLoggedIn ? (
                            <>
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full border-[2.5px] border-white/80 shadow-md overflow-hidden shrink-0 bg-[#0a4a8c]">
                                    {discordAvatarUrl ? (
                                        <img src={discordAvatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-white text-lg font-black">{discordUserData?.username?.charAt(0).toUpperCase() ?? user?.username?.charAt(0).toUpperCase() ?? '?'}</span>
                                        </div>
                                    )}
                                </div>
                                {/* Username + Tag */}
                                <div className="flex flex-col min-w-0">
                                    <span className="text-white text-[15px] font-black leading-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)] truncate" style={{ fontFamily: '"Titan One", sans-serif', WebkitTextStroke: '0.5px #0a4a8c' }}>
                                        {discordUserData?.username ?? user?.username ?? 'Player'}
                                    </span>
                                    <span className="text-white/70 text-[11px] font-bold leading-none truncate">
                                        #{discordUserData?.id?.slice(-6) ?? '000000'}
                                    </span>
                                </div>
                                {/* Refresh Icon */}
                                <button className="ml-1 w-8 h-8 rounded-full bg-white/20 border border-white/50 flex items-center justify-center hover:bg-white/30 transition-all active:scale-90 shrink-0">
                                    <RefreshCcw size={14} className="text-white" />
                                </button>
                            </>
                        ) : (
                            <span className="text-white/80 text-[13px] font-bold italic">
                                Not signed in
                            </span>
                        )}
                    </div>

                    {/* Right: Action Button ("Log In" / "Log Out") CoC-style */}
                    <button
                        onClick={handleLoginLogout}
                        className={`h-[40px] px-6 rounded-[10px] flex items-center justify-center active:translate-y-[2px] active:shadow-none transition-all relative overflow-hidden border-[2.5px] shrink-0
                                ${isLoggedIn
                                ? 'bg-gradient-to-b from-[#ff6b6b] via-[#cc0000] to-[#8a0000] border-[#4a0000] shadow-[0_3px_0_#4a0000]'
                                : 'bg-gradient-to-b from-[#5fd6ff] via-[#28b6ff] to-[#0080e0] border-[#004a99] shadow-[0_3px_0_#004a99]'
                            }`}
                    >
                        <div className="absolute top-[1.5px] left-[2.5px] right-[2.5px] h-[38%] bg-gradient-to-b from-white/60 to-transparent rounded-t-[6px] pointer-events-none"></div>
                        <span className="text-white text-[15px] font-black drop-shadow-[0_2px_1px_rgba(0,0,0,0.8)] relative z-10 tracking-wide" style={{ fontFamily: '"Titan One", sans-serif', WebkitTextStroke: '0.8px #000' }}>
                            {isLoggedIn ? 'Log Out' : 'Log In'}
                        </span>
                    </button>
                </div>

                {/* Sliders Section */}
                <div className="w-full flex px-16 pt-5 pb-3 shrink-0 relative z-0">
                    {/* Watermark map styling overlay (subtle in bg) */}
                    <div className="absolute inset-x-0 top-0 h-[200px] opacity-[0.06] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#333 25%, transparent 25%)', backgroundSize: '12px 12px' }}></div>

                    <div className="flex-1 flex flex-col items-center gap-6 relative z-10 w-1/2 pr-6 border-r border-[#9a978d]/50">
                        <span className="font-black text-[#504c44] text-[22px] drop-shadow-[0_1px_0_white] tracking-wide mt-1" style={{ fontFamily: '"Clash", "Titan One", sans-serif', WebkitTextStroke: '1px #f4f4f4', textShadow: '1px 1px 0px rgba(255,255,255,0.8), -1px -1px 0px transparent' }}>Music</span>
                        <div className="w-full max-w-[280px] h-[16px] bg-[#33312c] rounded-full border-[2px] border-[#8a867c] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_1px_white] relative flex items-center">
                            <div className="absolute inset-[1.5px] bg-[#22211c] rounded-full shadow-[inset_0_4px_6px_rgba(0,0,0,0.8)] pointer-events-none overflow-hidden">
                                {/* Green fill based on musicLevel */}
                                <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-b from-[#a4f542] via-[#7ae000] to-[#468200]" style={{ width: `${musicLevel * 100}%` }}></div>
                            </div>

                            {/* Draggable Handle Visual */}
                            <div className="absolute top-1/2 -translate-y-1/2 w-[54px] h-[54px] rounded-full bg-gradient-to-b from-gray-100 to-gray-400 border-[3px] border-[#362f28] shadow-[inset_0_-4px_4px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.6)] flex items-center justify-center pointer-events-none transition-transform" style={{ left: `calc(${musicLevel * 100}% - 27px)` }}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Music size={22} className="text-[#4a4740] ml-1" />
                                    {musicLevel === 0 && <div className="absolute w-[44px] h-[3px] bg-red-600 border border-[#8a0000] rotate-45 rounded-full shadow-sm"></div>}
                                </div>
                            </div>

                            {/* Invisible interactive input */}
                            <input
                                type="range" min="0" max="1" step="0.01"
                                value={musicLevel} onChange={(e) => setMusicLevel(parseFloat(e.target.value))}
                                className="absolute inset-y-[-20px] inset-x-[-10px] w-[calc(100%+20px)] opacity-0 cursor-grab active:cursor-grabbing z-20"
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-6 relative z-10 w-1/2 pl-6">
                        <span className="font-black text-[#504c44] text-[22px] drop-shadow-[0_1px_0_white] tracking-wide mt-1" style={{ fontFamily: '"Clash", "Titan One", sans-serif', WebkitTextStroke: '1px #f4f4f4', textShadow: '1px 1px 0px rgba(255,255,255,0.8), -1px -1px 0px transparent' }}>Sound Effects</span>
                        <div className="w-full max-w-[280px] h-[16px] bg-[#33312c] rounded-full border-[2px] border-[#8a867c] shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_1px_white] relative flex items-center">
                            <div className="absolute inset-[1.5px] bg-[#22211c] rounded-full shadow-[inset_0_4px_6px_rgba(0,0,0,0.8)] pointer-events-none overflow-hidden">
                                {/* Green fill based on volume */}
                                <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-b from-[#a4f542] via-[#7ae000] to-[#468200]" style={{ width: `${volume * 100}%` }}></div>
                            </div>

                            {/* Draggable Handle Visual */}
                            <div className="absolute top-1/2 -translate-y-1/2 w-[54px] h-[54px] rounded-full bg-gradient-to-b from-gray-100 to-gray-400 border-[3px] border-[#362f28] shadow-[inset_0_-4px_4px_rgba(0,0,0,0.2),0_4px_6px_rgba(0,0,0,0.6)] flex items-center justify-center pointer-events-none transition-transform" style={{ left: `calc(${volume * 100}% - 27px)` }}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Volume2 size={24} className="text-[#4a4740] ml-0.5" />
                                    {volume === 0 && <div className="absolute w-[44px] h-[3px] bg-red-600 border border-[#8a0000] rotate-45 rounded-full shadow-sm"></div>}
                                </div>
                            </div>

                            {/* Invisible interactive input connected to parent volume */}
                            <input
                                type="range" min="0" max="100" step="1"
                                value={volume * 100} onChange={handleSfxChange}
                                className="absolute inset-y-[-20px] inset-x-[-10px] w-[calc(100%+20px)] opacity-0 cursor-grab active:cursor-grabbing z-20"
                            />
                        </div>
                    </div>
                </div>

                {/* Lower Options Buttons */}
                <div className="w-full px-12 pb-2 pt-2 flex flex-col items-center flex-1 relative z-10">

                    {/* Language Dropdown Button */}
                    <div className="flex flex-col items-center gap-1 mb-6">
                        <span className="font-black text-[#504c44] text-[18px] drop-shadow-[0_1px_0_white]" style={{ fontFamily: '"Clash", "Titan One", sans-serif', WebkitTextStroke: '1px #f4f4f4', textShadow: '1px 1px 0px rgba(255,255,255,0.8), -1px -1px 0px transparent' }}>Language</span>
                        <button className="h-[48px] w-[180px] bg-gradient-to-b from-[#a4f542] via-[#7ae000] to-[#468200] border-[2.5px] border-[#1f4a00] rounded-[10px] shadow-[0_4px_0_#1f4a00] flex items-center justify-center active:translate-y-[4px] active:shadow-none transition-all group relative overflow-hidden mt-1">
                            <div className="absolute top-[1.5px] left-[2.5px] right-[2.5px] h-[35%] bg-gradient-to-b from-white/70 to-transparent rounded-t-[6px] pointer-events-none"></div>
                            <span className="text-white font-black text-[18px] drop-shadow-[0_2px_1px_rgba(0,0,0,0.8)] relative z-10 tracking-widest" style={{ WebkitTextStroke: '0.8px #000' }}>English</span>
                        </button>
                    </div>

                    <div className="w-[90%] h-[2px] bg-[#9a978d]/50 shadow-[0_1px_0_white] mb-4 relative">
                        <span className="absolute right-0 bottom-1 font-black text-[#6a665b] text-[12px] uppercase">Consent Choices</span>
                    </div>

                    {/* Small Green Buttons Grid */}
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 max-w-[800px]">
                        {[
                            'Privacy policy',
                            'Terms of service',
                            'Parent\'s Guide',
                            'Manage',
                            'Credits',
                            'CHEST Reward\nChances',
                            'Help and support'
                        ].map((label, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleButtonClick(label)}
                                className="h-[44px] min-w-[120px] px-6 bg-gradient-to-b from-[#a4f542] via-[#7ae000] to-[#468200] border-[2.5px] border-[#1f4a00] rounded-[10px] shadow-[0_4px_0_#1f4a00] flex items-center justify-center active:translate-y-[4px] active:shadow-none hover:from-[#b8ff52] hover:via-[#8ae910] hover:to-[#52a010] transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-[1px] left-[2px] right-[2px] h-[40%] bg-gradient-to-b from-white/60 to-transparent rounded-t-[6px] pointer-events-none"></div>
                                <span className={`text-white font-black whitespace-pre-wrap leading-[1.1] text-center drop-shadow-[0_2px_1px_rgba(0,0,0,0.8)] relative z-10 ${label.includes('\n') ? 'text-[12px]' : 'text-[15px]'}`} style={{ WebkitTextStroke: '0.8px #000' }}>
                                    {label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* More Settings Big Button */}
                    <div className="mt-5">
                        <button
                            onClick={() => handleButtonClick('More settings')}
                            className="h-[54px] px-10 bg-gradient-to-b from-[#a4f542] via-[#7ae000] to-[#468200] border-[2.5px] border-[#1f4a00] rounded-[12px] shadow-[0_4px_0_#1f4a00] flex items-center justify-center active:translate-y-[4px] active:shadow-none hover:from-[#b8ff52] hover:via-[#8ae910] hover:to-[#52a010] transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-[1.5px] left-[2.5px] right-[2.5px] h-[35%] bg-gradient-to-b from-white/70 to-transparent rounded-t-[8px] pointer-events-none"></div>
                            <span className="text-white font-black text-[20px] drop-shadow-[0_2px_1px_rgba(0,0,0,0.8)] relative z-10 tracking-widest" style={{ WebkitTextStroke: '1px #000' }}>More Settings</span>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
