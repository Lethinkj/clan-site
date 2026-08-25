import React, { useEffect, useState } from 'react';
import FantasyNavbar from '../components/FantasyNavbar';
import { supabase } from '../lib/supabase';
import { generateSlots, getAvailableSlots, cancelSlot } from '../lib/slotApi';
import { Shield, Users, Calendar, Layout, Search, Sparkles, Plus, X, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../components/AdminNav';

type TabType = 'users' | 'members' | 'events' | 'projects';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabType>('users');
    const [usersList, setUsersList] = useState<any[]>([]);
    const [eventsList, setEventsList] = useState<any[]>([]);

    // Slot Form State
    const [slotForm, setSlotForm] = useState({
        eventId: '',
        dayNumber: 1,
        date: '',
        startTime: '10:00',
        endTime: '17:00',
        duration: 15,
        capacity: 1
    });

    const [newEventForm, setNewEventForm] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        tag: 'Guild',
        custom_category: 'project_showcase',
        has_slots: true,
        status: 'upcoming'
    });
    const [creatingEvent, setCreatingEvent] = useState(false);
    const [createMsg, setCreateMsg] = useState('');
    const [editingEventId, setEditingEventId] = useState<string | null>(null);

    const [generating, setGenerating] = useState(false);
    const [message, setMessage] = useState('');

    // Admin Slot Viewer State
    const [viewingEvent, setViewingEvent] = useState<any | null>(null);
    const [viewingDay, setViewingDay] = useState(1);
    const [adminSlots, setAdminSlots] = useState<any[]>([]);
    const [adminSlotsLoading, setAdminSlotsLoading] = useState(false);

    // Slot Inspection (Registrations CRUD)
    const [inspectingSlot, setInspectingSlot] = useState<any | null>(null);
    const [slotRegistrations, setSlotRegistrations] = useState<any[]>([]);
    const [inspectingLoading, setInspectingLoading] = useState(false);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (viewingEvent) {
            fetchAdminSlots(viewingEvent.id, viewingDay);
        }
    }, [viewingEvent, viewingDay]);

    const fetchAdminSlots = async (eventId: string, day: number) => {
        setAdminSlotsLoading(true);
        try {
            const slots = await getAvailableSlots(eventId, day);
            setAdminSlots(slots);
        } catch (err) {
            console.error('Error fetching admin slots:', err);
        } finally {
            setAdminSlotsLoading(false);
        }
    };

    // Load specialized registrations for a specific slot when clicked
    useEffect(() => {
        if (inspectingSlot) {
            loadSlotRegistrations(inspectingSlot.id);
        }
    }, [inspectingSlot]);

    const loadSlotRegistrations = async (slotId: string) => {
        setInspectingLoading(true);
        try {
            const { data, error } = await supabase
                .from('event_slot_registrations')
                .select(`
                    id,
                    event_id,
                    user_email,
                    event_registrations (
                        id, name, email, registration_no, department, year, section, clan, project_title, project_category, project_description
                    )
                `)
                .eq('slot_id', slotId);

            if (data && !error) setSlotRegistrations(data);
        } catch (e) {
            console.error(e);
        } finally {
            setInspectingLoading(false);
        }
    };

    const handleRemoveRegistration = async (esrItem: any) => {
        if (!window.confirm(`Are you certain you want to banish ${esrItem.event_registrations?.name}'s booking? This will free up the slot immediately.`)) return;

        try {
            // First destroy the master level registration record, which CASCADES to event_slot_registrations
            await supabase.from('event_registrations').delete().eq('id', esrItem.event_registrations.id);

            // Reload UI state silently without closing popup
            await loadSlotRegistrations(inspectingSlot.id);
            if (viewingEvent) {
                await fetchAdminSlots(viewingEvent.id, viewingDay);
            }
        } catch (err) {
            console.error("Failed to delete booking:", err);
            alert("Error: Database resisted deletion.");
        }
    };

    useEffect(() => {
        const discordUserStr = sessionStorage.getItem('discordUser');
        if (!discordUserStr) {
            navigate('/newhome');
            return;
        }

        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'events') {
            fetchEvents();
        } else {
            setLoading(true);
            setTimeout(() => setLoading(false), 500);
        }
    }, [navigate, activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('users').select('*').order('username', { ascending: true });
            if (!error && data) {
                setUsersList(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
            if (!error && data) {
                setEventsList(data);
                if (data.length > 0 && !slotForm.eventId) {
                    setSlotForm(s => ({ ...s, eventId: data[0].id }));
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateSlots = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!slotForm.eventId || !slotForm.date) {
            setMessage('Error: Please select an event and provide a date.');
            return;
        }

        setGenerating(true);
        setMessage('');
        try {
            await generateSlots(
                slotForm.eventId,
                Number(slotForm.dayNumber),
                slotForm.date,
                slotForm.startTime,
                slotForm.endTime,
                Number(slotForm.duration),
                Number(slotForm.capacity)
            );
            setMessage('Success! Event slots generated flawlessly. They are now live on the database.');
        } catch (err: any) {
            setMessage('Error: ' + err.message);
        } finally {
            setGenerating(false);
        }
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreatingEvent(true);
        setCreateMsg('');

        try {
            if (editingEventId) {
                // Update existing event
                const { error } = await supabase.from('events').update({
                    title: newEventForm.title,
                    description: newEventForm.description,
                    date: newEventForm.date,
                    time: newEventForm.time,
                    location: newEventForm.location,
                    tag: newEventForm.tag,
                    custom_category: newEventForm.custom_category,
                    has_slots: newEventForm.has_slots,
                    status: newEventForm.status
                }).eq('id', editingEventId);

                if (error) throw error;
                setCreateMsg('Successfully updated the Event data!');
            } else {
                // Summon new event
                const { error } = await supabase.from('events').insert({
                    title: newEventForm.title,
                    description: newEventForm.description,
                    date: newEventForm.date,
                    time: newEventForm.time,
                    location: newEventForm.location,
                    tag: newEventForm.tag,
                    custom_category: newEventForm.custom_category,
                    has_slots: newEventForm.has_slots,
                    status: newEventForm.status,
                    attendees: '0'
                });

                if (error) throw error;
                setCreateMsg('Successfully summoned new Event into the database!');
            }

            setNewEventForm({ title: '', description: '', date: '', time: '', location: '', tag: 'Guild', custom_category: 'project_showcase', has_slots: true, status: 'upcoming' });
            setEditingEventId(null);
            fetchEvents();
        } catch (err: any) {
            setCreateMsg('Error: ' + err.message);
        } finally {
            setCreatingEvent(false);
        }
    };

    const handleEditClick = (ev: any) => {
        setEditingEventId(ev.id);
        setNewEventForm({
            title: ev.title || '',
            description: ev.description || '',
            date: ev.date || '',
            time: ev.time || '',
            location: ev.location || '',
            tag: ev.tag || 'Guild',
            custom_category: ev.custom_category || 'project_showcase',
            has_slots: !!ev.has_slots,
            status: ev.status || 'upcoming'
        });
        setCreateMsg('');

        // Scroll to form smoothly
        const element = document.getElementById("event-summon-form");
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    const handleDeleteEvent = async (evId: string, evTitle: string) => {
        if (!window.confirm(`Are you certain you want to permanently erase the event "${evTitle}"? This will DESTROY all slots and ALL user registrations associated with it CASCADING through the database.`)) return;

        try {
            const { error } = await supabase.from('events').delete().eq('id', evId);
            if (error) throw error;
            fetchEvents();
        } catch (err: any) {
            alert('Failed to erase event: ' + err.message);
        }
    };

    const tabs = [
        { id: 'users', label: 'User Roles', icon: <Users size={18} /> },
        { id: 'members', label: 'Members', icon: <Shield size={18} /> },
        { id: 'events', label: 'Events', icon: <Calendar size={18} /> },
        { id: 'projects', label: 'Projects', icon: <Layout size={18} /> },
    ] as const;

    return (
        <div className="relative min-h-screen w-full bg-[#0d1117] font-sans selection:bg-amber-400 selection:text-black pb-24">
            {/* Custom Background Image - Dark theme standard */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'url("https://www.boot.dev/img/bg-blue-gray.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></div>

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px]"></div>
            </div>



            <div className="relative z-10 w-full pt-12 lg:pt-32 px-4 xl:px-8">

                {/* Header */}
                <div className="flex flex-col items-center justify-center mb-12 space-y-4 lg:pl-[320px]">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 font-cinzel text-sm font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                        <Sparkles size={16} />
                        <span>High Council</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-cinzel font-bold tracking-wider text-center drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                        COMMAND <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">CENTER</span>
                    </h1>
                </div>

                <div className="flex flex-col lg:block">

                    {/* Left-Side MATCHING Wooden Navigation Sidebar */}
                    <AdminNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

                    {/* Main Content Area */}
                    <div className="flex-1 w-full order-2 lg:order-2 lg:pl-[340px]">
                        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                            {/* Inner ambient glow */}
                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl pointer-events-none"></div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="text-amber-500">
                                        {tabs.find(t => t.id === activeTab)?.icon}
                                    </div>
                                    <h2 className="text-2xl font-cinzel font-bold text-white uppercase tracking-widest">
                                        {tabs.find(t => t.id === activeTab)?.label}
                                    </h2>
                                </div>

                                {/* Search/Filter placeholder */}
                                <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-lg hover:border-amber-500/30 transition-colors">
                                    <Search size={16} className="text-slate-500" />
                                    <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-slate-300 text-sm font-lato placeholder:text-slate-600 w-full lg:w-48" />
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center p-24">
                                    <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                                </div>
                            ) : (
                                <div className="relative z-10 w-full overflow-x-auto custom-scrollbar">
                                    {activeTab === 'users' && (
                                        <table className="w-full text-left font-lato text-sm text-slate-300">
                                            <thead>
                                                <tr className="border-b-2 border-white/10 bg-black/40 text-slate-400 uppercase tracking-widest text-[10px] font-bold">
                                                    <th className="px-6 py-4 rounded-tl-lg">Avatar</th>
                                                    <th className="px-6 py-4">Username</th>
                                                    <th className="px-6 py-4">Discord ID</th>
                                                    <th className="px-6 py-4 rounded-tr-lg">Role / Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {usersList.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="text-center py-12 text-slate-500 font-cinzel">No users found in database.</td>
                                                    </tr>
                                                ) : (
                                                    usersList.map((usr) => (
                                                        <tr key={usr.id} className="border-b border-white/5 hover:bg-amber-900/10 transition-colors group">
                                                            <td className="px-6 py-3">
                                                                <img src={usr.avatar_url || `https://ui-avatars.com/api/?name=${usr.username}`} alt="avatar" className="w-10 h-10 rounded-full border border-slate-700 bg-black group-hover:border-amber-500/50 transition-colors" />
                                                            </td>
                                                            <td className="px-6 py-3 font-semibold text-white">{usr.username}</td>
                                                            <td className="px-6 py-3 font-mono text-xs text-slate-500">{usr.discord_user_id || 'N/A'}</td>
                                                            <td className="px-6 py-3">
                                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${usr.role === 'captain bash' || usr.role === 'admin' ? 'bg-amber-900/40 text-amber-400 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]' : 'bg-slate-800/80 text-slate-400 border border-slate-600'}`}>
                                                                    {usr.role || 'Guest'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    )}

                                    {activeTab === 'members' && (
                                        <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-white/5 rounded-xl bg-black/20 group hover:border-amber-500/20 transition-colors">
                                            <Shield size={48} className="text-amber-900/50 group-hover:text-amber-500/50 mb-4 transition-colors" />
                                            <h3 className="text-lg font-cinzel text-slate-300 uppercase tracking-widest">Members Vault Pending</h3>
                                            <p className="text-sm font-lato text-slate-500 mt-2 text-center max-w-sm">The guild roster modification tools are currently being polished in the forge.</p>
                                        </div>
                                    )}

                                    {activeTab === 'events' && (
                                        <div className="space-y-6">
                                            {/* Existing Events Table / List Placeholder */}
                                            <div className="bg-black/20 border border-white/5 rounded-xl p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-cinzel text-slate-300 uppercase tracking-widest">Active Events</h3>
                                                    <span className="text-xs text-amber-500 bg-amber-900/30 px-3 py-1 rounded-full border border-amber-500/30 font-bold tracking-wider">
                                                        {eventsList.length} Total
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                    {eventsList.slice(0, 5).map(event => (
                                                        <div key={event.id} className="p-4 bg-black/40 border border-white/10 rounded-lg hover:border-amber-500/30 transition-colors group flex flex-col justify-between">
                                                            <div>
                                                                <div className="flex justify-between items-start mb-2">
                                                                    <h4 className="font-lato font-bold text-white group-hover:text-amber-400 transition-colors w-3/4 truncate">{event.title}</h4>
                                                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${event.status === 'live' ? 'bg-green-900/40 text-green-400 border border-green-500/40' : 'bg-slate-800 text-slate-400 border border-slate-600'}`}>{event.status}</span>
                                                                </div>
                                                                <p className="text-xs text-slate-500 font-mono">{event.date} • {event.has_slots ? 'Slots Enabled' : 'Standard Registration'}</p>
                                                            </div>

                                                            <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                                                                <button onClick={() => handleDeleteEvent(event.id, event.title)} className="flex-1 py-1.5 bg-red-900/10 hover:bg-red-900/30 border border-transparent hover:border-red-500/50 rounded text-red-500 text-[10px] font-bold uppercase tracking-widest transition-all">
                                                                    Erase
                                                                </button>
                                                                <button onClick={() => handleEditClick(event)} className="flex-1 py-1.5 bg-purple-900/10 hover:bg-purple-900/30 border border-transparent hover:border-purple-500/50 rounded text-purple-400 text-[10px] font-bold uppercase tracking-widest transition-all">
                                                                    Modify
                                                                </button>
                                                                {event.has_slots && (
                                                                    <button onClick={() => setViewingEvent(event)} className="flex-1 py-1.5 bg-amber-900/20 hover:bg-amber-900/40 border border-amber-500/30 rounded text-amber-500 text-[10px] font-bold uppercase tracking-widest transition-all">
                                                                        Radar
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {eventsList.length > 5 && (
                                                        <div className="p-4 flex flex-col justify-center items-center border border-dashed border-white/10 rounded-lg text-slate-500 text-sm font-cinzel hover:bg-white/5 cursor-pointer">
                                                            View All {eventsList.length} Events...
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Create NEW Event Tool */}
                                            <div id="event-summon-form" className="bg-black/30 border border-purple-900/40 rounded-xl p-6 md:p-8 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -z-10 group-hover:bg-purple-500/20 transition-colors"></div>

                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <Calendar className="text-purple-500" size={24} />
                                                        <h3 className="text-xl font-cinzel font-bold text-white tracking-widest uppercase">
                                                            {editingEventId ? 'Modify Event Directives' : 'Summon New Event'}
                                                        </h3>
                                                    </div>
                                                    {editingEventId && (
                                                        <button
                                                            onClick={() => { setEditingEventId(null); setNewEventForm({ title: '', description: '', date: '', time: '', location: '', tag: 'Guild', custom_category: 'project_showcase', has_slots: true, status: 'upcoming' }); }}
                                                            className="text-xs font-bold text-slate-400 hover:text-white uppercase px-3 py-1 bg-white/5 hover:bg-white/10 rounded"
                                                        >
                                                            Cancel Modify
                                                        </button>
                                                    )}
                                                </div>

                                                <form onSubmit={handleCreateEvent} className="space-y-5 relative z-10 w-full font-lato">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                                        <div className="space-y-1.5 flex flex-col md:col-span-2">
                                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Event Title</label>
                                                            <input required type="text" value={newEventForm.title} onChange={e => setNewEventForm({ ...newEventForm, title: e.target.value })} className="bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 outline-none transition-colors" placeholder="e.g. Project Showcase 2024" />
                                                        </div>

                                                        <div className="space-y-1.5 flex flex-col md:col-span-2">
                                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Description</label>
                                                            <textarea required value={newEventForm.description} onChange={e => setNewEventForm({ ...newEventForm, description: e.target.value })} rows={3} className="bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 outline-none transition-colors resize-none" placeholder="Describe the raid..."></textarea>
                                                        </div>

                                                        <div className="space-y-1.5 flex flex-col">
                                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Date</label>
                                                            <input required type="date" value={newEventForm.date} onChange={e => setNewEventForm({ ...newEventForm, date: e.target.value })} className="bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 outline-none transition-colors" />
                                                        </div>

                                                        <div className="space-y-1.5 flex flex-col">
                                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Start Time</label>
                                                            <input required type="time" value={newEventForm.time} onChange={e => setNewEventForm({ ...newEventForm, time: e.target.value })} className="bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 outline-none transition-colors" />
                                                        </div>

                                                        <div className="space-y-1.5 flex flex-col">
                                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Location</label>
                                                            <input required type="text" value={newEventForm.location} onChange={e => setNewEventForm({ ...newEventForm, location: e.target.value })} className="bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 outline-none transition-colors" placeholder="e.g. Area 51" />
                                                        </div>

                                                        <div className="space-y-1.5 flex flex-col">
                                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Custom Category (Tags fields)</label>
                                                            <select value={newEventForm.custom_category} onChange={e => setNewEventForm({ ...newEventForm, custom_category: e.target.value })} className="bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-purple-500 outline-none transition-colors">
                                                                <option value="project_showcase">Project Showcase</option>
                                                                <option value="weekly_bash">Weekly Bash</option>
                                                                <option value="generic">Generic Realm</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 mt-6 p-4 rounded-lg bg-black/40 border border-white/5 w-full">
                                                        <label className="text-sm font-bold text-slate-200 mt-1 cursor-pointer flex gap-3 items-center w-full">
                                                            <input type="checkbox" checked={newEventForm.has_slots} onChange={e => setNewEventForm({ ...newEventForm, has_slots: e.target.checked })} className="w-5 h-5 accent-purple-500" />
                                                            <span>Enable "Time Slot Bookings" for this Event?</span>
                                                        </label>
                                                    </div>

                                                    {createMsg && (
                                                        <div className={`p-4 rounded-lg border text-sm font-bold mt-4 ${createMsg.includes('Success') ? 'bg-green-900/20 border-green-500/50 text-green-400' : 'bg-red-900/20 border-red-500/50 text-red-400'}`}>
                                                            {createMsg}
                                                        </div>
                                                    )}

                                                    <button type="submit" disabled={creatingEvent} className="mt-6 flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-cinzel font-bold tracking-widest rounded-lg border border-purple-400/50 shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                                        {creatingEvent ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Plus size={18} />}
                                                        {creatingEvent ? 'INITIATING...' : (editingEventId ? 'UPDATE EVENT' : 'CREATE EVENT')}
                                                    </button>
                                                </form>
                                            </div>

                                            {/* Slot Generator Tool */}
                                            <div className="bg-black/30 border border-amber-900/40 rounded-xl p-6 md:p-8 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl -z-10 group-hover:bg-amber-500/20 transition-colors"></div>

                                                <div className="flex items-center gap-3 mb-6">
                                                    <Sparkles className="text-amber-500" size={24} />
                                                    <h3 className="text-xl font-cinzel font-bold text-white tracking-widest uppercase">Forge Event Slots</h3>
                                                </div>

                                                <form onSubmit={handleGenerateSlots} className="space-y-5 relative z-10 w-full max-w-2xl font-lato">

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        <div className="space-y-1.5 flex flex-col md:col-span-2">
                                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Select Event</label>
                                                            <select
                                                                value={slotForm.eventId}
                                                                onChange={e => setSlotForm({ ...slotForm, eventId: e.target.value })}
                                                                className="bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 outline-none transition-colors"
                                                            >
                                                                <option value="" disabled>-- Select an Event --</option>
                                                                {eventsList.map(ev => (
                                                                    <option key={ev.id} value={ev.id}>{ev.title} ({ev.date})</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="space-y-1.5 flex flex-col">
                                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Day Number</label>
                                                            <input
                                                                type="number" min={1} max={10} value={slotForm.dayNumber}
                                                                onChange={e => setSlotForm({ ...slotForm, dayNumber: Number(e.target.value) })}
                                                                className="bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 outline-none"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5 flex flex-col">
                                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Date</label>
                                                            <input
                                                                type="date" value={slotForm.date}
                                                                onChange={e => setSlotForm({ ...slotForm, date: e.target.value })}
                                                                className="bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 outline-none"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5 flex flex-col">
                                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Start Time</label>
                                                            <input
                                                                type="time" value={slotForm.startTime}
                                                                onChange={e => setSlotForm({ ...slotForm, startTime: e.target.value })}
                                                                className="bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 outline-none"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5 flex flex-col">
                                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">End Time</label>
                                                            <input
                                                                type="time" value={slotForm.endTime}
                                                                onChange={e => setSlotForm({ ...slotForm, endTime: e.target.value })}
                                                                className="bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 outline-none"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5 flex flex-col">
                                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Interval (Mins)</label>
                                                            <input
                                                                type="number" step={5} min={5} value={slotForm.duration}
                                                                onChange={e => setSlotForm({ ...slotForm, duration: Number(e.target.value) })}
                                                                className="bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 outline-none"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5 flex flex-col">
                                                            <label className="text-xs font-bold text-slate-300 uppercase tracking-widest">Capacity / Slot</label>
                                                            <input
                                                                type="number" min={1} value={slotForm.capacity}
                                                                onChange={e => setSlotForm({ ...slotForm, capacity: Number(e.target.value) })}
                                                                className="bg-black/60 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 outline-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    {message && (
                                                        <div className={`p-4 rounded-lg border text-sm font-bold ${message.includes('Success') ? 'bg-green-900/20 border-green-500/50 text-green-400' : 'bg-red-900/20 border-red-500/50 text-red-400'}`}>
                                                            {message}
                                                        </div>
                                                    )}

                                                    <button
                                                        type="submit"
                                                        disabled={generating}
                                                        className="mt-6 flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white font-cinzel font-bold tracking-widest rounded-lg border border-amber-400/50 shadow-[0_0_20px_rgba(217,119,6,0.4)] hover:shadow-[0_0_30px_rgba(217,119,6,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {generating ? (
                                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                        ) : (
                                                            <Plus size={18} />
                                                        )}
                                                        {generating ? 'FORGING...' : 'GENERATE SLOTS'}
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'projects' && (
                                        <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed border-white/5 rounded-xl bg-black/20 group hover:border-amber-500/20 transition-colors">
                                            <Layout size={48} className="text-amber-900/50 group-hover:text-amber-500/50 mb-4 transition-colors" />
                                            <h3 className="text-lg font-cinzel text-slate-300 uppercase tracking-widest">Artifacts Forge</h3>
                                            <p className="text-sm font-lato text-slate-500 mt-2 text-center max-w-sm">Project uploads and approvals are currently restricted.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Admin Slot Viewer Modal */}
            {viewingEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setViewingEvent(null)}></div>
                    <div className="relative z-10 bg-slate-900/90 border border-amber-500/30 rounded-2xl p-6 md:p-8 w-full max-w-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">

                        <button onClick={() => setViewingEvent(null)} className="absolute top-4 right-4 text-slate-400 hover:text-amber-400 transition-colors">
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-cinzel font-bold text-white mb-2 pr-8">Slot Radar: {viewingEvent.title}</h2>

                        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4 mt-4">
                            {[1, 2, 3].map(d => (
                                <button type="button" key={d} onClick={() => setViewingDay(d)} className={`px-4 py-1.5 rounded text-sm font-bold border transition-colors ${viewingDay === d ? 'bg-amber-900/40 text-amber-400 border-amber-500/50' : 'bg-black/40 text-slate-400 border-white/10 hover:border-amber-500/30'}`}>Day {d}</button>
                            ))}
                        </div>

                        {adminSlotsLoading ? (
                            <div className="p-8 flex justify-center items-center text-amber-500 text-sm">
                                <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mr-3"></div> Loading Grid...
                            </div>
                        ) : adminSlots.length === 0 ? (
                            <div className="p-4 bg-red-900/10 rounded-lg border border-red-500/20 text-red-500 text-center font-cinzel">
                                <p>No slots have been forged for Day {viewingDay} yet.</p>
                                <p className="text-xs text-red-500/70 mt-2">Use the "Forge Event Slots" tool in the dashboard to generate them.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto custom-scrollbar pr-2 font-lato">
                                {adminSlots.map(slot => {
                                    const booked = slot.capacity - slot.spots_remaining;
                                    const isFull = slot.spots_remaining === 0;

                                    return (
                                        <button
                                            key={slot.id}
                                            onClick={() => setInspectingSlot(slot)}
                                            className={`p-3 rounded-lg border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${isFull ? 'bg-red-900/20 border-red-500/40 hover:bg-red-900/40 hover:border-red-400' : 'bg-black/40 border-white/10 hover:bg-amber-900/20 hover:border-amber-500/40'
                                                }`}
                                        >
                                            <span className={`font-mono text-sm font-bold ${isFull ? 'text-red-400' : 'text-slate-300'}`}>{slot.start_time.substring(0, 5)}</span>
                                            <span className={`text-[10px] uppercase font-bold tracking-wider mt-1 px-2 py-0.5 rounded ${isFull ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                {booked} / {slot.capacity} Booked
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* Inspecting Exact Slot & Registrations */}
            {inspectingSlot && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setInspectingSlot(null)}></div>
                    <div className="relative z-10 bg-slate-900 border border-emerald-500/30 rounded-xl p-6 md:p-8 w-full max-w-4xl max-h-[85vh] overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(0,0,0,0.9)]">
                        <button onClick={() => setInspectingSlot(null)} className="absolute top-4 right-4 text-slate-400 hover:text-emerald-400 transition-colors">
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                            <Sparkles className="text-emerald-500" size={24} />
                            <div>
                                <h2 className="text-2xl font-cinzel font-bold text-white tracking-widest uppercase">Slot Intel: {inspectingSlot.start_time.substring(0, 5)}</h2>
                                <p className="text-slate-400 text-sm font-lato">Total Capacity: {inspectingSlot.capacity}</p>
                            </div>
                        </div>

                        {inspectingLoading ? (
                            <div className="p-12 text-center text-emerald-500 border border-dashed border-emerald-500/20 rounded-xl bg-black/20">
                                <span className="animate-pulse font-cinzel tracking-wider">Accessing Classified Records...</span>
                            </div>
                        ) : slotRegistrations.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 border border-dashed border-white/10 rounded-xl bg-black/20 font-cinzel">
                                Sector is Empty. No warriors detected in this time block.
                            </div>
                        ) : (
                            <div className="space-y-4 font-lato">
                                {slotRegistrations.map((esr, idx) => {
                                    const details = esr.event_registrations;
                                    return (
                                        <div key={esr.id} className="relative bg-black/40 border border-white/10 rounded-xl p-5 hover:border-emerald-500/30 transition-colors border-l-4 border-l-emerald-500">

                                            {/* Top Banner / Actions */}
                                            <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded bg-emerald-900/40 border border-emerald-500/40 text-emerald-400 font-bold font-mono shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                                        #{idx + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-white">{details?.name || 'Unknown'}</h4>
                                                        <p className="text-xs text-slate-400 font-mono">{esr.user_email}</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleRemoveRegistration(esr)} className="p-2 text-red-500/70 hover:text-red-400 hover:bg-red-900/30 border border-transparent hover:border-red-500/50 rounded transition-all group relative" title="Destroy Record">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            {/* Project Showcase Details Map if exists */}
                                            {details?.project_title ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-3">
                                                    <div className="space-y-1 bg-black/30 p-2.5 rounded border border-white/5">
                                                        <p className="text-emerald-500/70 text-[10px] uppercase font-bold tracking-wider">Project Title</p>
                                                        <p className="text-slate-200 font-medium">{details.project_title} <span className="text-slate-500 text-xs">({details.project_category})</span></p>
                                                    </div>
                                                    <div className="space-y-1 bg-black/30 p-2.5 rounded border border-white/5">
                                                        <p className="text-emerald-500/70 text-[10px] uppercase font-bold tracking-wider">Academic Vector</p>
                                                        <p className="text-slate-200">{details.department} • Year {details.year} {details.section}</p>
                                                    </div>
                                                    <div className="space-y-1 bg-black/30 p-2.5 rounded border border-white/5">
                                                        <p className="text-emerald-500/70 text-[10px] uppercase font-bold tracking-wider">Reg No.</p>
                                                        <p className="text-amber-400 font-mono tracking-wider">{details.registration_no}</p>
                                                    </div>
                                                    {details.clan && (
                                                        <div className="space-y-1 bg-black/30 p-2.5 rounded border border-white/5">
                                                            <p className="text-emerald-500/70 text-[10px] uppercase font-bold tracking-wider">Clan Banner</p>
                                                            <p className="text-amber-400 font-cinzel">{details.clan}</p>
                                                        </div>
                                                    )}
                                                    <div className="space-y-1 md:col-span-2 bg-black/30 p-3 rounded border border-white/5 mt-1">
                                                        <p className="text-emerald-500/70 text-[10px] uppercase font-bold tracking-wider mb-1.5">Manifesto (Description)</p>
                                                        <p className="text-slate-400 italic text-xs leading-relaxed">{details.project_description}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-slate-500 italic mt-2 bg-black/30 p-3 rounded border border-white/5">Standard Registration (No additional Project Data attached to this warrior).</div>
                                            )}

                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
