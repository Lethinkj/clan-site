import React from 'react';

export default function FantasyNavbar() {
    return (
        <nav className="absolute top-0 left-0 w-full z-50 pointer-events-none">
            <div className="relative w-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">

                {/* The Nav Bar Image Layer */}
                <img
                    src="/nav6.png"
                    alt="Navigation Banner"
                    className="w-full h-auto object-contain"
                />

                {/* 
                  Foreground Overlay Container mapped strictly to the wooden bar's exact pixels in nav6.png 
                  nav6.png is 1366x1856. The bar is at Y=8 and is height=118.
                  top = 8 / 1856 = 0.431%
                  height = 118 / 1856 = 6.357%
                */}
                <div
                    className="absolute left-0 w-full flex items-center justify-end px-[4%] sm:px-[8%] lg:px-[12%] pointer-events-auto"
                    style={{ top: '0.431%', height: '6.357%' }}
                >
                    <div className="flex items-center gap-6 sm:gap-10 md:gap-14 xl:gap-20 h-full">
                        {[
                            { id: 'Campaigns', url: '#campaigns' },
                            { id: 'Guilds', url: '#guilds' },
                            { id: 'Rankings', url: '#rankings' }
                        ].map((btn) => (
                            <a
                                key={btn.id}
                                href={btn.url}
                                className="relative flex flex-col items-center group
                                           transition-transform duration-300 hover:scale-110 active:scale-95"
                            >
                                <span className="font-cinzel text-amber-200/90 font-bold text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg tracking-[0.15em] md:tracking-[0.25em] uppercase
                                                 group-hover:text-yellow-400 group-hover:drop-shadow-[0_0_8px_rgba(250,210,50,0.8)]
                                                 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] transition-all duration-300">
                                    {btn.id}
                                </span>
                                {/* Animated underline effect */}
                                <span className="absolute -bottom-2 left-1/2 w-0 h-[1.5px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent
                                                 group-hover:w-full group-hover:left-0 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                            </a>
                        ))}

                        {/* Login Button using login.png */}
                        <a
                            href="#login"
                            className="relative flex flex-col items-center group transition-transform duration-300 hover:scale-105 active:scale-95 ml-1 sm:ml-2"
                        >
                            <div className="relative w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 overflow-hidden flex items-center justify-center 
                                            drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] group-hover:brightness-110 transition-all duration-300"
                                style={{ aspectRatio: "918 / 377" }}>
                                <img
                                    src="/login.png"
                                    alt="Login"
                                    className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-[52%]"
                                    style={{ width: "148.8%", height: "auto" }}
                                />
                            </div>
                        </a>
                    </div>

                </div>
            </div>
        </nav>
    );
}
