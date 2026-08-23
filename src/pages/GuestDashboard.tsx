import React, { useEffect } from 'react';
import FantasyNavbar from '../components/FantasyNavbar';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GuestDashboard() {
    const navigate = useNavigate();
    const discordUserStr = sessionStorage.getItem('discordUser');
    const user = discordUserStr ? JSON.parse(discordUserStr) : null;

    useEffect(() => {
        if (!user) {
            navigate('/newhome');
        }
    }, [user, navigate]);

    if (!user) return null;

    return (
        <div className="relative min-h-screen w-full bg-[#0d1117] font-sans selection:bg-amber-400 selection:text-black flex flex-col pt-44">
            <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'url("https://www.boot.dev/img/bg-blue-gray.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>

            <FantasyNavbar />

            <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-8 mt-12">
                <div className="flex flex-col items-center justify-center p-12 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-md shadow-2xl text-center space-y-6">

                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        <img src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : `https://ui-avatars.com/api/?name=${user.username}`} alt="Profile" className="w-full h-full object-cover" />
                    </div>

                    <h1 className="text-3xl md:text-5xl text-white font-cinzel font-bold tracking-wider">
                        Welcome, <span className="text-amber-500">{user.username}</span>
                    </h1>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-500/30 bg-slate-500/10 text-slate-300 font-cinzel text-sm font-bold tracking-widest uppercase">
                        <User size={16} />
                        <span>Guest Member</span>
                    </div>

                    <p className="text-slate-400 max-w-lg mx-auto font-lato leading-relaxed">
                        You have successfully authenticated via Discord. Currently, you are a Guest. Only members with the <strong>Captain Bash</strong> role can access the Command Center.
                    </p>

                    <div className="pt-8">
                        <button onClick={() => { sessionStorage.removeItem('discordUser'); navigate('/newhome'); }} className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-900/30 hover:bg-red-900/60 border border-red-500/50 text-red-200 uppercase font-cinzel text-sm font-bold tracking-widest transition-colors">
                            <LogOut size={16} /> Disconnect
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
