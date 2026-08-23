import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Tab {
    id: 'users' | 'members' | 'events' | 'projects';
    label: string;
    icon: React.ReactNode;
}

interface AdminNavProps {
    tabs: readonly Tab[];
    activeTab: string;
    setActiveTab: (id: any) => void;
}

export default function AdminNav({ tabs, activeTab, setActiveTab }: AdminNavProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('discordUser');
        navigate('/newhome');
    };
    return (
        <div
            className="lg:fixed lg:top-0 lg:left-0 lg:w-[320px] lg:h-screen w-full relative z-40 p-6 flex flex-col mb-8 lg:mb-0"
            style={{ backgroundImage: 'url(/leftnav1.png)', backgroundSize: '1500px auto', backgroundPosition: 'left top', backgroundRepeat: 'no-repeat' }}
        >
            {/* Subtle Wood-like Grain Overlay using noise/gradient */}
            <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)' }}></div>

            {/* Accent Glow inside sidebar */}
            <div className="absolute inset-x-0 -top-10 h-24 bg-gradient-to-b from-amber-500/20 to-transparent blur-2xl opacity-50 pointer-events-none z-0"></div>

            {/* Header */}
            {/* <div className="mb-8 pb-4 border-b border-amber-800/40 relative z-10 flex items-center justify-between">
                <span className="font-cinzel font-black text-amber-500 tracking-[0.2em] uppercase text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                    Operations
                </span>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,1)] animate-pulse border border-amber-200"></div>
            </div> */}

            <nav className="flex flex-col space-y-4 relative z-10">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    let tabImg = '';
                    if (tab.id === 'users') tabImg = '/profile.png';
                    if (tab.id === 'members') tabImg = '/members.png';
                    if (tab.id === 'events') tabImg = '/events1.png';
                    if (tab.id === 'projects') tabImg = '/projects1.png';

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className="relative w-full flex flex-col items-center justify-center transition-transform duration-300 group hover:scale-110 active:scale-95 py-2"
                        >
                            {isActive && tabImg ? (
                                <div className="relative w-32 lg:w-40 overflow-visible flex items-center justify-center drop-shadow-[0_5px_10px_rgba(0,0,0,0.8)] group-hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] group-hover:brightness-110 transition-all duration-300">
                                    <img
                                        src={tabImg}
                                        alt={tab.label}
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                            ) : (
                                <span className="font-cinzel text-amber-100/70 font-bold text-sm lg:text-base tracking-[0.1em] md:tracking-[0.2em] uppercase group-hover:text-amber-400 group-hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] transition-colors duration-300 py-4">
                                    {tab.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <div className="mt-auto relative z-10 w-full pt-8 pb-4">
                <button
                    onClick={handleLogout}
                    className="relative w-full flex flex-col items-center justify-center transition-transform duration-300 group hover:scale-110 active:scale-95 py-2"
                >
                    <span className="font-cinzel text-red-500/80 font-bold text-sm lg:text-base tracking-[0.1em] md:tracking-[0.2em] uppercase group-hover:text-red-400 group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] transition-colors duration-300 py-4">
                        Logout
                    </span>
                </button>
            </div>
        </div>
    );
}
