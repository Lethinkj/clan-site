import React, { useEffect, useState } from 'react'
import { supabase, Event, EventRegistration } from '../lib/supabase'
import Modal, { Alert } from '../components/ui/Modal'

// --- Backend Helpers (Unchanged) ---
const parseEventDateTime = (dateStr: string, timeStr: string): Date => {
  try {
    const combined = `${dateStr} ${timeStr}`
    return new Date(combined)
  } catch {
    return new Date()
  }
}

const checkEventStatuses = async () => {
  const now = new Date()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .in('status', ['upcoming', 'live'])

  if (!events) return

  for (const event of events) {
    const startTime = parseEventDateTime(event.date, event.time)
    const endTime = event.end_time ? parseEventDateTime(event.date, event.end_time) : null
    let newStatus = event.status

    if (now >= startTime && event.status === 'upcoming') newStatus = 'live'
    if (endTime && now >= endTime && event.status === 'live') newStatus = 'ended'

    if (newStatus !== event.status) {
      await supabase.from('events').update({ status: newStatus }).eq('id', event.id)
    }
  }
}

// --- Components ---

export default function Events() {
  const [liveEvents, setLiveEvents] = useState<Event[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [endedEvents, setEndedEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    avgRating: '0'
  })
  const [registrationModal, setRegistrationModal] = useState<Event | null>(null)
  const [registrations, setRegistrations] = useState<{ [eventId: string]: number }>({})
  const [registeredMembers, setRegisteredMembers] = useState<{ [eventId: string]: EventRegistration[] }>({})

  useEffect(() => {
    checkEventStatuses().then(() => fetchEvents())
    const interval = setInterval(() => {
      checkEventStatuses().then(() => fetchEvents())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const refreshEventRegistrations = async (eventId: string) => {
    try {
      const { data, count } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact' })
        .eq('event_id', eventId)
        .order('registered_at', { ascending: true })
      
      setRegistrations(prev => ({ ...prev, [eventId]: count || 0 }))
      setRegisteredMembers(prev => ({ ...prev, [eventId]: data || [] }))
    } catch (error) {
      console.error('Error refreshing registrations:', error)
    }
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

      const allActiveEvents = [...(live || []), ...(upcoming || [])]
      if (allActiveEvents.length > 0) {
        const counts: { [eventId: string]: number } = {}
        const members: { [eventId: string]: EventRegistration[] } = {}
        for (const event of allActiveEvents) {
          const { data, count } = await supabase
            .from('event_registrations')
            .select('*', { count: 'exact' })
            .eq('event_id', event.id)
            .order('registered_at', { ascending: true })
          counts[event.id] = count || 0
          members[event.id] = data || []
        }
        setRegistrations(counts)
        setRegisteredMembers(members)
      }

      const allEvents = [...(live || []), ...(upcoming || []), ...(ended || []), ...(past || [])]
      const totalEvents = allEvents.length
      const totalAttendees = allEvents.reduce((sum, event) => {
        const num = parseInt(event.attendees.replace(/\D/g, ''))
        return sum + (isNaN(num) ? 0 : num)
      }, 0)

      const ratingsSum = allEvents.reduce((sum, event) => {
        if (event.rating) {
          const rating = parseFloat(event.rating.split('/')[0])
          return sum + (isNaN(rating) ? 0 : rating)
        }
        return sum
      }, 0)

      const eventsWithRatings = allEvents.filter(e => e.rating).length
      const avgRating = eventsWithRatings > 0 ? (ratingsSum / eventsWithRatings).toFixed(1) : '0'

      setStats({ totalEvents, totalAttendees, avgRating })
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  // --- UI Components ---

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'live':
        return <span className="inline-flex items-center gap-1.5 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-red-500/20 animate-pulse">
          <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
        </span>
      case 'upcoming':
        return <span className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">Upcoming</span>
      case 'ended':
        return <span className="bg-orange-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">Ended</span>
      default:
        return <span className="bg-gray-600/80 backdrop-blur-sm text-gray-200 px-3 py-1 rounded-full text-xs font-bold">Completed</span>
    }
  }

  const EventCard = ({ event, showRegister = false }: { event: Event; showRegister?: boolean }) => {
    const isLive = event.status === 'live';
    const hasImage = !!event.image_url;

    return (
      <div className={`group relative bg-slate-900/90 border-2 ${isLive ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.12)]'} rounded-2xl overflow-hidden hover:border-cyan-400/70 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:-translate-y-2 flex flex-col h-full backdrop-blur-sm`}>
        {/* Image Section */}
        <div className={`relative w-full ${hasImage ? 'aspect-video' : 'h-32 bg-gradient-to-br from-slate-800 to-slate-900'}`}>
          {hasImage ? (
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
             <div className="flex items-center justify-center h-full text-slate-600">
               <span className="text-4xl">📅</span>
             </div>
          )}
          <div className="absolute top-3 right-3 z-10">
            <StatusBadge status={event.status} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/95 to-transparent p-4 pt-12">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-slate-900/70 px-2 py-0.5 rounded border border-cyan-400/30 backdrop-blur-md">
              {event.tag === 'Other' && event.custom_category ? event.custom_category : event.tag}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          <h4 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
            {event.title}
          </h4>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-slate-400 gap-2">
              <span className="text-cyan-400/70">📅</span>
              <span>{event.date}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">{event.time}{event.end_time && ` - ${event.end_time}`}</span>
            </div>
            <div className="flex items-center text-sm text-slate-400 gap-2">
              <span className="text-cyan-400/70">📍</span>
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center text-sm text-slate-400 gap-2">
              <span className="text-cyan-400/70">👥</span>
              <span>
                {event.attendees} {event.status === 'upcoming' ? 'expected' : 'joined'}
                {event.max_registrations && <span className="text-slate-500 ml-1">({registrations[event.id] || 0}/{event.max_registrations} slots filled)</span>}
              </span>
            </div>
            {event.rating && (
              <div className="flex items-center text-sm text-cyan-400 gap-2">
                <span>⭐</span> <span>{event.rating} rating</span>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-400 leading-relaxed mb-6 line-clamp-3">
            {event.description}
          </p>

          <div className="mt-auto">
            {/* Registered Members Chips */}
            {registeredMembers[event.id] && registeredMembers[event.id].length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
                  Registered ({registeredMembers[event.id].length})
                </p>
                <div className="flex -space-x-2 overflow-hidden py-1">
                  {registeredMembers[event.id].slice(0, 5).map((reg, idx) => (
                    <div key={reg.id} className="relative inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 text-[10px] text-white font-medium" title={reg.name}>
                      {reg.name.charAt(0).toUpperCase()}
                      {reg.attending !== null && (
                         <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-slate-900 ${reg.attending ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      )}
                    </div>
                  ))}
                  {registeredMembers[event.id].length > 5 && (
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 text-[10px] text-white font-medium">
                      +{registeredMembers[event.id].length - 5}
                    </div>
                  )}
                </div>
              </div>
            )}

            {showRegister && (event.status === 'upcoming' || event.status === 'live') && (
              <button 
                onClick={() => setRegistrationModal(event)} 
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-200 shadow-lg ${
                  isLive 
                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                    : 'bg-cyan-400 hover:bg-cyan-500 text-slate-900 shadow-cyan-400/20'
                }`}
              >
                {isLive ? 'Join Live Event' : 'Reserve Spot'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm animate-pulse">Syncing events...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      
      {/* Header & Stats */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 id="events-title" className="text-4xl md:text-5xl font-extrabold text-white tracking-tight a-fade-up scroll-mt-24">
            Upcoming <span className="text-cyan-400">Events</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto a-fade-up">
            Connect with the community, showcase your projects, and learn from the best.
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto a-fade-up">
          {[
            { label: 'Events Hosted', value: stats.totalEvents + '+', icon: '🗓️' },
            { label: 'Total Attendees', value: stats.totalAttendees + '+', icon: '👥' },
            { label: 'Average Rating', value: stats.avgRating, icon: '⭐' }
          ].map((stat, i) => (
            <div key={i} className="group bg-slate-900/80 border border-cyan-500/30 p-6 rounded-2xl flex items-center justify-between hover:border-cyan-400/60 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-cyan-500/10 hover:shadow-xl hover:shadow-cyan-500/20 hover:-translate-y-1">
              <div>
                <div className="text-3xl font-bold text-cyan-300 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
              <div className="text-3xl text-cyan-500/60">{stat.icon}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-16">
        
        {liveEvents.length > 0 && (
          <section>
             <div className="flex items-center gap-3 mb-8">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <h3 className="text-2xl font-bold text-white">Happening Now</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveEvents.map((event) => <EventCard key={event.id} event={event} showRegister={true} />)}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-2xl font-bold text-white mb-8 border-l-4 border-cyan-400 pl-4">Upcoming Events</h3>
          {upcomingEvents.length === 0 ? (
            <div className="bg-slate-900/60 border border-dashed border-slate-700 rounded-3xl p-12 text-center backdrop-blur-sm">
              <p className="text-slate-500 text-lg">No upcoming events scheduled. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:a-stagger">
              {upcomingEvents.map((event) => <EventCard key={event.id} event={event} showRegister={true} />)}
            </div>
          )}
        </section>

        {endedEvents.length > 0 && (
          <section>
             <h3 className="text-2xl font-bold text-slate-300 mb-8 pl-4 border-l-4 border-cyan-500/50">Recently Ended</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {endedEvents.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          </section>
        )}

        {pastEvents.length > 0 && (
          <section className="opacity-90">
             <h3 className="text-2xl font-bold text-slate-400 mb-8 pl-4 border-l-4 border-slate-600">Archive</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          </section>
        )}
      </div>

      {/* Modals */}
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

// --- Registration Logic & Forms (Enhanced UI) ---

function RegistrationModal({ event, onClose, onRegistered }: { event: Event; onClose: () => void; onRegistered: () => void }) {
  const eventTag = event.tag === 'Other' && event.custom_category ? event.custom_category : event.tag
  const isProjectShowcase = eventTag.toLowerCase().includes('project') || eventTag.toLowerCase().includes('showcase')
  const isWeeklyBash = eventTag.toLowerCase().includes('weekly bash') || eventTag.toLowerCase().includes('bash')

  if (isProjectShowcase) return <ProjectShowcaseForm event={event} onClose={onClose} onRegistered={onRegistered} />
  if (isWeeklyBash) return <WeeklyBashForm event={event} onClose={onClose} onRegistered={onRegistered} />
  return <GeneralRegistrationForm event={event} onClose={onClose} onRegistered={onRegistered} />
}

// Reusable Input Component
const InputGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide ml-1">{label}</label>
    {children}
  </div>
);

// Common input styles
const inputClasses = "w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all";
const selectClasses = "w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all appearance-none";

function ProjectShowcaseForm({ event, onClose, onRegistered }: { event: Event; onClose: () => void; onRegistered: () => void }) {
  const [formData, setFormData] = useState({
    name: '', registration_no: '', email: '', department: '', year: '', section: '', clan: '',
    project_title: '', project_category: '', custom_category: '', project_description: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [alertModal, setAlertModal] = useState<{ type: 'success' | 'error', title: string, message: string } | null>(null)

  const departments = ['CSE', 'AI', 'ECE', 'MECH', 'EEE', 'Civil']
  const years = ['1', '2', '3', '4']
  const sections = ['A', 'B', 'C', 'D', 'E', 'F']
  const clans = ['BC1', 'BC2', 'BC3', 'BC4']
  const categories = ['Web Development', 'Mobile App', 'AI/ML', 'IoT', 'Game Development', 'Other']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: existing } = await supabase.from('event_registrations').select('*').eq('event_id', event.id).eq('email', formData.email).single()
      if (existing) { setError('You have already registered for this event!'); setLoading(false); return }

      if (event.max_registrations) {
        const { count } = await supabase.from('event_registrations').select('*', { count: 'exact', head: true }).eq('event_id', event.id)
        if (count && count >= event.max_registrations) { setError('Event full!'); setLoading(false); return }
      }

      const finalCategory = formData.project_category === 'Other' ? formData.custom_category : formData.project_category

      const { error: insertError } = await supabase.from('event_registrations').insert([{
        event_id: event.id, name: formData.name, email: formData.email, registration_no: formData.registration_no,
        department: formData.department, year: formData.year, section: formData.section, clan: formData.clan,
        project_title: formData.project_title, project_category: finalCategory, project_description: formData.project_description
      }])

      if (insertError) throw insertError
      setAlertModal({ type: 'success', title: 'Registration Successful!', message: "Your project has been registered." })
    } catch (err) { setError('Failed to register. Please try again.'); console.error(err) } finally { setLoading(false) }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={`Showcase Registration`} size="lg">
      {alertModal && <Alert isOpen={true} onClose={() => { setAlertModal(null); if (alertModal.type === 'success') onRegistered() }} type={alertModal.type} title={alertModal.title} message={alertModal.message} />}
      {error && <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">⚠️ {error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputGroup label="Full Name">
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className={inputClasses} placeholder="Your full name" />
          </InputGroup>
          <InputGroup label="Reg. No">
            <input type="text" value={formData.registration_no} onChange={(e) => setFormData({ ...formData, registration_no: e.target.value })} required className={inputClasses} placeholder="RA22..." />
          </InputGroup>
        </div>

        <InputGroup label="College Email">
           <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className={inputClasses} placeholder="student@university.edu" />
        </InputGroup>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
           <InputGroup label="Dept">
            <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required className={selectClasses}>
              <option value="">--</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
           </InputGroup>
           <InputGroup label="Year">
            <select value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} required className={selectClasses}>
              <option value="">--</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
           </InputGroup>
           <InputGroup label="Sec">
            <select value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })} required className={selectClasses}>
              <option value="">--</option>
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
           </InputGroup>
           <InputGroup label="Clan">
            <select value={formData.clan} onChange={(e) => setFormData({ ...formData, clan: e.target.value })} required className={selectClasses}>
              <option value="">--</option>
              {clans.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
           </InputGroup>
        </div>

        <div className="border-t border-white/10 pt-4 mt-4 space-y-5">
          <h4 className="text-white font-bold text-lg">Project Details</h4>
          <InputGroup label="Project Title">
             <input type="text" value={formData.project_title} onChange={(e) => setFormData({ ...formData, project_title: e.target.value })} required className={inputClasses} placeholder="Awesome Project Name" />
          </InputGroup>
          
          <InputGroup label="Category">
            <select value={formData.project_category} onChange={(e) => setFormData({ ...formData, project_category: e.target.value })} required className={selectClasses}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </InputGroup>

          {formData.project_category === 'Other' && (
            <InputGroup label="Specify Category">
              <input type="text" value={formData.custom_category} onChange={(e) => setFormData({ ...formData, custom_category: e.target.value })} required className={inputClasses} placeholder="Type here..." />
            </InputGroup>
          )}

          <InputGroup label="Description / Abstract">
            <textarea value={formData.project_description} onChange={(e) => setFormData({ ...formData, project_description: e.target.value })} required rows={4} className={inputClasses} placeholder="Briefly describe your project..." />
          </InputGroup>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 bg-cyan-400 text-slate-900 font-bold py-3 rounded-xl hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-400/20 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Submitting...' : 'Complete Registration'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function WeeklyBashForm({ event, onClose, onRegistered }: { event: Event; onClose: () => void; onRegistered: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', attending: null as boolean | null })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [alertModal, setAlertModal] = useState<{ type: 'success' | 'error', title: string, message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (formData.attending === null) { setError('Please select your status'); return }
    setLoading(true)

    try {
      const { data: existing } = await supabase.from('event_registrations').select('*').eq('event_id', event.id).eq('email', formData.email).single()
      if (existing) { setError('Response already recorded.'); setLoading(false); return }

      const { error: insertError } = await supabase.from('event_registrations').insert([{ event_id: event.id, name: formData.name, email: formData.email, attending: formData.attending }])
      if (insertError) throw insertError
      setAlertModal({ type: 'success', title: formData.attending ? "RSVP Confirmed" : "Response Recorded", message: formData.attending ? "See you there!" : "Thanks for letting us know." })
    } catch (err) { setError('Submission failed.'); console.error(err) } finally { setLoading(false) }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={`RSVP: ${event.title}`} size="sm">
      {alertModal && <Alert isOpen={true} onClose={() => { setAlertModal(null); if (alertModal.type === 'success') onRegistered() }} type={alertModal.type} title={alertModal.title} message={alertModal.message} />}
      {error && <div className="bg-red-900/20 text-red-200 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputGroup label="Name">
           <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className={inputClasses} placeholder="Your Name" />
        </InputGroup>
        <InputGroup label="Email">
           <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className={inputClasses} placeholder="Email Address" />
        </InputGroup>
        
        <div className="pt-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 block text-center">Are you attending?</label>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setFormData({ ...formData, attending: true })} className={`py-4 px-2 rounded-xl border font-bold transition-all ${formData.attending === true ? 'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-green-500/50'}`}>
              👍 Yes, I'm in!
            </button>
            <button type="button" onClick={() => setFormData({ ...formData, attending: false })} className={`py-4 px-2 rounded-xl border font-bold transition-all ${formData.attending === false ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-red-500/50'}`}>
              👎 Can't make it
            </button>
          </div>
        </div>
        
        <button type="submit" disabled={loading} className="w-full mt-4 bg-cyan-400 text-slate-900 font-bold py-3 rounded-xl hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-400/20 disabled:opacity-50">
          {loading ? 'Saving...' : 'Confirm RSVP'}
        </button>
      </form>
    </Modal>
  )
}

function GeneralRegistrationForm({ event, onClose, onRegistered }: { event: Event; onClose: () => void; onRegistered: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', discord_id: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [alertModal, setAlertModal] = useState<{ type: 'success' | 'error', title: string, message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data: existing } = await supabase.from('event_registrations').select('*').eq('event_id', event.id).eq('email', formData.email).single()
      if (existing) { setError('Already registered!'); setLoading(false); return }

      if (event.max_registrations) {
        const { count } = await supabase.from('event_registrations').select('*', { count: 'exact', head: true }).eq('event_id', event.id)
        if (count && count >= event.max_registrations) { setError('Full capacity reached'); setLoading(false); return }
      }

      const { error: insertError } = await supabase.from('event_registrations').insert([{ event_id: event.id, name: formData.name, email: formData.email, discord_id: formData.discord_id || null }])
      if (insertError) throw insertError
      setAlertModal({ type: 'success', title: 'Confirmed!', message: "You are on the list." })
    } catch (err) { setError('Error registering.'); console.error(err) } finally { setLoading(false) }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title={`Register for Event`} size="md">
      {alertModal && <Alert isOpen={true} onClose={() => { setAlertModal(null); if (alertModal.type === 'success') onRegistered() }} type={alertModal.type} title={alertModal.title} message={alertModal.message} />}
      {error && <div className="bg-red-900/20 text-red-200 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputGroup label="Name">
           <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className={inputClasses} placeholder="John Doe" />
        </InputGroup>
        <InputGroup label="Email">
           <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className={inputClasses} placeholder="you@example.com" />
        </InputGroup>
        <InputGroup label="Discord Username (Optional)">
           <input type="text" value={formData.discord_id} onChange={(e) => setFormData({ ...formData, discord_id: e.target.value })} className={inputClasses} placeholder="username#0000" />
        </InputGroup>

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 bg-cyan-400 text-slate-900 font-bold py-3 rounded-xl hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-400/20 disabled:opacity-50">
            {loading ? 'Processing...' : 'Register Now'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
