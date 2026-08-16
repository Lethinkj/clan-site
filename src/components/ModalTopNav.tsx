import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface ModalTopNavProps {
    tabs: string[];
    activeTab: string;
    onTabChange: (tab: string) => void;
    onClose: () => void;
    onBack?: () => void;
}

export default function ModalTopNav({ tabs, activeTab, onTabChange, onClose, onBack }: ModalTopNavProps) {
    return (
        <div className="relative flex justify-between items-end bg-[#484233] rounded-t-[18px] h-[58px] border-[4px] border-[#362e24] border-b-0 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] px-3 shrink-0 z-30 mb-[-1px] overflow-visible">

            {/* Inner highlight for the top bar frame itself */}
            <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none rounded-t-[14px] border-t-[2px] border-l-[2px] border-r-[2px] border-[#665e4e]"></div>

            {/* Glossy top-half overlay for the main Top Nav bar background */}
            <div className="absolute top-[2px] left-[2px] right-[2px] h-[45%] bg-[#6e6452] rounded-t-[12px] pointer-events-none z-0"></div>

            {/* Left: Back Button */}
            <div className="relative z-40 pb-1.5 flex items-center h-[58px]">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="relative w-[54px] h-[40px] bg-gradient-to-b from-[#42a7f5] via-[#0088ff] to-[#005ba6] border-[3.5px] border-[#362e24] rounded-[10px] shadow-[0_3px_5px_rgba(0,0,0,0.7)] flex items-center justify-center active:translate-y-1 active:shadow-none transition-all group overflow-hidden"
                    >
                        {/* Inner highlight for back button */}
                        <div className="absolute top-[0px] bottom-[0px] left-[0px] right-[0px] pointer-events-none rounded-[6px] border-[2px] border-[#8cc6ff]"></div>
                        {/* The glossy half-white element */}
                        <div className="absolute top-[2px] left-[2px] right-[2px] h-[45%] bg-white/30 rounded-t-[5px] pointer-events-none"></div>

                        <ChevronLeft size={28} strokeWidth={4} className="relative z-10 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] pr-0.5" />
                    </button>
                )}
            </div>

            {/* Center: Tabs Container */}
            <div className="absolute left-1/2 -translate-x-1/2 flex gap-[1.5px] h-[62px] items-end bottom-0 z-20">
                {tabs.map(tab => {
                    const isActive = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
                            className={`relative px-5 sm:px-9 rounded-t-[14px] border-[3.5px] border-[#362e24] font-black text-[16px] transition-all flex items-center justify-center group ${isActive
                                ? 'bg-gradient-to-b from-[#fdfbfc] via-[#f4f2ea] to-[#ebe7e0] text-[#222] h-[58px] z-30 border-b-0 pb-1'
                                : 'bg-gradient-to-b from-[#877d69] via-[#756a56] to-[#59503d] text-[#e0e0e0] hover:brightness-110 h-[48px] z-10'
                                }`}
                            style={isActive ? { textShadow: '0 1px 0 rgba(255,255,255,1)' } : { textShadow: '0 2px 2px rgba(0,0,0,0.9)' }}
                        >
                            {/* Inner Highlight Stroke (The thick white or light brown inner border requested by the user) */}
                            <div className={`absolute top-[0px] bottom-[0px] left-[0px] right-[0px] pointer-events-none rounded-t-[10px] border-t-[3px] border-l-[3px] border-r-[3px] ${isActive ? 'border-[#ffffff]' : 'border-[#9e937d] opacity-90'}`}></div>

                            {/* Seamless Bridge Strip: Physically covers the gap and gray-body border below it */}
                            {isActive && (
                                <div className="absolute -bottom-[3px] left-[0px] right-[0px] h-[5px] bg-[#ebe7e0] z-40 pointer-events-none"></div>
                            )}

                            <span className="relative z-10 mt-1">{tab}</span>
                        </button>
                    )
                })}
            </div>

            {/* Right: Close Button */}
            <div className="relative z-40 pb-1.5 flex items-center h-[58px]">
                <button
                    onClick={onClose}
                    className="relative w-[48px] h-[48px] bg-gradient-to-b from-[#ff5252] via-[#d60000] to-[#7d0000] border-[3.5px] border-[#362e24] rounded-[10px] shadow-[0_3px_5px_rgba(0,0,0,0.7)] flex items-center justify-center active:translate-y-1 active:shadow-none transition-all group overflow-hidden"
                >
                    {/* Inner highlight for close button */}
                    <div className="absolute top-[0px] bottom-[0px] left-[0px] right-[0px] pointer-events-none rounded-[6px] border-[2px] border-[#ff8c8c]"></div>
                    {/* The glossy half-white element */}
                    <div className="absolute top-[2px] left-[2px] right-[2px] h-[45%] bg-white/40 rounded-t-[5px] pointer-events-none"></div>

                    <span
                        className="relative z-10 text-white text-[25px] font-black leading-none drop-shadow-[0_2px_1px_rgba(0,0,0,0.8)]"
                        style={{ fontFamily: '"Titan One", sans-serif', WebkitTextStroke: '1.2px #2a0000' }}
                    >
                        X
                    </span>
                </button>
            </div>
        </div>
    );
}
