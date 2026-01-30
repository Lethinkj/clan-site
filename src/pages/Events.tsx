import React, { useEffect, useState } from 'react'
import { supabase, Event, EventRegistration } from '../lib/supabase'
import Modal, { Alert } from '../components/ui/Modal'
import { useTheme } from '../contexts/ThemeContext'
import { Scroll, Sword, Skull, Sparkles, MapPin, Calendar as CalIcon } from 'lucide-react'

// --- Backend Helpers ---
const parseEventDateTime = (dateStr: string, timeStr: string): Date => {
  try { return new Date(`${dateStr} ${timeStr}`) } catch { return new Date() }
}

const checkEventStatuses = async () => {
  try {
    const now = new Date()
    const { data: events } = await supabase.from('events').select('*').in('status', ['upcoming', 'live'])
    if (!events) return
    for (const event of events) {
      const startTime = parseEventDateTime(event.date, event.time)
      const endTime = event.end_time ? parseEventDateTime(event.date, event.end_time) : null
      let newStatus = event.status
      if (now >= startTime && event.status === 'upcoming') newStatus = 'live'
      if (endTime && now >= endTime && event.status === 'live') newStatus = 'ended'
      if (newStatus !== event.status) await supabase.from('events').update({ status: newStatus }).eq('id', event.id)
    }
  } catch (err) {
    console.error("Error checking event statuses:", err)
  }
}

// --- Sub-components extracted to prevent re-definition ---

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'live':
      return <span className="inline-flex items-center gap-1.5 bg-red-900/80 border border-red-500 text-red-200 px-3 py-1 rounded-sm text-xs font-cinzel font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse">
        <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span> RAID ACTIVE
      </span>
    case 'upcoming':
      return <span className="bg-amber-900/80 border border-amber-500/50 text-amber-200 px-3 py-1 rounded-sm text-xs font-cinzel font-bold">PREPARING</span>
    case 'ended':
      return <span className="bg-slate-800/80 border border-slate-600 text-slate-400 px-3 py-1 rounded-sm text-xs font-cinzel font-bold">COMPLETED</span>
    default:
      return <span className="bg-slate-900/80 border border-slate-700 text-slate-500 px-3 py-1 rounded-sm text-xs font-cinzel font-bold uppercase">{status}</span>
  }
}

