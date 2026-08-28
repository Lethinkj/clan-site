import React, { useEffect, useState } from 'react';
import { supabase, Event } from '../lib/supabase';
import { formatTime12h } from '../lib/utils';
import { getAvailableSlots, bookSlot } from '../lib/slotApi';
import FantasyNavbar from '../components/FantasyNavbar';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Sword, Skull, Scroll, MapPin, Calendar as CalIcon, X } from 'lucide-react';

export default function NewEvents() {
    const navigate = useNavigate();
    const [liveEvents, setLiveEvents] = useState<Event[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [pastEvents, setPastEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data: live } = await supabase.from('events').select('*').eq('status', 'live').order('date', { ascending: true });
            const { data: upcoming } = await supabase.from('events').select('*').eq('status', 'upcoming').order('date', { ascending: true });
            const { data: ended } = await supabase.from('events').select('*').eq('status', 'ended').order('date', { ascending: false });
            const { data: past } = await supabase.from('events').select('*').eq('status', 'completed').order('date', { ascending: false });

            setLiveEvents(live || []);
            setUpcomingEvents(upcoming || []);
            setPastEvents([...(ended || []), ...(past || [])]);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const StatusBadge = ({ isLive, status }: { isLive: boolean, status: string }) => {
        if (isLive) {
            return (
                <span className="inline-flex items-center gap-1.5 bg-red-900/80 border border-red-500 text-red-200 px-3 py-1 rounded-sm text-[10px] font-cinzel font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span> RAID ACTIVE
                </span>
            );
        }
        return (
            <span className="bg-amber-900/80 border border-amber-500/50 text-amber-200 px-3 py-1 rounded-sm text-[10px] uppercase font-cinzel font-bold tracking-wider">
                {status === 'upcoming' ? 'PREPARING' : 'COMPLETED'}
            </span>
        );
    };

    const EventCard = ({ event, isLive = false }: { event: Event; isLive?: boolean }) => (
        <div className={`group relative p-6 rounded-2xl border bg-slate-900/40 backdrop-blur-sm transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full
            ${isLive
                ? 'border-red-500/30 hover:border-red-500/60 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] shadow-[0_0_20px_rgba(220,38,38,0.05)]'
                : 'border-white/5 hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:-translate-y-2'
            }`}>

            {/* Ambient glow inside card */}
            <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-3xl transition-all duration-500 ${isLive ? 'bg-red-500/10 group-hover:bg-red-500/20' : 'bg-purple-500/5 group-hover:bg-amber-500/10'}`}></div>

            {/* Image Section */}
            <div className="relative w-full aspect-video rounded-xl border border-white/10 overflow-hidden mb-6 bg-black/50 shadow-inner z-10 box-border group-hover:border-amber-500/30 transition-colors">
                {event.image_url ? (
                    <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-700">
                        {isLive ? <Skull size={48} strokeWidth={1} className="text-red-900/50 group-hover:text-red-500/30 transition-colors" /> : <Sword size={48} strokeWidth={1} className="group-hover:text-amber-500/30 transition-colors" />}
                    </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity"></div>

                <div className="absolute top-3 right-3 z-20">
                    <StatusBadge isLive={isLive} status={event.status} />
                </div>
            </div>

            <div className="flex-1 flex flex-col z-10">
                <h3 className={`font-cinzel font-bold text-xl mb-3 tracking-wide transition-colors ${isLive ? 'text-red-200 group-hover:text-red-400' : 'text-slate-200 group-hover:text-amber-400'}`}>
                    {event.title}
                </h3>

                <div className="space-y-2 mb-4 text-xs font-lato">
                    <div className="flex items-center gap-2 text-slate-400">
                        <CalIcon size={14} className={isLive ? 'text-red-500/70' : 'text-amber-500/70'} />
                        <span>{event.date} • <span className="text-slate-500">{formatTime12h(event.time)}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <MapPin size={14} className={isLive ? 'text-red-500/70' : 'text-amber-500/70'} />
                        <span className="truncate">{event.location}</span>
                    </div>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-lato line-clamp-3">
                    {event.description}
                </p>

                <div className="mt-auto pt-4 border-t border-white/5">
                    {isLive || event.status === 'upcoming' ? (
                        <button
                            onClick={() => navigate('/registration/' + event.id)}
                            className={`w-full py-2.5 px-4 rounded-lg font-cinzel font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${isLive
                                ? 'bg-red-900/40 border border-red-500/50 text-red-200 hover:bg-red-900/60 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)]'
                                : 'bg-amber-900/20 border border-amber-500/30 text-amber-400 hover:bg-amber-900/40 hover:border-amber-400 hover:text-amber-200 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                                }`}>
                            {isLive ? <><Skull size={16} /> Enter Raid</> : <><Scroll size={16} /> Sign Quest</>}
                        </button>
                    ) : (
                        <span className="flex items-center justify-center w-full py-2.5 text-slate-500 font-cinzel text-sm uppercase tracking-wider">
                            Archived
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen w-full bg-[#0d1117] font-sans overflow-x-hidden selection:bg-amber-400 selection:text-black">
            {/* Custom Background Image (Dark Edition) */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundImage: 'url("https://www.boot.dev/img/bg-blue-gray.webp")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            ></div>

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px]"></div>
            </div>

            <FantasyNavbar />

            <div className="relative z-10 w-full max-w-7xl mx-auto pt-44 pb-24 px-4 md:px-8">

                {/* Board / Title */}
                <div className="flex flex-col items-center justify-center mb-16 space-y-4">
                    {/* <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-cinzel text-sm font-bold tracking-widest uppercase">
                        <Sparkles size={16} />
                        <span>Guild Events</span>
                    </div> */}
                    <h1 className="text-4xl md:text-6xl text-white font-cinzel font-bold tracking-wider text-center drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                        QUEST <span className="text-amber-500">BOARD</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-2xl text-center font-lato">
                        Embark on legendary quests, conquer challenges, and claim your glory within our ranks.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                    </div>
                ) : (
                    <div className="space-y-24">
                        {/* Live Events Section */}
                        {liveEvents.length > 0 && (
                            <section>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-3 rounded-xl bg-red-900/20 border border-red-500/30">
                                        <Skull className="text-red-500 size-6 animate-pulse" />
                                    </div>
                                    <h2 className="text-3xl font-cinzel font-bold text-white tracking-widest uppercase">
                                        Active Raids
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {liveEvents.map(event => (
                                        <EventCard key={event.id} event={event} isLive={true} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Upcoming Events Section */}
                        <section>
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 rounded-xl bg-amber-900/20 border border-amber-500/30">
                                    <Scroll className="text-amber-500 size-6" />
                                </div>
                                <h2 className="text-3xl font-cinzel font-bold text-white tracking-widest uppercase">
                                    Upcoming Quests
                                </h2>
                            </div>
                            {upcomingEvents.length === 0 ? (
                                <div className="border border-dashed border-slate-700 bg-slate-900/30 rounded-xl p-16 text-center backdrop-blur-sm">
                                    <p className="text-slate-500 font-cinzel text-lg">The board is empty. Rest by the fire, warriors.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {upcomingEvents.map(event => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Past Events Section */}
                        {pastEvents.length > 0 && (
                            <section className="opacity-80 hover:opacity-100 transition-opacity duration-500">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-600/30">
                                        <Sparkles className="text-slate-400 size-6" />
                                    </div>
                                    <h2 className="text-3xl font-cinzel font-bold text-slate-300 tracking-widest uppercase">
                                        Tales of Old
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {pastEvents.map((event, i) => (
                                        <div key={event.id} className={i >= 3 ? "hidden lg:block" : "block"}>
                                            <EventCard event={event} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}
