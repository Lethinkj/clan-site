import React from 'react';

export default function FantasyNavbar() {
    return (
        <nav className="absolute top-0 left-0 w-full z-50 pointer-events-none">
            <div className="relative w-full flex items-start justify-end drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">

                {/* The Nav Bar Image Layer */}
                <img
                    src="/nav6.png"
                    alt="Navigation Banner"
                    className="w-full h-auto object-contain"
                />

                {/* Foreground Overlay Layer */}
                <div className="absolute inset-0 flex items-start justify-center pt-[2%] sm:pt-[1.5%] md:pt-[1%] lg:pt-[0.8%]">

                    <div className="flex items-center gap-4 sm:gap-8 md:gap-12 xl:gap-16 pointer-events-auto ml-[4%] lg:ml-[6%]">
                        {[
                            { id: 'Campaigns', url: '#campaigns' },
                            { id: 'Guilds', url: '#guilds' },
                            { id: 'Rankings', url: '#rankings' }
                        ].map((btn) => (
                            <a key={btn.id} href={btn.url} className="relative flex flex-col items-center group hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer">
                                <img
                                    src="/logonew.png"
                                    alt={`Navigation Button ${btn.id}`}
                                    className="h-10 sm:h-12 md:h-16 lg:h-18 xl:h-20 w-auto object-contain drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.6)] group-hover:brightness-110 transition-all duration-300"
                                />
                                <span className="absolute bottom-[-15px] font-cinzel text-[#d4af37] font-bold text-[8px] sm:text-[10px] md:text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                                    {btn.id}
                                </span>
                            </a>
                        ))}
                    </div>

                </div>
            </div>
        </nav>
    );
}
