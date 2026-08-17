import React, { useState } from 'react';
import DiscordLoginModal from './DiscordLoginModal';

export default function FantasyNavbar() {
    const [showDiscordLogin, setShowDiscordLogin] = useState(false);

    return (
        <nav className="absolute top-4 left-0 w-full z-50 pointer-events-none">
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
                    className="absolute left-0 w-full flex items-center justify-end px-[2%] sm:px-[6%] lg:px-[10%] xl:px-[12%] pointer-events-auto"
                    style={{ top: '0.431%', height: '6.357%' }}
                >
                    <div className="flex items-center gap-1.5 sm:gap-4 md:gap-8 lg:gap-12 xl:gap-20 h-full">
                        {[
                            { id: 'Home', url: '/newhome', img: '/gen_home_new.png' },
                            { id: 'Events', url: '/events', img: '/gen_events_new.png' },
                            { id: 'Projects', url: '/projects', img: '/gen_projects_new.png' },
                            { id: 'Members', url: '/members', img: '/gen_members_new.png' },
                            { id: 'Gallery', url: '/gallery', img: '/gen_gallery_new.png' },
                            { id: 'Guilds', url: '/guilds', img: '/gen_guilds_new.png' }
                        ].map((btn) => (
                            <a
                                key={btn.id}
                                href={btn.url}
                                className="relative flex flex-col items-center group
                                           transition-transform duration-300 hover:scale-110 active:scale-95"
                            >
                                {btn.img ? (
                                    <div className="relative w-9 sm:w-14 md:w-20 lg:w-28 xl:w-36 overflow-hidden flex items-center justify-center 
                                                    drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] group-hover:brightness-110 transition-all duration-300"
                                        style={{ aspectRatio: "auto" }}>
                                        <img
                                            src={btn.img}
                                            alt={btn.id}
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <span className="font-cinzel text-amber-200/90 font-bold text-[8px] sm:text-xs md:text-sm lg:text-base xl:text-lg tracking-[0.1em] md:tracking-[0.25em] uppercase
                                                         group-hover:text-yellow-400 group-hover:drop-shadow-[0_0_8px_rgba(250,210,50,0.8)]
                                                         drop-shadow-[0_2px_4px_rgba(0,0,0,1)] transition-all duration-300">
                                            {btn.id}
                                        </span>
                                        {/* Animated underline effect */}
                                        <span className="absolute -bottom-2 left-1/2 w-0 h-[1.5px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent
                                                         group-hover:w-full group-hover:left-0 transition-all duration-300 opacity-0 group-hover:opacity-100"></span>
                                    </>
                                )}
                            </a>
                        ))}

                        {/* Login Button using login.png */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setShowDiscordLogin(true);
                            }}
                            className="relative flex flex-col items-center group transition-transform duration-300 hover:scale-105 active:scale-95 ml-0.5 sm:ml-2"
                        >
                            <div className="relative w-[34px] sm:w-14 md:w-20 lg:w-28 xl:w-32 overflow-hidden flex items-center justify-center 
                                            drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] group-hover:brightness-110 transition-all duration-300"
                                style={{ aspectRatio: "918 / 377" }}>
                                <img
                                    src="/login.png"
                                    alt="Login"
                                    className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-[52%]"
                                    style={{ width: "148.8%", height: "180%" }}
                                />
                            </div>
                        </button>
                    </div>

                </div>
            </div>

            {/* Discord Login Modal */}
            <DiscordLoginModal
                isOpen={showDiscordLogin}
                onClose={() => setShowDiscordLogin(false)}
                onLoginSuccess={() => setShowDiscordLogin(false)}
                title="Guild Authentication"
                subtitle="Login to access all features"
            />
        </nav>
    );
}
