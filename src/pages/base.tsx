import React from 'react';
import { Settings, MessageCircle, Map, Hammer, Plus, Shield, Coins, Droplet, Gem, Trophy, Star, Swords } from 'lucide-react';

export default function BaseUI() {
    return (
        <div
            className="relative w-full h-screen overflow-hidden bg-center bg-cover bg-no-repeat font-sans select-none"
            style={{ backgroundImage: "url('/coc-mockup.png')" }}
        >
            {/* 
        HUD Overlay
      */}

            {/* Top Left: Player Profile */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="flex items-center">
                    {/* Level Star Badge */}
                    <div className="relative z-10 w-16 h-16 flex items-center justify-center bg-gradient-to-b from-blue-300 to-blue-600 rounded-full border-4 border-blue-900 shadow-[0_4px_10px_rgba(0,0,0,0.5)] transform -rotate-6">
                        <Star className="absolute text-blue-900 w-12 h-12 fill-current opacity-20" />
                        <span className="relative z-10 text-white font-bold text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">48</span>
                        <div className="absolute -bottom-2 bg-gradient-to-b from-amber-400 to-amber-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm border border-amber-900">
                            RANK
                        </div>
                    </div>

                    {/* Name & XP Bar */}
                    <div className="bg-gradient-to-r from-gray-900/90 to-gray-800/80 border-2 border-gray-700 rounded-r-xl rounded-l-none pl-10 pr-6 py-2 -ml-8 flex flex-col justify-center shadow-lg backdrop-blur-sm">
                        <span className="text-white font-bold text-lg leading-none drop-shadow-md pb-1 border-b border-gray-600/50">WARRIOR_KING</span>
                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-white text-xs font-bold bg-green-500 rounded-full w-5 h-5 flex items-center justify-center border border-gray-900 shadow-inner">
                                XP
                            </span>
                            <div className="relative w-32 h-3 bg-gray-900 rounded-full border border-gray-700 overflow-hidden shadow-inner flex">
                                <div className="h-full bg-gradient-to-r from-green-400 to-green-300 w-3/4"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* League Trophy */}
                <div className="flex items-center gap-2 ml-4">
                    <div className="w-12 h-14 bg-gradient-to-b from-purple-500 to-purple-800 rounded-t-lg rounded-b-[2rem] border-2 border-gray-900 flex items-center justify-center shadow-md relative">
                        <Trophy className="text-amber-300 w-6 h-6 fill-amber-400 drop-shadow-md" />
                        <div className="absolute -bottom-2 right-[-5px] bg-gray-800 border-[1.5px] border-gray-400 font-bold text-white text-[10px] px-1 rounded-sm">
                            II
                        </div>
                    </div>
                    <span className="text-white font-black text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">2,150</span>
                </div>
            </div>


            {/* Top Right: Resources & Status */}
            <div className="absolute top-4 right-4 flex flex-col gap-3 items-end">
                {/* Status Row (Builders & Shield) */}
                <div className="flex gap-2">
                    {/* Builders */}
                    <div className="flex items-center bg-gray-900/80 border-[1.5px] border-gray-700 rounded-full h-8 pl-1 pr-3 shadow-lg">
                        <div className="w-9 h-9 -ml-2 rounded-full border border-gray-800 bg-amber-200 overflow-hidden shrink-0 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]">
                            {/* Dummy builder face */}
                            <div className="w-6 h-6 bg-orange-300 rounded-full mb-[-10px] border border-orange-500"></div>
                        </div>
                        <span className="text-white font-bold text-sm ml-2 drop-shadow">3/5</span>
                    </div>

                    {/* Shield */}
                    <div className="flex items-center bg-gray-900/80 border-[1.5px] border-gray-700 rounded-full h-8 px-3 shadow-lg">
                        <Shield className="text-gray-300 w-4 h-4 fill-gray-200 mr-2 drop-shadow" />
                        <span className="text-white font-bold text-sm drop-shadow">1d 14h</span>
                        <div className="ml-2 w-5 h-5 bg-gradient-to-t from-green-600 to-green-400 rounded-sm border border-gray-800 flex items-center justify-center cursor-pointer shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]">
                            <Plus className="text-white w-3 h-3 font-bold" />
                        </div>
                    </div>
                </div>

                {/* Resource Bars */}
                <div className="flex flex-col gap-2.5 mt-2">

                    {/* Gold */}
                    <div className="flex items-center justify-end relative h-8 min-w-[200px]">
                        <div className="absolute right-0 bg-gradient-to-b from-gray-200 to-gray-400 border-[1.5px] border-gray-900 rounded-l-full rounded-r-md h-full w-[90%] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] flex items-center justify-end px-3">
                            <span className="text-gray-900 font-extrabold text-sm font-mono drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">1,450,230</span>
                        </div>
                        <div className="absolute right-[90%] -mr-5 bg-gradient-to-br from-yellow-300 to-yellow-600 border-2 border-gray-900 rounded-full w-10 h-10 flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.7)] z-10">
                            <Coins className="text-yellow-700 w-6 h-6 fill-yellow-200" />
                        </div>
                    </div>

                    {/* Elixir */}
                    <div className="flex items-center justify-end relative h-8 min-w-[200px]">
                        <div className="absolute right-0 bg-gradient-to-b from-purple-200 to-purple-400 border-[1.5px] border-gray-900 rounded-l-full rounded-r-md h-full w-[90%] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] flex items-center justify-end px-3">
                            <span className="text-gray-900 font-extrabold text-sm font-mono drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">980,500</span>
                        </div>
                        <div className="absolute right-[90%] -mr-5 bg-gradient-to-t from-purple-700 to-fuchsia-400 border-2 border-gray-900 rounded-full rounded-tr-sm w-10 h-10 flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.4)] transform rotate-45 z-10">
                            <div className="w-full h-full bg-gradient-to-tl from-purple-900/50 to-transparent rounded-full rounded-tr-sm"></div>
                        </div>
                    </div>

                    {/* Gems */}
                    <div className="flex items-center justify-end relative h-8 min-w-[200px]">
                        <div className="absolute right-0 bg-gradient-to-b from-gray-800 to-gray-900 border-[1.5px] border-gray-900 rounded-l-full rounded-r-md h-full w-[90%] shadow-inner flex items-center justify-between pl-6 pr-1">
                            <span className="text-green-400 font-extrabold text-sm font-mono drop-shadow-md ml-auto mr-3">450</span>
                            <div className="w-6 h-6 bg-gradient-to-t from-green-600 to-green-400 rounded-sm border border-gray-800 flex items-center justify-center cursor-pointer shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]">
                                <Plus className="text-white w-4 h-4 font-bold" />
                            </div>
                        </div>
                        <div className="absolute right-[90%] -mr-5 bg-gradient-to-br from-green-300 via-green-500 to-green-700 border-2 border-gray-900 w-9 h-10 flex items-center justify-center shadow-[0_2px_4px_rgba(0,0,0,0.5)] hexagon-clip z-10">
                            <div style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} className="absolute inset-0 border border-green-200/50"></div>
                        </div>
                    </div>

                </div>
            </div>


            {/* Bottom Left: Attack & Chat */}
            <div className="absolute bottom-4 left-4 flex gap-4 items-end">
                {/* Chat Button (slide-out tab) */}
                <div className="bg-gradient-to-r from-amber-600 to-amber-700 w-10 h-16 rounded-r-xl rounded-l-sm border-2 border-l-0 border-amber-900 flex items-center justify-center shadow-[2px_0_10px_rgba(0,0,0,0.5)] cursor-pointer hover:w-12 transition-all">
                    <MessageCircle className="text-white w-6 h-6 fill-white/80 drop-shadow-md" />
                </div>

                {/* Global/Map Button */}
                <div className="flex flex-col gap-2">
                    <button className="relative w-20 h-20 bg-gradient-to-b from-amber-100 to-amber-300 rounded-xl border-4 border-amber-900 shadow-[0_8px_0_#78350f,0_15px_15px_rgba(0,0,0,0.5)] flex items-center justify-center active:translate-y-2 active:shadow-[0_0px_0_#78350f,0_5px_5px_rgba(0,0,0,0.5)] transition-all group overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Map className="w-12 h-12 text-amber-900 drop-shadow-sm opacity-80" />
                        <div className="absolute inset-0 border-2 border-white/40 mix-blend-overlay rounded-lg"></div>
                    </button>
                </div>

                {/* Attack Button */}
                <button className="relative w-24 h-24 bg-gradient-to-b from-orange-400 to-red-600 border-4 border-red-900 rounded-2xl shadow-[0_8px_0_#450a0a,0_15px_15px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center active:translate-y-2 active:shadow-[0_0px_0_#450a0a,0_5px_5px_rgba(0,0,0,0.5)] transition-all group overflow-hidden ml-2">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-1 left-1 right-1 h-1/3 bg-white/20 rounded-t-xl"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <Swords className="w-12 h-12 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] fill-white/30" />
                        <span className="text-white font-black text-xl tracking-wider mt-[-2px] uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] font-sans" style={{ textShadow: '0 2px 2px #000, 0 -1px 1px #000, 1px 0 1px #000, -1px 0 1px #000' }}>Attack!</span>
                    </div>
                </button>
            </div>


            {/* Bottom Right: Shop & Settings */}
            <div className="absolute bottom-4 right-4 flex items-end gap-3">
                {/* Settings/Info */}
                <div className="flex flex-col gap-2">
                    <button className="bg-gradient-to-b from-gray-200 to-gray-400 p-2 rounded-xl border-2 border-gray-600 shadow-[0_4px_0_#475569] active:translate-y-1 active:shadow-none transition-all">
                        <Settings className="w-6 h-6 text-gray-800 drop-shadow-sm" />
                    </button>
                    <button className="bg-gradient-to-b from-gray-200 to-gray-400 p-2 rounded-xl border-2 border-gray-600 shadow-[0_4px_0_#475569] active:translate-y-1 active:shadow-none transition-all">
                        <div className="w-6 h-6 flex items-center justify-center">
                            <span className="text-gray-800 font-extrabold text-lg leading-none">i</span>
                        </div>
                    </button>
                </div>

                {/* Shop Button */}
                <button className="relative w-20 h-24 bg-gradient-to-b from-amber-100 to-amber-300 rounded-xl border-4 border-amber-900 shadow-[0_8px_0_#78350f,0_15px_15px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center active:translate-y-2 active:shadow-[0_0px_0_#78350f,0_5px_5px_rgba(0,0,0,0.5)] transition-all group overflow-hidden ml-2">
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-1 left-1 right-1 h-3 bg-white/30 rounded-t-sm"></div>

                    <div className="flex flex-col items-center mt-2 z-10">
                        <Hammer className="w-10 h-10 text-amber-900 drop-shadow-md mb-1 fill-amber-700/50" />
                        <div className="bg-amber-900/10 px-3 py-1 w-full text-center border-t border-amber-900/20">
                            <span className="text-amber-900 font-black text-sm uppercase drop-shadow-[0_1px_0_rgba(255,255,255,0.5)] outline-1">Shop</span>
                        </div>
                    </div>

                    {/* Notification Bubble */}
                    <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-md z-20">
                        1
                    </div>
                </button>
            </div>

        </div>
    );
}