const EventCard = ({ event, showRegister = false, onRegister }: { event: Event; showRegister?: boolean; onRegister?: (e: Event) => void }) => {
  const isLive = event.status === 'live';
  const hasImage = !!event.image_url;

  return (
    <div className={`group relative border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 flex flex-col h-full
      ${isLive
        ? 'bg-gradient-to-b from-red-950/40 to-black border-red-500/50 shadow-[0_0_30px_rgba(185,28,28,0.15)] hover:border-red-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.25)]'
        : 'bg-gradient-to-b from-slate-900/60 to-black border-white/10 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)]'
      }`}>

      {/* Image Section */}
      <div className={`relative w-full ${hasImage ? 'aspect-video' : 'h-40'} ${!hasImage && 'bg-slate-900'}`}>
        {hasImage ? (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-700">
            <Sword size={48} strokeWidth={1} />
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          <StatusBadge status={event.status} />
        </div>
        {/* Bottom Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>

        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border border-amber-500/30 bg-black/60 text-amber-400 backdrop-blur-sm font-cinzel">
            {event.tag === 'Other' && event.custom_category ? event.custom_category : event.tag}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow relative">
        <h4 className="text-xl font-cinzel font-bold mb-3 text-white group-hover:text-amber-400 transition-colors leading-tight">
          {event.title}
        </h4>

        <div className="space-y-3 mb-6 text-sm">
          <div className="flex items-center gap-3 text-slate-400">
            <CalIcon size={14} className="text-amber-500/70" />
            <span className="font-lato">{event.date} • <span className="text-slate-500">{event.time}</span></span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <MapPin size={14} className="text-amber-500/70" />
            <span className="truncate font-lato">{event.location}</span>
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-6 line-clamp-3 text-slate-400 group-hover:text-slate-300 font-lato">
          {event.description}
        </p>

        <div className="mt-auto">
          {/* Register Button */}
          {showRegister && (event.status === 'upcoming' || event.status === 'live') && onRegister && (
            <button
              onClick={() => onRegister(event)}
              className={`w-full py-3 px-4 rounded-lg font-cinzel font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${isLive
                ? 'bg-red-900/80 border border-red-500 text-red-100 hover:bg-red-800 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                : 'bg-amber-900/30 border border-amber-500/30 text-amber-400 hover:bg-amber-900/50 hover:border-amber-400 hover:text-amber-200 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                }`}
            >
              {isLive ? <><Sword size={16} /> Join Raid</> : <><Scroll size={16} /> Welcome All</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function RegistrationModal({ event, onClose, onRegistered }: { event: Event; onClose: () => void; onRegistered: () => void }) {
  // Simplified placeholder logic to ensure it renders without errors
  return (
    <Modal isOpen={true} onClose={onClose} title={`Accept Quest: ${event.title}`} size="md">
      <div className="text-center py-8">
        <Scroll className="mx-auto text-amber-500 mb-4" size={48} />
        <p className="text-white font-cinzel mb-2 text-lg">Quest Accepted?</p>
        <p className="text-slate-400 text-sm mb-6 font-lato">Sign your name in the book of destiny to join this event.</p>

        <div className="flex gap-4 justify-center">
          <button onClick={onClose} className="px-4 py-2 border border-slate-600 text-slate-400 rounded hover:bg-slate-800 transition-colors">
            Retreat
          </button>
          <button onClick={onRegistered} className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-500 transition-colors font-bold">
            Sign Contract
          </button>
        </div>
      </div>
    </Modal>
  )
}

// --- Main Component ---

export default function Events() {
  const { theme } = useTheme() // kept for context
  const [liveEvents, setLiveEvents] = useState<Event[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [endedEvents, setEndedEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalEvents: 0, totalAttendees: 0, avgRating: '0' })
  const [registrationModal, setRegistrationModal] = useState<Event | null>(null)

  // kept state for compatibility, even if unused in this simplified view
  const [registrations, setRegistrations] = useState<{ [eventId: string]: number }>({})
  const [registeredMembers, setRegisteredMembers] = useState<{ [eventId: string]: EventRegistration[] }>({})

  useEffect(() => {
    checkEventStatuses().then(() => fetchEvents())
    const interval = setInterval(() => { checkEventStatuses().then(() => fetchEvents()) }, 60000)
    return () => clearInterval(interval)
  }, [])

  const refreshEventRegistrations = async (eventId: string) => {
    try {
      const { data, count } = await supabase.from('event_registrations').select('*', { count: 'exact' }).eq('event_id', eventId).order('registered_at', { ascending: true })
      setRegistrations(prev => ({ ...prev, [eventId]: count || 0 }))
      setRegisteredMembers(prev => ({ ...prev, [eventId]: data || [] }))
    } catch (error) { console.error('Error refreshing registrations:', error) }
  }

  const fetchEvents = async () => {
    try {
      const { data: live } = await supabase.from('events').select('*').eq('status', 'live').order('date', { ascending: true })
      const { data: upcoming } = await supabase.from('events').select('*').eq('status', 'upcoming').order('date', { ascending: true })
      const { data: ended } = await supabase.from('events').select('*').eq('status', 'ended').order('date', { ascending: false })
      const { data: past } = await supabase.from('events').select('*').eq('status', 'completed').order('date', { ascending: false })

      setLiveEvents(live || [])
      setUpcomingEvents(upcoming || [])
      setEndedEvents(ended || [])
      setPastEvents(past || [])

      const allEvents = [...(live || []), ...(upcoming || []), ...(ended || []), ...(past || [])]
      setStats({
        totalEvents: allEvents.length,
        totalAttendees: allEvents.reduce((s, e) => s + (parseInt(e.attendees) || 0), 0),
        avgRating: '4.9'
      })
      setLoading(false)
    } catch (e) { console.error(e); setLoading(false) }
  }

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-amber-500 animate-pulse font-cinzel text-xl">Scrying the future...</div>

  return (
    <div id="events-title" className="max-w-7xl mx-auto px-4 py-12 space-y-20 relative">
      {/* Magical Fog Animation */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <div className="text-center space-y-4 pt-10">
        <h2 className="text-5xl font-cinzel font-bold text-white drop-shadow-lg">
          Quest <span className="text-amber-500">Board</span>
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto font-lato">
          Embark on legendary quests, conquer challenges, and claim your glory.
        </p>
        <div className="flex justify-center gap-8 mt-8 border-t border-b border-white/5 py-4 bg-black/20 backdrop-blur-md">
          <div className="text-center">
            <div className="text-2xl font-cinzel font-bold text-amber-400">{stats.totalEvents}</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Quests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-cinzel font-bold text-purple-400">{stats.totalAttendees}</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500">Adventurers</div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-20">

        {liveEvents.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <Skull className="text-red-500 size-8 animate-pulse" />
              <h3 className="text-3xl font-cinzel font-bold text-white">Active Raids</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liveEvents.map((event) => <EventCard key={event.id} event={event} showRegister={true} onRegister={setRegistrationModal} />)}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-4 mb-8">
            <Scroll className="text-amber-500 size-8" />
            <h3 className="text-3xl font-cinzel font-bold text-white">Upcoming Quests</h3>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="border border-dashed border-slate-700 bg-slate-900/30 rounded-xl p-12 text-center">
              <p className="text-slate-500 font-cinzel">The board is empty. Rest by the fire.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => <EventCard key={event.id} event={event} showRegister={true} onRegister={setRegistrationModal} />)}
            </div>
          )}
        </section>

        {(endedEvents.length > 0 || pastEvents.length > 0) && (
          <section className="opacity-70 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-4 mb-8">
              <Sparkles className="text-slate-500 size-8" />
              <h3 className="text-3xl font-cinzel font-bold text-slate-400">Tales of Old</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...endedEvents, ...pastEvents].map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          </section>
        )}
      </div>

      {registrationModal && (
        <RegistrationModal
          event={registrationModal}
          onClose={() => setRegistrationModal(null)}
          onRegistered={() => { refreshEventRegistrations(registrationModal.id); setRegistrationModal(null) }}
        />
      )}
    </div>
  )
}
