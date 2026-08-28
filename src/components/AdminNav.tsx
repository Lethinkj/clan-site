import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut } from 'lucide-react';

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
        <aside className="lg:fixed lg:top-0 lg:left-0 lg:w-[268px] lg:h-screen w-full relative z-40 flex flex-col bg-[#0b1120] border-r border-white/[0.06]">
            {/* Brand */}
            <div className="flex items-center gap-3 px-6 h-[72px] border-b border-white/[0.06] shrink-0">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                    <ShieldCheck size={20} />
                </div>
                <div className="leading-tight">
                    <p className="text-sm font-semibold text-white">Aura Admin</p>
                    <p className="text-[11px] text-slate-500">Control Panel</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600">Management</p>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-white/[0.08] text-white ring-1 ring-white/10'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                            }`}
                        >
                            {isActive && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-indigo-500"></span>
                            )}
                            <span className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-white/[0.06] shrink-0">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
