import React, { useState } from 'react';
import { X, Users, Trophy, Shield, MessageSquare, Swords, Mail, BookOpen, Crown, Sparkles, Zap, Target, Share2, Star } from 'lucide-react';
import ModalTopNav from './ModalTopNav';

const principles = [
    { icon: <Shield size={24} className="text-[#a4f542]" />, title: 'Alliance', desc: 'Forging unbreakable bonds and teamwork.' },
    { icon: <BookOpen size={24} className="text-[#4bc2ff]" />, title: 'Wisdom', desc: 'Sharing ancient scrolls to elevate the clan.' },
    { icon: <Crown size={24} className="text-[#fcd34d]" />, title: 'Glory', desc: 'Striving for legendary status in every artifact.' },
    { icon: <Sparkles size={24} className="text-[#cbb6f7]" />, title: 'Magic', desc: 'Weaving spells to birth innovation from the void.' },
    { icon: <Zap size={24} className="text-yellow-400" />, title: 'Ascension', desc: 'Leveling skills to god-tier potential.' },
    { icon: <Target size={24} className="text-red-400" />, title: 'Precision', desc: 'Executing quests with lethal efficiency.' }
];

interface ProfileModalProps {
    onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
    const [activeTab, setActiveTab] = useState('Our Clan');
    const [activeSubTab, setActiveSubTab] = useState('Guild Info');
    const [scale, setScale] = useState(1);

    React.useEffect(() => {
        const updateScale = () => {
            // For landscape forced mode, if portrait, width and height bounds physically swap
            const isPortrait = window.innerHeight > window.innerWidth;
            const w = isPortrait ? window.innerHeight : window.innerWidth;
            const h = isPortrait ? window.innerWidth : window.innerHeight;

            // Add safe padding to the computation limits
            const scaleW = (w - 80) / 1000;
            const scaleH = (h - 80) / 820; // 780 + 40 buffer
            setScale(Math.min(scaleW, scaleH, 1));
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 font-sans select-none overflow-hidden">

            {/* The single wrapper enclosing the entire frame. Fixed dimensions, scales infinitely based on viewport ratio */}
            <div
                className="relative w-[1000px] h-[780px] shrink-0 flex flex-col origin-center bg-gradient-to-b from-[#e5e5e5] to-[#a3a3a3] border-[6px] border-[#362f28] rounded-[24px] shadow-[inset_0_4px_0_rgba(255,255,255,0.8),0_20px_40px_rgba(0,0,0,0.8)] p-[6px] pb-3"
                style={{ transform: `scale(${scale})` }}
            >

                {/* Header Row Component */}
                <ModalTopNav
                    tabs={['Our Clan', 'Clan Members']}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onClose={onClose}
                    onBack={onClose}
                />

                {/* Inner Main Content Box. Connects to the active tab */}
                <div className="relative flex-1 bg-[#ebe7e0] border-[3px] border-[#362f28] rounded-b-[12px] flex flex-col p-2 gap-2 z-20">

                    {/* Inner Inner Outline (Darker map holding zone) */}
                    <div className="relative flex-1 w-full bg-[#969a91] border-[3px] border-[#4b4e47] rounded-xl p-2.5 pb-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)] flex flex-col gap-2">

                        {activeTab === 'Our Clan' && (
                            <>
                                {/* Sub Tabs Container */}
                                <div className="flex gap-2 items-center justify-center pt-1 shrink-0">
                                    {['Guild Info', 'Principles', 'Milestones'].map(sub => {
                                        const isSubActive = activeSubTab === sub;
                                        return (
                                            <button
                                                key={sub}
                                                onClick={() => setActiveSubTab(sub)}
                                                className={`flex items-center gap-2 px-10 py-2 rounded-full border-[2.5px] border-black/80 font-black text-[15px] shadow-md transition-all ${isSubActive
                                                    ? 'bg-gradient-to-b from-[#ffffff] to-[#d4d4d4] text-[#222] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)]'
                                                    : 'bg-gradient-to-b from-[#b3b0a6] to-[#858071] text-white hover:brightness-110'
                                                    }`}
                                                style={isSubActive ? {} : { textShadow: '0 2px 2px rgba(0,0,0,0.8)' }}
                                            >
                                                {sub === 'Guild Info' && <Shield size={20} className={isSubActive ? 'text-black' : 'text-gray-200'} />}
                                                {sub === 'Principles' && <BookOpen size={20} className={isSubActive ? 'text-black' : 'text-gray-200'} />}
                                                {sub === 'Milestones' && <Trophy size={20} className={isSubActive ? 'text-black' : 'text-gray-200'} />}
                                                <span className={isSubActive ? 'drop-shadow-[0_1px_0_white]' : ''}>{sub}</span>
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Middle Window (With map background) */}
                                <div className="relative flex flex-col bg-gradient-to-b from-[#bdc2b7] to-[#868c81] border-[3px] border-[#4b4e47] rounded-xl shadow-inner shrink-0 flex-1 overflow-hidden">

                                    {/* Watermark map styling */}
                                    <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#333 25%, transparent 25%)', backgroundSize: '12px 12px' }}></div>
                                    <div className="absolute -top-[50px] -right-[50px] w-[600px] h-[400px] opacity-[0.05] pointer-events-none mix-blend-overlay border-[30px] border-white rounded-[200px]"></div>

                                    {activeSubTab === 'Guild Info' && (
                                        <div className="relative z-10 flex p-6 px-8 gap-4 pb-2 w-full flex-1">
                                            {/* Left: Badge, Name & Big Stats */}
                                            <div className="flex flex-col gap-6 flex-[1.2] pr-4">
                                                <div className="flex items-start gap-6">
                                                    {/* Shield Badge */}
                                                    <div className="relative w-[130px] h-[145px] bg-gradient-to-b from-amber-700 to-amber-900 border-[3px] border-black flex items-center justify-center shadow-lg shrink-0 mt-2" style={{ clipPath: 'polygon(50% 100%, 0 85%, 0 0, 100% 0, 100% 85%)' }}>
                                                        <div className="absolute top-0 left-0 bg-white border-b-[2px] border-r-[2px] border-black text-black font-black text-[15px] px-2.5 py-0.5 rounded-br-[6px] shadow-sm z-10">7F</div>
                                                        <img src="/Aura-7f.png" alt="Aura Logo" className="w-[100px] h-[100px] object-contain drop-shadow-md z-10 opacity-90" />
                                                        <div className="absolute inset-1.5 border-[2px] border-amber-400/40 border-dashed" style={{ clipPath: 'polygon(50% 100%, 0 85%, 0 0, 100% 0, 100% 85%)' }}></div>
                                                    </div>

                                                    {/* Title & Tag */}
                                                    <div className="flex flex-col w-full max-w-[380px] pt-1 mt-2">
                                                        <div className="flex items-center justify-between w-full">
                                                            <h3 className="text-[40px] font-black text-white uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider whitespace-nowrap" style={{ WebkitTextStroke: '1.2px #000' }}>
                                                                AURA-7F <span className="text-amber-400">✨</span>
                                                            </h3>
                                                            <button className="text-white hover:text-gray-200 drop-shadow-md shrink-0 ml-2 pt-2 transition-transform active:scale-95">
                                                                <Share2 size={26} />
                                                            </button>
                                                        </div>
                                                        <span className="text-white font-bold text-[16px] mt-0.5 opacity-95" style={{ textShadow: '0 1px 1px #000' }}>#DIGITALVOID</span>
                                                        <div className="bg-black/20 border border-black/10 rounded-md p-3 mt-4 shadow-inner">
                                                            <p className="text-white text-[15px] font-bold drop-shadow-md leading-relaxed w-full" style={{ textShadow: '0 1px 1px rgba(0,0,0,0.8)' }}>
                                                                The Essence of Aura-7F. <br />A fellowship of code-wizards crafting legendary artifacts through unity and forbidden technologies! ⚔️
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Big Points Row (Total Points & War Trophies) */}
                                                <div className="flex items-center gap-4 mt-2">
                                                    {/* Total Clan Points */}
                                                    <div className="flex items-center gap-3 bg-gradient-to-r from-black/30 to-transparent p-2 rounded-lg flex-1">
                                                        <Trophy size={36} className="text-yellow-400 fill-yellow-400 drop-shadow-[0_2px_2px_black]" />
                                                        <div className="flex flex-col">
                                                            <span className="text-[12px] font-black text-gray-300 uppercase leading-none drop-shadow-md" style={{ textShadow: '0 1px 1px #000' }}>Total Points</span>
                                                            <span className="text-[26px] font-black text-white leading-none mt-1 drop-shadow-md" style={{ textShadow: '0 2px 2px #000' }}>24,850</span>
                                                        </div>
                                                    </div>
                                                    {/* Clan War Trophies */}
                                                    <div className="flex items-center gap-3 bg-gradient-to-r from-black/30 to-transparent p-2 rounded-lg flex-1">
                                                        <Swords size={36} className="text-[#a4f542] fill-[#a4f542]/50 drop-shadow-[0_2px_2px_black]" />
                                                        <div className="flex flex-col">
                                                            <span className="text-[12px] font-black text-gray-300 uppercase leading-none drop-shadow-md" style={{ textShadow: '0 1px 1px #000' }}>Wars Won</span>
                                                            <span className="text-[26px] font-black text-white leading-none mt-1 drop-shadow-md" style={{ textShadow: '0 2px 2px #000' }}>142</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Detailed Stats List */}
                                            <div className="flex flex-col flex-[0.8] text-[15px] font-black text-white gap-0 pl-4 border-l-[2px] border-black/20" style={{ textShadow: '0 1px 1px rgba(0,0,0,0.8)' }}>
                                                {/* Clan War League Ribbon (Right Corner) */}
                                                <div className="absolute top-0 right-10 w-10 h-[70px] bg-gradient-to-b from-[#8a2be2] to-[#4b0082] border-l-[2px] border-r-[2px] border-b-[2px] border-black/80 shadow-[0_4px_6px_rgba(0,0,0,0.6)] z-20" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }}></div>


                                                {/* Stat Rows */}
                                                <div className="flex justify-between items-center py-2.5 border-b border-black/20 w-full">
                                                    <span className="opacity-90 tracking-wide text-gray-200">Clan Location:</span>
                                                    <span className="opacity-100 pr-1 text-white">Byte Bash Blitz</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2.5 border-b border-black/20 w-full">
                                                    <span className="opacity-90 tracking-wide text-gray-200">Chat Language:</span>
                                                    <span className="opacity-100 pr-1 text-white">English</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2.5 border-b border-black/20 w-full">
                                                    <span className="opacity-90 tracking-wide text-gray-200">War Frequency:</span>
                                                    <span className="opacity-100 pr-1 text-white">Always</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2.5 border-b border-black/20 w-full">
                                                    <span className="opacity-90 tracking-wide text-gray-200">Required Trophies:</span>
                                                    <span className="opacity-100 pr-1 text-white">0</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2.5 border-b border-black/20 w-full">
                                                    <span className="opacity-90 tracking-wide text-gray-200">Type:</span>
                                                    <span className="opacity-100 pr-1 text-[#ff5c5c]">Invite only</span>
                                                </div>
                                                <div className="flex justify-between items-center py-2.5 w-full">
                                                    <span className="opacity-90 tracking-wide text-gray-200">Guild Members:</span>
                                                    <span className="font-black text-amber-400 pr-1 drop-shadow-[0_1px_1px_black]">12/50</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeSubTab === 'Milestones' && (
                                        <div className="relative z-10 flex flex-col p-4 px-6 w-full h-full overflow-y-auto custom-scrollbar">
                                            <h4 className="text-white font-black text-[22px] drop-shadow-md mb-4" style={{ WebkitTextStroke: '0.5px #000' }}>Guild Milestones</h4>
                                            <div className="flex flex-col gap-3">
                                                {/* Milestone Items */}
                                                {[
                                                    { date: "September 08, 2025", title: "The First Spark", desc: "Aura-7F become master clan of Byte Bash Blitz.", icon: <Star className="text-amber-400 fill-amber-400" /> },
                                                    { date: "October 06, 2025", title: "Halfway to a Thousand", desc: "Proof of unity, effort, and momentum.", icon: <Shield className="text-blue-400 fill-blue-400" /> },
                                                    { date: "October 2025", title: "Pointzilla", desc: "100+ already crushed under its claws, Pointzilla reigns supreme.", icon: <Trophy className="text-purple-400 fill-purple-400" /> },
                                                    { date: "November 25, 2025", title: "1000 Echoes of Victory", desc: "This is more than a milestone; it’s the mark of legends.", icon: <Trophy className="text-cyan-400 fill-cyan-400" /> },
                                                    { date: "December 14, 2025", title: "Honor Stone", desc: "Clan achieves a high rank in external competition.", icon: <Shield className="text-amber-400 fill-amber-400" /> },
                                                    { date: "CB Shaniya", title: "Valor Stone", desc: "First basher to conquer Sapphire, Ruby, and Emerald leagues.", icon: <Star className="text-red-400 fill-red-400" /> }
                                                ].map((stone, i) => (
                                                    <div key={i} className="flex gap-4 items-center bg-black/40 border border-white/10 rounded-xl p-3 shadow-sm hover:bg-black/50 transition-colors">
                                                        <div className="w-[50px] h-[50px] rounded-full bg-slate-800/80 border border-white/20 flex items-center justify-center shrink-0">
                                                            {stone.icon}
                                                        </div>
                                                        <div className="flex flex-col justify-center">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-white font-black text-[18px] drop-shadow-sm tracking-wide">{stone.title}</span>
                                                                <span className="text-amber-400/80 font-black text-[12px] uppercase">{stone.date}</span>
                                                            </div>
                                                            <span className="text-gray-300 font-bold text-[14px] mt-0.5 leading-snug max-w-lg shadow-black drop-shadow-md">{stone.desc}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeSubTab === 'Principles' && (
                                        <div className="relative z-10 flex flex-col w-full h-full p-4 overflow-y-auto custom-scrollbar">
                                            <div className="grid grid-cols-2 gap-4">
                                                {principles.map((p, idx) => (
                                                    <div key={idx} className="bg-gradient-to-br from-[#ffffff] to-[#e6e2d6] border-[3px] border-[#362f28] rounded-[10px] p-3 flex items-start gap-4 shadow-[0_4px_6px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-transform">
                                                        <div className="w-[50px] h-[50px] bg-gradient-to-b from-[#362f28] to-[#1c1815] border-[2px] border-[#8a857a] rounded-[8px] flex items-center justify-center shadow-inner shrink-0">
                                                            {p.icon}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-[#2a2825] text-[18px] uppercase tracking-wide drop-shadow-[0_1px_0_white]">{p.title}</span>
                                                            <span className="text-[#5a554a] font-bold text-[13px] leading-tight mt-1">{p.desc}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {activeTab === 'Clan Members' && (
                            <div className="flex flex-col h-full w-full">
                                {/* Members Target Header Row */}
                                <div className="flex items-center justify-center gap-6 py-3 border-[2px] border-[#656860] bg-gradient-to-b from-[#cfcfcf] to-[#b3b3b3] mb-2 rounded-sm shadow-inner shrink-0">
                                    <span className="text-black font-black text-[14px] drop-shadow-[0_1px_0_rgba(255,255,255,0.6)] uppercase">Members 12/50</span>
                                    <div className="flex flex-col gap-1 cursor-pointer bg-gradient-to-b from-[#ffffff] to-[#d3ebf2] rounded border-[2px] border-[#1c6e8c] p-1.5 px-6 shadow-md active:scale-95 transition-transform">
                                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-transparent border-b-black"></div>
                                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-black"></div>
                                    </div>
                                    <span className="text-black font-black text-[14px] drop-shadow-[0_1px_0_rgba(255,255,255,0.6)] uppercase tracking-wide">Highest League & Trophies</span>
                                </div>

                                {/* Scrolling Members List Container spanning remaining view */}
                                <div className="flex-1 w-full overflow-y-auto custom-scrollbar pr-1 bg-[#8c887e]/20 rounded pb-1">
                                    {/* MOCK MEMBER */}
                                    <div className="flex items-stretch bg-gradient-to-b from-white to-[#eae7dd] border-[3px] border-[#8a857a] rounded-[10px] shadow-sm mb-1.5 h-[80px] w-full">
                                        <div className="w-16 flex items-center justify-center bg-black/5 rounded-l-[8px] border-r border-black/10 shrink-0">
                                            <span className="font-black text-[#554e44] text-[22px] drop-shadow-[0_1px_0_white]">1.</span>
                                        </div>
                                        <div className="flex items-center justify-center px-5 shrink-0">
                                            <div className="w-[44px] h-[50px] bg-[#6db33f] border-[2px] border-black flex items-center justify-center shadow-inner" style={{ clipPath: 'polygon(50% 100%, 0 85%, 0 0, 100% 0, 100% 85%)' }}>
                                                <Users size={22} className="text-white drop-shadow-sm" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-center px-4 shrink-0">
                                            <div className="w-[54px] h-[54px] bg-gradient-to-br from-[#c98e4d] to-[#804215] border-[2.5px] border-[#362f28] rounded flex items-center justify-center relative shadow-sm">
                                                <span className="text-white font-black text-[16px] drop-shadow-md">TH</span>
                                                <div className="absolute -bottom-[5px] -right-[5px] bg-black text-white text-[12px] font-black px-1.5 rounded-[4px] border border-gray-400 z-10 shadow-sm leading-tight">14</div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center flex-1 ml-6">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-[#222] text-[20px] uppercase drop-shadow-[0_1px_0_white] tracking-wide">Commander</span>
                                                <div className="w-4 h-4 bg-[#6db33f] border border-black/10 flex items-center justify-center rounded-[3px] shadow-sm mt-0.5"><span className="text-white text-[11px] font-black leading-none drop-shadow-md">≡</span></div>
                                            </div>
                                            <span className="text-[13px] text-[#554e44] font-black drop-shadow-[0_1px_0_white] mt-1 tracking-wider">Leader <span className="font-bold opacity-80 pl-3">Played today</span></span>
                                        </div>

                                        <div className="flex items-center ml-auto h-full shrink-0">
                                            <div className="flex flex-col items-center justify-center h-full px-8 border-l border-black/10 pt-1">
                                                <span className="text-[12px] text-[#554e44] font-black uppercase drop-shadow-[0_1px_0_white]">Spells cast:</span>
                                                <span className="font-black text-black text-[20px] drop-shadow-sm">402</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center h-full px-8 border-l border-black/10 pt-1">
                                                <span className="text-[12px] text-[#554e44] font-black uppercase drop-shadow-[0_1px_0_white]">Spells received:</span>
                                                <span className="font-black text-black text-[20px] drop-shadow-sm">13</span>
                                            </div>
                                            <div className="flex items-center justify-center px-10 gap-3 bg-gradient-to-b from-[#e3e8eb] to-[#b8c1c9] rounded-r-md min-w-[170px] border-l-[3px] border-[#8a857a] shadow-[inset_0_2px_5px_rgba(0,0,0,0.1)] h-full">
                                                <span className="font-black text-black text-[28px] drop-shadow-[0_1px_0_white]">1024</span>
                                                <Trophy className="w-8 h-8 text-yellow-500 fill-[#fcd34d] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] stroke-black stroke-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
